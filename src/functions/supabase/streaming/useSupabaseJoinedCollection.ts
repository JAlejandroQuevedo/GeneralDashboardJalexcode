import { useEffect, useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../../config/config";
import { useAuthStore } from "../../../stores/userStore";

// Recibimos un genérico T que obligatoriamente debe tener un 'id'
export const useSupabaseJoinedCollection = <T extends { id: string }>(
  tableName: string,
  selectQuery: string,
  order: string = "created_at",
  ascending: boolean = true,
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const sbToken = user?.supabaseToken;

  useEffect(() => {
    if (!tableName || !sbToken || !selectQuery) return;
    let isMounted = true;
    let customSupabase: any = null;

    const setupStreaming = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error("No hay sesión activa");
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
          .select(selectQuery)
          .order(order, { ascending: ascending });

        if (fetchError) throw fetchError;
        if (isMounted) setData((initialData as T[]) || []);

        const fetchJoinedRecord = async (recordId: string) => {
          const { data: fullRecord, error: recordError } = await customSupabase
            .from(tableName)
            .select(selectQuery)
            .eq("id", recordId)
            .single();

          if (recordError) {
            console.error("Error hidratando registro:", recordError);
            return null;
          }
          return fullRecord as T;
        };

        customSupabase
          .channel(`public:${tableName}-joined-collection`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: tableName,
            },
            async (payload: any) => {
              if (!isMounted) return;

              if (payload.eventType === "INSERT") {
                const fullRecord = await fetchJoinedRecord(payload.new.id);
                if (fullRecord && isMounted) {
                  setData((prev) => [...prev, fullRecord]);
                }
              } else if (payload.eventType === "UPDATE") {
                const fullRecord = await fetchJoinedRecord(payload.new.id);
                if (fullRecord && isMounted) {
                  setData((prev) => {
                    const exists = prev.some(
                      (item) => item.id === fullRecord.id,
                    );
                    if (exists) {
                      return prev.map((item) =>
                        item.id === fullRecord.id ? fullRecord : item,
                      );
                    } else {
                      return [fullRecord, ...prev];
                    }
                  });
                }
              } else if (payload.eventType === "DELETE") {
                setData((prev) =>
                  prev.filter((item) => item.id !== payload.old.id),
                );
              }
            },
          )
          .subscribe();
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupStreaming();

    return () => {
      isMounted = false;
      if (customSupabase) customSupabase.removeAllChannels();
    };
  }, [tableName, selectQuery]);

  return { data, loading, error };
};
