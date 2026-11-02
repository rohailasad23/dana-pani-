import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import { fullAddress } from "@/lib/links";
import "./globals.css";

// Fonts are self-hosted (Google Fonts, SIL Open Font License) so builds never depend on a network fetch.
const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin.woff2", weight: "300 700", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const sans = localFont({
  src: [{ path: "../fonts/manrope-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const title = "Dana Pani Restaurant | Traditional Pakistani Dining in Peoples Colony, Multan";
const description =
  "Dana Pani is a traditional Pakistani restaurant on Peoples Colony Road, Multan, offering all-you-can-eat desi dining. Explore the menu and reserve your table.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  applicationName: site.name,
  keywords: ["Dana Pani", "restaurant in Multan", "Peoples Colony restaurant", "Pakistani food Multan", "desi restaurant", "all you can eat Multan"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "/",
    siteName: site.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#123C32",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.name,
  url: site.url,
  telephone: site.phone.tel,
  servesCuisine: site.cuisine,
  priceRange: site.priceRangeSchema,
  acceptsReservations: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.plusCode}, ${site.address.street}, ${site.address.area}`,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
  ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
};

// Runs before paint: enables the intro only for JS users who haven't seen it this session
// and don't prefer reduced motion.
const introScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('dp-intro-played')||location.hash){d.classList.add('no-intro')}}catch(e){d.classList.add('no-intro')}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
