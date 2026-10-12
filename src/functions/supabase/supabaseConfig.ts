import { createClient } from "@supabase/supabase-js";
import { config } from "../../config/config";

let supabaseInstance: any = null;
let currentToken: string | null = null;

export const getSupabaseClient = (sbToken: string) => {
  // Si ya existe la instancia y el token es el mismo, reutilizamos la conexión (1 solo WebSocket)
  if (supabaseInstance && currentToken === sbToken) {
    return supabaseInstance;
  }

  // Si no existe o el token cambió (ej. nuevo login), creamos la instancia
  currentToken = sbToken;
  supabaseInstance = createClient(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${sbToken}`,
          apikey: config.SUPABASE_ANON_KEY,
          "x-application-name": "mi-app-cognito",
        },
      },
    },
  );

  return supabaseInstance;
};
