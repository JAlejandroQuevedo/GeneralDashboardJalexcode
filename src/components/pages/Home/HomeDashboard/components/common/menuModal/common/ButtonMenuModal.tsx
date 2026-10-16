import { Forward } from "lucide-react";
import type { ButtonMenuModalProps } from "../../../../../../../../types/home/menuModal";
import { BeatLoader } from "react-spinners";

export const ButtonMenuModal = ({
  selectedChats,
  onClick,
  isLoading = false,
}: ButtonMenuModalProps) => {
  return (
    <div className="modal-footer">
      <div className="selected-preview">
        <span>{selectedChats.length} chat(s) seleccionado(s)</span>
      </div>
      <button className="send-forward-btn" onClick={onClick}>
        {isLoading ? (
          <BeatLoader size={10} color="#ed3636" />
        ) : (
          <Forward size={24} color="white" />
        )}
      </button>
    </div>
  );
};
