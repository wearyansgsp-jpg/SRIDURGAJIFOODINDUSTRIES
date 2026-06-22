import { Quote } from "lucide-react";
import { usePresidents, useSiteSettings } from "@/lib/site-queries";

export function Founder() {
  const PRESIDENTS = usePresidents();
  const s = useSiteSettings();
  return (
    <section id="founder" className="relative bg-gradient-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80"
                alt="Founder"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl glass-dark p-4">
                <div className="font-display text-xl font-bold text-cream">Sh. Durga Prasad</div>
                <div className="text-xs uppercase tracking-widest text-gold">Founder & Chairman</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
              From the Founder
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
              "Every grain carries
              <span className="text-gradient-gold"> our family name."</span>
            </h2>
            <Quote className="mt-6 h-8 w-8 text-gold" />
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              When my father set up our first chakki in 1992, he taught me one rule —
              never compromise on the wheat you grind. Three decades later, that
              promise still walks into every sack we send out. We are not just a
              factory; we are custodians of a quality you can taste.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-charcoal px-4 py-3 text-sm text-cream">
              — Sh. Durga Prasad
            </div>
          </div>
        </div>


        {/* Brain Behind */}
        <div className="mt-24">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
              The Brain Behind
            </div>
            <h3 className="mt-3 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Our Working Presidents
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
