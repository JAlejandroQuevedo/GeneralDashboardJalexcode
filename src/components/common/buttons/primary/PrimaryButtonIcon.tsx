import type { ButtonIconProps } from "../../../../types/buttons/buttons_types";

export const PrimaryButtonIcon = ({
  text,
  onClick,
  icon,
  alt,
  disabled,
  type,
  width,
  height,
}: ButtonIconProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
      className="primary-button-icon"
    >
      <img
        src={icon || "/img/icons/icon_button.svg"}
        alt={alt || "Icono del botón primario"}
      />
      {text}
    </button>
  );
};
