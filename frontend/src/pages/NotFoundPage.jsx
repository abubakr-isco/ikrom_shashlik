import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useI18n } from '../i18n/context.js';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const { t } = useI18n();
  usePageTitle(`${t('notFound.title')} | Ikrom Shashlik`);

  return (
    <main id="main" tabIndex={-1} className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>{t('notFound.title')}</h1>
      <p className={styles.text}>{t('notFound.text')}</p>
      <Link to="/" className="btn btn-primary btn-lg">
        {t('common.toHome')}
      </Link>
    </main>
  );
}
