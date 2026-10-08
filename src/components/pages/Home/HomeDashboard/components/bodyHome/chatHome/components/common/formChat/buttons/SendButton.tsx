import { SendHorizontal } from "lucide-react";
import type { SendButtonProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const SendButton = ({
  isButtonDisabled,
  isChatDisabled,
  isSubmiting,
}: SendButtonProps) => {
  return (
    <button
      className="submit-message"
      type="submit"
      disabled={isButtonDisabled || isChatDisabled || isSubmiting}
    >
      <SendHorizontal size={18} color="#9da3ab" />
    </button>
  );
};
