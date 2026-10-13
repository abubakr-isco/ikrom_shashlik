import ru from './translations/ru.js';
import uz from './translations/uz.js';

export const LANGUAGES = ['ru', 'uz'];
export const DEFAULT_LANGUAGE = 'ru';

const dictionaries = { ru, uz };
const pluralRules = {
  ru: new Intl.PluralRules('ru'),
  uz: new Intl.PluralRules('uz'),
};

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

function interpolate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (vars[name] == null ? match : String(vars[name])));
}

/**
 * Creates `t(key, vars)` for a language. Values that are objects with plural
 * forms ({ one, few, many, other }) are resolved with `vars.count`.
 * Missing keys fall back to Russian, then to the key itself.
 */
export function createTranslator(lang) {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANGUAGE];
  const fallback = dictionaries[DEFAULT_LANGUAGE];

  function message(key) {
    const value = lookup(dict, key);
    return value === undefined ? lookup(fallback, key) : value;
  }

  function t(key, vars = {}) {
    let value = message(key);
    if (value && typeof value === 'object' && !Array.isArray(value) && 'other' in value) {
      const form = pluralRules[lang]?.select(Number(vars.count ?? 0)) ?? 'other';
      value = value[form] ?? value.other;
    }
    if (typeof value !== 'string') {
      if (import.meta.env?.DEV && value === undefined) console.warn(`Missing translation: ${key}`);
      return key;
    }
    return interpolate(value, vars);
  }

  /** Raw translation value (arrays, nested objects). */
  t.raw = message;
  return t;
}
