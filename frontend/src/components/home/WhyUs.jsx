import { Flame, Leaf, Timer, UtensilsCrossed } from 'lucide-react';
import { useI18n } from '../../i18n/context.js';
import { Reveal } from '../ui/Reveal.jsx';
import styles from './WhyUs.module.css';

const ITEMS = [
  { key: 'fresh', Icon: Leaf },
  { key: 'coals', Icon: Flame },
  { key: 'portions', Icon: UtensilsCrossed },
  { key: 'fast', Icon: Timer },
];

export function WhyUs() {
  const { t } = useI18n();
  return (
    <section className={`section ${styles.section}`} aria-labelledby="why-title">
      <div className={`container ${styles.grid}`}>
        <Reveal as="figure" className={styles.figure}>
          <img
            className={styles.image}
            src="/images/site/embers-900.webp"
            srcSet="/images/site/embers-900.webp 900w, /images/site/embers-1600.webp 1600w"
            sizes="(min-width: 960px) 50vw, 100vw"
            width="900"
            height="600"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <figcaption className={styles.caption}>{t('whyUs.imageCaption')}</figcaption>
        </Reveal>

        <div className={styles.text}>
          <Reveal>
            <h2 id="why-title" className="section-title">
              {t('whyUs.title')}
            </h2>
          </Reveal>
          <ul role="list" className={styles.list}>
            {ITEMS.map(({ key, Icon }, index) => (
              <Reveal as="li" key={key} className={styles.item} delay={0.05 * index}>
                <span className={styles.icon}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className={styles.itemTitle}>{t(`whyUs.items.${key}.title`)}</h3>
                  <p className={styles.itemText}>{t(`whyUs.items.${key}.text`)}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
