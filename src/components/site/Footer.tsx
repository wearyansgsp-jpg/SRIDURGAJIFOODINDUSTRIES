import { Wheat } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data";
import { useSiteSettings, useSocial } from "@/lib/site-queries";
import * as Icons from "lucide-react";
import mashoorLogo from "@/assets/mashoor-bano.png";

export function Footer() {
  const cfg = useSiteSettings();
  const SOCIAL = useSocial();
  return (
    <footer className="bg-charcoal text-cream grain">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold">
              <Wheat className="h-6 w-6 text-charcoal" />
            </div>
            <div className="font-display text-lg font-bold">{cfg.company_name}</div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/65">
            Premium flour mill crafting maida, suji, atta and wheat bran for India's
            finest bakeries, hotels and homes since 1992.
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">Quick Links</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-cream/70 transition hover:text-gold">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">Contact</div>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
            <li>{cfg.phone}</li>
            <li>{cfg.email}</li>
            <li>{cfg.address}</li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">Follow</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOCIAL.map((s) => {
              const I = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[s.icon] ?? Icons.Globe;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-cream transition hover:bg-gold hover:text-charcoal"
                >
                  <I className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} {cfg.company_name}. All rights reserved.
        </div>
      </div>

      {/* Mashoor Bano credit */}
      <div className="bg-black px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <a href="https://mashoorbano.com" target="_blank" rel="noreferrer" aria-label="MashoorBano">
            <img src={mashoorLogo} alt="MashoorBano" className="h-28 w-auto sm:h-36" loading="lazy" />
          </a>
          <p className="mt-5 text-sm text-cream/80">
            Designed & developed by <span className="font-semibold text-[#ff6b1a]">MashoorBano</span> &nbsp;•&nbsp; +91 78147 18340
          </p>
        </div>
      </div>
    </footer>
  );
}
