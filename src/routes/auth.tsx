import { useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Wheat, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/admin" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setInfo("Account created. Signing you in...");
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (e2: unknown) {
      setErr(e2 instanceof Error ? e2.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-hero p-4 text-cream">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 text-charcoal shadow-soft"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-gradient-gold">
            <Wheat className="h-6 w-6 text-charcoal" />
          </div>
          <div>
            <div className="font-display text-lg font-bold">Sri Durga Ji Foods</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Admin Console
            </div>
          </div>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold">
          {mode === "signin" ? "Sign in" : "Create admin account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage products, leads and site content."
            : "The first account created becomes the admin automatically."}
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-widest text-brown">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-md border border-input bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          autoComplete="email"
          placeholder="you@example.com"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-widest text-brown">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-md border border-input bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="Min 8 characters"
        />

        {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
        {info && <p className="mt-3 text-sm text-brown">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-charcoal px-5 py-3.5 text-sm font-semibold text-cream transition hover:bg-charcoal/90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign in" : "Sign up"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setErr(null);
          }}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-charcoal"
        >
          {mode === "signin"
            ? "Need an admin account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
