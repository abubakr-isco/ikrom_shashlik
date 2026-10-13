import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/context.js';
import styles from './CategoryRail.module.css';

/**
 * Category switcher drawn as a skewer: categories are threaded on a steel
 * rod, the selected one glows like an ember.
 */
export function CategoryRail({ options, value, onChange }) {
  const { t } = useI18n();
  const scrollerRef = useRef(null);

  // Keep the selected category visible on narrow screens.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector('[aria-pressed="true"]');
    if (!scroller || !active) return;
    const left = active.offsetLeft - scroller.clientWidth / 2 + active.offsetWidth / 2;
    scroller.scrollTo({ left, behavior: 'smooth' });
  }, [value]);

  return (
    <div className={styles.rail}>
      <div className={styles.scroller} ref={scrollerRef}>
        <span className={styles.handle} aria-hidden="true" />
        <ul role="list" className={styles.list} aria-label={t('menu.categories')}>
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className={styles.piece}
                aria-pressed={value === option.id}
                onClick={() => onChange(option.id)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
        <span className={styles.tip} aria-hidden="true" />
      </div>
    </div>
  );
}
