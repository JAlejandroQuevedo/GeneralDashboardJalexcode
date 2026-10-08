export type ButtonProps = {
  text: string;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  disabledChat?: boolean;
  width?: string;
  height?: string;
  fontSize?: string;
  onClick?: () => void;
};
export type ButtonIconProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  icon?: string;
  alt?: string;
  width?: string;
  height?: string;
};

export type WarningButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  isLoading?: boolean;
};
