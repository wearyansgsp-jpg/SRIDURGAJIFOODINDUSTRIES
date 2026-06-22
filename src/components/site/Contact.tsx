import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { z } from "zod";
import { COMPANY_ADDRESS, COMPANY_EMAIL, WHATSAPP_DISPLAY } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  mobile: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid mobile"),
  email: z.string().trim().email("Invalid email").max(120),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

export function Contact() {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      mobile: fd.get("mobile"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setState("loading");
    try {
      // Attempts to insert into a `leads` table; will work once you run migrations.
      const { error } = await supabase.from("leads").insert(parsed.data);
      if (error) throw error;
      setState("sent");
      (e.target as HTMLFormElement).reset();
    } catch (e2) {
      console.error(e2);
      setState("error");
      setErr("Could not send right now. Please WhatsApp us instead.");
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-brown">
              Get In Touch
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">
              Talk to our team
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Quotes, dealership enquiries, or a plant visit — we usually respond
              within an hour during business hours.
            </p>

            <div className="mt-8 space-y-4">
              <ContactRow icon={<MapPin className="h-5 w-5" />} label="Address" value={COMPANY_ADDRESS} />
              <ContactRow icon={<Phone className="h-5 w-5" />} label="Phone" value={WHATSAPP_DISPLAY} />
              <ContactRow icon={<Mail className="h-5 w-5" />} label="Email" value={COMPANY_EMAIL} />
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-border shadow-soft">
              <iframe
                title="map"
                src="https://www.google.com/maps?q=Ludhiana%20Punjab%20India&output=embed"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            <Field name="name" label="Your Name" placeholder="Full name" />
            <Field name="mobile" label="Mobile" placeholder="+91 ..." type="tel" />
            <Field name="email" label="Email" placeholder="you@example.com" type="email" />
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-widest text-brown">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us what you need…"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
            </div>
            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
            {state === "sent" && (
              <p className="mt-3 text-sm font-medium text-brown">Thank you! We'll be in touch shortly.</p>
            )}
            <button
              disabled={state === "loading"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold px-5 py-3.5 text-sm font-semibold text-charcoal shadow-gold transition hover:scale-[1.02] disabled:opacity-60"
            >
              {state === "loading" ? "Sending…" : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  name, label, placeholder, type = "text",
}: { name: string; label: string; placeholder: string; type?: string }) {
  return (
    <div className="mt-4 first:mt-0">
      <label className="text-xs font-semibold uppercase tracking-widest text-brown">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-gold text-charcoal">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-brown">{label}</div>
        <div className="mt-0.5 break-words text-sm text-charcoal">{value}</div>
      </div>
    </div>
  );
}
