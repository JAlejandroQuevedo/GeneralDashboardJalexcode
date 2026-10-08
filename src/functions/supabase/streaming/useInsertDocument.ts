import { useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../../config/config";
import { useAuthStore } from "../../../stores/userStore";

export const useInsertDocument = (tableName: string) => {
  const [inserting, setInserting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const sbToken = user?.supabaseToken;
  const insertDoc = async (newData: any) => {
    setInserting(true);
    setError(null);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("No hay sesión activa en Cognito");

      if (!sbToken) throw new Error("Falta el token de Supabase");
      const customSupabase = createClient(
        config.SUPABASE_URL,
        config.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            storageKey: `temp-supabase-${Math.random()}`,
          },

          global: {
            headers: {
              Authorization: `Bearer ${sbToken}`,
              apikey: config.SUPABASE_ANON_KEY,
            },
          },
        },
      );

      const { data, error: insertError } = await customSupabase
        .from(tableName)
        .insert([newData])
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err: any) {
      console.error(`Error insertando en ${tableName}:`, err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setInserting(false);
    }
  };

  return { insertDoc, inserting, insertError: error };
};
