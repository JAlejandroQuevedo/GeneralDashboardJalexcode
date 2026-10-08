import { useSelectedStore } from "../../../../stores/auth/LateralMenuStore";
import type { OptionsType } from "../../../../types/home/lateralMenu";
import { DashboardHome } from "./components/bodyHome/dashboardHome/DashboardHome";
import { LateralMenu } from "./components/lateralMenu/LateralMenu";
import { useLoadingStore } from "../../../../stores/auth/LoadingStore";
import useDocumentSEO from "../../../../hooks/useDocumentSEO";
import { NavBar } from "../../../layout/navBar/NavBar";
import { StaffHome } from "./components/bodyHome/staffHome/StaffHome";
import { ChatApp } from "./components/bodyHome/chatHome/MessageHome";
import { useSupabaseSingleDocument } from "../../../../functions/supabase/streaming/useSupabaseStreamingSingle";
import type { UserDataType } from "../../../../types/home/dashboardTypes";
import { useEffect } from "react";
import { SettingsHome } from "./components/bodyHome/settingsHome/SettingsHome";
import { BeatLoader } from "react-spinners";
import { useResponsive } from "../../../../constants/reactResponsive";
import {
  useActiveChat,
  useShowLateralPanelStore,
} from "../../../../stores/homeStore";
import { useOptionsLateralPanel } from "./components/lateralMenu/useOptions";
import { useAuthStore } from "../../../../stores/userStore";
import { InsurancePoliciesHome } from "./components/bodyHome/insurancePoliciesHome/InsurancePoliciesHome";
import { useDesktopNotifications } from "../../../../hooks/useNotifications";
import { useDataChat } from "./components/bodyHome/chatHome/data/useDataChat";

export const HomeDashboard = () => {
  const { selected, setSelected } = useSelectedStore();
  const { user: data } = useAuthStore();
  //Se toman los mensajes y los chats para las notificaciones
  const { messages, chats } = useDataChat();
  const { activeChat, setActiveChat } = useActiveChat();
  //Hook para las notificaciones
  useDesktopNotifications(chats, messages, activeChat, (chatId) => {
    setSelected("Mensajes");
    setActiveChat(chatId);
  });
  const role = data?.role || "staff";

  const { optionsConstantAdmin, optionConstantStaff, optionConstantUser } =
    useOptionsLateralPanel();

  const options: OptionsType[] =
    role === "admin" || role === "super-admin"
      ? optionsConstantAdmin
      : role === "user"
        ? optionConstantUser
        : optionConstantStaff;

  const { isLoading } = useLoadingStore();

  const { loading } = useSupabaseSingleDocument<UserDataType>("users");

  //El lateral panel se oculta por defecto
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();

  const isSmall = isSm || isMd || isLg || isIpadPro;
  const { setisLateralPanelVisible } = useShowLateralPanelStore();

  useEffect(() => {
    if (isSmall) {
      setisLateralPanelVisible(false);
    } else {
      setisLateralPanelVisible(true);
    }
  }, [isSmall, setisLateralPanelVisible]);
  //Title de seccion
  useDocumentSEO({
    title: "Dashboard - JAlexcode",
    description:
      "Panel de administración de JAlexcode para gestionar productos, clientes, contabilidad, usuarios y ajustes.",
  });
  if (isLoading)
    return (
      <div className="loader-card-desktop">
        <BeatLoader size={20} color="#85b6ff" />
      </div>
    );
  return (
    <>
      {loading ? (
        <>
          <div className="loader-card-desktop">
            <BeatLoader size={20} color="#85b6ff" />
          </div>
        </>
      ) : (
        <>
          <section className="home">
            <LateralMenu />
            <div className="main-wrapper">
              <NavBar />
              <main className="content-area">
                {role === "user" ? (
                  <>
                    {selected === options[0].name && <DashboardHome />}
                    {selected === options[1].name && <InsurancePoliciesHome />}
                    {selected === options[2].name && <SettingsHome />}
                  </>
                ) : (
                  <>
                    {selected === options[0].name && <DashboardHome />}
                    {selected === options[1].name && <StaffHome />}
                    {selected === options[2].name && <ChatApp />}
                    {selected === options[3].name && <SettingsHome />}
                  </>
                )}
              </main>
            </div>
          </section>
        </>
      )}
    </>
  );
};
