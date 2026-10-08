import { useEffect, useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../../config/config";
import { useAuthStore } from "../../../stores/userStore";

export const useSupabaseSingleDocument = <T>(tableName: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const sbToken = user?.supabaseToken;
  const sbUserId = user?.uuId;
  useEffect(() => {
    if (!tableName) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let customSupabase: any = null;

    const setupStreaming = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (!idToken) throw new Error("No hay sesión activa en Cognito");

        if (!sbToken || !sbUserId) {
          throw new Error(
            `Faltan datos del backend. Token: ${!!sbToken}, UserId: ${!!sbUserId}`,
          );
        }

        if (!isMounted) return;

        customSupabase = createClient(
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

        customSupabase.realtime.setAuth(sbToken);

        const { data: initialData, error: fetchError } = await customSupabase
          .from(tableName)
          .select("*")
          .eq("id", sbUserId)
          .single();

        if (fetchError) {
          if (fetchError.code === "PGRST116") {
            throw new Error(
              "El perfil no existe en la base de datos o RLS lo bloqueó.",
            );
          }
          throw fetchError;
        }

        if (isMounted) setData(initialData as T);

        customSupabase
          .channel(`public:${tableName}:${sbUserId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: tableName,
              filter: `id=eq.${sbUserId}`,
            },
            (payload: any) => {
              if (isMounted) {
                if (payload.eventType === "DELETE") {
                  setData(null);
                } else {
                  setData(payload.new as T);
                }
              }
            },
          )
          .subscribe();
      } catch (err: any) {
        console.error(`Error en streaming de Supabase (${tableName}):`, err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupStreaming();

    return () => {
      isMounted = false;
      if (customSupabase) {
        customSupabase.removeAllChannels();
      }
    };
  }, [tableName]);

  return { data, loading, error };
};
