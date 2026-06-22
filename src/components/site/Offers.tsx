import { Sparkles } from "lucide-react";
import { useOffers } from "@/lib/site-queries";

export function Offers() {
  const OFFERS = useOffers();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
              Limited Offers
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
              Better rates for
              <span className="text-gradient-gold"> bulk buyers</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Dealer pricing, festival combos and bulk discounts — refreshed every month.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o, i) => (
            <div
              key={o.title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-gold"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-gold opacity-20 blur-2xl transition group-hover:opacity-40" />
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-brown">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {o.tag}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-charcoal">{o.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
