import { useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { createClient } from "@supabase/supabase-js";
import { config } from "../../../config/config";
import { useAuthStore } from "../../../stores/userStore";

export const useDeleteDocument = (tableName: string) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Ahora acepta un string o un arreglo de strings
  const deleteDoc = async (ids: string | string[]) => {
    if (deleting) return { success: false, error: "Ya se está eliminando..." };
    if (Array.isArray(ids) && ids.length === 0) return { success: true };

    setDeleting(true);
    setError(null);
    const sbToken = user?.supabaseToken;

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("No hay sesión activa");
      if (!sbToken) throw new Error("Faltan datos del backend");

      const customSupabase = createClient(
        config.SUPABASE_URL,
        config.SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            storageKey: `temp-supabase-del-${Math.random()}`,
          },
          global: {
            headers: {
              Authorization: `Bearer ${sbToken}`,
              apikey: config.SUPABASE_ANON_KEY,
            },
          },
        },
      );

      // Preparamos la consulta
      let query = customSupabase.from(tableName).delete();

      // Condición: Bloque (.in) o Único (.eq)
      if (Array.isArray(ids)) {
        query = query.in("id", ids);
      } else {
        query = query.eq("id", ids);
      }

      const { error: deleteError } = await query;

      if (deleteError) {
        throw new Error(
          "No tienes permisos para eliminar o hubo un error de red.",
        );
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setDeleting(false);
    }
  };

  return { deleteDoc, deleting, deleteError: error };
};
