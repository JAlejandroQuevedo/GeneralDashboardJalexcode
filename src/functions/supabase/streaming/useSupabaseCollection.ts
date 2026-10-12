import { useEffect, useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useAuthStore } from "../../../stores/userStore";
import { getSupabaseClient } from "../supabaseConfig";

export const useSupabaseCollection = <T extends { id: string }>(
  tableName: string,
  order: string = "created_at",
  ascending: boolean = true,
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnected, setIsDisconnected] = useState(false);

  const [retryTrigger, setRetryTrigger] = useState(0);

  const { user } = useAuthStore();
  const sbToken = user?.supabaseToken;

  const reconnect = () => setRetryTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!tableName || !sbToken) return;

    let isMounted = true;

    //Creamos esta variable para atrapar el canal

    let channel: any = null;

    //Se crea un canal unico para el streaming de la tabla
    const uniqueChannelName = `public:${tableName}-${Math.random().toString(36).substring(7)}`;

    const setupStreaming = async () => {
      setLoading(true);
      setError(null);
      setIsDisconnected(false);

      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error("No hay sesión activa");
        if (!isMounted) return;

        // Obtenemos la instancia global
        const customSupabase = getSupabaseClient(sbToken);
        customSupabase.realtime.setAuth(sbToken);

        const { data: initialData, error: fetchError } = await customSupabase
          .from(tableName)
          .select("*")
          .order(order, { ascending: ascending });

        if (fetchError) throw fetchError;

        if (isMounted) setData((initialData as T[]) || []);

        //Asignamos la configuración a nuestra variable 'channel'
        channel = customSupabase.channel(uniqueChannelName).on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: tableName,
          },
          (payload: any) => {
            if (!isMounted) return;

            if (payload.eventType === "INSERT") {
              setData((prev) => {
                const alreadyExists = prev.some(
                  (item) => item.id === payload.new.id,
                );
                if (alreadyExists) return prev;
                return [...prev, payload.new as T];
              });
            } else if (payload.eventType === "UPDATE") {
              setData((prev) => {
                const exists = prev.some((item) => item.id === payload.new.id);
                if (exists) {
                  return prev.map((item) =>
                    item.id === payload.new.id ? (payload.new as T) : item,
                  );
                } else {
                  return [payload.new as T, ...prev];
                }
              });
            } else if (payload.eventType === "DELETE") {
              setData((prev) =>
                prev.filter((item) => item.id !== payload.old.id),
              );
            }
          },
        );

        // Nos suscribimos usando la variable 'channel'
        channel.subscribe((status: string) => {
          if (!isMounted) return;
          if (status === "SUBSCRIBED") {
            setIsDisconnected(false);
          } else if (
            status === "CLOSED" ||
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT"
          ) {
            setIsDisconnected(true);
          }
        });
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || `Error en lista de Supabase (${tableName})`);
          setIsDisconnected(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupStreaming();

    return () => {
      isMounted = false;
      // Si el canal existe, lo matamos de raíz
      if (channel) {
        const customSupabase = getSupabaseClient(sbToken);
        customSupabase.removeChannel(channel);
      }
    };
  }, [tableName, order, ascending, sbToken, retryTrigger]);

  return { data, loading, error, isDisconnected, reconnect };
};
