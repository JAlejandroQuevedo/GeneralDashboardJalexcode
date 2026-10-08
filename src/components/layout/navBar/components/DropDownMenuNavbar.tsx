import { useAuth } from "../../../../functions/auth/useAuth";
import { useSelectedStore } from "../../../../stores/auth/LateralMenuStore";

export const DropDownMenuNavbar = () => {
  const { logout } = useAuth();
  const { setSelected } = useSelectedStore();
  return (
    <div className="dropdown-menu">
      <button
        className="dropdown-item"
        onClick={() => {
          logout();
          setSelected("Dashboard");
        }}
      >
        Log out
      </button>
    </div>
  );
};
