import { useI18n } from '../../i18n/context.js';
import { LANGUAGES } from '../../i18n/translate.js';
import styles from './LanguageSwitch.module.css';

const LABELS = { ru: { short: 'RU', full: 'Русский' }, uz: { short: 'UZ', full: 'Oʻzbekcha' } };

export function LanguageSwitch({ className = '' }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`${styles.switch} ${className}`} role="group" aria-label={t('nav.language')}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          className={styles.option}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          title={LABELS[code].full}
        >
          <span aria-hidden="true">{LABELS[code].short}</span>
          <span className="visually-hidden">{LABELS[code].full}</span>
        </button>
      ))}
    </div>
  );
}
