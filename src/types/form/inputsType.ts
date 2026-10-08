import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import type { Path } from "react-hook-form";
import type { ContentSearchType } from "..";
import type { KeyboardEventHandler } from "react";
import type { ChatFormType } from "./formChat";

//Input type
export type InputProps<T extends Record<string, any>> = {
  label: string;
  id: Path<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  customError?: string;
  disabled?: boolean;
  width?: string;
  height?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyDownTextArea?: KeyboardEventHandler<HTMLTextAreaElement>;
  dinamicFontSizeMobile?: string;
};

export type InputIconProps<T extends Record<string, any>> = Omit<
  InputProps<T>,
  "label"
>;

export type InputPasswordProps<T extends Record<string, any>> = Omit<
  InputProps<T>,
  "type"
>;
//Dropdown type
export type DropdownOption = {
  value: string;
  label: string;
};

export type DropdownFieldProps<T extends Record<string, any>> = {
  label: string;
  id: Path<T>;
  errors: FieldErrors<T>;
  options: DropdownOption[];
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
  width?: string | number;
  height?: string;
};
export type DropdownFieldPropsFilter<T extends Record<string, any>> = {
  label: string;
  id: Path<T>;
  errors: FieldErrors<T>;
  options: DropdownOption[];
  placeholder?: string;
  control: Control<T>;
  disabled?: boolean;
  width?: string | number;
  height?: string;
};

//Checkbox Type
export type CheckboxProps<T extends Record<string, any>> = {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  width?: string;
  height?: string;
};

//Files type

export type FileUploadProps = {
  value: File | null; // viene del Controller
  onChange: (file: File | null) => void; // para actualizar el form
  error?: string;
  disabled?: boolean;
  width?: string;
  height?: string;
};

//Image type

export type InputImageProps<T extends Record<string, any>> = Omit<
  InputProps<T>,
  "label" | "errors"
> & {
  content: ContentSearchType[];
  height?: string;
};

//Date type
type ModeType = "date" | "datetime" | "time";
export type InputDateProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  errors: FieldErrors<T>;
  mode?: ModeType; // <-- NUEVO: selecciona date | datetime | time
  minDate?: Date;
  maxDate?: Date;
  timeIntervals?: number; // minutos entre cada opción
  width?: string;
  height?: string;
  placeholder?: string;
  showErrors?: boolean;
};

//Verification Code type

export type InputVerificationCodeProps<T extends Record<string, any>> = Omit<
  InputProps<T>,
  | "label"
  | "type"
  | "placeholder"
  | "disabled"
  | "width"
  | "height"
  | "onChange"
> & {
  index: number;
  inputRefs: React.RefObject<HTMLInputElement>[];
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
};

//Types para el componente de formulario de crear chat

export type FormCreateChatTypeProps = {
  register: UseFormRegister<ChatFormType>;
  errors: FieldErrors<ChatFormType>;
  control: Control<ChatFormType>;
};

//Types del smart text area

export type SmartTextAreaProps = {
  label?: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  onKeyDownTextArea?: (e: any) => void;
};

//Comandos para la interfaz

export type SmartEditorRef = {
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleStrike: () => void;
  toggleCode: () => void;
  toggleBulletList: () => void;
  insertEmoji: (emoji: string) => void;
};
