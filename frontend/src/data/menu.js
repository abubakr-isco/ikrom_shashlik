/**
 * Menu: categories and dishes.
 *
 * DEMO data: prices, weights and descriptions are examples. Replace them with
 * the restaurant's real menu. Every dish needs:
 *   id          unique, stable string (used in the cart and in orders)
 *   category    one of the category ids below
 *   name        { ru, uz }
 *   description { ru, uz }
 *   portion     { value, unit } — unit is 'g', 'ml' or 'pcs'
 *   price       integer, UZS
 *   image       file name in public/images/dishes without size suffix
 *               (provide `<image>-520.webp` and `<image>-900.webp`)
 *   popular     shown in the "Popular" block on the home page
 *   available   false shows the dish as temporarily unavailable
 */

export const categories = [
  { id: 'shashlik', name: { ru: 'Шашлык', uz: 'Shashlik' } },
  { id: 'lula', name: { ru: 'Люля-кебаб', uz: 'Lyulya-kabob' } },
  { id: 'chicken', name: { ru: 'Курица на углях', uz: 'Choʻgʻdagi tovuq' } },
  { id: 'national', name: { ru: 'Национальные блюда', uz: 'Milliy taomlar' } },
  { id: 'sides', name: { ru: 'Гарниры', uz: 'Garnirlar' } },
  { id: 'salads', name: { ru: 'Салаты', uz: 'Salatlar' } },
  { id: 'drinks', name: { ru: 'Напитки', uz: 'Ichimliklar' } },
];

export const dishes = [
  // --- Шашлык ---------------------------------------------------------
  {
    id: 'lamb-shashlik',
    category: 'shashlik',
    name: { ru: 'Шашлык из баранины', uz: 'Qoʻy goʻshtidan shashlik' },
    description: {
      ru: 'Мякоть баранины с курдючным жиром, маринад из лука и зиры.',
      uz: 'Dumba yogʻi bilan qoʻy goʻshti, piyoz va zira marinadi.',
    },
    portion: { value: 180, unit: 'g' },
    price: 32_000,
    image: 'lamb-shashlik',
    popular: true,
    available: true,
  },
  {
    id: 'beef-shashlik',
    category: 'shashlik',
    name: { ru: 'Шашлык из говядины', uz: 'Mol goʻshtidan shashlik' },
    description: {
      ru: 'Говяжья вырезка, маринованная с луком и чёрным перцем.',
      uz: 'Piyoz va qora murch bilan marinadlangan mol goʻshti.',
    },
    portion: { value: 180, unit: 'g' },
    price: 29_000,
    image: 'beef-shashlik',
    popular: true,
    available: true,
  },
  {
    id: 'lamb-chops',
    category: 'shashlik',
    name: { ru: 'Каре ягнёнка', uz: 'Qoʻzi qovurgʻasi' },
    description: {
      ru: 'Рёбрышки ягнёнка на углях с розмарином и печёными овощами.',
      uz: 'Rozmarin va pishirilgan sabzavotlar bilan choʻgʻdagi qoʻzi qovurgʻasi.',
    },
    portion: { value: 300, unit: 'g' },
    price: 58_000,
    image: 'lamb-chops',
    popular: false,
    available: false,
  },
  {
    id: 'assorted-shashlik',
    category: 'shashlik',
    name: { ru: 'Шашлык-ассорти с овощами', uz: 'Sabzavotli assorti shashlik' },
    description: {
      ru: 'Баранина, говядина и курица, перец, лук и помидоры с мангала. На компанию.',
      uz: 'Qoʻy, mol va tovuq goʻshti, mangaldagi qalampir, piyoz va pomidor. Davra uchun.',
    },
    portion: { value: 750, unit: 'g' },
    price: 125_000,
    image: 'assorted-shashlik',
    popular: false,
    available: true,
  },

  // --- Люля-кебаб ------------------------------------------------------
  {
    id: 'lula-lamb',
    category: 'lula',
    name: { ru: 'Люля-кебаб из баранины', uz: 'Qoʻy goʻshtidan lyulya-kabob' },
    description: {
      ru: 'Рубленая баранина с луком и специями, подаётся с маринованным луком.',
      uz: 'Piyoz va ziravorlar bilan qiyma qilingan qoʻy goʻshti, marinadlangan piyoz bilan.',
    },
    portion: { value: 160, unit: 'g' },
    price: 27_000,
    image: 'lula-lamb',
    popular: true,
    available: true,
  },
  {
    id: 'lula-beef',
    category: 'lula',
    name: { ru: 'Люля-кебаб из говядины', uz: 'Mol goʻshtidan lyulya-kabob' },
    description: {
      ru: 'Сочный фарш из говядины, зелень, помидоры и красный лук.',
      uz: 'Shirali mol goʻshti qiymasi, koʻkat, pomidor va qizil piyoz.',
    },
    portion: { value: 160, unit: 'g' },
    price: 25_000,
    image: 'lula-beef',
    popular: false,
    available: true,
  },

  // --- Курица на углях -------------------------------------------------
  {
    id: 'chicken-wings',
    category: 'chicken',
    name: { ru: 'Куриные крылышки на углях', uz: 'Choʻgʻda pishgan tovuq qanotlari' },
    description: {
      ru: 'Крылышки в пряном маринаде с хрустящей корочкой.',
      uz: 'Achchiq-shirin marinaddagi qarsildoq tovuq qanotlari.',
    },
    portion: { value: 350, unit: 'g' },
    price: 34_000,
    image: 'chicken-wings',
    popular: true,
    available: true,
  },
  {
    id: 'chicken-shashlik',
    category: 'chicken',
    name: { ru: 'Куриный шашлык', uz: 'Tovuq shashlik' },
    description: {
      ru: 'Бедро цыплёнка в маринаде с паприкой и чесноком.',
      uz: 'Paprika va sarimsoqli marinaddagi tovuq soni.',
    },
    portion: { value: 200, unit: 'g' },
    price: 24_000,
    image: 'chicken-shashlik',
    popular: false,
    available: true,
  },

  // --- Национальные блюда ----------------------------------------------
  {
    id: 'plov',
    category: 'national',
    name: { ru: 'Плов ташкентский', uz: 'Toshkent palovi' },
    description: {
      ru: 'Рис девзира, баранина, жёлтая морковь, нут и перепелиное яйцо.',
      uz: 'Devzira guruch, qoʻy goʻshti, sariq sabzi, noʻxat va bedana tuxumi.',
    },
    portion: { value: 350, unit: 'g' },
    price: 42_000,
    image: 'plov',
    popular: true,
    available: true,
  },
  {
    id: 'lagman',
    category: 'national',
    name: { ru: 'Лагман', uz: 'Lagʻmon' },
    description: {
      ru: 'Тянутая лапша, говядина и овощи в густом пряном бульоне.',
      uz: 'Choʻzma lagʻmon, mol goʻshti va sabzavotlar quyuq ziravorli shoʻrvada.',
    },
    portion: { value: 450, unit: 'g' },
    price: 36_000,
    image: 'lagman',
    popular: false,
    available: true,
  },
  {
    id: 'shurpa',
    category: 'national',
    name: { ru: 'Шурпа', uz: 'Shoʻrva' },
    description: {
      ru: 'Наваристый бульон из баранины с картофелем, морковью и зеленью.',
      uz: 'Kartoshka, sabzi va koʻkat qoʻshilgan quyuq qoʻy goʻshti shoʻrvasi.',
    },
    portion: { value: 450, unit: 'g' },
    price: 34_000,
    image: 'shurpa',
    popular: false,
    available: true,
  },
  {
    id: 'samsa',
    category: 'national',
    name: { ru: 'Самса тандырная', uz: 'Tandir somsa' },
    description: {
      ru: 'Слоёное тесто, рубленая баранина и лук. Прямо из тандыра.',
      uz: 'Qatlama xamir, qiyma qilingan qoʻy goʻshti va piyoz. Toʻgʻridan-toʻgʻri tandirdan.',
    },
    portion: { value: 1, unit: 'pcs' },
    price: 12_000,
    image: 'samsa',
    popular: true,
    available: true,
  },
  {
    id: 'manti',
    category: 'national',
    name: { ru: 'Манты', uz: 'Manti' },
    description: {
      ru: 'Тонкое тесто, баранина с луком, на пару. Подаются со сметаной.',
      uz: 'Yupqa xamir, piyozli qoʻy goʻshti, bugʻda pishirilgan. Qaymoq bilan.',
    },
    portion: { value: 4, unit: 'pcs' },
    price: 32_000,
    image: 'manti',
    popular: false,
    available: true,
  },

  // --- Гарниры ---------------------------------------------------------
  {
    id: 'potato-wedges',
    category: 'sides',
    name: { ru: 'Картофель по-деревенски', uz: 'Qishloqcha kartoshka' },
    description: {
      ru: 'Дольки картофеля с чесноком и паприкой.',
      uz: 'Sarimsoq va paprikali kartoshka boʻlaklari.',
    },
    portion: { value: 200, unit: 'g' },
    price: 16_000,
    image: 'potato-wedges',
    popular: false,
    available: true,
  },
  {
    id: 'grilled-vegetables',
    category: 'sides',
    name: { ru: 'Овощи на углях', uz: 'Choʻgʻda pishgan sabzavotlar' },
    description: {
      ru: 'Баклажан, кабачок, перец и лук с мангала.',
      uz: 'Mangaldagi baqlajon, qovoqcha, qalampir va piyoz.',
    },
    portion: { value: 250, unit: 'g' },
    price: 22_000,
    image: 'grilled-vegetables',
    popular: false,
    available: true,
  },
  {
    id: 'tandoor-bread',
    category: 'sides',
    name: { ru: 'Лепёшка тандырная', uz: 'Tandir non' },
    description: {
      ru: 'Горячая лепёшка с кунжутом и чернушкой.',
      uz: 'Kunjut va sedana sepilgan issiq non.',
    },
    portion: { value: 1, unit: 'pcs' },
    price: 6_000,
    image: 'tandoor-bread',
    popular: false,
    available: true,
  },

  // --- Салаты ----------------------------------------------------------
  {
    id: 'achichuk',
    category: 'salads',
    name: { ru: 'Ачичук', uz: 'Achchiq-chuchuk' },
    description: {
      ru: 'Помидоры, сладкий лук и острый перец. Классика к шашлыку.',
      uz: 'Pomidor, shirin piyoz va achchiq qalampir. Shashlikka klassika.',
    },
    portion: { value: 250, unit: 'g' },
    price: 15_000,
    image: 'achichuk',
    popular: false,
    available: true,
  },
  {
    id: 'fresh-salad',
    category: 'salads',
    name: { ru: 'Овощной салат', uz: 'Sabzavotli salat' },
    description: {
      ru: 'Огурцы, помидоры, болгарский перец и зелень с маслом.',
      uz: 'Bodring, pomidor, bulgʻor qalampiri va koʻkat, yogʻ bilan.',
    },
    portion: { value: 250, unit: 'g' },
    price: 20_000,
    image: 'fresh-salad',
    popular: false,
    available: true,
  },
  {
    id: 'radish-salad',
    category: 'salads',
    name: { ru: 'Салат с редисом', uz: 'Rediskali salat' },
    description: {
      ru: 'Листья салата, редис, морковь и черри с лимонной заправкой.',
      uz: 'Salat barglari, rediska, sabzi va cherri, limonli sous bilan.',
    },
    portion: { value: 250, unit: 'g' },
    price: 22_000,
    image: 'radish-salad',
    popular: false,
    available: true,
  },

  // --- Напитки ---------------------------------------------------------
  {
    id: 'green-tea',
    category: 'drinks',
    name: { ru: 'Зелёный чай', uz: 'Koʻk choy' },
    description: {
      ru: 'Чайник зелёного чая на компанию.',
      uz: 'Davra uchun bir choynak koʻk choy.',
    },
    portion: { value: 700, unit: 'ml' },
    price: 8_000,
    image: 'green-tea',
    popular: false,
    available: true,
  },
  {
    id: 'black-tea',
    category: 'drinks',
    name: { ru: 'Чёрный чай с лимоном', uz: 'Limonli qora choy' },
    description: {
      ru: 'Чайник чёрного чая, лимон и сахар отдельно.',
      uz: 'Bir choynak qora choy, limon va shakar alohida.',
    },
    portion: { value: 700, unit: 'ml' },
    price: 9_000,
    image: 'black-tea',
    popular: false,
    available: true,
  },
  {
    id: 'citrus-lemonade',
    category: 'drinks',
    name: { ru: 'Лимонад цитрусовый', uz: 'Sitrusli limonad' },
    description: {
      ru: 'Апельсин, лимон и мята. Готовим сами.',
      uz: 'Apelsin, limon va yalpiz. Oʻzimiz tayyorlaymiz.',
    },
    portion: { value: 1000, unit: 'ml' },
    price: 28_000,
    image: 'citrus-lemonade',
    popular: false,
    available: true,
  },
  {
    id: 'apricot-compote',
    category: 'drinks',
    name: { ru: 'Компот из абрикосов', uz: 'Oʻrik kompoti' },
    description: {
      ru: 'Домашний компот из сушёных абрикосов.',
      uz: 'Quritilgan oʻrikdan uy kompoti.',
    },
    portion: { value: 1000, unit: 'ml' },
    price: 20_000,
    image: 'apricot-compote',
    popular: false,
    available: true,
  },
];

export const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));

export function getDishImage(image, width) {
  return `/images/dishes/${image}-${width}.webp`;
}
