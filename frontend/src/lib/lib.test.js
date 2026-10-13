import { describe, expect, it } from 'vitest';
import { dishes, dishesById } from '../data/menu.js';
import { createTranslator } from '../i18n/translate.js';
import ru from '../i18n/translations/ru.js';
import uz from '../i18n/translations/uz.js';
import { buildLines, calcTotals, cartReducer, emptyCart, sanitizeCart } from './cart.js';
import { formatPortion, formatPrice } from './format.js';
import { getOpenStatus } from './hours.js';
import { filterDishes, normalizeSearch } from './menuFilter.js';
import { formatPhone, nextPhoneValue, normalizePhone, toLocalDigits } from './phone.js';
import { hasErrors, validateCheckout } from './validation.js';

const NBSP = ' ';
const delivery = { fee: 15_000, freeFrom: 250_000, minOrder: 60_000 };
const limits = { nameMaxLength: 60, addressMaxLength: 200, commentMaxLength: 500 };

describe('format', () => {
  it('formats sums with grouped digits and currency', () => {
    expect(formatPrice(125000, 'ru')).toBe(`125${NBSP}000${NBSP}сум`);
    expect(formatPrice(6000, 'uz')).toBe(`6${NBSP}000${NBSP}soʻm`);
    expect(formatPrice(0, 'ru')).toBe(`0${NBSP}сум`);
  });

  it('formats portions, converting a litre of drink', () => {
    expect(formatPortion({ value: 180, unit: 'g' }, 'ru')).toBe(`180${NBSP}г`);
    expect(formatPortion({ value: 1000, unit: 'ml' }, 'ru')).toBe(`1${NBSP}л`);
    expect(formatPortion({ value: 700, unit: 'ml' }, 'uz')).toBe(`700${NBSP}ml`);
    expect(formatPortion({ value: 4, unit: 'pcs' }, 'uz')).toBe(`4${NBSP}dona`);
  });
});

describe('phone', () => {
  it('extracts local digits from typed and pasted numbers', () => {
    expect(toLocalDigits('90 123-45-67')).toBe('901234567');
    expect(toLocalDigits('+998 (90) 123 45 67')).toBe('901234567');
    expect(toLocalDigits('998901234567')).toBe('901234567');
  });

  it('formats progressively and handles deleting a separator', () => {
    expect(nextPhoneValue('', '9')).toBe('9');
    expect(nextPhoneValue('90', '901')).toBe('90 1');
    expect(nextPhoneValue('90 123', '90 1234')).toBe('90 123-4');
    // Backspace over the dash removes the digit before it too
    expect(nextPhoneValue('90 123-4', '90 123-')).toBe('90 123');
    expect(nextPhoneValue('90 1', '90 ')).toBe('90');
  });

  it('normalizes only complete numbers', () => {
    expect(normalizePhone('90 123-45-67')).toBe('+998901234567');
    expect(normalizePhone('90 123-45')).toBeNull();
    expect(formatPhone('+998901234567')).toBe('+998 90 123-45-67');
  });
});

describe('cart', () => {
  it('adds, increments, decrements and removes', () => {
    let state = cartReducer(emptyCart, { type: 'add', id: 'plov' });
    state = cartReducer(state, { type: 'add', id: 'samsa' });
    state = cartReducer(state, { type: 'increment', id: 'plov' });
    expect(state.items).toEqual([
      { id: 'plov', qty: 2 },
      { id: 'samsa', qty: 1 },
    ]);
    state = cartReducer(state, { type: 'decrement', id: 'samsa' });
    expect(state.items).toEqual([{ id: 'plov', qty: 2 }]);
    state = cartReducer(state, { type: 'remove', id: 'plov' });
    expect(state.items).toEqual([]);
  });

  it('caps quantity at the configured maximum', () => {
    let state = cartReducer(emptyCart, { type: 'set', id: 'plov', qty: 49, max: 50 });
    state = cartReducer(state, { type: 'increment', id: 'plov', max: 50 });
    state = cartReducer(state, { type: 'increment', id: 'plov', max: 50 });
    expect(state.items[0].qty).toBe(50);
  });

  it('drops unknown, duplicate and malformed saved items', () => {
    const saved = {
      items: [{ id: 'plov', qty: 2 }, { id: 'plov', qty: 5 }, { id: 'deleted-dish', qty: 1 }, { id: 'samsa', qty: -3 }, null],
    };
    expect(sanitizeCart(saved, dishesById, 50).items).toEqual([{ id: 'plov', qty: 2 }]);
    expect(sanitizeCart('garbage', dishesById, 50)).toEqual(emptyCart);
  });

  it('prices lines from the menu and excludes unavailable dishes from totals', () => {
    const lines = buildLines(
      [
        { id: 'plov', qty: 2 },
        { id: 'lamb-chops', qty: 1 },
      ],
      dishesById,
    );
    const plov = dishesById.get('plov');
    expect(dishesById.get('lamb-chops').available).toBe(false);
    const totals = calcTotals(lines, 'delivery', delivery);
    expect(totals.subtotal).toBe(plov.price * 2);
    expect(totals.deliveryFee).toBe(15_000);
    expect(totals.total).toBe(plov.price * 2 + 15_000);
    expect(totals.freeDeliveryLeft).toBe(250_000 - plov.price * 2);
  });

  it('makes delivery free above the threshold and for pickup', () => {
    const lines = buildLines([{ id: 'assorted-shashlik', qty: 2 }], dishesById);
    expect(calcTotals(lines, 'delivery', delivery).deliveryFee).toBe(0);
    const small = buildLines([{ id: 'samsa', qty: 1 }], dishesById);
    expect(calcTotals(small, 'pickup', delivery).deliveryFee).toBe(0);
  });
});

describe('validateCheckout', () => {
  const lines = buildLines([{ id: 'plov', qty: 2 }], dishesById);
  const totals = calcTotals(lines, 'delivery', delivery);
  const valid = { name: 'Азиз', phone: '90 123-45-67', address: 'ул. Навои, 12, кв. 5', comment: '', fulfillment: 'delivery' };
  const ctx = { lines, totals, delivery, limits };

  it('accepts a complete delivery order', () => {
    expect(hasErrors(validateCheckout(valid, ctx))).toBe(false);
  });

  it('reports each invalid field', () => {
    const result = validateCheckout({ ...valid, name: ' ', phone: '90 12', address: '' }, ctx);
    expect(result.fields.name.key).toBe('errors.nameRequired');
    expect(result.fields.phone.key).toBe('errors.phoneInvalid');
    expect(result.fields.address.key).toBe('errors.addressRequired');
  });

  it('does not require an address for pickup', () => {
    const result = validateCheckout({ ...valid, address: '', fulfillment: 'pickup' }, ctx);
    expect(result.fields.address).toBeUndefined();
  });

  it('enforces the delivery minimum but not for pickup', () => {
    const smallLines = buildLines([{ id: 'samsa', qty: 1 }], dishesById);
    const smallTotals = calcTotals(smallLines, 'delivery', delivery);
    const small = { ...ctx, lines: smallLines, totals: smallTotals };
    expect(validateCheckout(valid, small).cart.key).toBe('errors.minOrder');
    expect(validateCheckout({ ...valid, fulfillment: 'pickup' }, small).cart).toBeNull();
  });

  it('blocks orders with unavailable dishes or an empty cart', () => {
    const withUnavailable = buildLines([{ id: 'lamb-chops', qty: 1 }, { id: 'plov', qty: 2 }], dishesById);
    const result = validateCheckout(valid, { ...ctx, lines: withUnavailable });
    expect(result.cart.key).toBe('errors.unavailable');
    expect(validateCheckout(valid, { ...ctx, lines: [] }).cart.key).toBe('errors.cartEmpty');
  });

  it('limits the comment length', () => {
    const result = validateCheckout({ ...valid, comment: 'a'.repeat(501) }, ctx);
    expect(result.fields.comment.key).toBe('errors.commentLong');
  });
});

describe('menu filtering', () => {
  it('ignores case, ё and Uzbek apostrophes', () => {
    expect(normalizeSearch('Лепёшка')).toBe('лепешка');
    expect(normalizeSearch("Qo'y goʻshti")).toBe('qoy goshti');
  });

  it('searches names in both languages', () => {
    expect(filterDishes(dishes, { query: 'плов' }).map((d) => d.id)).toEqual(['plov']);
    expect(filterDishes(dishes, { query: 'palov', lang: 'uz' }).map((d) => d.id)).toEqual(['plov']);
    expect(filterDishes(dishes, { query: "lag'mon", lang: 'uz' }).map((d) => d.id)).toEqual(['lagman']);
  });

  it('filters by category and keeps unavailable dishes last', () => {
    const result = filterDishes(dishes, { category: 'shashlik', sort: 'priceDesc' });
    expect(result.every((d) => d.category === 'shashlik')).toBe(true);
    expect(result.at(-1).available).toBe(false);
    const prices = result.filter((d) => d.available).map((d) => d.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

describe('opening hours', () => {
  const tz = 'Asia/Tashkent'; // UTC+5, no DST
  const at = (hhmm) => new Date(`2026-10-13T${hhmm}:00+05:00`);

  it('handles closing at midnight', () => {
    const hours = { open: '10:00', close: '00:00' };
    expect(getOpenStatus(hours, tz, at('09:59'))).toEqual({ isOpen: false, opensAt: '10:00' });
    expect(getOpenStatus(hours, tz, at('10:00'))).toEqual({ isOpen: true, until: '00:00' });
    expect(getOpenStatus(hours, tz, at('23:59')).isOpen).toBe(true);
  });

  it('handles closing after midnight and same-day hours', () => {
    expect(getOpenStatus({ open: '11:00', close: '02:00' }, tz, at('01:30')).isOpen).toBe(true);
    expect(getOpenStatus({ open: '11:00', close: '02:00' }, tz, at('03:00')).isOpen).toBe(false);
    expect(getOpenStatus({ open: '09:00', close: '18:00' }, tz, at('18:00')).isOpen).toBe(false);
  });
});

describe('translations', () => {
  it('picks Russian plural forms', () => {
    const t = createTranslator('ru');
    expect(t('cart.count', { count: 1 })).toBe('1 блюдо');
    expect(t('cart.count', { count: 3 })).toBe('3 блюда');
    expect(t('cart.count', { count: 11 })).toBe('11 блюд');
  });

  it('interpolates Uzbek strings and falls back to the key when missing', () => {
    const t = createTranslator('uz');
    expect(t('cart.count', { count: 5 })).toBe('5 ta taom');
    expect(t('no.such.key')).toBe('no.such.key');
  });

  it('has the same keys in both languages', () => {
    const keys = (obj, prefix = '') =>
      Object.entries(obj).flatMap(([k, v]) =>
        v && typeof v === 'object' && !Array.isArray(v) && !('other' in v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
      );
    expect(keys(uz).sort()).toEqual(keys(ru).sort());
  });
});
