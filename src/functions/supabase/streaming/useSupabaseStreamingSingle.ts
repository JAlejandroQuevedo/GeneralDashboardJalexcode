import { useEffect, useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useAuthStore } from "../../../stores/userStore";
import { getSupabaseClient } from "../supabaseConfig";

export const useSupabaseSingleDocument = <T>(tableName: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const sbToken = user?.supabaseToken;
  const sbUserId = user?.uuId;

  useEffect(() => {
    // Evitamos ejecutar si faltan datos esenciales
    if (!tableName || !sbToken || !sbUserId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let channel: any = null;

    // Nombre de canal único para evitar colisiones entre múltiples componentes montados
    const uniqueChannelName = `public:${tableName}:${sbUserId}-${Math.random().toString(36).substring(7)}`;

    const setupStreaming = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await fetchAuthSession();
        if (!session.tokens?.idToken) {
          throw new Error("No hay sesión activa en Cognito");
        }
        if (!isMounted) return;

        // Obtenemos el cliente Singleton y actualizamos el token de Realtime
        const customSupabase = getSupabaseClient(sbToken);
        customSupabase.realtime.setAuth(sbToken);

        // Ejecutamos la consulta inicial (Fetch REST)
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

        // Asignamos la configuración de tiempo real a la variable 'channel'
        channel = customSupabase.channel(uniqueChannelName).on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: tableName,
            filter: `id=eq.${sbUserId}`,
          },
          (payload: any) => {
            if (!isMounted) return;

            if (payload.eventType === "DELETE") {
              setData(null);
            } else {
              setData(payload.new as T);
            }
          },
        );

        // Suscribimos el canal
        channel.subscribe();
      } catch (err: any) {
        console.error(`Error en streaming de Supabase (${tableName}):`, err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setupStreaming();

    //Limpieza (Cleanup) al desmontar
    return () => {
      isMounted = false;
      // Removemos estrictamente el canal actual, sin afectar conexiones de otros componentes
      if (channel) {
        const customSupabase = getSupabaseClient(sbToken);
        customSupabase.removeChannel(channel);
      }
    };
  }, [tableName, sbToken, sbUserId]);

  return { data, loading, error };
};
