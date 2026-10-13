import { useI18n } from '../../i18n/context.js';
import { formatPortion, formatPrice } from '../../lib/format.js';
import { DishImage } from '../ui/DishImage.jsx';
import { AddToCart } from './AddToCart.jsx';
import styles from './DishCard.module.css';

/** Large card with a photo on top, used for the popular dishes. */
export function DishCard({ dish }) {
  const { t, lang, pick } = useI18n();
  return (
    <article className={styles.card} data-unavailable={!dish.available || undefined}>
      <div className={styles.media}>
        <DishImage
          image={dish.image}
          alt={pick(dish.name)}
          className={styles.image}
          sizes="(min-width: 1100px) 380px, (min-width: 700px) 45vw, 82vw"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{pick(dish.name)}</h3>
        <p className={styles.description}>{pick(dish.description)}</p>
        <div className={styles.footer}>
          <p className={styles.meta}>
            <span className={styles.price}>{formatPrice(dish.price, lang)}</span>
            <span className={styles.portion}>
              <span className="visually-hidden">{t('dish.portion')}: </span>
              {formatPortion(dish.portion, lang)}
            </span>
          </p>
          <AddToCart dish={dish} />
        </div>
      </div>
    </article>
  );
}
