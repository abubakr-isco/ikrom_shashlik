import { photoCredits } from '../data/photoCredits.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useI18n } from '../i18n/context.js';
import styles from './CreditsPage.module.css';

export function CreditsPage() {
  const { t } = useI18n();
  usePageTitle(`${t('credits.title')} | Ikrom Shashlik`);

  return (
    <main id="main" tabIndex={-1} className={`container ${styles.page}`}>
      <h1 className={styles.title}>{t('credits.title')}</h1>
      <p className={styles.lead}>{t('credits.lead')}</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t('credits.file')}</th>
              <th scope="col">{t('credits.author')}</th>
              <th scope="col">{t('credits.source')}</th>
              <th scope="col">{t('credits.license')}</th>
            </tr>
          </thead>
          <tbody>
            {photoCredits.map((credit) => (
              <tr key={credit.file}>
                <td>{credit.file}</td>
                <td>{credit.author ?? <span className={styles.muted}>{t('credits.unknownAuthor')}</span>}</td>
                <td>
                  <a href={credit.url} target="_blank" rel="noopener noreferrer">
                    {credit.source}
                  </a>
                </td>
                <td>
                  <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {credit.license}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.note}>{t('credits.changes')}</p>
    </main>
  );
}
