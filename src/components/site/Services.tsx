import * as Icons from "lucide-react";
import { useServices, useWhyUs } from "@/lib/site-queries";

type IconName = keyof typeof Icons;

function Icon({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Circle;
  return <C className={className} />;
}

export function Services() {
  const SERVICES = useServices();
  return (
    <section id="services" className="relative bg-charcoal py-24 text-cream sm:py-32 grain">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            What We Do
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            End-to-end milling &amp;
            <span className="text-gradient-gold"> supply</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                <Icon name={s.icon as IconName} className="h-6 w-6 text-charcoal" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-cream/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const WHY_US = useWhyUs();
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
            Why Choose Us
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
            Trusted by bakers,
            <span className="text-gradient-gold"> hotels & dealers</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((w) => (
            <div key={w.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
                <Icon name={w.icon} className="h-6 w-6 text-brown" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-charcoal">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
