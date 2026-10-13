import { formatPrice } from './format.js';

/** Turns a validation error ({ key, vars }) into text in the current language. */
export function errorText(error, { t, lang }) {
  if (!error) return '';
  const vars = { ...error.vars };
  if (typeof vars.amount === 'number') vars.amount = formatPrice(vars.amount, lang);
  if (Array.isArray(vars.dishes)) vars.names = vars.dishes.map((dish) => dish.name[lang] ?? dish.name.ru).join(', ');
  return t(error.key, vars);
}
