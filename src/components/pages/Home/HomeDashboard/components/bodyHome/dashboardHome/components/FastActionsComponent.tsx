import type { CSSProperties } from "react";
import type { FastActionsComponentProps } from "../../../../../../../../types/home/dashboardTypes";
import { useAuthStore } from "../../../../../../../../stores/userStore";

export const FastActionsComponent = ({ data }: FastActionsComponentProps) => {
  const { user } = useAuthStore();

  const role = user?.role;
  const subtitle =
    role === "user"
      ? "Tareas comunes del panel de usuario"
      : "Tareas comunes del panel de control";
  return (
    <section className="fast-actions">
      <div className="title-img-subtitle">
        <div className="txt-img">
          <img src="/img/icons/pulse_icon.svg" alt="Icono de pulso" />
          <h3>Acciones Rápidas</h3>
        </div>
        <p>{subtitle}</p>
      </div>
      <div className="actions-btns">
        {data.map((action, index) => {
          return (
            <button
              style={
                {
                  "--dinamic-pointer": action.isInactive ? "default" : "arrow",
                } as CSSProperties
              }
              onClick={action.onClick}
              key={index}
              className={`${action.isInactive ? "btn-inactive" : "btn-actions"}`}
            >
              <img src={action.icon} alt={action.alt} />
              {action.btnTxt}
            </button>
          );
        })}
      </div>
    </section>
  );
};
