import { Plus } from 'lucide-react';
import { useCart } from '../../context/cart.js';
import { useToast } from '../../context/toast.js';
import { useI18n } from '../../i18n/context.js';
import { QuantityStepper } from '../ui/QuantityStepper.jsx';
import styles from './AddToCart.module.css';

/** "Add to cart" button that turns into a quantity stepper once added. */
export function AddToCart({ dish, size = 'md', block = false }) {
  const { t, pick } = useI18n();
  const cart = useCart();
  const toast = useToast();
  const name = pick(dish.name);
  const qty = cart.getQty(dish.id);

  if (!dish.available) {
    return (
      <span className={styles.unavailable} data-size={size}>
        {t('dish.unavailable')}
      </span>
    );
  }

  if (qty > 0) {
    return (
      <QuantityStepper
        name={name}
        qty={qty}
        max={cart.maxQty}
        size={size}
        onIncrement={() => cart.increment(dish.id)}
        onDecrement={() => {
          if (qty === 1) toast(t('cart.removed', { name }), { tone: 'info' });
          cart.decrement(dish.id);
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-primary ${size === 'sm' ? 'btn-sm' : ''} ${block ? 'btn-block' : ''}`}
      onClick={() => {
        cart.add(dish.id);
        toast(t('cart.added', { name }));
      }}
      aria-label={t('dish.addNamed', { name })}
    >
      <Plus size={18} aria-hidden="true" />
      {t('dish.add')}
    </button>
  );
}
