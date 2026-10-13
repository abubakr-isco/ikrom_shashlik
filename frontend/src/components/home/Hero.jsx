import { m } from 'framer-motion';
import { Phone, Truck } from 'lucide-react';
import { Link } from 'react-router';
import { site } from '../../config/site.js';
import { useOrderNow } from '../../hooks/useOrderNow.js';
import { useI18n } from '../../i18n/context.js';
import { ContactLink } from '../ui/ContactLink.jsx';
import styles from './Hero.module.css';
import { OpenStatus } from './OpenStatus.jsx';

const ease = [0.2, 0.8, 0.2, 1];

// The page's one orchestrated moment: the headline rises out of the dark line by line.
const line = (index) => ({
  initial: { y: '105%' },
  animate: { y: 0 },
  transition: { duration: 0.9, delay: 0.15 + index * 0.12, ease },
});

const fade = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export function Hero() {
  const { t } = useI18n();
  const orderNow = useOrderNow();

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        <img
          className={styles.image}
          src="/images/site/hero-1280.webp"
          srcSet="/images/site/hero-760.webp 760w, /images/site/hero-1280.webp 1280w, /images/site/hero-2000.webp 2000w"
          sizes="100vw"
          width="2000"
          height="1333"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        <div className={styles.smoke}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.shade} />
      </div>

      <div className={`container ${styles.content}`}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.lineMask}>
            <m.span className={styles.line} {...line(0)}>
              {t('hero.titleLine1')}
            </m.span>
          </span>
          <span className={styles.lineMask}>
            <m.span className={styles.line} {...line(1)}>
              {t('hero.titleLine2')}
            </m.span>
          </span>
        </h1>

        <m.p className={styles.subtitle} {...fade(0.55)}>
          {t('hero.subtitle')}
        </m.p>

        <m.div className={styles.actions} {...fade(0.7)}>
          <button type="button" className="btn btn-primary btn-lg" onClick={orderNow}>
            {t('hero.orderNow')}
          </button>
          <Link to={{ pathname: '/', hash: '#menu' }} className="btn btn-outline btn-lg">
            {t('hero.viewMenu')}
          </Link>
        </m.div>

        <m.ul role="list" className={styles.facts} {...fade(0.85)}>
          <li>
            <OpenStatus />
          </li>
          <li>
            <Truck size={18} aria-hidden="true" />
            {t('hero.delivery')}
          </li>
          <li>
            <Phone size={18} aria-hidden="true" />
            <ContactLink href={site.phone.href ? `tel:${site.phone.href}` : ''} className={styles.phone}>
              {site.phone.display}
            </ContactLink>
          </li>
        </m.ul>
      </div>
    </section>
  );
}
