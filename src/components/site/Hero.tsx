import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES, waLink } from "@/lib/site-data";

export function Hero() {
  const [i, setI] = useState(0);
  const slide = HERO_SLIDES[i];

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-gradient-hero text-cream grain"
    >
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {Array.from({ length: 28 }).map((_, k) => (
          <span
            key={k}
            className="absolute rounded-full bg-gold/40 blur-[1px] animate-float"
            style={{
              left: `${(k * 37) % 100}%`,
              top: `${(k * 53) % 100}%`,
              width: `${4 + (k % 5)}px`,
              height: `${4 + (k % 5)}px`,
              animationDelay: `${(k % 7) * 0.6}s`,
              animationDuration: `${6 + (k % 6)}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(225,180,90,0.18),transparent_50%)]" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-32 lg:grid-cols-2 lg:gap-16 lg:pt-28">
        <div key={slide.title} className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {slide.eyebrow}
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            {slide.title}
            <span className="block text-gradient-gold">crafted in every grain.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            {slide.desc}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink("Hi! I'd like a quotation.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-charcoal shadow-gold transition hover:scale-[1.03]"
            >
              Request Quotation
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-xl border border-cream/20 px-6 py-3.5 text-sm font-semibold text-cream backdrop-blur transition hover:bg-white/5"
            >
              Explore Products
            </a>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { k: "30+", v: "Years" },
              { k: "200 MT", v: "Daily Output" },
              { k: "12+", v: "States Served" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl font-bold text-gold sm:text-3xl">{s.k}</div>
                <div className="text-xs uppercase tracking-widest text-cream/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 -z-10 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-gold/20 shadow-gold">
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              loading="eager"
              className="h-full w-full animate-fade-up object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl glass-dark px-4 py-3">
              <div className="text-xs uppercase tracking-widest text-cream/70">
                {String(i + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
              </div>
              <div className="flex gap-1.5">
                <button
                  aria-label="Previous"
                  onClick={() => setI((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-gold hover:text-charcoal"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next"
                  onClick={() => setI((p) => (p + 1) % HERO_SLIDES.length)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-gold hover:text-charcoal"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
