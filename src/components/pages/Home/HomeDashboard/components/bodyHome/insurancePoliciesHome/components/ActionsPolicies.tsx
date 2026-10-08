import type { PoliciesType } from "../../../../../../../../types/home/dashboardTypes";

export const ActionsPolicies = ({ document }: PoliciesType) => {
  return (
    <div className="actions-container">
      <>
        <button
          onClick={() => {
            if (document) {
              window.open(document, "_blank");
            }
          }}
          className="edit-btn"
        >
          <img src="/img/icons/download.svg" alt="Icono de editar" />
        </button>
      </>
    </div>
  );
};
