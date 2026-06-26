ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS founder_eyebrow text,
  ADD COLUMN IF NOT EXISTS founder_headline text,
  ADD COLUMN IF NOT EXISTS founder_headline_accent text,
  ADD COLUMN IF NOT EXISTS presidents_eyebrow text,
  ADD COLUMN IF NOT EXISTS presidents_title text;

UPDATE public.site_settings SET
  founder_eyebrow = COALESCE(founder_eyebrow, 'From the Founder'),
  founder_headline = COALESCE(founder_headline, 'Every grain carries'),
  founder_headline_accent = COALESCE(founder_headline_accent, 'our family name.'),
  presidents_eyebrow = COALESCE(presidents_eyebrow, 'The Brain Behind'),
  presidents_title = COALESCE(presidents_title, 'Our Working Presidents')
WHERE id = 1;

DROP VIEW IF EXISTS public.public_site_info;
CREATE VIEW public.public_site_info
  WITH (security_invoker = true) AS
SELECT id, company_name, tagline, phone, whatsapp_number, email, address,
       founder_name, founder_role, founder_image, founder_quote,
       about_image, about_text,
       founder_eyebrow, founder_headline, founder_headline_accent,
       presidents_eyebrow, presidents_title
FROM public.site_settings WHERE id = 1;

GRANT SELECT ON public.public_site_info TO anon, authenticated;