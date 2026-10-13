import { AnimatePresence, m } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCart } from '../../context/cart.js';
import { useDialog } from '../../hooks/useDialog.js';
import { useI18n } from '../../i18n/context.js';
import { CartLine } from './CartLine.jsx';
import styles from './CartDrawer.module.css';
import { OrderTotals } from './OrderTotals.jsx';

export function CartDrawer() {
  const { t, pick } = useI18n();
  const cart = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useDialog(cart.isOpen, cart.closeCart);
  const { closeCart } = cart;

  // Any navigation, including a click on the current link, closes the drawer.
  useEffect(() => {
    closeCart();
  }, [location.key, closeCart]);

  const unavailable = cart.lines.filter((line) => !line.dish.available);

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <m.div
            key="overlay"
            className={styles.overlay}
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <m.aside
            key="panel"
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <header className={styles.header}>
              <h2 id="cart-title" className={styles.title}>
                {t('cart.title')}
                {cart.count > 0 && <span className={styles.count}>{t('cart.count', { count: cart.count })}</span>}
              </h2>
              <button type="button" className="icon-btn" onClick={closeCart} aria-label={t('cart.close')}>
                <X size={24} aria-hidden="true" />
              </button>
            </header>

            {cart.lines.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>
                  <ShoppingBag size={32} aria-hidden="true" />
                </span>
                <h3 className={styles.emptyTitle}>{t('cart.emptyTitle')}</h3>
                <p className={styles.emptyText}>{t('cart.emptyText')}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate({ pathname: '/', hash: '#menu' })}
                  data-autofocus
                >
                  {t('cart.toMenu')}
                </button>
              </div>
            ) : (
              <>
                <ul role="list" className={styles.lines}>
                  {cart.lines.map((line) => (
                    <CartLine key={line.dish.id} line={line} />
                  ))}
                </ul>
                <footer className={styles.footer}>
                  <OrderTotals totals={cart.totals} fulfillment={cart.fulfillment} />
                  {unavailable.length > 0 && (
                    <p className={styles.note} role="alert">
                      {t('errors.unavailable', { names: unavailable.map((line) => pick(line.dish.name)).join(', ') })}
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary btn-lg btn-block"
                    onClick={() => navigate('/checkout')}
                    disabled={unavailable.length > 0 || cart.totals.count === 0}
                  >
                    {t('cart.checkout')}
                  </button>
                </footer>
              </>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
