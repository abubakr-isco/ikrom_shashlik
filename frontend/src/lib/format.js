const NBSP = ' ';

const CURRENCY = { ru: 'сум', uz: 'soʻm' };
const UNITS = {
  ru: { g: 'г', ml: 'мл', l: 'л', pcs: 'шт' },
  uz: { g: 'g', ml: 'ml', l: 'l', pcs: 'dona' },
};

const groupFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

/** 125000 -> "125 000" (with non-breaking spaces). */
export function formatNumber(value) {
  return groupFormatter.format(value).replace(/\s/g, NBSP);
}

/** 125000 -> "125 000 сум" / "125 000 soʻm". */
export function formatPrice(amount, lang = 'ru') {
  return `${formatNumber(amount)}${NBSP}${CURRENCY[lang] ?? CURRENCY.ru}`;
}

/** { value: 1000, unit: 'ml' } -> "1 л"; { value: 4, unit: 'pcs' } -> "4 шт". */
export function formatPortion({ value, unit }, lang = 'ru') {
  const units = UNITS[lang] ?? UNITS.ru;
  if (unit === 'ml' && value >= 1000) {
    return `${formatNumber(value / 1000)}${NBSP}${units.l}`;
  }
  return `${formatNumber(value)}${NBSP}${units[unit] ?? unit}`;
}
