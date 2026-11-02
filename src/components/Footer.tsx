import { site } from "@/content/site";
import { telHref } from "@/lib/links";
import { navLinks } from "@/lib/nav";
import { Pattern, Rosette } from "./Pattern";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-emerald text-ivory">
      <Pattern id="footer-pattern" className="pointer-events-none absolute inset-0 opacity-[0.09]" size={110} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_120%,rgba(198,165,107,0.25),transparent_70%)]" />
      <div className="gutter relative mx-auto max-w-[1600px] pb-28 pt-24 md:pb-10 md:pt-32">
        <div className="grid gap-12 md:grid-cols-12">
          <p className="font-serif text-4xl italic leading-[1.05] text-gold-soft md:col-span-5 md:text-5xl">
            Good Food.
            <br />
            Beautiful Moments.
            <br />
            Together.
          </p>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 text-sm md:col-span-6 md:col-start-7 md:grid-cols-3">
            <div>
              <p className="eyebrow text-gold">Explore</p>
              <ul className="mt-4 space-y-2.5 text-ivory/75">
                {navLinks.slice(0, 4).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="hover:text-ivory">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-gold">Visit</p>
              <ul className="mt-4 space-y-2.5 text-ivory/75">
                <li><a href="#menu" className="hover:text-ivory">Menu</a></li>
                <li><a href="#reserve" className="hover:text-ivory">Reservations</a></li>
                <li><a href="#contact" className="hover:text-ivory">Contact</a></li>
                <li><a href="#visit" className="hover:text-ivory">Location</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-gold">Talk to us</p>
              <ul className="mt-4 space-y-2.5 text-ivory/75">
                <li><a href={telHref} className="hover:text-ivory">{site.phone.display}</a></li>
                <li>{site.address.area}, {site.address.city}</li>
                {site.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex items-center gap-6">
          <span className="rule-gold flex-1" />
          <Rosette className="h-8 w-8" />
          <span className="rule-gold flex-1" />
        </div>
        <p aria-hidden="true" className="mt-6 whitespace-nowrap text-center font-serif font-medium leading-[0.8] text-ivory" style={{ fontSize: "clamp(3.4rem, 15.5vw, 17rem)" }}>
          DANA PANI
        </p>
        <div className="mt-10 flex flex-col gap-3 border-t border-ivory/15 pt-6 text-xs text-ivory/55 sm:flex-row sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>{site.address.street}, {site.address.city}, {site.address.countryName}</p>
          <a href="#top" className="hover:text-ivory">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
