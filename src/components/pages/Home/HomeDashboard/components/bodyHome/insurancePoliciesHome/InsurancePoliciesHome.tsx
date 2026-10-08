import { useResponsive } from "../../../../../../../constants/reactResponsive";
import { Table } from "../../../../../../common/inputs/table/Table";
import { useDataPolicies } from "./data/useDataPolicies";

export const InsurancePoliciesHome = () => {
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();

  const isSmall = isSm || isMd || isLg || isIpadPro;
  const headers = [
    "Nombre del cliente",
    !isSmall && "Información de Contacto",
    !isSmall && "Fecha de adquisición",
    "Acciones",
  ].filter(Boolean) as string[];
  const { tablePoliciesData } = useDataPolicies();

  return (
    <section>
      <div>
        <div className="home-titles">
          <img
            src="/img/icons/logo_shield.svg"
            alt="Icono del escudo del logo"
          />
          <div className="txt-container">
            <h4>Productos</h4>
            <p>Lista de productos que adquiriste</p>
          </div>
        </div>
        <>
          <div className="container-table-policies home-body">
            <Table headers={headers} data={tablePoliciesData} />
          </div>
        </>
      </div>
    </section>
  );
};
