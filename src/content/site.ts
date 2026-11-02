/**
 * ─────────────────────────────────────────────────────────────
 *  DANA PANI — EDITABLE SITE CONTENT
 *  Every business fact on the website comes from this file.
 *
 *  Rule of thumb: only put VERIFIED information here.
 *  Anything set to `null` (or an empty list) is shown on the site
 *  as "to be confirmed" or is hidden entirely, never invented.
 * ─────────────────────────────────────────────────────────────
 */

export type Photo = {
  /** Path inside /public, e.g. "/images/hero.jpg". null = decorative placeholder. */
  src: string | null;
  alt: string;
};

export const site = {
  name: "Dana Pani Restaurant",
  shortName: "Dana Pani",
  url: "https://danapani.pk", // TODO: replace with the real domain before launch
  cuisine: ["Pakistani", "Traditional Desi"],
  priceRange: "Rs. 2,000–7,000 per person",
  priceRangeSchema: "PKR 2000-7000",
  allYouCanEat: true,
  googleReviewCount: 34,

  phone: {
    display: "0304 4759007",
    tel: "+923044759007",
  },

  /**
   * WhatsApp is OFF until the restaurant confirms this number is on WhatsApp.
   * Set `enabled: true` to switch the reservation form and contact CTA to WhatsApp.
   */
  whatsapp: {
    enabled: false,
    number: "923044759007", // international format, no "+" or spaces
  },

  address: {
    plusCode: "5FHR+8R4",
    street: "Peoples Colony Road",
    area: "Peoples Colony",
    city: "Multan",
    region: "Punjab",
    country: "PK",
    countryName: "Pakistan",
  },

  maps: {
    query: "Dana Pani Restaurant, 5FHR+8R4, Peoples Colony Road, Multan",
  },

  /**
   * Opening hours. null = not yet verified (site asks guests to call).
   * Example once verified:
   * [{ days: "Monday – Sunday", hours: "12:00 pm – 11:30 pm" }]
   */
  hours: null as null | { days: string; hours: string }[],

  /** Social links. Leave empty until the real profile URLs are confirmed. */
  socials: [] as { label: string; href: string }[],
};

/* ───────────────────────── Photography ─────────────────────────
 * Drop real restaurant photos into /public/images and set `src`.
 * Until then each slot renders an art-directed decorative panel
 * (no fake food or interiors are shown).
 */
export const photos = {
  hero: { src: null, alt: "The Dana Pani dining room in warm evening light" } as Photo,
  story: [
    { src: null, alt: "Guests sharing a meal at Dana Pani" },
    { src: null, alt: "A detail of the Dana Pani table" },
  ] as Photo[],
  ambiance: [
    { src: null, alt: "Dana Pani dining room", caption: "The dining room" },
    { src: null, alt: "Evening at Dana Pani", caption: "Evening" },
    { src: null, alt: "A shared table at Dana Pani", caption: "At the table" },
    { src: null, alt: "A detail at Dana Pani", caption: "Details" },
    { src: null, alt: "Guests arriving at Dana Pani", caption: "The welcome" },
  ] as (Photo & { caption: string })[],
  ambianceWide: { src: null, alt: "Wide view of Dana Pani" } as Photo,
  buffet: { src: null, alt: "The all-you-can-eat spread at Dana Pani" } as Photo,
};

/* ───────────────────────── Menu ─────────────────────────
 * PLACEHOLDER MENU. Replace every item with the restaurant's
 * verified dishes, descriptions and PKR prices.
 * `price: null` displays as "Price on request".
 */
export type MenuItem = {
  name: string;
  description: string;
  price: number | null;
  category: MenuCategory;
  image?: Photo;
  placeholder?: boolean;
};

export const menuCategories = [
  "Starters",
  "Main Course",
  "BBQ",
  "Rice & Biryani",
  "Desserts",
  "Beverages",
] as const;
export type MenuCategory = (typeof menuCategories)[number];

const ph = (category: MenuCategory, n: number): MenuItem => ({
  name: `${category} — item ${n}`,
  description: "Dish name, description and price to be added from Dana Pani's verified menu.",
  price: null,
  category,
  placeholder: true,
});

export const menu: MenuItem[] = menuCategories.flatMap((c) => [ph(c, 1), ph(c, 2), ph(c, 3)]);

/* ───────────────────────── All-you-can-eat ─────────────────────────
 * The restaurant offers all-you-can-eat dining (verified).
 * Fill in the details below once the restaurant confirms them.
 * null = shown as "To be confirmed".
 */
export const buffet = {
  offerings: null as string | null,
  pricing: null as string | null,
  timings: null as string | null,
  conditions: null as string | null,
  terms: null as string | null,
};
