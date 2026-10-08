import { Plus, X } from "lucide-react";
import type { ButtonDocumentProps } from "../../../../../../../../../../../types/home/chatSectionTypes";

export const ButtonDocument = ({
  onClick,
  showSender,
  isDisabled = false,
}: ButtonDocumentProps) => {
  return (
    <button disabled={isDisabled} onClick={onClick} className="plus-icon">
      {showSender ? <X /> : <Plus color="#54656f" />}
    </button>
  );
};
