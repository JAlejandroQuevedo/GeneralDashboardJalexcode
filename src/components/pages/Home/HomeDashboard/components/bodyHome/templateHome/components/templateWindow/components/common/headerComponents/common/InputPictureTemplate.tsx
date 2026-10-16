import type { InputPictureTemplateProps } from "../../../../../../../../../../../../../types/home/templateSectionTypes";

export const InputPictureTemplate = ({
  fileInputRef,
  setValue,
}: InputPictureTemplateProps) => {
  return (
    <input
      type="file"
      ref={fileInputRef}
      hidden
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setValue("file", file, { shouldValidate: true });
        }
      }}
    />
  );
};
