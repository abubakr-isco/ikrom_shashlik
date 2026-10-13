/**
 * Cart state is a list of { id, qty } in the order dishes were added.
 * Names and prices are always read from the menu data, so a price change
 * in the menu is reflected in carts saved earlier.
 */

export const emptyCart = { items: [] };

function clampQty(qty, max) {
  return Math.max(0, Math.min(max, Math.floor(qty)));
}

function setQty(state, id, qty, max) {
  const next = clampQty(qty, max);
  const exists = state.items.some((item) => item.id === id);
  if (next === 0) {
    return exists ? { items: state.items.filter((item) => item.id !== id) } : state;
  }
  if (!exists) return { items: [...state.items, { id, qty: next }] };
  return { items: state.items.map((item) => (item.id === id ? { ...item, qty: next } : item)) };
}

export function getQty(state, id) {
  return state.items.find((item) => item.id === id)?.qty ?? 0;
}

export function cartReducer(state, action) {
  const max = action.max ?? Infinity;
  switch (action.type) {
    case 'add':
    case 'increment':
      return setQty(state, action.id, getQty(state, action.id) + 1, max);
    case 'decrement':
      return setQty(state, action.id, getQty(state, action.id) - 1, max);
    case 'set':
      return setQty(state, action.id, action.qty, max);
    case 'remove':
      return setQty(state, action.id, 0, max);
    case 'clear':
      return emptyCart;
    case 'replace':
      return action.state;
    default:
      return state;
  }
}

/** Restores a cart saved in storage, dropping anything malformed or unknown. */
export function sanitizeCart(raw, dishesById, max) {
  if (!raw || !Array.isArray(raw.items)) return emptyCart;
  const seen = new Set();
  const items = [];
  for (const item of raw.items) {
    if (!item || typeof item.id !== 'string' || seen.has(item.id) || !dishesById.has(item.id)) continue;
    const qty = clampQty(Number(item.qty) || 0, max);
    if (qty > 0) {
      seen.add(item.id);
      items.push({ id: item.id, qty });
    }
  }
  return { items };
}

export function buildLines(items, dishesById) {
  return items
    .map(({ id, qty }) => {
      const dish = dishesById.get(id);
      return dish ? { dish, qty, lineTotal: dish.price * qty } : null;
    })
    .filter(Boolean);
}

/** Totals for orderable (available) lines only. */
export function calcTotals(lines, fulfillment, delivery) {
  const orderable = lines.filter((line) => line.dish.available);
  const subtotal = orderable.reduce((sum, line) => sum + line.lineTotal, 0);
  const count = orderable.reduce((sum, line) => sum + line.qty, 0);
  const isFree = delivery.freeFrom > 0 && subtotal >= delivery.freeFrom;
  const deliveryFee = fulfillment === 'delivery' && subtotal > 0 && !isFree ? delivery.fee : 0;
  const freeDeliveryLeft =
    fulfillment === 'delivery' && delivery.freeFrom > 0 && subtotal > 0 && !isFree
      ? delivery.freeFrom - subtotal
      : 0;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee, count, freeDeliveryLeft };
}
