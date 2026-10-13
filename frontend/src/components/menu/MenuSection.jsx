import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown, Search, SearchX, X } from 'lucide-react';
import { useId, useMemo, useRef, useState } from 'react';
import { categories, dishes } from '../../data/menu.js';
import { useI18n } from '../../i18n/context.js';
import { filterDishes } from '../../lib/menuFilter.js';
import { Reveal } from '../ui/Reveal.jsx';
import { CategoryRail } from './CategoryRail.jsx';
import { DishRow } from './DishRow.jsx';
import styles from './MenuSection.module.css';

const SORTS = ['popular', 'priceAsc', 'priceDesc', 'name'];

export function MenuSection() {
  const { t, lang, pick } = useI18n();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular');
  const listRef = useRef(null);
  const searchId = useId();
  const sortId = useId();

  const options = useMemo(
    () => [{ id: 'all', label: t('menu.all') }, ...categories.map((c) => ({ id: c.id, label: pick(c.name) }))],
    [t, pick],
  );

  const results = useMemo(() => filterDishes(dishes, { category, query, sort, lang }), [category, query, sort, lang]);
  const grouped = category === 'all' && !query.trim() && sort === 'popular';
  const categoryName = options.find((o) => o.id === category)?.label ?? '';

  function selectCategory(id) {
    setCategory(id);
    // If the visitor is deep in a long list, bring the start of the new list into view.
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function resetSearch() {
    setQuery('');
    document.getElementById(searchId)?.focus();
  }

  return (
    <section id="menu" className={`section ${styles.section}`} aria-labelledby="menu-title">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 id="menu-title" className="section-title">
            {t('menu.title')}
          </h2>
          <p className="section-lead">{t('menu.lead')}</p>
        </Reveal>

        <div className={styles.toolbar}>
          <div className={styles.search}>
            <label htmlFor={searchId} className="visually-hidden">
              {t('menu.searchLabel')}
            </label>
            <Search size={20} className={styles.searchIcon} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              className={`input ${styles.searchInput}`}
              placeholder={t('menu.searchPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className={`icon-btn ${styles.clear}`} onClick={resetSearch} aria-label={t('menu.clearSearch')}>
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className={styles.sort}>
            <label htmlFor={sortId} className="visually-hidden">
              {t('menu.sortLabel')}
            </label>
            <select id={sortId} className={`input ${styles.select}`} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((key) => (
                <option key={key} value={key}>
                  {t(`menu.sort.${key}`)}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className={styles.selectIcon} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className={styles.railBar}>
        <div className="container">
          <CategoryRail options={options} value={category} onChange={selectCategory} />
        </div>
      </div>

      <div className={`container ${styles.results}`} ref={listRef}>
        <p className={query.trim() ? styles.count : 'visually-hidden'} aria-live="polite">
          {query.trim() ? t('menu.results', { count: results.length }) : ''}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={`${category}|${sort}|${grouped}|${results.length === 0}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {results.length === 0 ? (
              <div className={styles.empty}>
                <SearchX size={36} aria-hidden="true" className={styles.emptyIcon} />
                <h3 className={styles.emptyTitle}>{t('menu.emptyTitle')}</h3>
                <p className={styles.emptyText}>
                  {category === 'all'
                    ? t('menu.emptyAny', { query: query.trim() })
                    : t('menu.emptyInCategory', { query: query.trim(), category: categoryName })}
                </p>
                <div className={styles.emptyActions}>
                  {category !== 'all' && (
                    <button type="button" className="btn btn-primary" onClick={() => setCategory('all')}>
                      {t('menu.searchEverywhere')}
                    </button>
                  )}
                  <button type="button" className="btn btn-outline" onClick={resetSearch}>
                    {t('menu.resetSearch')}
                  </button>
                </div>
              </div>
            ) : grouped ? (
              categories.map((cat) => {
                const items = results.filter((dish) => dish.category === cat.id);
                if (items.length === 0) return null;
                return (
                  <section key={cat.id} className={styles.group} aria-labelledby={`menu-group-${cat.id}`}>
                    <h3 id={`menu-group-${cat.id}`} className={styles.groupTitle}>
                      {pick(cat.name)}
                    </h3>
                    <DishGrid dishes={items} />
                  </section>
                );
              })
            ) : (
              <DishGrid dishes={results} />
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function DishGrid({ dishes: items }) {
  return (
    <ul role="list" className={styles.grid}>
      {items.map((dish) => (
        <li key={dish.id}>
          <DishRow dish={dish} />
        </li>
      ))}
    </ul>
  );
}
