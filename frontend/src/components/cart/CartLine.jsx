import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/cart.js';
import { useI18n } from '../../i18n/context.js';
import { formatPortion, formatPrice } from '../../lib/format.js';
import { DishImage } from '../ui/DishImage.jsx';
import { QuantityStepper } from '../ui/QuantityStepper.jsx';
import styles from './CartLine.module.css';

export function CartLine({ line, compact = false }) {
  const { t, lang, pick } = useI18n();
  const cart = useCart();
  const { dish, qty, lineTotal } = line;
  const name = pick(dish.name);

  return (
    <li className={styles.line} data-unavailable={!dish.available || undefined} data-compact={compact || undefined}>
      <div className={styles.thumb}>
        <DishImage image={dish.image} alt="" sizes="80px" className={styles.image} />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.meta}>
          {formatPortion(dish.portion, lang)}, {formatPrice(dish.price, lang)}
        </p>
        {!dish.available && <p className={styles.warning}>{t('cart.unavailableItem')}</p>}
        {!compact && dish.available && (
          <QuantityStepper
            name={name}
            qty={qty}
            max={cart.maxQty}
            size="sm"
            onIncrement={() => cart.increment(dish.id)}
            onDecrement={() => cart.decrement(dish.id)}
          />
        )}
        {compact && <p className={styles.meta}>× {qty}</p>}
      </div>
      <div className={styles.side}>
        <span className={styles.total}>{formatPrice(lineTotal, lang)}</span>
        {!compact && (
          <button
            type="button"
            className={`icon-btn ${styles.remove}`}
            onClick={() => cart.remove(dish.id)}
            aria-label={t('cart.remove', { name })}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </li>
  );
}
