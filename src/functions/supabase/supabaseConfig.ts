import { createClient } from "@supabase/supabase-js";
import { config } from "../../config/config"; // Tu archivo de variables

const supabaseUrl = config.SUPABASE_URL;
const supabaseAnonKey = config.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "x-application-name": "mi-app-cognito",
    },
  },
});
