import { Award, Leaf, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/site-queries";

export function About() {
  const s = useSiteSettings();
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
            <img
              src={s.about_image ?? ""}
              alt="Sri Durga Ji flour manufacturing plant"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden w-56 rounded-2xl glass p-5 shadow-soft sm:block">
            <div className="font-display text-4xl font-bold text-charcoal">30+</div>
            <div className="text-sm text-muted-foreground">years of milling craft</div>
          </div>
          <div className="absolute -top-6 -left-4 hidden w-48 rounded-2xl bg-charcoal p-5 text-cream shadow-soft sm:block">
            <div className="font-display text-3xl font-bold text-gold">FSSAI</div>
            <div className="text-xs uppercase tracking-widest text-cream/70">Certified Plant</div>
          </div>
        </div>

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

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { Icon: Award, t: "Premium Quality" },
              { Icon: ShieldCheck, t: "FSSAI Certified" },
              { Icon: Leaf, t: "Naturally Pure" },
            ].map(({ Icon, t }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold">
                  <Icon className="h-5 w-5 text-charcoal" />
                </div>
                <div className="mt-3 font-semibold text-charcoal">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
