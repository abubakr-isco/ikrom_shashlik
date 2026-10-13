import { AnimatePresence, m } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useCart } from '../../context/cart.js';
import { useI18n } from '../../i18n/context.js';
import { formatPrice } from '../../lib/format.js';
import styles from './CartBar.module.css';

/** Bottom bar on phones and tablets that keeps the cart one tap away. */
export function CartBar() {
  const { t, lang } = useI18n();
  const { count, totals, isOpen, openCart } = useCart();
  const { pathname } = useLocation();
  const visible = count > 0 && !isOpen && pathname !== '/checkout';

  // Lets toasts and the footer leave room for the bar.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.style.setProperty('--bottom-bar', '76px');
    else root.style.removeProperty('--bottom-bar');
    return () => root.style.removeProperty('--bottom-bar');
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className={styles.bar}
          initial={{ y: '120%' }}
          animate={{ y: 0 }}
          exit={{ y: '120%' }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        >
          <button type="button" className={styles.button} onClick={openCart}>
            <span className={styles.icon}>
              <ShoppingBag size={20} aria-hidden="true" />
            </span>
            <span className={styles.label}>
              {t('nav.cart')}
              <span className={styles.count}>{t('cart.count', { count })}</span>
            </span>
            <span className={styles.total}>{formatPrice(totals.subtotal, lang)}</span>
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
