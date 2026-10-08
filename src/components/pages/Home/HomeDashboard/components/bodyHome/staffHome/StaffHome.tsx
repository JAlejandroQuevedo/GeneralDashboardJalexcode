import { useDataStaff } from "./data/useDataStaff";

import { useShowPopopStaffCreate } from "../../../../../../../stores/homeStore";
import { PopUpStaffCreateComponent } from "./popup/PopupStaffCreate";
import { PopUpStaffEditComponent } from "./popup/PopupStaffEdit";
import { PopUpStaffDeleteComponent } from "./popup/PopupStaffDelete";
import { StaffTeamTable } from "./components/StaffTeamTable";
import { useUserData } from "../../data/userData";
import { CardsComponent } from "../../common/CardsComponent";

export const StaffHome = () => {
  const { dataStaffCards } = useDataStaff();
  const { setisPopupVisible, isPopupVisible } = useShowPopopStaffCreate();
  const { data } = useUserData();

  return (
    <section className="bodyHome">
      <div className="home-body">
        <div className="table-titles-btn">
          <div className="table-titles">
            <h2>Gestión de Usuarios</h2>
            <h3>Administra tus usuarios</h3>
          </div>
          {data?.role === "super-admin" && (
            <button
              onClick={() => {
                setisPopupVisible(true);
              }}
            >
              <img
                src="/img/icons/plus_icon.svg"
                alt="Imagen de un signo de +"
              />
              Nuevo Usuario
            </button>
          )}
        </div>

        <CardsComponent dinamicHeightMobile="430px" data={dataStaffCards} />
        <StaffTeamTable showTitles={true} />
      </div>
      <PopUpStaffCreateComponent
        isOpen={isPopupVisible}
        btnVoid={() => setisPopupVisible(false)}
      />
      <PopUpStaffEditComponent />
      <PopUpStaffDeleteComponent />
    </section>
  );
};
