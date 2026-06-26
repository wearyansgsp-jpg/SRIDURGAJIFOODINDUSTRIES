ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS about_eyebrow text,
  ADD COLUMN IF NOT EXISTS about_headline text,
  ADD COLUMN IF NOT EXISTS about_headline_accent text;

DROP VIEW IF EXISTS public.public_site_info;
CREATE VIEW public.public_site_info
WITH (security_invoker = true) AS
SELECT
  id,
  company_name, tagline, phone, whatsapp_number, email, address,
  founder_name, founder_role, founder_image, founder_quote,
  about_image, about_text,
  about_eyebrow, about_headline, about_headline_accent,
  founder_eyebrow, founder_headline, founder_headline_accent,
  presidents_eyebrow, presidents_title
FROM public.site_settings;

GRANT SELECT ON public.public_site_info TO anon, authenticated;