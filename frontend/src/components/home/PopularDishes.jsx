import { Link } from 'react-router';
import { dishes } from '../../data/menu.js';
import { useI18n } from '../../i18n/context.js';
import { DishCard } from '../menu/DishCard.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import styles from './PopularDishes.module.css';

const popular = dishes.filter((dish) => dish.popular).slice(0, 6);

export function PopularDishes() {
  const { t } = useI18n();
  return (
    <section id="popular" className={`section ${styles.section}`} aria-labelledby="popular-title">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 id="popular-title" className="section-title">
            {t('popular.title')}
          </h2>
          <p className="section-lead">{t('popular.lead')}</p>
          <Link to={{ pathname: '/', hash: '#menu' }} className={`btn btn-outline ${styles.all}`}>
            {t('hero.viewMenu')}
          </Link>
        </Reveal>
        <Reveal as="ul" role="list" className={styles.grid} y={28} delay={0.1}>
          {popular.map((dish) => (
            <li key={dish.id} className={styles.item}>
              <DishCard dish={dish} />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
