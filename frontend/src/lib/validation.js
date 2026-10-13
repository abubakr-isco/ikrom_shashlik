import { normalizePhone } from './phone.js';

/**
 * Validates the checkout form. Returns translation keys (with variables),
 * not text, so the UI can show errors in the current language.
 *
 * @returns {{ fields: Record<string, {key: string, vars?: object}>, cart: {key: string, vars?: object} | null }}
 */
export function validateCheckout(form, { lines, totals, delivery, limits }) {
  const fields = {};
  const name = form.name.trim();
  const address = form.address.trim();
  const comment = form.comment.trim();

  if (!name) fields.name = { key: 'errors.nameRequired' };
  else if (name.length < 2) fields.name = { key: 'errors.nameShort' };
  else if (name.length > limits.nameMaxLength) fields.name = { key: 'errors.nameLong', vars: { max: limits.nameMaxLength } };

  if (!form.phone.trim()) fields.phone = { key: 'errors.phoneRequired' };
  else if (!normalizePhone(form.phone)) fields.phone = { key: 'errors.phoneInvalid' };

  if (form.fulfillment === 'delivery') {
    if (!address) fields.address = { key: 'errors.addressRequired' };
    else if (address.length < 5) fields.address = { key: 'errors.addressShort' };
    else if (address.length > limits.addressMaxLength)
      fields.address = { key: 'errors.addressLong', vars: { max: limits.addressMaxLength } };
  }

  if (comment.length > limits.commentMaxLength)
    fields.comment = { key: 'errors.commentLong', vars: { max: limits.commentMaxLength } };

  let cart = null;
  const unavailable = lines.filter((line) => !line.dish.available);
  if (lines.length === 0) cart = { key: 'errors.cartEmpty' };
  else if (unavailable.length > 0) cart = { key: 'errors.unavailable', vars: { dishes: unavailable.map((l) => l.dish) } };
  else if (form.fulfillment === 'delivery' && delivery.minOrder > 0 && totals.subtotal < delivery.minOrder)
    cart = { key: 'errors.minOrder', vars: { amount: delivery.minOrder } };

  return { fields, cart };
}

export function hasErrors({ fields, cart }) {
  return Boolean(cart) || Object.keys(fields).length > 0;
}
