import { useResponsive } from "../../../../../../../../../constants/reactResponsive";
import type { PopUpHomePropsType } from "../../../../../../../../../types/home/dashboardTypes";
import { Popup } from "../../../../../../../../common/inputs/popup/Popup";
import { StaffTeamTable } from "../../../staffHome/components/StaffTeamTable";

export const PopUpDashboardStaffComponent = ({
  btnVoid,
  isOpen,
}: PopUpHomePropsType) => {
  const { isSm } = useResponsive();
  return (
    <Popup
      isOpen={isOpen}
      onClose={btnVoid}
      width={isSm ? "95%" : "800px"}
      height={isSm ? "80dvh" : "85dvh"}
    >
      <section className="popup-staff">
        <div className="home-titles">
          <img
            src="/img/icons/logo_shield.svg"
            alt="Icono del escudo del logo"
          />
          <div className="txt-container">
            <h4>Usuarios</h4>

            <p>
              Lista completa de todos los usuarios registrados en el sistema
            </p>
          </div>
        </div>
        <StaffTeamTable showTitles={false} />
      </section>
    </Popup>
  );
};
