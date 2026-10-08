import { useSelectedStore } from "../../../../../../../../stores/auth/LateralMenuStore";
import {
  useShowPopopStaffDelete,
  useShowPopopStaffEdit,
  useShowPopopStaffStore,
} from "../../../../../../../../stores/homeStore";
import { useAuthStore } from "../../../../../../../../stores/userStore";
import type { UserDataType } from "../../../../../../../../types/home/dashboardTypes";

export const ActionsStaff = ({
  id,
  name,
  email,
  created_at,
  username,
  role,
}: UserDataType) => {
  const dataActions: UserDataType = {
    id,
    name,
    email,
    created_at,
    username,
    role,
  };
  const { setData, setisPopupVisible } = useShowPopopStaffDelete();
  const { user } = useAuthStore();
  const userRole = user?.role;
  const userID = user?.uuId;
  const { setData: setDataEdit, setisPopupVisible: setisPopupVisibleEdit } =
    useShowPopopStaffEdit();
  const { setSelected } = useSelectedStore();
  const { setisPopupVisible: setisPopupStaffVisible } =
    useShowPopopStaffStore();

  return (
    <div className="actions-container">
      {userID !== id && (
        <>
          <button
            onClick={() => {
              const selected = userRole === "staff" ? "Usuarios" : "Usuarios";
              setSelected(selected);
              setisPopupStaffVisible(false);
              setDataEdit(dataActions);
              setisPopupVisibleEdit(true);
            }}
            className="edit-btn"
          >
            <img src="/img/icons/edit_button.svg" alt="Icono de editar" />
          </button>
          <button
            className="delete-btn"
            onClick={() => {
              const selected = userRole === "staff" ? "Usuarios" : "Usuarios";
              setSelected(selected);
              setisPopupStaffVisible(false);
              setData(dataActions);
              setisPopupVisible(true);
            }}
          >
            <img src="/img/icons/trash_icon.svg" alt="Icono de eliminar" />
          </button>
        </>
      )}
    </div>
  );
};
