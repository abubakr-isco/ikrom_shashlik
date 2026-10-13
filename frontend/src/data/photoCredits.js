/**
 * Sources of the temporary photos. All images were cropped, resized and
 * converted to WebP. Remove entries as you replace photos with your own.
 */

const pexels = (id, author = null) => ({
  author,
  source: 'Pexels',
  url: `https://www.pexels.com/photo/${id}/`,
  license: 'Pexels License',
  licenseUrl: 'https://www.pexels.com/license/',
});

export const photoCredits = [
  { file: 'site/hero', ...pexels(2233730, 'Samer Daboul') },
  { file: 'site/about-chef', ...pexels(5779787, 'RDNE Stock project') },
  { file: 'site/about-hall', ...pexels(1581384, 'Rene Terp') },
  { file: 'site/about-meat', ...pexels(12884549) },
  { file: 'site/embers', ...pexels(14887417, 'Shayne Spencer') },
  { file: 'dishes/lamb-shashlik', ...pexels(13156974, 'Kostiantyn Klymovets') },
  { file: 'dishes/beef-shashlik', ...pexels(17138059, 'Valeria Boltneva') },
  { file: 'dishes/lamb-chops', ...pexels(17988080) },
  { file: 'dishes/assorted-shashlik', ...pexels(604659) },
  { file: 'dishes/lula-lamb', ...pexels(6419704) },
  { file: 'dishes/lula-beef', ...pexels(7462776, 'Артем Смолдарев') },
  { file: 'dishes/chicken-wings', ...pexels(106343) },
  { file: 'dishes/chicken-shashlik', ...pexels(899237) },
  { file: 'dishes/plov', ...pexels(10522937, 'Nadin Sh') },
  { file: 'dishes/lagman', ...pexels(29305560, '颖 徐') },
  { file: 'dishes/shurpa', ...pexels(34636461) },
  {
    file: 'dishes/samsa',
    author: 'Fumikas Sagisavas',
    source: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Mutton_samsa.jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    file: 'dishes/manti',
    author: 'Sterilgutassistentin',
    source: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Manti_20100213_011.JPG',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  { file: 'dishes/potato-wedges', ...pexels(3727185, 'Horizon Content') },
  { file: 'dishes/grilled-vegetables', ...pexels(8841153, 'Julia M Cameron') },
  { file: 'dishes/tandoor-bread', ...pexels(20045238, 'Muhammadbobur Salidjanov') },
  { file: 'dishes/achichuk', ...pexels(7954630, 'Tamanna Rumee') },
  { file: 'dishes/fresh-salad', ...pexels(1555814, 'Gil Goldman') },
  { file: 'dishes/radish-salad', ...pexels(257816) },
  { file: 'dishes/green-tea', ...pexels(15318692) },
  { file: 'dishes/black-tea', ...pexels(15675493) },
  { file: 'dishes/citrus-lemonade', ...pexels(2705644) },
  { file: 'dishes/apricot-compote', ...pexels(2960894) },
];
