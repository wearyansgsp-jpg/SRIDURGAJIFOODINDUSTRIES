import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Settings = {
  id: number;
  company_name: string;
  tagline: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  founder_name: string | null;
  founder_role: string | null;
  founder_image: string | null;
  founder_quote: string | null;
  about_image: string | null;
  about_text: string | null;
  founder_eyebrow: string | null;
  founder_headline: string | null;
  founder_headline_accent: string | null;
  presidents_eyebrow: string | null;
  presidents_title: string | null;
};

function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      setS((data as Settings) ?? null);
      setLoading(false);
    });
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true); setMsg(null);
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    setMsg(error ? error.message : "Saved.");
    setSaving(false);
  }

  if (loading || !s) return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;

  const F = (k: keyof Settings, label: string, area = false) => (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-brown">{label}</label>
      {area ? (
        <textarea rows={3} value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })}
          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
      ) : (
        <input value={String(s[k] ?? "")} onChange={(e) => setS({ ...s, [k]: e.target.value })}
          className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" />
      )}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Company details shown across the website.</p>

      <div className="mt-6 grid gap-4 rounded-lg border border-border bg-white p-6">
        {F("company_name", "Company name")}
        {F("tagline", "Tagline")}
        <div className="grid gap-4 sm:grid-cols-2">
          {F("phone", "Phone")}
          {F("whatsapp_number", "WhatsApp number (digits only, e.g. 919988719133)")}
        </div>
        {F("email", "Email")}
        {F("address", "Address", true)}

        <h2 className="mt-4 font-display text-lg font-bold text-charcoal">About section</h2>
        {F("about_image", "About image URL")}
        {F("about_text", "About paragraph", true)}

        <h2 className="mt-4 font-display text-lg font-bold text-charcoal">Founder block</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {F("founder_name", "Founder name")}
          {F("founder_role", "Founder role")}
        </div>
        {F("founder_image", "Founder photo URL")}
        {F("founder_quote", "Founder quote", true)}
        {F("founder_eyebrow", "Founder eyebrow (small label)")}
        <div className="grid gap-4 sm:grid-cols-2">
          {F("founder_headline", "Founder headline")}
          {F("founder_headline_accent", "Founder headline accent (gold text)")}
        </div>

        <h2 className="mt-4 font-display text-lg font-bold text-charcoal">Working Presidents block</h2>
        {F("presidents_eyebrow", "Presidents eyebrow (small label)")}
        {F("presidents_title", "Presidents section title")}
      </div>

      {msg && <p className="mt-3 text-sm text-brown">{msg}</p>}

      <button onClick={save} disabled={saving}
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-charcoal px-5 py-3 text-sm font-semibold text-cream disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
      </button>
    </div>
  );
}
