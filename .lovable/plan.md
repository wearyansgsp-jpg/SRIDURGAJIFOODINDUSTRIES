
## Goal
Produce a single, portable SQL file you can run in your own Supabase project's SQL editor to recreate everything: enum types, tables, indexes, GRANTs, RLS policies, helper functions (`has_role`, `touch_updated_at`, `handle_new_user`), the `auth.users` → `user_roles` trigger, and all current row data.

## Deliverable
A new file: `supabase/exports/full-migration.sql`

It will contain, in order:

1. **Extensions** — `create extension if not exists pgcrypto;`
2. **Enum** — `app_role` (`admin`, `moderator`, `user`)
3. **Functions** — `public.touch_updated_at()`, `public.has_role(uuid, app_role)`, `public.handle_new_user()` (verbatim from current DB)
4. **Tables** (CREATE TABLE for all 12 public tables, exact column defs from live DB):
   `user_roles`, `public_site_info`, `site_settings`, `leads`, `products`, `offers`, `services`, `why_us`, `testimonials`, `presidents`, `hero_slides`, `social_links`
5. **GRANTs** on every table to `anon` / `authenticated` / `service_role` matching the existing policies (public-read tables get `anon` SELECT; `leads` and `user_roles` stay auth-only)
6. **RLS enable + policies** — recreated exactly as they exist today (public read on content tables; admin-only write via `has_role`; `leads` insert open to anon, read/update/delete restricted to admins; `user_roles` self-read + admin-manage)
7. **Triggers** — `trg_<table>_touch` BEFORE UPDATE on every content table, and `on_auth_user_created` AFTER INSERT on `auth.users` calling `handle_new_user()`
8. **Seed data** — `INSERT INTO ... VALUES (...)` for every existing row in all public tables (hero_slides, products, services, offers, presidents, testimonials, social_links, why_us, public_site_info, site_settings). `leads` and `user_roles` left empty (they're per-user / per-install).

## How to use it on your own Supabase project
1. Create a new Supabase project on your account.
2. Open SQL Editor → paste contents of `supabase/exports/full-migration.sql` → Run.
3. Update your app's `.env`:
   - `VITE_SUPABASE_URL` = your new project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your new anon/publishable key
4. Sign up the first user in your new project — `handle_new_user()` auto-grants them `admin`.

## Notes / scope
- Only the `public` schema is exported. Supabase-managed schemas (`auth`, `storage`, etc.) are recreated automatically by Supabase itself when you make the new project.
- Storage buckets: none exist in this project, so nothing to migrate there.
- Edge function secrets (`LOVABLE_API_KEY` etc.) are not portable — you'll set those in your own project.
- The file is idempotent-ish: uses `create ... if not exists` where possible, but seed `INSERT`s assume a fresh DB. Run on an empty project.

Confirm and I'll generate `supabase/exports/full-migration.sql` in the next step.
