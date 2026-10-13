import { useCallback, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from '../lib/storage.js';
import { I18nContext } from './context.js';
import { createTranslator, DEFAULT_LANGUAGE, LANGUAGES } from './translate.js';

const STORAGE_KEY = 'ikrom-lang';

function initialLanguage() {
  const saved = readJson(STORAGE_KEY);
  if (LANGUAGES.includes(saved)) return saved;
  const browser = typeof navigator === 'undefined' ? '' : navigator.language?.toLowerCase() ?? '';
  return browser.startsWith('uz') ? 'uz' : DEFAULT_LANGUAGE;
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage);

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    writeJson(STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => {
    const t = createTranslator(lang);
    const pick = (field) => (field ? field[lang] ?? field.ru : '');
    return { lang, setLang, t, pick };
  }, [lang, setLang]);

  // Page titles are set per page (see usePageTitle); here only document-wide meta.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.querySelector('meta[name="description"]')?.setAttribute('content', value.t('meta.description'));
  }, [lang, value]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
