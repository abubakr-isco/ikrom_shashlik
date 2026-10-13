/** Lowercase, treat ё as е and ignore Uzbek apostrophes (oʻ = o' = o). */
export function normalizeSearch(text) {
  return String(text ?? '')
    .toLocaleLowerCase('ru')
    .replace(/ё/g, 'е')
    .replace(/[ʻʼ'`‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesQuery(dish, query, lang) {
  if (!query) return true;
  const haystack = [dish.name.ru, dish.name.uz, dish.description[lang] ?? dish.description.ru]
    .map(normalizeSearch)
    .join(' ');
  return query.split(' ').every((word) => haystack.includes(word));
}

const sorters = {
  popular: (a, b) => Number(b.popular) - Number(a.popular),
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
};

/**
 * Filters and sorts dishes. Unavailable dishes always go last so the
 * first things a visitor sees can be ordered.
 */
export function filterDishes(dishes, { category = 'all', query = '', sort = 'popular', lang = 'ru' }) {
  const q = normalizeSearch(query);
  const byName = (a, b) => (a.name[lang] ?? a.name.ru).localeCompare(b.name[lang] ?? b.name.ru, lang);
  const compare = sort === 'name' ? byName : sorters[sort] ?? sorters.popular;
  return dishes
    .filter((dish) => (category === 'all' || dish.category === category) && matchesQuery(dish, q, lang))
    .map((dish, index) => ({ dish, index }))
    .sort((a, b) => Number(!a.dish.available) - Number(!b.dish.available) || compare(a.dish, b.dish) || a.index - b.index)
    .map(({ dish }) => dish);
}
