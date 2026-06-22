
-- 1. ROLES ENUM + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. has_role security-definer helper
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. First signup → admin trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_first BOOLEAN;
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 5. LEADS (contact form)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. Public content tables (admin-managed, world-readable)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rate TEXT,
  image TEXT,
  usps TEXT[] NOT NULL DEFAULT '{}',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tag TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Factory',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.why_us (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'ShieldCheck',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  review TEXT NOT NULL,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.presidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  company_name TEXT NOT NULL DEFAULT 'Sri Durga Ji Food Industries',
  tagline TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  founder_name TEXT,
  founder_role TEXT,
  founder_image TEXT,
  founder_quote TEXT,
  about_image TEXT,
  about_text TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

-- Grants + RLS for all content tables
DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['products','offers','services','why_us','testimonials','presidents','hero_slides','social_links','site_settings'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated;', t);
    EXECUTE format('GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "Public read %I" ON public.%I FOR SELECT TO anon, authenticated USING (true);', t, t);
    EXECUTE format('CREATE POLICY "Admins write %I" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''));', t, t);
    EXECUTE format('CREATE TRIGGER trg_%I_touch BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();', t, t);
  END LOOP;
END $$;

-- Seed site_settings singleton
INSERT INTO public.site_settings (id, company_name, tagline, phone, whatsapp_number, email, address)
VALUES (1, 'Sri Durga Ji Food Industries', 'Industrial Flour Manufacturer • Maida, Suji, Atta & Wheat Bran', '+91 99887 19133', '919988719133', 'info@sridurgajifoods.com', 'Industrial Area, Phase II, Ludhiana, Punjab 141003, India')
ON CONFLICT (id) DO NOTHING;

-- Seed products
INSERT INTO public.products (name, rate, image, usps, ingredients, sort_order) VALUES
  ('Maida (Refined Flour)', '₹38 / kg', 'https://images.unsplash.com/photo-1612257999691-c5680bdfc1b8?auto=format&fit=crop&w=900&q=80', ARRAY['Double-sifted','Bakery & B2B grade','Uniform granulation'], ARRAY['100% refined wheat','No bleaching agents','Mill-direct dispatch'], 1),
  ('Suji (Semolina)', '₹42 / kg', 'https://images.unsplash.com/photo-1568717264143-3673f3f8d6c0?auto=format&fit=crop&w=900&q=80', ARRAY['Even granulation','High yield','Bulk packs'], ARRAY['Durum / hard wheat semolina','Clean separation','Sun-conditioned'], 2),
  ('Wheat Bran', '₹28 / kg', 'https://images.unsplash.com/photo-1535912559178-bc1c8d2ef8ec?auto=format&fit=crop&w=900&q=80', ARRAY['High fibre','Feed & food grade','Cold-milled'], ARRAY['Outer wheat bran','Naturally separated','No preservatives'], 3),
  ('Atta (Whole Wheat)', '₹46 / kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80', ARRAY['Chakki-fresh','Whole wheat','Soft rotis'], ARRAY['100% whole wheat','Bran retained','Stone-milled'], 4);

INSERT INTO public.hero_slides (eyebrow, title, description, image, sort_order) VALUES
  ('Flour Manufacturing Plant', 'Industrial-Scale Milling', 'A modern roller-flour mill in Ludhiana producing Maida, Suji, Atta and Wheat Bran for distributors, wholesalers and large-volume buyers across India.', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80', 1),
  ('Wheat Sourcing', 'Direct from Punjab Farms', 'Hand-picked wheat sourced from verified Punjab growers — cleaned, tempered and milled under strict food-safety controls.', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80', 2),
  ('Packaging & Despatch', 'Bulk Supply, Sealed Quality', 'Automated packaging lines fill, weigh and seal food-grade bags — from 1 kg consumer packs to 50 kg HDPE sacks.', 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80', 3);

INSERT INTO public.offers (title, description, tag, sort_order) VALUES
  ('Bulk Order Discount', 'Save up to 12% on confirmed orders above 500 kg.', 'Wholesale', 1),
  ('Dealer Pricing', 'Slab-based MOQ pricing for registered distributors.', 'Partner', 2),
  ('Annual Contracts', 'Locked-rate annual supply contracts for HoReCa & FMCG buyers.', 'B2B', 3),
  ('Pan-India Logistics', 'Door delivery and FOR-destination quotes on demand.', 'Delivery', 4);

INSERT INTO public.services (icon, title, description, sort_order) VALUES
  ('Factory','Flour Manufacturing','Automated roller-mill plant producing 200+ MT daily across multiple SKUs.',1),
  ('Truck','Bulk Distribution','FTL & part-load dispatch across 12+ states in food-grade packaging.',2),
  ('Warehouse','Warehousing','Climate-controlled warehouses and silo storage for finished goods.',3),
  ('Package','Contract Packaging','Private label and co-pack from 1 kg pouches to 50 kg HDPE sacks.',4),
  ('FlaskConical','Quality Laboratory','In-house lab — moisture, gluten, ash, granulation per batch.',5),
  ('ClipboardCheck','Compliance & Audits','FSSAI certified plant; ready for buyer audits and FMCG vendor onboarding.',6);

INSERT INTO public.why_us (icon, title, description, sort_order) VALUES
  ('Wheat','Premium Raw Material','Hand-picked Punjab wheat from trusted farms.',1),
  ('Cog','Advanced Machinery','Modern roller mills, automated sifters and pneumatic conveyance.',2),
  ('Sparkles','Hygienic Processing','FSSAI-certified plant with zero human contact on the line.',3),
  ('Clock','Timely Despatch','98% on-time despatch record across India.',4),
  ('BadgePercent','Mill-Direct Pricing','Transparent quotes with no intermediary margins.',5),
  ('ShieldCheck','Trusted Manufacturer','30+ years of consistent industrial flour supply.',6);

INSERT INTO public.testimonials (name, role, review, image, sort_order) VALUES
  ('Harpreet Singh','Wholesale Distributor, Amritsar','Consistent batch quality and on-time despatch — we''ve moved over 8,000 MT through their plant in the last three years.','https://i.pravatar.cc/120?img=12',1),
  ('Meera Iyer','Procurement, Spice Route Hotels','Their Suji and Maida specs match every audit we run. A reliable B2B supplier for our central kitchens.','https://i.pravatar.cc/120?img=47',2),
  ('Vinod Aggarwal','Super Stockist, Delhi NCR','Transparent mill-direct pricing and clean documentation. Easiest manufacturer to work with in 18 years of trade.','https://i.pravatar.cc/120?img=33',3),
  ('Rakesh Mehta','Retail Chain Buyer, Jaipur','Their wheat bran and atta packaging hold up perfectly in transit. Zero quality complaints from our outlets.','https://i.pravatar.cc/120?img=15',4),
  ('Sunita Devi','FMCG Co-pack Client','We co-pack our private-label atta here — the plant runs to spec, every run.','https://i.pravatar.cc/120?img=49',5);

INSERT INTO public.presidents (name, role, image, description, sort_order) VALUES
  ('Sh. Rajesh Kumar','Working President — Operations','https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80','25+ years in flour milling. Heads plant operations, wheat procurement and quality assurance.',1),
  ('Sh. Anil Sharma','Working President — Sales & Distribution','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80','Built the company''s pan-India dealer and wholesale network across 12 states.',2);

INSERT INTO public.social_links (name, url, icon, sort_order) VALUES
  ('Facebook','https://facebook.com/sridurgajifoods','Facebook',1),
  ('Instagram','https://instagram.com/sridurgajifoods','Instagram',2),
  ('LinkedIn','https://linkedin.com/company/sridurgajifoods','Linkedin',3),
  ('WhatsApp','https://wa.me/919988719133','MessageCircle',4);
