import { useEffect, useMemo } from "react";
import { formatDate } from "../../../../../../../../functions/helpersChat";
import { useSupabaseCollection } from "../../../../../../../../functions/supabase/streaming/useSupabaseCollection";
import { useCounters } from "../../../../../../../../hooks/useGetCounters";
import { useisStaffAdminLoading } from "../../../../../../../../stores/loadersStore";
import type {
  DashboardDataType,
  UserDataType,
} from "../../../../../../../../types/home/dashboardTypes";
import { ActionsStaff } from "../components/ActionsStaff";
import { useResponsive } from "../../../../../../../../constants/reactResponsive";
import { useAuthStore } from "../../../../../../../../stores/userStore";
import { config } from "../../../../../../../../config/config";
import { useFilteredData } from "../../../../../../../../functions/filteredData";
import { ProfileUser } from "../../../common/ProfileUser";

export const useDataStaff = () => {
  //Datos del usuario
  const { user: userData } = useAuthStore();
  //Ids restringidos
  const restrictedIdsStaff: string[] = [
    config.ID_DEV_USER,
    config.DEV_USER_ADMIN,
  ];
  //Filtros de usuarios de desarrollo
  const { filteredData } = useFilteredData();

  //Data de la tabla del staff
  const {
    data: normalData,
    loading,
    isDisconnected: disconnecedUsers,
    reconnect: reconnectUsers,
  } = useSupabaseCollection<UserDataType>("users");

  const staffData = filteredData(
    normalData,
    restrictedIdsStaff,
    userData?.uuId || "",
    "id",
  );
  // Loader
  const { setisLoading } = useisStaffAdminLoading();

  //Effect para el loader
  useEffect(() => {
    setisLoading(loading);
  }, [loading, setisLoading]);

  //Effect para recargar el streaming cuando un usuario pierde la conexion

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    if (disconnecedUsers) {
      reconnectTimer = setTimeout(() => {
        reconnectUsers();
      }, 5000);
    }

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [disconnecedUsers, reconnectUsers]);
  //Counter del staff
  const { getCountersStaff } = useCounters();
  //Data de las cards del staf
  const staffOnlyUsers = useMemo(() => {
    return staffData.filter((user) => user.role === "staff");
  }, [staffData]);
  const dataStaffCards: DashboardDataType[] = [
    {
      title: "Total de usuarios",
      counter: staffOnlyUsers.length.toString(),
      phrase: `+${getCountersStaff(staffOnlyUsers)} nuevos este mes`,
      icon: "/img/icons/staff_icon_inactive.svg",
      alt: "Icono de Usuarios",
    },
    {
      title: "Usuarios Activos",
      counter: staffOnlyUsers.length.toString(),
      phrase: "100% del equipo",
      icon: "/img/icons/success_icon_staff.svg",
      alt: "Icono de success",
      color: "#23CB7A",
    },
    {
      title: "Nuevos Este Mes",
      counter: getCountersStaff(staffOnlyUsers).toString(),
      phrase: "Crecimiento del equipo",
      icon: "/img/icons/calenadar_icon.svg",
      alt: "Icono de Usuarios",
    },
  ];
  //Table Staff Data
  //Verificacion para responsive

  const { isSm, isMd, isLg, isIpadPro } = useResponsive();

  const isSmall = isSm || isMd || isLg || isIpadPro;
  const tableStaffData = staffData
    .map((staff) => {
      const dataActions: UserDataType = {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        created_at: staff.created_at,
        username: staff.username,
        role: staff.role,
      };
      return {
        Usuario: (
          <ProfileUser
            name={staff.name}
            photo="/img/icons/logo_shield.svg"
            // dni={staff.dni}
          />
        ),
        ...(!isSmall && { "Información de Contacto": staff.email }),
        ...(!isSmall && { "Fecha de Ingreso": formatDate(staff.created_at) }),
        Acciones: <ActionsStaff {...dataActions} />,
      };
    })
    .reverse();

  return { dataStaffCards, tableStaffData, disconnecedUsers, reconnectUsers };
};
