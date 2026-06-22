import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Award, Factory, Sparkles } from "lucide-react";
import { STATS, TRUST_BADGES, waLink } from "@/lib/site-data";
import { useHeroSlides } from "@/lib/site-queries";

const BADGE_ICONS = [ShieldCheck, Award, Sparkles, Factory];

export function Hero() {
  const HERO_SLIDES = useHeroSlides();
  const [i, setI] = useState(0);
  const slide = HERO_SLIDES[i] ?? HERO_SLIDES[0];

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [HERO_SLIDES.length]);

  if (!slide) return null;

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-gradient-hero text-cream"
    >
      <div className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(circle_at_85%_15%,rgba(212,165,74,0.35),transparent_55%)]" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-20 pt-32 lg:grid-cols-2 lg:gap-16 lg:pt-28">
        <div key={slide.title} className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {slide.eyebrow}
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Sri Durga Ji Food Industries
            <span className="mt-2 block text-gradient-gold">{slide.title}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
            {slide.desc}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink("Hi! Please share your latest price list for Maida, Suji, Atta and Wheat Bran.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-md bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-charcoal shadow-gold transition hover:scale-[1.02]"
            >
              Get Price List
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap gap-2">
            {TRUST_BADGES.map((b, k) => {
              const I = BADGE_ICONS[k % BADGE_ICONS.length];
              return (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/85">
                  <I className="h-3.5 w-3.5 text-gold" />
                  {b}
                </span>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl font-bold text-gold sm:text-3xl">{s.k}</div>
                <div className="mt-1 text-[11px] uppercase tracking-widest text-white/60">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 shadow-gold sm:aspect-[4/3]">
            <img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              loading="eager"
              className="h-full w-full animate-fade-up object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-md bg-charcoal/85 px-4 py-3 backdrop-blur">
              <div className="text-xs uppercase tracking-widest text-white/70">
                {String(i + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")} — {slide.eyebrow}
              </div>
              <div className="flex gap-1.5">
                <button
                  aria-label="Previous"
                  onClick={() => setI((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold hover:text-charcoal"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next"
                  onClick={() => setI((p) => (p + 1) % HERO_SLIDES.length)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-gold hover:text-charcoal"
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
