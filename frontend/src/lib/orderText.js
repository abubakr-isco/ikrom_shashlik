import { formatPrice } from './format.js';

/**
 * Plain-text version of an order, for copying into a messenger when online
 * ordering is unavailable.
 */
export function buildOrderText({ lines, form, totals, phone, lang, t, fulfillmentLabel }) {
  const price = (amount) => formatPrice(amount, lang);
  const out = [t('orderText.heading'), '', t('orderText.items')];
  for (const { dish, qty, lineTotal } of lines.filter((l) => l.dish.available)) {
    out.push(`${qty} × ${dish.name[lang] ?? dish.name.ru}: ${price(lineTotal)}`);
  }
  out.push('');
  out.push(`${t('orderText.subtotal')}: ${price(totals.subtotal)}`);
  if (form.fulfillment === 'delivery') out.push(`${t('orderText.deliveryFee')}: ${price(totals.deliveryFee)}`);
  out.push(`${t('orderText.total')}: ${price(totals.total)}`);
  out.push('');
  if (form.name.trim()) out.push(`${t('orderText.name')}: ${form.name.trim()}`);
  if (phone) out.push(`${t('orderText.phone')}: ${phone}`);
  out.push(`${t('orderText.fulfillment')}: ${fulfillmentLabel}`);
  if (form.fulfillment === 'delivery' && form.address.trim()) out.push(`${t('orderText.address')}: ${form.address.trim()}`);
  if (form.comment.trim()) out.push(`${t('orderText.comment')}: ${form.comment.trim()}`);
  return out.join('\n');
}
