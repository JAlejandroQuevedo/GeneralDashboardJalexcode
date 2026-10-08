import { useResponsive } from "../../../../../../../../../constants/reactResponsive";
import type { PopUpHomePropsType } from "../../../../../../../../../types/home/dashboardTypes";
import { Popup } from "../../../../../../../../common/inputs/popup/Popup";

export const PopUpDashboardChatComponent = ({
  btnVoid,
  isOpen,
}: PopUpHomePropsType) => {
  const { isSm } = useResponsive();
  return (
    <Popup
      isOpen={isOpen}
      onClose={btnVoid}
      width={isSm ? "95%" : "800px"}
      height={isSm ? "80dvh" : "80dvh"}
    >
      <div>Abriste la lista del chat </div>
    </Popup>
  );
};
