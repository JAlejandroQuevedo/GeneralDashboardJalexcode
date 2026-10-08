import { X } from "lucide-react";
import type { PreviewStateType } from "../../../../../../../../../../../../../types/home/chatSectionTypes";
import { ButtonModal } from "../../../buttons/ButtonModal";

export type PreviewHeaderType = {
  onClose: () => void;
  activeFile: PreviewStateType;
};
export const PreviewHeader = ({ onClose, activeFile }: PreviewHeaderType) => {
  return (
    <div className="preview-header">
      <ButtonModal
        className="modal-icon-btn"
        onClick={() => {
          onClose();
        }}
      >
        <X size={24} color="#54656f" />
      </ButtonModal>
      <div className="preview-title-container">
        <div className="preview-title">{activeFile.name}</div>
      </div>
      <div className="fill-title"></div>
    </div>
  );
};
