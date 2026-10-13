import { useEffect, useState } from 'react';
import { site } from '../../config/site.js';
import { useI18n } from '../../i18n/context.js';
import { getOpenStatus } from '../../lib/hours.js';
import styles from './OpenStatus.module.css';

/** "Open until 00:00" / "Closed, opens at 10:00", in the restaurant's time zone. */
export function OpenStatus({ className = '' }) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const status = getOpenStatus(site.hours, site.timeZone, now);
  return (
    <span className={`${styles.status} ${className}`} data-open={status.isOpen || undefined}>
      <span className={styles.dot} aria-hidden="true" />
      {status.isOpen ? t('status.openUntil', { time: status.until }) : t('status.closedOpensAt', { time: status.opensAt })}
    </span>
  );
}
