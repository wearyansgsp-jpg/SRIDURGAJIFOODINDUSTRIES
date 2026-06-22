import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  HERO_SLIDES,
  PRODUCTS,
  OFFERS,
  SERVICES,
  WHY_US,
  TESTIMONIALS,
  PRESIDENTS,
  SOCIAL,
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_ADDRESS,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "./site-data";

const ACTIVE_ORDER = (q: any) =>
  q.eq("is_active", true).order("sort_order", { ascending: true });

function useDb<T>(key: string, fetcher: () => Promise<T[]>, fallback: T[]) {
  const q = useQuery({
    queryKey: [key],
    queryFn: fetcher,
    staleTime: 60_000,
  });
  const rows = q.data && q.data.length > 0 ? q.data : fallback;
  return rows;
}

export function useHeroSlides() {
  return useDb(
    "hero_slides",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("hero_slides").select("eyebrow,title,description,image"),
      );
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        eyebrow: r.eyebrow,
        title: r.title,
        desc: r.description,
        image: r.image,
      }));
    },
    HERO_SLIDES,
  );
}

export function useProducts() {
  return useDb(
    "products",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("products").select("name,rate,image,usps,ingredients"),
      );
      if (error) throw error;
      return (data ?? []) as any;
    },
    PRODUCTS as any,
  );
}

export function useOffers() {
  return useDb(
    "offers",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("offers").select("title,description,tag"),
      );
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        title: r.title,
        desc: r.description,
        tag: r.tag,
      }));
    },
    OFFERS,
  );
}

export function useServices() {
  return useDb(
    "services",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("services").select("icon,title,description"),
      );
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        icon: r.icon,
        title: r.title,
        desc: r.description,
      }));
    },
    SERVICES,
  );
}

export function useWhyUs() {
  return useDb(
    "why_us",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("why_us").select("icon,title,description"),
      );
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        icon: r.icon,
        title: r.title,
        desc: r.description,
      }));
    },
    WHY_US,
  );
}

export function useTestimonials() {
  return useDb(
    "testimonials",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("testimonials").select("name,role,review,image"),
      );
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        name: r.name,
        role: r.role,
        review: r.review,
        img: r.image || `https://i.pravatar.cc/120?u=${encodeURIComponent(r.name)}`,
      }));
    },
    TESTIMONIALS,
  );
}

export function usePresidents() {
  return useDb(
    "presidents",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("presidents").select("name,role,image,description"),
      );
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        name: r.name,
        role: r.role,
        image: r.image,
        desc: r.description,
      }));
    },
    PRESIDENTS,
  );
}

export function useSocial() {
  return useDb(
    "social_links",
    async () => {
      const { data, error } = await ACTIVE_ORDER(
        supabase.from("social_links").select("name,url,icon"),
      );
      if (error) throw error;
      return (data ?? []) as any;
    },
    SOCIAL,
  );
}

export type SiteSettings = {
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
};

const SETTINGS_FALLBACK: SiteSettings = {
  company_name: COMPANY_NAME,
  tagline: "Industrial Flour Manufacturer",
  phone: WHATSAPP_DISPLAY,
  whatsapp_number: WHATSAPP_NUMBER,
  email: COMPANY_EMAIL,
  address: COMPANY_ADDRESS,
  founder_name: "Sh. Durga Prasad",
  founder_role: "Founder & Chairman",
  founder_image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
  founder_quote:
    "When my father set up our first chakki in 1992, he taught me one rule — never compromise on the wheat you grind. Three decades later, that promise still walks into every sack we send out. We are not just a factory; we are custodians of a quality you can taste.",
  about_image:
    "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=1200&q=80",
  about_text:
    "Sri Durga Ji Food Industries operates a modern roller-flour mill in Ludhiana, Punjab — manufacturing and supplying Maida, Suji, Wheat Bran and Atta to distributors, wholesalers, HoReCa kitchens and FMCG private-label brands across 12+ states. Every batch is cleaned, tempered, milled, sifted and packed under FSSAI-compliant controls with full in-house lab testing.",
};

export function useSiteSettings(): SiteSettings {
  const q = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
  if (!q.data) return SETTINGS_FALLBACK;
  return { ...SETTINGS_FALLBACK, ...(q.data as any) };
}
