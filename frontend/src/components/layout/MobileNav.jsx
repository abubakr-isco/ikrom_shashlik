import { AnimatePresence, m } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { site } from '../../config/site.js';
import { useDialog } from '../../hooks/useDialog.js';
import { useOrderNow } from '../../hooks/useOrderNow.js';
import { useI18n } from '../../i18n/context.js';
import { ContactLink } from '../ui/ContactLink.jsx';
import { LanguageSwitch } from './LanguageSwitch.jsx';
import { Logo } from './Logo.jsx';
import styles from './MobileNav.module.css';
import { NAV_ITEMS } from './navItems.js';

export function MobileNav({ open, onClose }) {
  const { t } = useI18n();
  const orderNow = useOrderNow();
  const panelRef = useDialog(open, onClose);

  // Portal: the header uses backdrop-filter, which would trap a fixed-position
  // sheet inside the header's own 64px box.
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-nav"
          ref={panelRef}
          className={styles.sheet}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.label')}
          tabIndex={-1}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={`container ${styles.top}`}>
            <Logo onClick={onClose} />
            <button type="button" className="icon-btn" onClick={onClose} aria-label={t('nav.closeMenu')} data-autofocus>
              <X size={26} aria-hidden="true" />
            </button>
          </div>

          <nav className={`container ${styles.body}`} aria-label={t('nav.label')}>
            <ul role="list" className={styles.links}>
              {NAV_ITEMS.map((item, index) => (
                <m.li
                  key={item.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.04, duration: 0.3 }}
                >
                  <Link to={item.to} className={styles.link} onClick={onClose}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </m.li>
              ))}
            </ul>

            <div className={styles.footer}>
              <LanguageSwitch />
              <ContactLink href={site.phone.href ? `tel:${site.phone.href}` : ''} className={styles.phone}>
                <Phone size={18} aria-hidden="true" />
                {site.phone.display}
              </ContactLink>
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={() => {
                  onClose();
                  orderNow();
                }}
              >
                {t('nav.order')}
              </button>
            </div>
          </nav>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
