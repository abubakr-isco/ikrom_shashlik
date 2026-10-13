import { Minus, Plus } from 'lucide-react';
import { useI18n } from '../../i18n/context.js';
import styles from './QuantityStepper.module.css';

export function QuantityStepper({ name, qty, max, onIncrement, onDecrement, size = 'md' }) {
  const { t } = useI18n();
  return (
    <div className={styles.stepper} data-size={size} role="group" aria-label={t('dish.quantity', { name })}>
      <button type="button" className={styles.button} onClick={onDecrement} aria-label={t('dish.decrease', { name })}>
        <Minus size={18} aria-hidden="true" />
      </button>
      <output className={styles.value} aria-live="polite">
        {qty}
      </output>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrement}
        disabled={qty >= max}
        aria-label={t('dish.increase', { name })}
      >
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
