# Dana Pani Restaurant — website

"The Art of Desi Dining." A cinematic, single-page website for Dana Pani Restaurant, Peoples Colony Road, Multan.

Built with **Next.js 15 (App Router) + React 19 + Tailwind CSS 4 + GSAP/ScrollTrigger**. No other runtime dependencies.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start   # production
npm run preview:static # optional: plain static copy in /out (relative paths, any host)
```

Deploys as-is to Vercel, Netlify or any Node host.

## Editing content (no coding needed beyond one file)

**Everything factual lives in `src/content/site.ts`.** Only verified information should go there.

| What | Where in `site.ts` | Currently |
| --- | --- | --- |
| Menu dishes, descriptions, PKR prices | `menu` | Placeholder items, "Price on request" |
| Menu categories | `menuCategories` | All / Starters / Main Course / BBQ / Rice & Biryani / Desserts / Beverages |
| All-you-can-eat offerings, price, timings, conditions, terms | `buffet` | All `null` → shown as "To be confirmed" |
| Opening hours | `site.hours` | `null` → "Please call ahead" |
| Social links | `site.socials` | Empty → hidden |
| **WhatsApp** | `site.whatsapp.enabled` | `false` until the number is confirmed on WhatsApp |
| Photography | `photos` (+ files in `public/images/`) | `null` → decorative art panels |
| Domain for SEO / OG | `site.url` | `https://danapani.pk` (placeholder, change before launch) |

### Photos
Put real restaurant photos in `public/images/` and set e.g. `photos.hero.src = "/images/hero.jpg"`. Menu items accept `image: { src, alt }`. Until a photo is supplied, each slot shows an art-directed lattice/arch panel. No stock food or interiors are used, so nothing misrepresents the restaurant.

### Reservations
There is no booking backend. The form validates name, Pakistani mobile number, guests, date (not in the past) and time, then:
- **WhatsApp off (default):** shows the formatted request with Call and Text-message buttons.
- **WhatsApp on:** opens WhatsApp with the request pre-filled.

In both cases the guest is told the table is **not confirmed** until the restaurant replies.

## Structure

```
src/app/            layout (fonts, metadata, JSON-LD Restaurant schema), page, OG image, robots, sitemap
src/content/site.ts all editable business content
src/components/     Hero (intro), DiningTable, Menu, Story, Ambiance, Buffet, Reservation, Visit (map + contact), Footer, Nav, Cursor, Magnetic, Reveal, PhotoFrame, Pattern, Dish
src/lib/            GSAP setup, link helpers, nav links
```

## Motion & accessibility
- Intro plays once per browser session (~3s) and is skipped for `prefers-reduced-motion`, deep links, and repeat visits; a CSS fail-safe reveals content if scripts stall.
- Pinned horizontal "table" scroll on desktop only; mobile gets a vertical, lightweight version.
- Custom cursor and magnetic buttons only on fine pointers; hidden with reduced motion.
- Skip link, semantic landmarks, labelled form fields with inline errors, keyboard-accessible menu tabs and mobile menu (Esc closes).
- Google Map loads lazily only when the section approaches.
