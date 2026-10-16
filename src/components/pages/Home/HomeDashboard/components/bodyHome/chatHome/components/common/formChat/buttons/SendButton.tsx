import { SendHorizontal } from "lucide-react";
import type { SendButtonProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { BeatLoader } from "react-spinners";

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
      {isSubmiting ? (
        <BeatLoader size={10} color="#ed3636" />
      ) : (
        <SendHorizontal size={18} color="#9da3ab" />
      )}
    </button>
  );
};
