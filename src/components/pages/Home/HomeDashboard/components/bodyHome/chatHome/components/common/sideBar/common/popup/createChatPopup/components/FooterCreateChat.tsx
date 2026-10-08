import type { CSSProperties } from "react";
import { DiscardButton } from "../../../../../../../../../../../../../common/buttons/warnings/DiscardButton";
import { PrimaryButton } from "../../../../../../../../../../../../../common/buttons/primary/PrimaryButton";
import { useShowPopupCreateChat } from "../../../../../../../../../../../../../../stores/homeStore";
import type { FooterCreateChatPropsType } from "../../../../../../../../../../../../../../types";

export const FooterCreateChat = ({
  isSubmitting,
}: FooterCreateChatPropsType) => {
  const { setisPopupVisible } = useShowPopupCreateChat();

  return (
    <div
      style={
        {
          "--dinamic-align": "space-between",
        } as CSSProperties
      }
      className={`form-buttons-container-chat`}
    >
      <DiscardButton
        onClick={() => {
          setisPopupVisible(false);
        }}
        width={"30%"}
        height="50px"
      />

      <PrimaryButton
        text={"Crear Chat"}
        type="submit"
        width={"30%"}
        height="50px"
        disabled={isSubmitting}
      />
    </div>
  );
};
