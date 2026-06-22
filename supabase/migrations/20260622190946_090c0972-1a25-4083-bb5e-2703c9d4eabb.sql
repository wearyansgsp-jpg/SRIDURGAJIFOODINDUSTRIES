
-- 1. Lock down user_roles inserts with an explicit RESTRICTIVE policy.
-- Even though the existing "Admins manage roles" ALL policy already gates inserts,
-- this restrictive policy makes the deny explicit and survives any future
-- permissive INSERT policy added by mistake.
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- The handle_new_user trigger inserts via SECURITY DEFINER (table owner),
-- so it bypasses this policy and still works for new signups.

-- 2. has_role: switch from SECURITY DEFINER to SECURITY INVOKER.
-- The function only ever checks the caller's own role (has_role(auth.uid(), ...)),
-- and user_roles has a "Users can view their own roles" SELECT policy,
-- so SECURITY INVOKER works without privilege bypass.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. site_settings: stop exposing the whole config row to anonymous visitors.
-- Create an explicit public view with only the fields the public site renders,
-- so future columns added to site_settings (API keys, internal notes, etc.)
-- are NOT auto-exposed.
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;

CREATE POLICY "Authenticated read site_settings" ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (true);

REVOKE SELECT ON public.site_settings FROM anon;

CREATE OR REPLACE VIEW public.public_site_info
WITH (security_invoker = true) AS
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
  about_text,
  updated_at
FROM public.site_settings;

GRANT SELECT ON public.public_site_info TO anon, authenticated;
