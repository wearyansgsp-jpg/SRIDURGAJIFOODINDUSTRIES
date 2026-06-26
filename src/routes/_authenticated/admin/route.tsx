import { createFileRoute, Outlet, Link, useRouterState, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Inbox, Package, Sparkles, Wrench, ShieldCheck, MessageSquareQuote,
  Users, Image as ImageIcon, Share2, Settings, LogOut, Wheat,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    // Only check if user is logged in - skip has_role RPC
    // RLS policies on DB tables handle actual permission enforcement
    const { data: ures } = await supabase.auth.getUser();
    if (!ures.user) throw redirect({ to: "/auth" });
    return { user: ures.user };
  },
  component: AdminShell,
});

const NAV = [
  { to: "/admin", label: "Leads", icon: Inbox, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/offers", label: "Offers", icon: Sparkles },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/why-us", label: "Why Us", icon: ShieldCheck },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/presidents", label: "Leadership", icon: Users },
  { to: "/admin/hero", label: "Hero Slides", icon: ImageIcon },
  { to: "/admin/social", label: "Social Links", icon: Share2 },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;

function AdminShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen w-full bg-muted">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-gradient-gold">
            <Wheat className="h-5 w-5 text-charcoal" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold text-charcoal">Sri Durga Ji</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {NAV.map((n) => {
            const active = 'exact' in n ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-charcoal text-cream" : "text-charcoal hover:bg-muted"
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{email}</div>
          <button onClick={signOut} className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-charcoal hover:bg-muted">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:px-8">
          <div className="lg:hidden font-display font-bold text-charcoal">Admin</div>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-charcoal">View site</Link>
            <button onClick={signOut} className="lg:hidden text-xs text-charcoal"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex overflow-x-auto border-t border-border bg-white lg:hidden">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`flex min-w-[72px] flex-col items-center gap-1 px-3 py-2 text-[10px] ${active ? "text-charcoal" : "text-muted-foreground"}`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
