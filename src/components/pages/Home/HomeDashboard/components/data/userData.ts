import { useSupabaseSingleDocument } from "../../../../../../functions/supabase/streaming/useSupabaseStreamingSingle";
import type { UserDataType } from "../../../../../../types/home/dashboardTypes";

export const useUserData = () => {
  const { data, loading } = useSupabaseSingleDocument<UserDataType>("users");

  return { data, loading };
};
