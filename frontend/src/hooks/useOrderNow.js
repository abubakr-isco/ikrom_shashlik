import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/cart.js';

/**
 * "Order" buttons: open the cart when it has something in it, otherwise
 * take the visitor to the menu to pick dishes.
 */
export function useOrderNow() {
  const { count, openCart } = useCart();
  const navigate = useNavigate();

  return useCallback(() => {
    if (count > 0) openCart();
    else navigate({ pathname: '/', hash: '#menu' });
  }, [count, openCart, navigate]);
}
