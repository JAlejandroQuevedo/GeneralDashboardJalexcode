import { BeatLoader } from "react-spinners";
import { useisStaffAdminLoading } from "../../../../../../../../stores/loadersStore";
import { Table } from "../../../../../../../common/inputs/table/Table";
import { useDataStaff } from "../data/useDataStaff";
import { useResponsive } from "../../../../../../../../constants/reactResponsive";

export const StaffTeamTable = ({ showTitles }: { showTitles: boolean }) => {
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();

  const isSmall = isSm || isMd || isLg || isIpadPro;
  const headers = [
    "Usuario",
    !isSmall && "Información de Contacto",
    !isSmall && "Fecha de Ingreso",
    "Acciones",
  ].filter(Boolean) as string[];
  const { tableStaffData } = useDataStaff();
  const { isLoading } = useisStaffAdminLoading();
  return (
    <section className="home-list">
      {isLoading ? (
        <div className="loader-card">
          <BeatLoader size={8} color="#85b6ff" />
        </div>
      ) : (
        <>
          {showTitles && (
            <div className="table-titles">
              <h2>Usuarios</h2>
              <h3>
                Lista completa de todos los usuarios registrados en el sistema
              </h3>
            </div>
          )}

          <div className="containerTable">
            <Table headers={headers} data={tableStaffData} />
          </div>
        </>
      )}
    </section>
  );
};
