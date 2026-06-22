import { useEffect, useState } from "react";
import { Menu, X, Wheat, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NAV_LINKS, waLink } from "@/lib/site-data";
import { useSiteSettings } from "@/lib/site-queries";

export function Header() {
  const s = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-300 ${
          scrolled ? "" : ""
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-md px-4 py-3 transition-all duration-300 ${
            scrolled ? "bg-white shadow-soft border border-border" : "bg-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-3 min-w-0">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
              <Wheat className="h-6 w-6 text-charcoal" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate font-display text-base font-bold text-charcoal sm:text-lg">
                {s.company_name}
              </div>
              <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Flour Manufacturer • Since 1992
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal/80 transition hover:bg-secondary hover:text-charcoal"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/admin" aria-label="Admin" className="hidden h-10 w-10 place-items-center rounded-md border border-border bg-white text-charcoal/70 transition hover:text-charcoal sm:grid">
              <Lock className="h-4 w-4" />
            </Link>
            <a
              href={waLink("Hi! Please share your latest price list.")}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-md bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-charcoal shadow-gold transition hover:scale-[1.03] sm:inline-flex"
            >
              Get Price List
            </a>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-2 rounded-md border border-border bg-white p-4 shadow-soft lg:hidden">
            <nav className="grid gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-secondary"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={waLink("Hi! Please share your latest price list.")}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex justify-center rounded-xl bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-charcoal"
              >
                Get Price List
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
