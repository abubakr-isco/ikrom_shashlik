import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { site } from '../config/site.js';
import { dishesById } from '../data/menu.js';
import { buildLines, calcTotals, cartReducer, getQty, sanitizeCart } from '../lib/cart.js';
import { readJson, writeJson } from '../lib/storage.js';
import { CartContext } from './cart.js';

const CART_KEY = 'ikrom-cart-v1';
const FULFILLMENT_KEY = 'ikrom-fulfillment';
const MAX = site.order.maxQuantityPerItem;

function loadCart() {
  return sanitizeCart(readJson(CART_KEY), dishesById, MAX);
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [fulfillment, setFulfillmentState] = useState(() =>
    readJson(FULFILLMENT_KEY) === 'pickup' ? 'pickup' : 'delivery',
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => writeJson(CART_KEY, state), [state]);

  // Keep carts in several open tabs in sync.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === CART_KEY) dispatch({ type: 'replace', state: loadCart() });
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setFulfillment = useCallback((value) => {
    setFulfillmentState(value);
    writeJson(FULFILLMENT_KEY, value);
  }, []);

  const actions = useMemo(
    () => ({
      add: (id) => dispatch({ type: 'add', id, max: MAX }),
      increment: (id) => dispatch({ type: 'increment', id, max: MAX }),
      decrement: (id) => dispatch({ type: 'decrement', id, max: MAX }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [],
  );

  const value = useMemo(() => {
    const lines = buildLines(state.items, dishesById);
    const totals = calcTotals(lines, fulfillment, site.delivery);
    return {
      ...actions,
      lines,
      totals,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      getQty: (id) => getQty(state, id),
      maxQty: MAX,
      fulfillment,
      setFulfillment,
      isOpen,
    };
  }, [state, fulfillment, setFulfillment, isOpen, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
