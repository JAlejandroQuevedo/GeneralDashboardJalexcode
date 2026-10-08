import { FastActionsComponent } from "./components/FastActionsComponent";
import { PopUpDashboardChatComponent } from "./components/popups/PopUpDashboardChatComponent";
import { PopUpDashboardStaffComponent } from "./components/popups/PopUpDashboardStaffComponent";
import { useDataDahboard } from "./data/useDataDashboard";
import { useAuthStore } from "../../../../../../../stores/userStore";
import { CardsComponent } from "../../common/CardsComponent";
import { ListCardsComponent } from "../../common/ListCardsComponent";

export const DashboardHome = () => {
  const { dataDashboardCards, dataDashboardList, dataFastActions } =
    useDataDahboard();
  const staffPopupData = dataDashboardList.find(
    (item) => item.type === "staff-list",
  );
  const chatPopupData = dataDashboardList.find(
    (item) => item.type === "active-chats",
  );
  const { user } = useAuthStore();
  const role = user?.role;
  const subtitle: string =
    role === "user"
      ? "Bienvenido al panel de control del usuario"
      : "Bienvenido al panel de control de usuarios";
  const {
    btnVoidPopoup: btnVoidStaff = () => {},
    isOpen: isOpenStaff = false,
    type: typeStaff = "staff-list",
  } = staffPopupData || {};

  const {
    btnVoidPopoup: btnVoidChat = () => {},
    isOpen: isOpenChat = false,
    type: typeChat = "active-chats",
  } = chatPopupData || {};
  return (
    <section className="bodyHome">
      <div className="home-body">
        <div className="dashboard-titles">
          <h2>Dashboard</h2>
          <h3>{subtitle}</h3>
        </div>
        <CardsComponent
          dinamicHeightMobile={role === "user" ? "150px" : "540px"}
          data={dataDashboardCards}
        />
        <ListCardsComponent data={dataDashboardList} />
        <FastActionsComponent data={dataFastActions} />
      </div>

      <PopUpDashboardStaffComponent
        btnVoid={btnVoidStaff}
        isOpen={isOpenStaff}
        type={typeStaff}
      />

      <PopUpDashboardChatComponent
        btnVoid={btnVoidChat}
        isOpen={isOpenChat}
        type={typeChat}
      />
    </section>
  );
};
