import { Copy, PhoneCall, RotateCw, TriangleAlert, WifiOff } from 'lucide-react';
import { site } from '../../config/site.js';
import { useToast } from '../../context/toast.js';
import { useI18n } from '../../i18n/context.js';
import { TelegramIcon } from '../ui/BrandIcons.jsx';
import styles from './SubmitProblem.module.css';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for browsers without the async clipboard API
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) throw new Error('copy failed');
}

/**
 * Explains why an order did not go through and what the visitor can do now.
 * The cart is never cleared here.
 */
export function SubmitProblem({ error, orderText, onRetry, ref }) {
  const { t } = useI18n();
  const toast = useToast();
  const notConfigured = error.kind === 'not_configured';
  const rejected = error.kind === 'rejected';

  const title = notConfigured
    ? t('result.notConfiguredTitle')
    : rejected
      ? t('result.rejectedTitle')
      : t('result.networkTitle');
  const text = notConfigured
    ? t('result.notConfiguredText')
    : rejected
      ? error.message || t('result.rejectedText')
      : t('result.networkText');
  const Icon = notConfigured || rejected ? TriangleAlert : WifiOff;

  async function onCopy() {
    try {
      await copyText(orderText);
      toast(t('result.copied'));
    } catch {
      toast(t('result.copyFailed'), { tone: 'error', duration: 4000 });
    }
  }

  return (
    <div ref={ref} className={styles.panel} role="alert" tabIndex={-1} data-kind={error.kind}>
      <div className={styles.head}>
        <Icon size={22} aria-hidden="true" className={styles.icon} />
        <h2 className={styles.title}>{title}</h2>
      </div>
      <p className={styles.text}>{text}</p>

      <div className={styles.actions}>
        {!notConfigured && (
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            <RotateCw size={18} aria-hidden="true" />
            {t('result.retry')}
          </button>
        )}
        {notConfigured && (
          <button type="button" className="btn btn-primary" onClick={onCopy}>
            <Copy size={18} aria-hidden="true" />
            {t('result.copy')}
          </button>
        )}
        {notConfigured && site.socials.telegram.href && (
          <a className="btn btn-outline" href={site.socials.telegram.href} target="_blank" rel="noopener noreferrer">
            <TelegramIcon size={18} />
            {t('result.telegram')}
          </a>
        )}
        {site.phone.href && (
          <a className="btn btn-outline" href={`tel:${site.phone.href}`}>
            <PhoneCall size={18} aria-hidden="true" />
            {t('result.call')}
          </a>
        )}
      </div>

      {notConfigured && (
        <details className={styles.details}>
          <summary>{t('result.orderText')}</summary>
          <pre className={styles.orderText}>{orderText}</pre>
        </details>
      )}

      {notConfigured && import.meta.env.DEV && <p className={styles.dev}>{t('result.notConfiguredDev')}</p>}
    </div>
  );
}
