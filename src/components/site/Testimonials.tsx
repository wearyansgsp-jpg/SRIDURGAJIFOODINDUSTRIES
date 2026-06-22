import { Star } from "lucide-react";
import { useTestimonials } from "@/lib/site-queries";

const SIZES = ["sm:row-span-2", "", "sm:row-span-1", "sm:row-span-2", ""];

export function Testimonials() {
  const TESTIMONIALS = useTestimonials();
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
            Voices of Trust
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
            What our partners say
          </h2>
        </div>

        {/* Masonry grid for desktop */}
        <div className="mt-14 hidden grid-cols-3 gap-5 sm:grid auto-rows-[170px]">
          {TESTIMONIALS.map((t, i) => (
            <Card key={t.name} t={t} className={SIZES[i % SIZES.length]} />
          ))}
        </div>

        {/* Marquee for mobile */}
        <div className="mt-14 overflow-hidden sm:hidden">
          <div className="flex w-max gap-4 animate-marquee">
            {loop.map((t, i) => (
              <div key={i} className="w-72 shrink-0">
                <Card t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  t,
  className = "",
}: {
  t: { name: string; role: string; review: string; img: string };
  className?: string;
}) {
  return (
    <div
      className={`flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft ${className}`}
    >
      <div>
        <div className="flex gap-0.5 text-gold">
          {Array.from({ length: 5 }).map((_, k) => (
            <Star key={k} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-charcoal">"{t.review}"</p>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <img
          src={t.img}
          alt={t.name}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-charcoal">{t.name}</div>
          <div className="truncate text-xs text-muted-foreground">{t.role}</div>
        </div>
      </div>
    </div>
  );
}
