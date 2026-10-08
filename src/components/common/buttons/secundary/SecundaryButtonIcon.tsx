import type { ButtonIconProps } from "../../../../types/buttons/buttons_types";

export const SecundaryButtonIcon = ({
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
      className="secundary-button-icon"
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
    >
      <img src={icon || "/img/icons/icon_button.svg"} alt={alt} />
      {text}
    </button>
  );
};
