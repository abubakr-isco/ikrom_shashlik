import { m } from 'framer-motion';
import { Menu, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../../context/cart.js';
import { useOrderNow } from '../../hooks/useOrderNow.js';
import { useI18n } from '../../i18n/context.js';
import styles from './Header.module.css';
import { LanguageSwitch } from './LanguageSwitch.jsx';
import { Logo } from './Logo.jsx';
import { MobileNav } from './MobileNav.jsx';
import { NAV_ITEMS } from './navItems.js';

export function Header() {
  const { t } = useI18n();
  const { count, openCart } = useCart();
  const orderNow = useOrderNow();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Over the hero the header is transparent; everywhere else it is solid.
  const solid = pathname !== '/' || scrolled;

  return (
    <header className={styles.header} data-solid={solid || undefined}>
      <div className={`container ${styles.inner}`}>
        <Logo />

        <nav className={styles.nav} aria-label={t('nav.label')}>
          <ul role="list" className={styles.links}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link to={item.to} className={styles.link}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitch className={styles.lang} />
          <button type="button" className={`icon-btn ${styles.cart}`} onClick={openCart} aria-label={t('nav.cartWithCount', { count })}>
            <ShoppingBag size={22} aria-hidden="true" />
            {count > 0 && (
              // Remounts on every change, so the badge bumps when a dish is added
              <m.span
                key={count}
                className={styles.badge}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 18 }}
                aria-hidden="true"
              >
                {count > 99 ? '99+' : count}
              </m.span>
            )}
          </button>
          <button type="button" className={`btn btn-primary btn-sm ${styles.order}`} onClick={orderNow}>
            {t('nav.order')}
          </button>
          <button
            type="button"
            className={`icon-btn ${styles.burger}`}
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <Menu size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
