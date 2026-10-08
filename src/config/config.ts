import type { ConfigType } from "../types";

export const config: ConfigType = {
  ENV_PRIMARY: import.meta.env.VITE_ENV_PRIMARY,
  API_URL: import.meta.env.VITE_API_URL,
  VITE_API_WHATSAPP_URL: import.meta.env.VITE_API_WHATSAPP_URL,
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID,
  CLIENT_POOL: import.meta.env.VITE_CLIENT_POOL,
  COGNITO_DOMAIN: import.meta.env.VITE_COGNITO_DOMAIN,
  CALLBACK_AUTH: import.meta.env.VITE_CALLBACK_AUTH,
  //SUPABASE keys
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  //Barear token
  BEARER_TOKEN: import.meta.env.VITE_BEARER_TOKEN,
  DEV_USER_ADMIN: import.meta.env.VITE_ID_DEV_USER_ADMIN,
  ID_DEV_USER: import.meta.env.VITE_ID_DEV_USER,
  ID_DEV_CHAT: import.meta.env.VITE_ID_DEV_CHAT,
};
