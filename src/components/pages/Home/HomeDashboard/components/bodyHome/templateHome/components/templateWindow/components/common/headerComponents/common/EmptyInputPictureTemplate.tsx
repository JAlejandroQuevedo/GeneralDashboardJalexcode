import { ImagePlus } from "lucide-react";
import type { CSSProperties } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";

export type EmptyInputPictureTemplateProps = {
  errors: FieldErrors<FieldValues>;
};
export const EmptyInputPictureTemplate = ({
  errors,
}: EmptyInputPictureTemplateProps) => {
  return (
    <>
      <ImagePlus size={32} color={errors.file ? "#ef4444" : "#64748b"} />
      <span
        className="template-image-placeholder-text"
        style={
          {
            "--dinamic-color": errors.file ? "#ef4444" : "#64748b",
          } as CSSProperties
        }
      >
        Clic para adjuntar imagen
      </span>
    </>
  );
};
