import { useResponsive } from "../../../../../../../../constants/reactResponsive";
import { formatDate } from "../../../../../../../../functions/helpersChat";
import { useSupabaseJoinedCollection } from "../../../../../../../../functions/supabase/streaming/useSupabaseJoinedCollection";
import type { PoliciesType } from "../../../../../../../../types/home/dashboardTypes";
import { ProfileUserPolicy } from "../../../common/ProfileUserPolicy";
import { ActionsPolicies } from "../components/ActionsPolicies";

export const useDataPolicies = () => {
  //Data de las politicas

  const { data: dataPolicies, loading } =
    useSupabaseJoinedCollection<PoliciesType>(
      "policies",
      "*, users(*)",
      "created_at",
    );
  //Tabla policies data
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  const tablePoliciesData = dataPolicies.map((policie) => {
    const dataActions: PoliciesType = {
      id: policie.id,
      created_at: policie.created_at,
      userId: policie.userId,
      document: policie.document,
      policy_number: policie.policy_number,
      users: {
        name: policie.users.name || "",
        email: policie.users.email || "",
        created_at: policie.users.created_at || "",
        username: policie.users.username || "",
        id: policie.users.id || "",
        role: policie.users.role || "",
      },
    };
    const user = dataActions.users;
    return {
      "Nombre del cliente": (
        <ProfileUserPolicy
          name={user.name}
          photo="/img/icons/logo_shield.svg"
          policyNumber={dataActions.policy_number}
        />
      ),
      ...(!isSmall && { "Información de Contacto": user.email }),
      ...(!isSmall && { "Fecha de adquisición": formatDate(user.created_at) }),
      Acciones: <ActionsPolicies {...dataActions} />,
    };
  });

  return { dataPolicies, loading, tablePoliciesData };
};
