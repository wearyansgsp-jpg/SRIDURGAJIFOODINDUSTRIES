import { Award, Leaf, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/site-queries";

export function About() {
  const s = useSiteSettings();
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Wide horizontal photo with gold frame */}
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-gold to-gold-soft p-2 shadow-gold sm:p-3">
            <div className="relative aspect-[21/9] overflow-hidden rounded-[1rem] shadow-soft sm:aspect-[16/7]">
              <img
                src={s.about_image ?? ""}
                alt="Sri Durga Ji flour manufacturing plant"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Floating badges on the frame */}
          <div className="absolute -bottom-6 left-6 hidden rounded-2xl bg-white p-4 shadow-soft sm:block">
            <div className="font-display text-3xl font-bold text-charcoal">30+</div>
            <div className="text-xs text-muted-foreground">Years of Milling Craft</div>
          </div>
          <div className="absolute -bottom-6 right-6 hidden rounded-2xl bg-charcoal p-4 text-cream shadow-soft sm:block">
            <div className="font-display text-2xl font-bold text-gold">FSSAI</div>
            <div className="text-[10px] uppercase tracking-widest text-cream/70">Certified Plant</div>
          </div>
        </div>

        {/* Text content below the photo */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
              {s.about_eyebrow ?? "Our Story"}
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
              {s.about_headline ?? "Industrial flour manufacturing,"}
              <span className="block text-gradient-gold">{s.about_headline_accent ?? "trusted across India."}</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {s.about_text}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
            {[
              { Icon: Award, t: "Premium Quality" },
              { Icon: ShieldCheck, t: "FSSAI Certified" },
              { Icon: Leaf, t: "Naturally Pure" },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft lg:p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-gold">
                  <Icon className="h-5 w-5 text-charcoal" />
                </div>
                <div className="font-semibold text-charcoal">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
