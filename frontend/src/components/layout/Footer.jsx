import { Clock, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { site } from '../../config/site.js';
import { useI18n } from '../../i18n/context.js';
import { formatPrice } from '../../lib/format.js';
import { InstagramIcon, TelegramIcon } from '../ui/BrandIcons.jsx';
import { ContactLink } from '../ui/ContactLink.jsx';
import styles from './Footer.module.css';
import { Logo } from './Logo.jsx';
import { NAV_ITEMS } from './navItems.js';

export function Footer() {
  const { t, lang, pick } = useI18n();
  const { delivery, socials, phone, hours } = site;
  const price = (amount) => formatPrice(amount, lang);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>{t('hero.subtitle')}</p>
          <div className={styles.socials}>
            <ContactLink href={socials.telegram.href} external className={styles.social}>
              <TelegramIcon size={18} />
              {socials.telegram.label}
            </ContactLink>
            <ContactLink href={socials.instagram.href} external className={styles.social}>
              <InstagramIcon size={18} />
              {socials.instagram.label}
            </ContactLink>
          </div>
        </div>

        <nav className={styles.column} aria-labelledby="footer-nav">
          <h2 id="footer-nav" className={styles.heading}>
            {t('footer.navigation')}
          </h2>
          <ul role="list" className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link to={item.to} className={styles.link}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.column}>
          <h2 className={styles.heading}>{t('footer.contacts')}</h2>
          <ul role="list" className={styles.list}>
            <li className={styles.iconItem}>
              <MapPin size={18} aria-hidden="true" />
              {pick(site.address)}
            </li>
            <li className={styles.iconItem}>
              <Phone size={18} aria-hidden="true" />
              <ContactLink href={phone.href ? `tel:${phone.href}` : ''} className={styles.link}>
                {phone.display}
              </ContactLink>
            </li>
            <li className={styles.iconItem}>
              <Clock size={18} aria-hidden="true" />
              {t('contacts.daily', { open: hours.open, close: hours.close })}
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>{t('footer.delivery')}</h2>
          <ul role="list" className={styles.list}>
            <li>{t('footer.deliveryFee', { fee: price(delivery.fee) })}</li>
            {delivery.freeFrom > 0 && <li>{t('footer.freeFrom', { amount: price(delivery.freeFrom) })}</li>}
            {delivery.minOrder > 0 && <li>{t('footer.minOrder', { amount: price(delivery.minOrder) })}</li>}
            <li>{t('footer.deliveryTime', { time: pick(delivery.time) })}</li>
            <li>{t('footer.pickup', { time: pick(delivery.pickupTime) })}</li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        <Link to="/credits" className={styles.link}>
          {t('footer.credits')}
        </Link>
      </div>
    </footer>
  );
}
