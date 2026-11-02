"use client";
import { useId, useMemo, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { telHref, whatsappHref } from "@/lib/links";
import { MaskedHeading } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { Pattern } from "./Pattern";

type Values = { name: string; phone: string; guests: string; date: string; time: string; notes: string };
type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = { name: "", phone: "", guests: "2", date: "", time: "", notes: "" };
const PK_MOBILE = /^(?:\+92|0092|92|0)3\d{9}$/;

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  const phone = v.phone.replace(/[\s-()]/g, "");
  if (!PK_MOBILE.test(phone)) e.phone = "Enter a Pakistani mobile number, e.g. 0300 1234567.";
  const g = Number(v.guests);
  if (!Number.isInteger(g) || g < 1 || g > 100) e.guests = "Number of guests should be between 1 and 100.";
  if (!v.date) e.date = "Choose a date.";
  else if (v.date < todayISO()) e.date = "Please pick today or a future date.";
  if (!v.time) e.time = "Choose a time.";
  if (v.notes.length > 500) e.notes = "Please keep requests under 500 characters.";
  return e;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

function Field({
  id,
  label,
  error,
  filled,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  filled: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${filled ? "is-filled" : ""} ${error ? "has-error" : ""}`}>
      {children}
      <label htmlFor={id}>{label}</label>
      <p id={`${id}-error`} className="error" role={error ? "alert" : undefined}>
        {error ?? ""}
      </p>
    </div>
  );
}

export function Reservation() {
  const uid = useId();
  const [values, setValues] = useState<Values>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [submitted, setSubmitted] = useState<null | "whatsapp" | "call">(null);
  const errors = useMemo(() => validate(values), [values]);
  const minDate = useMemo(() => todayISO(), []);
  const wa = site.whatsapp.enabled;

  const id = (k: string) => `${uid}-${k}`;
  const show = (k: keyof Values) => (touched[k] ? errors[k] : undefined);
  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k: keyof Values) => () => setTouched((t) => ({ ...t, [k]: true }));

  const message = [
    `Assalam-o-Alaikum Dana Pani, I would like to request a table.`,
    ``,
    `Name: ${values.name.trim()}`,
    `Phone: ${values.phone.trim()}`,
    `Guests: ${values.guests}`,
    values.date ? `Date: ${formatDate(values.date)}` : "",
    values.time ? `Time: ${formatTime(values.time)}` : "",
    values.notes.trim() ? `Special requests: ${values.notes.trim()}` : "",
    ``,
    `Please confirm if this is available. Thank you.`,
  ]
    .filter((l, i, a) => l !== "" || (a[i - 1] ?? "") !== "")
    .join("\n");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, guests: true, date: true, time: true, notes: true });
    if (Object.keys(errors).length) {
      const first = (["name", "phone", "guests", "date", "time", "notes"] as const).find((k) => errors[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    if (wa) {
      window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
      setSubmitted("whatsapp");
    } else {
      setSubmitted("call");
    }
  };

  const smsHref = `sms:${site.phone.tel}?body=${encodeURIComponent(message)}`;

  return (
    <section id="reserve" aria-labelledby="reserve-heading" className="relative overflow-hidden bg-emerald-deep text-ivory">
      <Pattern id="reserve-pattern" className="pointer-events-none absolute inset-0 opacity-[0.05]" size={90} />
      <div className="gutter relative mx-auto grid max-w-[1600px] gap-14 py-24 md:grid-cols-12 md:py-36">
        <div className="md:col-span-5">
          <p className="eyebrow text-gold">Reservations</p>
          <MaskedHeading
            id="reserve-heading"
            className="mt-6 font-serif text-[clamp(3.2rem,7vw,7.5rem)] font-medium leading-[0.9]"
            lines={["Your Table", <em key="d" className="text-gold">Is Waiting.</em>]}
          />
          <p className="mt-8 max-w-md text-[1.02rem] leading-[1.8] text-ivory/70">
            Tell us when you would like to come and how many will be joining. Your request goes to the restaurant, and it is only confirmed
            once Dana Pani gets back to you.
          </p>
          <div className="mt-10 border-t border-ivory/15 pt-6 text-sm text-ivory/60">
            Prefer to talk?{" "}
            <a href={telHref} className="font-semibold text-gold underline decoration-gold/40 underline-offset-4">
              Call {site.phone.display}
            </a>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          {submitted ? (
            <div role="status" className="relative border border-gold/40 p-8 md:p-12">
              <p className="eyebrow text-gold">{submitted === "whatsapp" ? "Request sent to WhatsApp" : "One last step"}</p>
              <p className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
                {submitted === "whatsapp" ? "Your request is on its way." : "Your request is ready."}
              </p>
              <p className="mt-5 leading-relaxed text-ivory/75">
                {submitted === "whatsapp" ? (
                  <>
                    We opened WhatsApp with your details filled in. Please press send there. Your table is <strong className="text-ivory">not confirmed</strong> until the restaurant replies.
                  </>
                ) : (
                  <>
                    Online booking isn&apos;t connected yet, so please call or text the restaurant to confirm. Your table is{" "}
                    <strong className="text-ivory">not confirmed</strong> until Dana Pani confirms it.
                  </>
                )}
              </p>
              <pre className="mt-6 whitespace-pre-wrap border-l-2 border-gold/50 bg-black/15 p-4 font-sans text-sm leading-relaxed text-ivory/80">{message}</pre>
              <div className="mt-8 flex flex-wrap gap-4">
                {submitted === "whatsapp" ? (
                  <a href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" className="bg-gold px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-charcoal">
                    Open WhatsApp again
                  </a>
                ) : (
                  <>
                    <a href={telHref} className="bg-gold px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-charcoal">
                      Call {site.phone.display}
                    </a>
                    <a href={smsHref} className="border border-gold/60 px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-gold">
                      Send as text message
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                  }}
                  className="px-2 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-ivory/70 underline-offset-4 hover:underline"
                >
                  Edit details
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-x-10 gap-y-4 sm:grid-cols-2" aria-describedby={`${uid}-formnote`}>
              <div className="sm:col-span-2">
                <Field id={id("name")} label="Your name" error={show("name")} filled={!!values.name}>
                  <input id={id("name")} name="name" autoComplete="name" value={values.name} onChange={set("name")} onBlur={blur("name")} aria-invalid={!!show("name")} aria-describedby={`${id("name")}-error`} required />
                </Field>
              </div>
              <Field id={id("phone")} label="Phone number" error={show("phone")} filled={!!values.phone}>
                <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} onBlur={blur("phone")} aria-invalid={!!show("phone")} aria-describedby={`${id("phone")}-error`} required />
              </Field>
              <Field id={id("guests")} label="Number of guests" error={show("guests")} filled>
                <div className="flex items-end gap-3">
                  <input
                    id={id("guests")}
                    name="guests"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={100}
                    value={values.guests}
                    onChange={set("guests")}
                    onBlur={blur("guests")}
                    aria-invalid={!!show("guests")}
                    aria-describedby={`${id("guests")}-error`}
                    required
                  />
                  <div className="flex shrink-0 gap-1 pb-1">
                    {[-1, 1].map((d) => (
                      <button
                        key={d}
                        type="button"
                        aria-label={d < 0 ? "Fewer guests" : "More guests"}
                        onClick={() => setValues((v) => ({ ...v, guests: String(Math.min(100, Math.max(1, (Number(v.guests) || 0) + d))) }))}
                        className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 text-lg text-gold transition-colors hover:bg-gold hover:text-charcoal"
                      >
                        {d < 0 ? "−" : "+"}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
              <Field id={id("date")} label="Preferred date" error={show("date")} filled>
                <input id={id("date")} name="date" type="date" min={minDate} value={values.date} onChange={set("date")} onBlur={blur("date")} aria-invalid={!!show("date")} aria-describedby={`${id("date")}-error`} required />
              </Field>
              <Field id={id("time")} label="Preferred time" error={show("time")} filled>
                <input id={id("time")} name="time" type="time" step={900} value={values.time} onChange={set("time")} onBlur={blur("time")} aria-invalid={!!show("time")} aria-describedby={`${id("time")}-error`} required />
              </Field>
              <div className="sm:col-span-2">
                <Field id={id("notes")} label="Special requests (optional)" error={show("notes")} filled={!!values.notes}>
                  <textarea id={id("notes")} name="notes" rows={3} value={values.notes} onChange={set("notes")} onBlur={blur("notes")} aria-invalid={!!show("notes")} aria-describedby={`${id("notes")}-error`} />
                </Field>
              </div>
              <div className="mt-4 flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p id={`${uid}-formnote`} className="max-w-xs text-xs leading-relaxed text-ivory/50">
                  {wa
                    ? "Submitting opens WhatsApp with your request. The restaurant will reply to confirm."
                    : "Submitting prepares your request so you can call or text the restaurant to confirm."}
                </p>
                <Magnetic>
                  <button type="submit" data-cursor="Book" className="group inline-flex items-center gap-3 bg-gold px-8 py-5 text-[0.75rem] font-bold uppercase tracking-[0.24em] text-charcoal transition-colors duration-500 hover:bg-ivory">
                    {wa ? "Request via WhatsApp" : "Request a table"}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </Magnetic>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
