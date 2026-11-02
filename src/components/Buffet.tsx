import { buffet, photos, site } from "@/content/site";
import { telHref } from "@/lib/links";
import { ClipReveal, MaskedHeading, Rise } from "./Reveal";
import { PhotoFrame } from "./PhotoFrame";
import { Pattern } from "./Pattern";

const rows: { key: keyof typeof buffet; label: string }[] = [
  { key: "offerings", label: "What's on the table" },
  { key: "pricing", label: "Pricing" },
  { key: "timings", label: "Timings" },
  { key: "conditions", label: "Service conditions" },
  { key: "terms", label: "Terms" },
];

export function Buffet() {
  return (
    <section id="all-you-can-eat" aria-labelledby="buffet-heading" className="relative overflow-hidden bg-emerald text-ivory">
      <Pattern id="buffet-pattern" className="pointer-events-none absolute inset-0 opacity-[0.06]" size={140} />
      <div className="gutter relative mx-auto grid max-w-[1600px] gap-14 py-24 md:grid-cols-12 md:py-36">
        <div className="md:col-span-6">
          <p className="eyebrow text-gold">All-you-can-eat</p>
          <MaskedHeading
            id="buffet-heading"
            className="mt-6 font-serif text-[clamp(3.2rem,7.4vw,8.5rem)] font-medium leading-[0.86]"
            lines={["Come Hungry.", <em key="c" className="text-gold">Leave Happy.</em>]}
          />
          <Rise className="mt-10 max-w-lg text-[1.02rem] leading-[1.8] text-ivory/75">
            <p>
              At Dana Pani, the table keeps giving. Our all-you-can-eat service is made for long lunches, family dinners and anyone who has
              ever wanted just one more helping.
            </p>
          </Rise>

          <dl className="mt-12 max-w-xl">
            {rows.map((r) => {
              const value = buffet[r.key];
              return (
                <div key={r.key} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-6 border-t border-ivory/15 py-5 last:border-b">
                  <dt className="eyebrow pt-1 text-gold/90">{r.label}</dt>
                  <dd className={value ? "text-ivory/90" : "text-ivory/50 italic"}>
                    {value ?? (
                      <>
                        To be confirmed.{" "}
                        <a href={telHref} className="not-italic text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
                          Call {site.phone.display}
                        </a>
                      </>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="relative md:col-span-5 md:col-start-8">
          <ClipReveal className="arch aspect-[3/4] w-full md:sticky md:top-24" parallax={8}>
            <PhotoFrame photo={photos.buffet} tone="terracotta" patternId="buffet-photo" sizes="(min-width:768px) 40vw, 100vw" className="h-full w-full" />
          </ClipReveal>
          <div className="pointer-events-none absolute -left-6 top-10 hidden h-28 w-28 place-items-center rounded-full border border-gold/50 text-center md:grid">
            <span className="eyebrow leading-relaxed text-gold">
              All you
              <br />
              can eat
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
