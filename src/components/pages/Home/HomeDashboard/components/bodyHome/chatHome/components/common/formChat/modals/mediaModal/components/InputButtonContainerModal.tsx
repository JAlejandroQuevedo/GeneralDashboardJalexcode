import { CaptionArea } from "./CaptionArea";
import { ButtonModal } from "../../../buttons/ButtonModal";
import { Camera, Plus } from "lucide-react";
import type { InputButtonContainerModalTypeProps } from "../../../../../../../../../../../../../types/home/chatSectionTypes";

export const InputButtonContainerModal = ({
  fileInputRef,
  acceptTypes,
  handleAddMoreFiles,
  onOpenCamera,
  isMediaMode,
  isDisabled,
  files,
  onSend,
  onAddMore,
}: InputButtonContainerModalTypeProps) => {
  return (
    <div className="input-btn-container-modal">
      <input
        type="file"
        ref={fileInputRef}
        hidden
        multiple
        accept={acceptTypes}
        onChange={handleAddMoreFiles}
      />
      <ButtonModal className="modal-btns" onClick={onAddMore}>
        <Plus color="#54656f" />
      </ButtonModal>
      {onOpenCamera && isMediaMode && (
        <ButtonModal className="modal-btns" onClick={() => onOpenCamera()}>
          <Camera color="#54656f" size={20} />
        </ButtonModal>
      )}
      <CaptionArea isDisabled={isDisabled} files={files} onSend={onSend} />
    </div>
  );
};
