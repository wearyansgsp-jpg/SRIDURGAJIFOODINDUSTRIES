import { createClient } from "@supabase/supabase-js";

// User-provided Supabase project
const SUPABASE_URL = "https://kygjqkupwoxzzqkqivky.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_FDZ8snMIOMwSvyR39SADog_Qp2pzE28";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "sdj-auth",
  },
});
