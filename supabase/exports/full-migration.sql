-- =========================================================================
-- Sri Durga Ji Food Industries — Full Schema + RLS + Seed Data Export
-- Generated for migration to a fresh Supabase project.
-- Run this in the SQL Editor of your new Supabase project.
-- =========================================================================

-- 1. Extensions ----------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Enum ----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Helper functions ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE is_first BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO is_first;
  IF is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Tables --------------------------------------------------------------

-- user_roles -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings (singleton row id=1) -------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Sri Durga Ji Food Industries',
  tagline text, phone text, whatsapp_number text, email text, address text,
  founder_name text, founder_role text, founder_image text, founder_quote text,
  about_image text, about_text text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read site_settings" ON public.site_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can view site settings" ON public.site_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write site_settings" ON public.site_settings
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_settings_touch BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- public_site_info (view exposing site_settings publicly) ----------------
CREATE OR REPLACE VIEW public.public_site_info AS
  SELECT id, company_name, tagline, phone, whatsapp_number, email, address,
         founder_name, founder_role, founder_image, founder_quote,
         about_image, about_text
  FROM public.site_settings
  LIMIT 1;
GRANT SELECT ON public.public_site_info TO anon, authenticated;

-- leads ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, mobile text NOT NULL, email text NOT NULL,
  message text NOT NULL, status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(trim(name))>1 AND length(trim(email))>3
              AND length(trim(mobile))>5 AND length(trim(message))>4);
CREATE POLICY "Admins read leads" ON public.leads
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update leads" ON public.leads
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete leads" ON public.leads
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Generic content tables (same shape: public read, admin write) ---------
-- products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, rate text, image text,
  usps text[] NOT NULL DEFAULT '{}', ingredients text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- offers
CREATE TABLE IF NOT EXISTS public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, description text NOT NULL, tag text,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- services
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Factory',
  title text NOT NULL, description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- why_us
CREATE TABLE IF NOT EXISTS public.why_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'ShieldCheck',
  title text NOT NULL, description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, role text NOT NULL, review text NOT NULL, image text,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- presidents
CREATE TABLE IF NOT EXISTS public.presidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, role text NOT NULL, image text, description text NOT NULL,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- hero_slides
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow text NOT NULL, title text NOT NULL, description text NOT NULL,
  image text NOT NULL,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- social_links
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, url text NOT NULL, icon text NOT NULL,
  sort_order int NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTs + RLS + policies + touch triggers for all 8 content tables ------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['products','offers','services','why_us',
                           'testimonials','presidents','hero_slides','social_links']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon;', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "Public read %1$s" ON public.%1$I FOR SELECT TO anon, authenticated USING (true);', t);
    EXECUTE format('CREATE POLICY "Admins write %1$s" ON public.%1$I TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''));', t);
    EXECUTE format('CREATE TRIGGER trg_%1$s_touch BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();', t);
  END LOOP;
END $$;

-- 5. Auth trigger: first sign-up becomes admin ---------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 6. Seed data (current rows from source project)
-- =========================================================================

-- Seed: hero_slides
INSERT INTO public.hero_slides (id,eyebrow,title,description,image,sort_order,is_active,created_at,updated_at) VALUES ('21353550-7f63-48f2-829b-53adf455354e'::uuid,'Wheat Sourcing'::text,'Direct from Punjab Farms'::text,'Hand-picked wheat sourced from verified Punjab growers — cleaned, tempered and milled under strict food-safety controls.'::text,'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.hero_slides (id,eyebrow,title,description,image,sort_order,is_active,created_at,updated_at) VALUES ('309831c0-1f0e-43ee-946c-2fed11df459b'::uuid,'Packaging & Despatch'::text,'Bulk Supply, Sealed Quality'::text,'Automated packaging lines fill, weigh and seal food-grade bags — from 1 kg consumer packs to 50 kg HDPE sacks.'::text,'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80'::text,'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.hero_slides (id,eyebrow,title,description,image,sort_order,is_active,created_at,updated_at) VALUES ('bfd7c84c-5042-42ee-9e8b-bc1421352155'::uuid,'Flour Manufacturing Plant'::text,'Industrial-Scale Milling'::text,'A modern roller-flour mill in Ludhiana producing Maida, Suji, Atta and Wheat Bran for distributors, wholesalers and large-volume buyers across India.'::text,'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: products
INSERT INTO public.products (id,name,rate,image,usps,ingredients,sort_order,is_active,created_at,updated_at) VALUES ('78129b0e-bd29-4337-a4a2-a81117f7d005'::uuid,'Suji (Semolina)'::text,'₹42 / kg'::text,'https://images.unsplash.com/photo-1568717264143-3673f3f8d6c0?auto=format&fit=crop&w=900&q=80'::text,'{"Even granulation","High yield","Bulk packs"}'::text[],'{"Durum / hard wheat semolina","Clean separation",Sun-conditioned}'::text[],'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.products (id,name,rate,image,usps,ingredients,sort_order,is_active,created_at,updated_at) VALUES ('9e39688a-425c-4652-ae8d-3690451319c9'::uuid,'Atta (Whole Wheat)'::text,'₹46 / kg'::text,'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80'::text,'{Chakki-fresh,"Whole wheat","Soft rotis"}'::text[],'{"100% whole wheat","Bran retained",Stone-milled}'::text[],'4'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.products (id,name,rate,image,usps,ingredients,sort_order,is_active,created_at,updated_at) VALUES ('c4c40589-a611-4428-a072-1e106ff0631c'::uuid,'Wheat Bran'::text,'₹28 / kg'::text,'https://images.unsplash.com/photo-1535912559178-bc1c8d2ef8ec?auto=format&fit=crop&w=900&q=80'::text,'{"High fibre","Feed & food grade",Cold-milled}'::text[],'{"Outer wheat bran","Naturally separated","No preservatives"}'::text[],'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.products (id,name,rate,image,usps,ingredients,sort_order,is_active,created_at,updated_at) VALUES ('e4678b03-d9b3-47e0-aef0-0d4a02f233c0'::uuid,'Maida (Refined Flour)'::text,'₹38 / kg'::text,'https://images.unsplash.com/photo-1612257999691-c5680bdfc1b8?auto=format&fit=crop&w=900&q=80'::text,'{Double-sifted,"Bakery & B2B grade","Uniform granulation"}'::text[],'{"100% refined wheat","No bleaching agents","Mill-direct dispatch"}'::text[],'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: offers
INSERT INTO public.offers (id,title,description,tag,sort_order,is_active,created_at,updated_at) VALUES ('08dfc22b-4b20-4b9f-99bb-ae75e7a91904'::uuid,'Dealer Pricing'::text,'Slab-based MOQ pricing for registered distributors.'::text,'Partner'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.offers (id,title,description,tag,sort_order,is_active,created_at,updated_at) VALUES ('31fcabfc-caa2-4c52-8555-c91e6464d127'::uuid,'Bulk Order Discount'::text,'Save up to 12% on confirmed orders above 500 kg.'::text,'Wholesale'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.offers (id,title,description,tag,sort_order,is_active,created_at,updated_at) VALUES ('5ada690e-aafb-4e8c-ac8c-9ee63c5e0b62'::uuid,'Annual Contracts'::text,'Locked-rate annual supply contracts for HoReCa & FMCG buyers.'::text,'B2B'::text,'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.offers (id,title,description,tag,sort_order,is_active,created_at,updated_at) VALUES ('dff950d3-85c3-4441-bbd4-6262fc5085ac'::uuid,'Pan-India Logistics'::text,'Door delivery and FOR-destination quotes on demand.'::text,'Delivery'::text,'4'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: services
INSERT INTO public.services (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('71792ca2-bbea-4684-ab98-c49e98521dbd'::uuid,'FlaskConical'::text,'Quality Laboratory'::text,'In-house lab — moisture, gluten, ash, granulation per batch.'::text,'5'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.services (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('9ea9ce81-712e-4619-ba13-24d417b5449e'::uuid,'Warehouse'::text,'Warehousing'::text,'Climate-controlled warehouses and silo storage for finished goods.'::text,'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.services (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('ad8fab79-ea6d-48ca-8838-9e6a7b12778d'::uuid,'Truck'::text,'Bulk Distribution'::text,'FTL & part-load dispatch across 12+ states in food-grade packaging.'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.services (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('ae78f2ec-833e-4908-875e-7aaf6681e68e'::uuid,'Package'::text,'Contract Packaging'::text,'Private label and co-pack from 1 kg pouches to 50 kg HDPE sacks.'::text,'4'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.services (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('b4199576-fc45-4d18-9c2c-c79a7c80792e'::uuid,'ClipboardCheck'::text,'Compliance & Audits'::text,'FSSAI certified plant; ready for buyer audits and FMCG vendor onboarding.'::text,'6'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.services (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('ebe6edd6-3652-49bc-bb97-f016b1b0f755'::uuid,'Factory'::text,'Flour Manufacturing'::text,'Automated roller-mill plant producing 200+ MT daily across multiple SKUs.'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: why_us
INSERT INTO public.why_us (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('132912bc-766e-41b1-bedf-fb12e9d652e2'::uuid,'Sparkles'::text,'Hygienic Processing'::text,'FSSAI-certified plant with zero human contact on the line.'::text,'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.why_us (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('13e47107-6aa4-46c8-9595-b70d48c55a0a'::uuid,'Clock'::text,'Timely Despatch'::text,'98% on-time despatch record across India.'::text,'4'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.why_us (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('45354de4-9ec2-4dd3-8053-eaae0219b291'::uuid,'Cog'::text,'Advanced Machinery'::text,'Modern roller mills, automated sifters and pneumatic conveyance.'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.why_us (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('4b9e5ca5-a706-404c-a7aa-2800d2c87ab0'::uuid,'Wheat'::text,'Premium Raw Material'::text,'Hand-picked Punjab wheat from trusted farms.'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.why_us (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('d1dfbfb9-37ba-46c7-9fe2-b495e8138106'::uuid,'ShieldCheck'::text,'Trusted Manufacturer'::text,'30+ years of consistent industrial flour supply.'::text,'6'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.why_us (id,icon,title,description,sort_order,is_active,created_at,updated_at) VALUES ('eba6cff2-0844-4302-abd3-53dc99879f94'::uuid,'BadgePercent'::text,'Mill-Direct Pricing'::text,'Transparent quotes with no intermediary margins.'::text,'5'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: testimonials
INSERT INTO public.testimonials (id,name,role,review,image,sort_order,is_active,created_at,updated_at) VALUES ('1c6acb87-e3a4-461f-8307-4da7d292f758'::uuid,'Sunita Devi'::text,'FMCG Co-pack Client'::text,'We co-pack our private-label atta here — the plant runs to spec, every run.'::text,'https://i.pravatar.cc/120?img=49'::text,'5'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.testimonials (id,name,role,review,image,sort_order,is_active,created_at,updated_at) VALUES ('42e867c5-6016-4430-9aa9-a77e26e47832'::uuid,'Vinod Aggarwal'::text,'Super Stockist, Delhi NCR'::text,'Transparent mill-direct pricing and clean documentation. Easiest manufacturer to work with in 18 years of trade.'::text,'https://i.pravatar.cc/120?img=33'::text,'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.testimonials (id,name,role,review,image,sort_order,is_active,created_at,updated_at) VALUES ('9acc5a53-0c64-47de-8889-3e908d2822a8'::uuid,'Harpreet Singh'::text,'Wholesale Distributor, Amritsar'::text,'Consistent batch quality and on-time despatch — we''ve moved over 8,000 MT through their plant in the last three years.'::text,'https://i.pravatar.cc/120?img=12'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.testimonials (id,name,role,review,image,sort_order,is_active,created_at,updated_at) VALUES ('a62d0908-8415-4a92-9c06-ea016ece87da'::uuid,'Rakesh Mehta'::text,'Retail Chain Buyer, Jaipur'::text,'Their wheat bran and atta packaging hold up perfectly in transit. Zero quality complaints from our outlets.'::text,'https://i.pravatar.cc/120?img=15'::text,'4'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.testimonials (id,name,role,review,image,sort_order,is_active,created_at,updated_at) VALUES ('cf442bab-7740-4670-9140-8f76db9ffcd3'::uuid,'Meera Iyer'::text,'Procurement, Spice Route Hotels'::text,'Their Suji and Maida specs match every audit we run. A reliable B2B supplier for our central kitchens.'::text,'https://i.pravatar.cc/120?img=47'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: presidents
INSERT INTO public.presidents (id,name,role,image,description,sort_order,is_active,created_at,updated_at) VALUES ('6e51a7b3-4eb1-4155-9c21-f4402b0c6c3d'::uuid,'Sh. Rajesh Kumar'::text,'Working President — Operations'::text,'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80'::text,'25+ years in flour milling. Heads plant operations, wheat procurement and quality assurance.'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.presidents (id,name,role,image,description,sort_order,is_active,created_at,updated_at) VALUES ('d5b1ed7d-fed7-4d4c-806e-229f51f51287'::uuid,'Sh. Anil Sharma'::text,'Working President — Sales & Distribution'::text,'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'::text,'Built the company''s pan-India dealer and wholesale network across 12 states.'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: social_links
INSERT INTO public.social_links (id,name,url,icon,sort_order,is_active,created_at,updated_at) VALUES ('196e0bdf-6d00-47b7-a174-7ce2f3cac538'::uuid,'LinkedIn'::text,'https://linkedin.com/company/sridurgajifoods'::text,'Linkedin'::text,'3'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.social_links (id,name,url,icon,sort_order,is_active,created_at,updated_at) VALUES ('55463cf9-7326-4fca-832f-1bf15029e846'::uuid,'WhatsApp'::text,'https://wa.me/919988719133'::text,'MessageCircle'::text,'4'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.social_links (id,name,url,icon,sort_order,is_active,created_at,updated_at) VALUES ('9cc374b6-dc5b-4212-a5a0-6c600af696f2'::uuid,'Facebook'::text,'https://facebook.com/sridurgajifoods'::text,'Facebook'::text,'1'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);
INSERT INTO public.social_links (id,name,url,icon,sort_order,is_active,created_at,updated_at) VALUES ('caddc7b8-d405-45c9-8959-7b1fbb359785'::uuid,'Instagram'::text,'https://instagram.com/sridurgajifoods'::text,'Instagram'::text,'2'::int4,'t'::bool,'2026-06-22 18:57:31.98298+00'::timestamptz,'2026-06-22 18:57:31.98298+00'::timestamptz);

-- Seed: site_settings
INSERT INTO public.site_settings (id,company_name,tagline,phone,whatsapp_number,email,address,founder_name,founder_role,founder_image,founder_quote,about_image,about_text,updated_at) VALUES ('1'::int4,'Sri Durga Ji Food Industries'::text,'Industrial Flour Manufacturer • Maida, Suji, Atta & Wheat Bran'::text,'+91 99887 19133'::text,'919988719133'::text,'info@sridurgajifoods.com'::text,'Industrial Area, Phase II, Ludhiana, Punjab 141003, India'::text,NULL::text,NULL::text,NULL::text,NULL::text,NULL::text,NULL::text,'2026-06-22 18:57:31.98298+00'::timestamptz);

