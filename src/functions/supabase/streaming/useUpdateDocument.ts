import { useState } from "react";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useAuthStore } from "../../../stores/userStore";
import { getSupabaseClient } from "../supabaseConfig";

export const useUpdateDocument = (tableName: string) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const sbToken = user?.supabaseToken;
  const updateDoc = async (docId: string, updates: any) => {
    setUpdating(true);
    setError(null);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("No hay sesión activa en Cognito");

      if (!sbToken) throw new Error("Falta el token de Supabase");

      const customSupabase = getSupabaseClient(sbToken);

      const { error: updateError } = await customSupabase
        .from(tableName)
        .update(updates)
        .eq("id", docId);

      if (updateError) throw updateError;
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUpdating(false);
    }
  };

  return { updateDoc, updating, updateError: error };
};
