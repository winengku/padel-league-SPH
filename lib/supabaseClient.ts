import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL!,
  process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY!
);
