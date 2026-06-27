import { Quote } from "lucide-react";
import { usePresidents, useSiteSettings } from "@/lib/site-queries";

export function Founder() {
  const PRESIDENTS = usePresidents();
  const s = useSiteSettings();
  return (
    <section id="founder" className="relative bg-gradient-cream py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="relative max-w-[350px] mx-auto lg:mx-0">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-soft">
              <img
                src={s.founder_image ?? ""}
                alt={s.founder_name ?? "Founder"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent" />
              <div className="absolute bottom-3 left-3 right-3 rounded-xl glass-dark p-2.5">
                <div className="font-display text-base font-bold text-cream">{s.founder_name}</div>
                <div className="text-[10px] uppercase tracking-widest text-gold">{s.founder_role}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brown">
              {s.founder_eyebrow ?? "From the Founder"}
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-charcoal sm:text-2xl">
              {s.founder_headline ?? "Every grain carries"}
              <span className="text-gradient-gold"> {s.founder_headline_accent ?? "our family name."}</span>
            </h2>
            <Quote className="mt-3 h-5 w-5 text-gold" />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {s.founder_quote}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-charcoal px-3 py-1.5 text-xs text-cream">
              — {s.founder_name}
            </div>
          </div>
        </div>


        {/* Brain Behind */}
        <div className="mt-16">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
              {s.presidents_eyebrow ?? "The Brain Behind"}
            </div>
            <h3 className="mt-3 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              {s.presidents_title ?? "Our Working Presidents"}
            </h3>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {PRESIDENTS.map((p) => (
              <div
                key={p.name}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-brown">{p.role}</div>
                  <div className="mt-1 font-display text-2xl font-bold text-charcoal">{p.name}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
