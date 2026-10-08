import type { AssignMenuProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const AsignButtonsDropdown = ({
  handleChangeStatus,
  handleAssignClick,
  handleDeleteBtn,
  handleCleanBtn,
}: AssignMenuProps) => {
  return (
    <>
      <button
        className="btn-pendient"
        onClick={(e) => handleChangeStatus(e, "Pendient")}
      >
        <div></div>
        Pendiente
      </button>
      <button
        className="btn-completed"
        onClick={(e) => handleChangeStatus(e, "Completed")}
      >
        <div></div>
        Completado
      </button>
      <button
        className="btn-notstarted"
        onClick={(e) => handleChangeStatus(e, "Notstarted")}
      >
        <div></div>
        Sin iniciar
      </button>
      <button onClick={handleAssignClick}>Asignar ▸</button>
      <button onClick={handleDeleteBtn} className="delete-chat-dropdown">
        Eliminar chat
      </button>
      <button onClick={handleCleanBtn} className="delete-chat-dropdown">
        Vaciar chat
      </button>
    </>
  );
};
