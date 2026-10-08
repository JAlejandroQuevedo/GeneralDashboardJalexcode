import type {
  DashboardDataType,
  DashboardListDataType,
  FastActionTypes,
  ListElementType,
  UserDataType,
} from "../../../../../../../../types/home/dashboardTypes";
import { useShowPopopStaffStore } from "../../../../../../../../stores/homeStore";
import { useSelectedStore } from "../../../../../../../../stores/auth/LateralMenuStore";
import { useSupabaseCollection } from "../../../../../../../../functions/supabase/streaming/useSupabaseCollection";
import type {
  ChatType,
  MessageType,
} from "../../../../../../../../types/home/chatSectionTypes";
import { formatDate } from "../../../../../../../../functions/helpersChat";
import { useCounters } from "../../../../../../../../hooks/useGetCounters";
import {
  useisChatDashboardLoading,
  useisStaffLoading,
} from "../../../../../../../../stores/loadersStore";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "../../../../../../../../stores/userStore";
import { useDataPolicies } from "../../insurancePoliciesHome/data/useDataPolicies";
import { config } from "../../../../../../../../config/config";
import { useFilteredData } from "../../../../../../../../functions/filteredData";

export const useDataDahboard = () => {
  //Datos del usuario
  const { user: userData } = useAuthStore();
  //Selected para lateral menu

  const { setSelected } = useSelectedStore();
  //Ids restringidos
  const restrictedIdsStaff: string[] = [
    config.ID_DEV_USER,
    config.DEV_USER_ADMIN,
  ];
  //Filtros de usuarios de desarrollo
  const { filteredData } = useFilteredData();
  //Data para el staff desde supabase
  const { data: normalData, loading: isStaffLoading } =
    useSupabaseCollection<UserDataType>("users");
  const dataStaff = filteredData(
    normalData,
    restrictedIdsStaff,
    userData?.uuId || "",
    "id",
  );
  /* Loader */
  const { setisLoading: setStaffLoader } = useisStaffLoading();
  //Effect para el loader
  useEffect(() => {
    setStaffLoader(isStaffLoading);
  }, [isStaffLoading, setStaffLoader]);
  //Data para los chats y mensajes desde supabase
  const restrictedIdChats: string[] = [config.ID_DEV_CHAT];
  const { data: normalDataChats, loading: isChatsLoading } =
    useSupabaseCollection<ChatType>("chat");
  //Filtro de chats de desarrollo
  const dataChats = filteredData(
    normalDataChats,
    restrictedIdChats,
    userData?.uuId || "",
    "id",
  );
  /* Loader  */
  const { setisLoading: setChatLoading } = useisChatDashboardLoading();
  //Effect para el loader
  useEffect(() => {
    setChatLoading(isChatsLoading);
  }, [isChatsLoading, setChatLoading]);
  //Data para los mensajes desde supabase
  const { data: dataMessages, loading: isMessageLoading } =
    useSupabaseCollection<MessageType>("messages");

  // Data para las el counter de polizas
  const { dataPolicies } = useDataPolicies();
  /* Loader  */
  const { setisLoading: setMessageLoading } = useisChatDashboardLoading();
  //Effect para el loader
  useEffect(() => {
    setMessageLoading(isMessageLoading);
  }, [isMessageLoading, setMessageLoading]);

  //Calculo de chats con mensajes sin leer
  const chatsWithUnreadMessages = (dataChats || []).filter(
    (chat) => chat.total_messages !== 0,
  );
  //Dashboard Cards Data
  const { getCountersStaff, getCountersPolicies } = useCounters();

  //Data para mostrar segun el role
  const staffOnlyUsers = useMemo(() => {
    return dataStaff.filter((user) => user.role === "staff");
  }, [dataStaff]);
  const dataDashboardCards: DashboardDataType[] = [
    ...(userData?.role !== "user"
      ? [
          ...(userData?.role !== "staff"
            ? [
                {
                  title: "Total de usuarios",
                  counter: staffOnlyUsers.length.toString(),
                  phrase: `+${getCountersStaff(staffOnlyUsers)} nuevos este mes`,
                  icon: "/img/icons/staff_icon_inactive.svg",
                  alt: "Icono de usuarios",
                },
              ]
            : []),

          {
            title: "Conversaciones",
            counter: dataChats.length.toString(),
            phrase: "Chats activos",
            icon: "/img/icons/messages_icon_inactive.svg",
            alt: "Icono de chats",
          },
          {
            title: "Mensajes",
            counter: dataMessages.length.toString(),
            phrase: "Total intercambiados",
            icon: "/img/icons/email_icon.svg",
            alt: "Icono de usuarios",
          },
          {
            title: "Sin Leer",
            counter: chatsWithUnreadMessages.length.toString(),
            phrase: "Requieren atención",
            icon: "/img/icons/warning_icon.svg",
            alt: "Icono de usuarios",
            color: "#EF4343",
          },
        ]
      : [
          {
            title: "Total de productos adquiridos ",
            counter: dataPolicies.length.toString(),
            phrase: `+${getCountersPolicies(dataPolicies)} nuevos este mes`,
            icon: "/img/icons/logo_shield.svg",
            alt: "Icono del escudo del logo representando las productos",
          },
        ]),
  ];
  //Dashboard List Data

  //Data para la staffList

  const detailStaff: ListElementType[] =
    dataStaff.map((staff) => ({
      detailTitle: staff.name,
      detailSubtitle: staff.email,
      date: formatDate(staff.created_at),
    })) || [];

  //Data para la active chats list

  const { getMessages } = useCounters();
  const sortedAndFilteredChats = getMessages({ dataChats, dataMessages });
  const detailChats: ListElementType[] = sortedAndFilteredChats.map((chat) => ({
    detailTitle: chat.name,
    detailSubtitle: chat.lastMessageText,
    date: formatDate(chat.lastMessageTime || ""),
  }));

  //Data para la policiesList
  const detailPolicies: ListElementType[] = dataPolicies.map((policie) => ({
    detailTitle: "Número de póliza",
    detailSubtitle: `${policie.policy_number}`,
    date: formatDate(policie.users.created_at),
  }));

  const {
    isPopupVisible: isPopupStaffVisible,
    setisPopupVisible: setisPopupStaffVisible,
  } = useShowPopopStaffStore();

  const dataDashboardList: DashboardListDataType[] = [
    ...(userData?.role !== "user"
      ? [
          ...(userData?.role !== "staff"
            ? [
                {
                  title: "Usuarios Recientes",
                  subtitle: "Últimos usuarios creados",
                  btnTxt: "Ver todos",
                  btnVoidPopoup: () => setisPopupStaffVisible(false),
                  btnVoid: () => setisPopupStaffVisible(true),
                  isOpen: isPopupStaffVisible,
                  type: "staff-list",
                  listDetailData: detailStaff,
                },
              ]
            : []),

          {
            title: "Conversaciones Activas",
            subtitle: "Chats con actividad reciente",
            btnTxt: "Ver todas",
            btnVoidPopoup: () => () => {},
            btnVoid: () => setSelected("Mensajes"),
            isOpen: false,
            type: "active-chats",
            listDetailData: detailChats,
          },
        ]
      : [
          {
            title: "Lista de productos",
            subtitle: "Productos adquiridos recientemente",
            btnTxt: "Ver todas",
            btnVoidPopoup: () => () => {
              setSelected("Productos");
            },
            btnVoid: () => setSelected("Productos"),
            isOpen: false,
            type: "active-policies",
            listDetailData: detailPolicies,
          },
        ]),
  ];

  //Data de la sección de acciones rápidas

  const dataFastActions: FastActionTypes[] = [
    ...(userData?.role !== "user"
      ? [
          ...(userData?.role !== "staff"
            ? [
                {
                  icon: "/img/icons/staff_icon_inactive.svg",
                  alt: "Icono de staff",
                  btnTxt: "Gestionar Usuarios",
                  isInactive: false,
                  onClick: () => {
                    setSelected("Usuarios");
                  },
                },
              ]
            : []),
          {
            icon: "/img/icons/messages_icon_inactive.svg",
            alt: "Icono de mensajes",
            btnTxt: "Ver mensajes",
            isInactive: false,
            onClick: () => {
              setSelected("Mensajes");
            },
          },
        ]
      : [
          {
            icon: "/img/icons/logo_shield.svg",
            alt: "Icono del escudo del logo representando las productos",
            btnTxt: "Ver productos",
            isInactive: false,
            onClick: () => {
              setSelected("productos");
            },
          },
        ]),
  ];
  return { dataDashboardCards, dataDashboardList, dataFastActions };
};
