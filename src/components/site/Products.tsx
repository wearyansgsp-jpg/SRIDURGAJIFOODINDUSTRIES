import { useState } from "react";
import { Info, MessageCircle, X } from "lucide-react";
import { PRODUCTS, waLink } from "@/lib/site-data";

export function Products() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="products" className="relative bg-gradient-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
            Our Range
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
            Flour, refined to perfection
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every product is milled, sifted and packed under one roof — never blended,
            never compromised.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, idx) => (
            <article
              key={p.name}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-gold"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute right-3 top-3 rounded-full bg-charcoal/85 px-3 py-1 text-xs font-semibold text-gold backdrop-blur">
                  {p.rate}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-charcoal">{p.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.usps.map((u) => (
                    <li
                      key={u}
                      className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-brown"
                    >
                      {u}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setActive(idx)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-charcoal transition hover:bg-secondary"
                  >
                    <Info className="h-3.5 w-3.5" /> Ingredients
                  </button>
                  <a
                    href={waLink(`Hi! I'm interested in ${p.name}. Please share details.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-gold px-3 py-2.5 text-xs font-semibold text-charcoal shadow-gold transition hover:scale-[1.03]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Enquire
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-charcoal/70 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-card p-6 shadow-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-2xl font-bold text-charcoal">
              {PRODUCTS[active].name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Ingredients & sourcing</p>
            <ul className="mt-5 space-y-2.5">
              {PRODUCTS[active].ingredients.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
