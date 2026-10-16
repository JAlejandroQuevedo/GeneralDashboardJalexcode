import { useSelectedStore } from "../../../../../../stores/auth/LateralMenuStore";
import {
  useActiveChat,
  useChatUIStore,
  useShowLateralPanelStore,
  useTemplateUIStore,
} from "../../../../../../stores/homeStore";
import type { OptionsType } from "../../../../../../types/home/lateralMenu";
import { useResponsive } from "../../../../../../constants/reactResponsive";
import { useAuthStore } from "../../../../../../stores/userStore";
import { useOptionsLateralPanel } from "./useOptions";
export const LateralMenu = () => {
  const { selected, setSelected } = useSelectedStore();
  const { user: data } = useAuthStore();
  const { setActiveChat } = useActiveChat();

  const role = data?.role || "staff";

  const { optionConstantStaff, optionsConstantAdmin, optionConstantUser } =
    useOptionsLateralPanel();
  const { setForwardModalOpen } = useChatUIStore();
  const { setMenuModalOpen } = useTemplateUIStore();
  const options: OptionsType[] =
    role === "admin" || role === "super-admin"
      ? optionsConstantAdmin
      : role === "user"
        ? optionConstantUser
        : optionConstantStaff;

  const { isLateralPanelVisible, setisLateralPanelVisible } =
    useShowLateralPanelStore();

  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  return (
    <div className={`lateralMenu ${!isLateralPanelVisible ? "is-closed" : ""}`}>
      <div className="logoLateralMenu">
        <img src={"/img/icons/logo_auth.svg"} alt="Logo de la empresa" />
        {isSmall && (
          <button
            onClick={() => {
              setisLateralPanelVisible(false);
            }}
          >
            <img src="/img/icons/iconClose.svg" alt="" />
          </button>
        )}
      </div>
      <div className="containerButtonsLateralMenu">
        {options.map((item, index) => {
          return (
            <button
              onClick={() => {
                setSelected(item.name);
                setActiveChat("");
                setForwardModalOpen(false);
                setMenuModalOpen(false);
                if (isSmall) {
                  setisLateralPanelVisible(false);
                }
              }}
              className={selected === item.name ? "btnFill" : "btnInactive"}
              key={index}
            >
              <img
                src={
                  selected === item.name ? item.iconActive : item.iconInactive
                }
                alt={item.alt}
              />
              {isSm && <p>{item.name}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
