/**
 * Restaurant settings: contacts, hours, delivery rules.
 *
 * Everything here is DEMO data. Replace it with the restaurant's real
 * details before going live, then set `isDemo` to false.
 *
 * Links with an empty `href` are rendered as plain text, so the site never
 * points visitors to a page that does not belong to the restaurant.
 */
export const site = {
  name: 'Ikrom Shashlik',
  isDemo: true,

  phone: {
    display: '+998 90 000-00-00',
    // Full number for the tel: link, e.g. '+998901234567'. Leave empty to show text only.
    href: '',
  },

  address: {
    ru: 'г. Ташкент, ул. Примерная, 1',
    uz: 'Toshkent sh., Namuna koʻchasi, 1',
  },

  // Map pin. Demo coordinates point at central Tashkent, not at a real venue.
  map: { lat: 41.3111, lng: 69.2797, zoom: 16 },

  // Opening hours in the restaurant's time zone. `close` earlier than `open`
  // means the restaurant closes after midnight.
  timeZone: 'Asia/Tashkent',
  hours: { open: '10:00', close: '00:00' },

  socials: {
    telegram: { label: '@ikrom_shashlik', href: '' },
    instagram: { label: '@ikrom.shashlik', href: '' },
  },

  // Amounts are in UZS.
  delivery: {
    fee: 15_000,
    freeFrom: 250_000, // 0 disables free delivery
    minOrder: 60_000, // minimum subtotal for delivery, 0 disables the check
    time: { ru: '45–60 мин', uz: '45–60 daqiqa' },
    pickupTime: { ru: '20–30 мин', uz: '20–30 daqiqa' },
  },

  order: {
    maxQuantityPerItem: 50,
    nameMaxLength: 60,
    addressMaxLength: 200,
    commentMaxLength: 500,
  },
};

/**
 * Endpoint that accepts orders (POST, JSON). Configured through
 * VITE_ORDER_API_URL in `.env`; see README for the expected contract.
 */
export const ORDER_API_URL = (import.meta.env.VITE_ORDER_API_URL ?? '').trim();
