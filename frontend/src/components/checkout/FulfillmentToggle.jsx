import { Store, Truck } from 'lucide-react';
import { site } from '../../config/site.js';
import { useI18n } from '../../i18n/context.js';
import { formatPrice } from '../../lib/format.js';
import styles from './FulfillmentToggle.module.css';

export function FulfillmentToggle({ value, onChange, deliveryFee }) {
  const { t, lang, pick } = useI18n();
  const time = pick(site.delivery.time);

  const options = [
    {
      value: 'delivery',
      Icon: Truck,
      title: t('checkout.delivery'),
      hint:
        deliveryFee > 0
          ? t('checkout.deliveryHint', { time, fee: formatPrice(deliveryFee, lang) })
          : t('checkout.deliveryHintFree', { time }),
    },
    {
      value: 'pickup',
      Icon: Store,
      title: t('checkout.pickup'),
      hint: t('checkout.pickupHint', { time: pick(site.delivery.pickupTime), address: pick(site.address) }),
    },
  ];

  return (
    <div className={styles.options}>
      {options.map(({ value: option, Icon, title, hint }) => (
        <label key={option} className={styles.option}>
          <input
            type="radio"
            name="fulfillment"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className={styles.input}
          />
          <span className={styles.icon}>
            <Icon size={22} aria-hidden="true" />
          </span>
          <span className={styles.text}>
            <span className={styles.title}>{title}</span>
            <span className={styles.hint}>{hint}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
