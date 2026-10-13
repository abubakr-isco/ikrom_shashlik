import { useI18n } from '../../i18n/context.js';
import { formatPortion, formatPrice } from '../../lib/format.js';
import { DishImage } from '../ui/DishImage.jsx';
import { AddToCart } from './AddToCart.jsx';
import styles from './DishRow.module.css';

/** Compact menu entry: photo on the left, details on the right. */
export function DishRow({ dish }) {
  const { t, lang, pick } = useI18n();
  return (
    <article className={styles.row} data-unavailable={!dish.available || undefined}>
      <div className={styles.media}>
        <DishImage image={dish.image} alt={pick(dish.name)} className={styles.image} sizes="(min-width: 700px) 168px, 112px" />
      </div>
      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.name}>{pick(dish.name)}</h3>
          <span className={styles.portion}>
            <span className="visually-hidden">{t('dish.portion')}: </span>
            {formatPortion(dish.portion, lang)}
          </span>
        </div>
        <p className={styles.description}>{pick(dish.description)}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(dish.price, lang)}</span>
          <AddToCart dish={dish} size="sm" />
        </div>
      </div>
    </article>
  );
}
