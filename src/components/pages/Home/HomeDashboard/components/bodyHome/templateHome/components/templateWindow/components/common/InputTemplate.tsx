import type { CSSProperties } from "react";

import type { InputTemplateProps } from "../../../../../../../../../../../types/home/templateSectionTypes";

export const InputTemplate = ({
  register,
  placeholderStr,
  varName,
  inputLength,
  hasError,
}: InputTemplateProps) => {
  return (
    <input
      type="text"
      className="template-inline-input"
      placeholder={placeholderStr}
      {...register(varName)}
      style={
        {
          "--dinamic-width": `${inputLength + 2}ch`,
          "--dinamic-border-bottom-color": hasError ? "#ef4444" : "#00a884",
        } as CSSProperties
      }
    />
  );
};
