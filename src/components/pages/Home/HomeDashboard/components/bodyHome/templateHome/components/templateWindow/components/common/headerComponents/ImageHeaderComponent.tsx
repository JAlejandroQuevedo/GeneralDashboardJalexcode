import type { ImageHeaderComponentProps } from "../../../../../../../../../../../../types/home/templateSectionTypes";
import type { CSSProperties } from "react";
import { InputPictureTemplate } from "./common/InputPictureTemplate";
import { EmptyInputPictureTemplate } from "./common/EmptyInputPictureTemplate";

export const ImageHeaderComponent = ({
  errors,
  onClick,
  template,
  setValue,
  fileInputRef,
  selectedFile,
  selectedFilePreview,
  headerComponent,
}: ImageHeaderComponentProps) => {
  return (
    <div
      className="template-image-header"
      onClick={onClick}
      title="Haz clic para cambiar la imagen"
      style={
        {
          "--dinamic-border": errors.file ? "2px dashed #ef4444" : "none",
          "--dinamic-fit": template.requiresFile ? "cover" : "contain",
        } as CSSProperties
      }
    >
      <InputPictureTemplate fileInputRef={fileInputRef} setValue={setValue} />
      {selectedFile ? (
        <img src={selectedFilePreview} alt="Preview" />
      ) : headerComponent.url &&
        headerComponent.url !== "FILE_UPLOAD_PLACEHOLDER" ? (
        <img src={headerComponent.url} alt="Logo" />
      ) : (
        <EmptyInputPictureTemplate errors={errors} />
      )}
    </div>
  );
};
