import type { ReactNode, RefObject } from "react";
import type {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export type TemplateButton = {
  text: string;
};

export type TemplateComponent = {
  type: "HEADER" | "BODY" | "BUTTONS";
  format?: "TEXT" | "IMAGE";
  text?: string;
  url?: string;
  variables?: string[];
  placeholders?: Record<string, string>;
  buttons?: TemplateButton[];
};

export type TemplateType = {
  id: string;
  name: string;
  endpoint: string;
  category: "Utilidad" | "Marketing";
  requiresFile: boolean;
  language: "ES";
  components: TemplateComponent[];
};

// Props para el SideBar
export type TemplateSideBarProps = {
  templates: TemplateType[];
  onSelect: (template: TemplateType) => void;
  activeTemplateId?: string;
};

// Props para el Preview Window
export type TemplatePreviewWindowProps = {
  template: TemplateType;
  onSend: (
    endpoint: string,
    variables: Record<string, string>,
    file: File | null,
  ) => void;
};

export type TemplateContainerProps = {
  headerComponent: TemplateComponent | undefined;
  bodyComponent: TemplateComponent | undefined;
  buttonsComponent: TemplateComponent | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | undefined;
  selectedFilePreview: string;
  template: TemplateType;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

export type InputTemplateProps = {
  placeholderStr: string;
  register: (
    name: string,
    options?: RegisterOptions<FieldValues, string> | undefined,
  ) => UseFormRegisterReturn<string>;
  inputLength: number;
  hasError: boolean;
  varName: string;
};

export type LinesTemplateProps = {
  lines: string[];
};
export type ImageHeaderComponentProps = {
  errors: FieldErrors<FieldValues>;
  onClick: () => void;
  template: TemplateType;
  selectedFile: File | undefined;
  headerComponent: TemplateComponent;
  selectedFilePreview: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setValue: (
    name: "file",
    value: any,
    options?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
          shouldTouch: boolean;
        }>
      | undefined,
  ) => void;
};
export type TextHeaderComponentProps = {
  headerComponent: TemplateComponent;
  renderEditableText: (textObj?: TemplateComponent) => ReactNode[] | null;
};
export type ButtonComponentsProps = {
  buttonsComponent: TemplateComponent | undefined;
};
export type InputPictureTemplateProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  setValue: (
    name: "file",
    value: any,
    options?:
      | Partial<{
          shouldValidate: boolean;
          shouldDirty: boolean;
          shouldTouch: boolean;
        }>
      | undefined,
  ) => void;
};
