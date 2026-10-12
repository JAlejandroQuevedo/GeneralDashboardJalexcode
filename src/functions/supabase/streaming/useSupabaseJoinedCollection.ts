import { useEffect, useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useAuthStore } from "../../../stores/userStore";
import { getSupabaseClient } from "../supabaseConfig";

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
    let channel: any = null;
    const uniqueChannelName = `public:${tableName}-${Math.random().toString(36).substring(7)}`;

    const setupStreaming = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error("No hay sesión activa");
        if (!isMounted) return;

        const customSupabase = getSupabaseClient(sbToken);
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

        // Asignamos la configuración a nuestra variable 'channel' sin código flotante
        channel = customSupabase.channel(uniqueChannelName).on(
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
                  const exists = prev.some((item) => item.id === fullRecord.id);
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
        );

        // Suscribirse al canal
        channel.subscribe();
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupStreaming();

    return () => {
      isMounted = false;
      // Limpieza correcta pidiendo el cliente de nuevo y removiendo solo el canal actual
      if (channel) {
        const customSupabase = getSupabaseClient(sbToken);
        customSupabase.removeChannel(channel);
      }
    };
  }, [tableName, selectQuery, order, ascending, sbToken]);

  return { data, loading, error };
};
