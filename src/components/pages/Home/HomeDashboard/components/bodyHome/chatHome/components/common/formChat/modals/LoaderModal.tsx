import { X } from "lucide-react";
import type { LoaderModalProps } from "../../../../../../../../../../../types/home/chatSectionTypes";
import { ButtonModal } from "../buttons/ButtonModal";
import { BeatLoader } from "react-spinners";

export const LoaderModal = ({ onClick }: LoaderModalProps) => {
  return (
    <div className="media-modal-overlay">
      <div className="preview-header">
        <ButtonModal className="modal-icon-btn" onClick={onClick}>
          <X size={24} color="#54656f" />
        </ButtonModal>
        <div className="preview-title-container">
          <div className="preview-title">
            Tu imagen está siendo procesada, por favor espera
          </div>
        </div>
        <div className="fill-title"></div>
      </div>
      <div className="preview-main">
        <div className="preview-iframe">
          <BeatLoader size={8} color="#85b6ff" />
        </div>
      </div>
      <div className="preview-footer"></div>
    </div>
  );
};
