import { useI18n } from '../../i18n/context.js';
import { Reveal } from '../ui/Reveal.jsx';
import styles from './About.module.css';

const PHOTOS = [
  { key: 'chef', widths: [600, 1000], width: 600, height: 750 },
  { key: 'hall', widths: [600, 1000], width: 600, height: 450 },
  { key: 'meat', widths: [600, 1000], width: 600, height: 450 },
];

export function About() {
  const { t } = useI18n();
  const paragraphs = t.raw('about.paragraphs') ?? [];

  return (
    <section id="about" className={`section ${styles.section}`} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <Reveal>
            <h2 id="about-title" className="section-title">
              {t('about.title')}
            </h2>
          </Reveal>
          <Reveal className={styles.story} delay={0.08}>
            {paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? styles.lead : undefined}>
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>

        <Reveal className={styles.collage} y={28}>
          {PHOTOS.map(({ key, widths, width, height }) => (
            <figure key={key} className={styles[key]}>
              <img
                src={`/images/site/about-${key}-${widths[0]}.webp`}
                srcSet={widths.map((w) => `/images/site/about-${key}-${w}.webp ${w}w`).join(', ')}
                sizes={key === 'chef' ? '(min-width: 960px) 28vw, 60vw' : '(min-width: 960px) 22vw, 40vw'}
                width={width}
                height={height}
                alt={t(`about.photos.${key}`)}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
