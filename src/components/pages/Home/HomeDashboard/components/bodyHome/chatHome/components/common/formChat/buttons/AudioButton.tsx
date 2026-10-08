import { Mic } from "lucide-react";
import type { AudioButtonPropsTypes } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const AudioButton = ({
  isButtonDisabled,
  onClick,
}: AudioButtonPropsTypes) => {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="mic-btn"
        disabled={isButtonDisabled}
      >
        <Mic size={20} color="#54656f" />
      </button>
    </>
  );
};
