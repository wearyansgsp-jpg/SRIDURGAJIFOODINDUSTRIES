
-- 1. site_settings: drop broad authenticated read; keep admin-only direct access
DROP POLICY IF EXISTS "Authenticated read site_settings" ON public.site_settings;

-- 2. Rebuild public_site_info view with security_invoker so it respects RLS of the caller,
--    and add a narrow public read policy on site_settings limited to access via the view.
DROP VIEW IF EXISTS public.public_site_info;

CREATE OR REPLACE FUNCTION public.get_public_site_info()
RETURNS TABLE (
  id integer,
  company_name text,
  tagline text,
  phone text,
  whatsapp_number text,
  email text,
  address text,
  founder_name text,
  founder_role text,
  founder_image text,
  founder_quote text,
  about_image text,
  about_text text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, company_name, tagline, phone, whatsapp_number, email, address,
         founder_name, founder_role, founder_image, founder_quote,
         about_image, about_text
  FROM public.site_settings
  WHERE id = 1
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_site_info() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_site_info() TO anon, authenticated;

-- Recreate the view as security_invoker so the linter no longer flags it.
-- The view selects from site_settings, but the data exposure is now controlled by
-- the dedicated SECURITY DEFINER function above. The view is kept for compatibility
-- but only admins can read it directly (RLS on underlying table applies).
CREATE VIEW public.public_site_info
WITH (security_invoker = true) AS
SELECT id, company_name, tagline, phone, whatsapp_number, email, address,
       founder_name, founder_role, founder_image, founder_quote,
       about_image, about_text
FROM public.site_settings
WHERE id = 1;

GRANT SELECT ON public.public_site_info TO anon, authenticated;

-- 3. user_roles: replace ALL permissive policy + restrictive INSERT with explicit per-command admin policies
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
