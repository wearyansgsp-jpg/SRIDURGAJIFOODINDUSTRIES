import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: LeadsPage,
});

type Lead = {
  id: string; name: string; mobile: string; email: string;
  message: string; status: string; created_at: string;
};

function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">Contact-form submissions from your website.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total" value={leads.length} />
        <Stat label="New" value={leads.filter((l) => l.status === "new").length} />
        <Stat label="Contacted" value={leads.filter((l) => l.status === "contacted").length} />
        <Stat label="Closed" value={leads.filter((l) => l.status === "closed").length} />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No leads yet.</div>
        ) : (
          <ul className="divide-y divide-border">
            {leads.map((l) => (
              <li key={l.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-charcoal">{l.name}</div>
                      <StatusBadge status={l.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <a href={`tel:${l.mobile}`} className="inline-flex items-center gap-1 hover:text-charcoal"><Phone className="h-3 w-3" />{l.mobile}</a>
                      <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1 hover:text-charcoal"><Mail className="h-3 w-3" />{l.email}</a>
                      <span>{new Date(l.created_at).toLocaleString()}</span>
                    </div>
                    <p className="mt-3 text-sm text-charcoal/90">{l.message}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <select
                      value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button onClick={() => remove(l.id)} className="rounded-md p-1.5 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-white p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-charcoal">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "new" ? "bg-gold/20 text-brown"
    : status === "contacted" ? "bg-charcoal/10 text-charcoal"
    : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${cls}`}>{status}</span>;
}
