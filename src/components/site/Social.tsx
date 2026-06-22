import { QRCodeSVG } from "qrcode.react";
import * as Icons from "lucide-react";
import { SOCIAL } from "@/lib/site-data";

export function Social() {
  return (
    <section className="relative bg-charcoal py-24 text-cream sm:py-32 grain">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Connect With Us
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Scan, follow, stay in touch
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {SOCIAL.map((s) => {
            const Ico =
              (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[s.icon] ??
              Icons.Globe;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-charcoal shadow-gold">
                  <Ico className="h-6 w-6" />
                </div>
                <div className="font-display text-lg font-bold">{s.name}</div>
                <div className="rounded-xl bg-cream p-2.5">
                  <QRCodeSVG value={s.url} size={96} bgColor="#faf5ea" fgColor="#262219" />
                </div>
                <div className="truncate text-[11px] text-cream/60">{s.url.replace(/^https?:\/\//, "")}</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
