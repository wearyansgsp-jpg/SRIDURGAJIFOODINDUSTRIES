DROP POLICY IF EXISTS "Authenticated can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;

CREATE POLICY "Admins can view site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP VIEW IF EXISTS public.public_site_info;

CREATE VIEW public.public_site_info
WITH (security_invoker = false) AS
SELECT
  id,
  company_name,
  tagline,
  phone,
  whatsapp_number,
  email,
  address,
  founder_name,
  founder_role,
  founder_image,
  founder_quote,
  about_image,
  about_text
FROM public.site_settings
LIMIT 1;

GRANT SELECT ON public.public_site_info TO anon, authenticated;