import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Wheat, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Check session on mount — if already logged in go straight to admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate({ to: "/admin", replace: true });
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

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
        setInfo("Account created! Signing you in...");
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin", replace: true });
    } catch (e2: unknown) {
      setErr(e2 instanceof Error ? e2.message : "Authentication failed");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-hero">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-hero p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft"
        style={{ color: '#1a1a1a' }}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-gradient-gold">
            <Wheat className="h-6 w-6" style={{ color: '#1a1a1a' }} />
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Sri Durga Ji Foods</div>
            <div className="text-xs uppercase tracking-widest" style={{ color: '#666' }}>Admin Console</div>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold" style={{ color: '#1a1a1a' }}>
          {mode === "signin" ? "Sign in" : "Create admin account"}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#666' }}>
          {mode === "signin"
            ? "Sign in to manage products, leads and site content."
            : "The first account created becomes the admin automatically."}
        </p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B5E3C' }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            marginTop: '8px', width: '100%', borderRadius: '6px',
            border: '1px solid #d1d5db', backgroundColor: '#ffffff',
            padding: '12px 16px', fontSize: '14px', color: '#1a1a1a',
            outline: 'none', boxSizing: 'border-box',
          }}
          autoComplete="email"
          placeholder="you@example.com"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B5E3C' }}>
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginTop: '8px', width: '100%', borderRadius: '6px',
            border: '1px solid #d1d5db', backgroundColor: '#ffffff',
            padding: '12px 16px', fontSize: '14px', color: '#1a1a1a',
            outline: 'none', boxSizing: 'border-box',
          }}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="Min 8 characters"
        />

        {err && <p className="mt-3 text-sm" style={{ color: '#dc2626' }}>{err}</p>}
        {info && <p className="mt-3 text-sm" style={{ color: '#8B5E3C' }}>{info}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '24px', width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '8px',
            borderRadius: '6px', backgroundColor: '#1a1a1a', padding: '14px 20px',
            fontSize: '14px', fontWeight: '600', color: '#ffffff',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign in" : "Sign up"}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); }}
          style={{
            marginTop: '16px', width: '100%', fontSize: '14px',
            color: '#666', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          {mode === "signin"
            ? "Need an admin account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
