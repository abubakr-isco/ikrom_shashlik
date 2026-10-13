import { site } from '../../config/site.js';
import { useI18n } from '../../i18n/context.js';
import { formatPrice } from '../../lib/format.js';
import styles from './OrderTotals.module.css';

export function OrderTotals({ totals, fulfillment }) {
  const { t, lang } = useI18n();
  const price = (amount) => formatPrice(amount, lang);
  const { freeFrom } = site.delivery;
  const progress = freeFrom > 0 ? Math.min(1, totals.subtotal / freeFrom) : 1;

  return (
    <div className={styles.totals}>
      {totals.freeDeliveryLeft > 0 && (
        <div className={styles.hint}>
          <p>{t('cart.freeDeliveryHint', { amount: price(totals.freeDeliveryLeft) })}</p>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
      )}
      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>{t('cart.subtotal')}</dt>
          <dd>{price(totals.subtotal)}</dd>
        </div>
        {fulfillment === 'delivery' && (
          <div className={styles.row}>
            <dt>{t('cart.deliveryFee')}</dt>
            <dd>{totals.deliveryFee > 0 ? price(totals.deliveryFee) : t('cart.free')}</dd>
          </div>
        )}
        <div className={`${styles.row} ${styles.total}`}>
          <dt>{t('cart.total')}</dt>
          <dd>{price(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
