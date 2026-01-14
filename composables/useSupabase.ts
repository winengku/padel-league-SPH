import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const config = useRuntimeConfig();

  console.log("SUPABASE URL:", config.public.supabaseUrl);

  return createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);
};
