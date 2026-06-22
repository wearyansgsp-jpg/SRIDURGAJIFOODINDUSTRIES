import { useState, useEffect, useMemo } from "react";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "url" | "number"; required?: boolean; placeholder?: string }
  | { key: string; label: string; type: "array"; placeholder?: string }
  | { key: string; label: string; type: "boolean" };

type Row = Record<string, unknown> & { id: string };

interface Props {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  listColumns: Array<{ key: string; label: string }>;
  defaultValues?: Record<string, unknown>;
  orderBy?: string;
}

export function CrudPanel({ table, title, description, fields, listColumns, defaultValues = {}, orderBy = "sort_order" }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const q: any = supabase.from(table as never).select("*");
    const { data, error } = await q.order(orderBy, { ascending: true });
    if (error) setErr(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [table]);

  async function remove(id: string) {
    if (!confirm("Delete this row?")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from(table as never) as any).delete().eq("id", id);
    if (error) alert(error.message);
    else load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={() => { setCreating(true); setEditing({ id: "new", ...defaultValues } as Row); }}
          className="inline-flex items-center gap-2 rounded-md bg-charcoal px-4 py-2.5 text-sm font-semibold text-cream hover:bg-charcoal/90"
        >
          <Plus className="h-4 w-4" /> Add new
        </button>
      </div>

      {err && <p className="mt-4 text-sm text-destructive">{err}</p>}

      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No entries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  {listColumns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/40">
                    {listColumns.map((c) => (
                      <td key={c.key} className="max-w-xs truncate px-4 py-3 text-charcoal">
                        {renderCell(r[c.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditing(r); setCreating(false); }} className="rounded-md px-2 py-1 text-xs font-semibold text-charcoal hover:bg-muted">Edit</button>
                      <button onClick={() => remove(r.id)} className="rounded-md px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10">
                        <Trash2 className="inline h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditDialog
          table={table}
          isNew={creating}
          row={editing}
          fields={fields}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); load(); }}
        />
      )}
    </div>
  );
}

function renderCell(v: unknown) {
  if (v == null) return "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  const s = String(v);
  return s.length > 80 ? s.slice(0, 80) + "…" : s;
}

function EditDialog({ table, isNew, row, fields, onClose, onSaved }: {
  table: string; isNew: boolean; row: Row; fields: FieldDef[];
  onClose: () => void; onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "array") v[f.key] = Array.isArray(row[f.key]) ? (row[f.key] as string[]).join(", ") : "";
      else v[f.key] = row[f.key] ?? (f.type === "boolean" ? true : f.type === "number" ? 0 : "");
    });
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const payload = useMemo(() => {
    const out: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "array") {
        const s = String(values[f.key] ?? "").trim();
        out[f.key] = s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];
      } else if (f.type === "number") {
        out[f.key] = Number(values[f.key] ?? 0);
      } else if (f.type === "boolean") {
        out[f.key] = Boolean(values[f.key]);
      } else {
        out[f.key] = String(values[f.key] ?? "");
      }
    });
    return out;
  }, [values, fields]);

  async function save() {
    setSaving(true); setErr(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = supabase.from(table as never) as any;
      if (isNew) {
        const { error } = await t.insert(payload);
        if (error) throw error;
      } else {
        const { error } = await t.update(payload).eq("id", row.id);
        if (error) throw error;
      }
      onSaved();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/60 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-soft">
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-muted">
          <X className="h-4 w-4" />
        </button>
        <h2 className="font-display text-xl font-bold text-charcoal">{isNew ? "Create" : "Edit"}</h2>

        <div className="mt-5 grid gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-semibold uppercase tracking-widest text-brown">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  rows={4} value={String(values[f.key] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              ) : f.type === "boolean" ? (
                <div className="mt-1.5">
                  <label className="inline-flex items-center gap-2 text-sm text-charcoal">
                    <input type="checkbox" checked={Boolean(values[f.key])}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.checked }))}
                    /> Active / visible
                  </label>
                </div>
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                  value={String(values[f.key] ?? "")}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.type === "array" ? (f.placeholder ?? "comma, separated, values") : f.placeholder}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              )}
              {f.type === "array" && <p className="mt-1 text-[11px] text-muted-foreground">Separate items with commas.</p>}
            </div>
          ))}
        </div>

        {err && <p className="mt-4 text-sm text-destructive">{err}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}
