import type { ButtonProps } from "../../../../types/buttons/buttons_types";

export const SecundaryButton = ({
  text,
  onClick,
  disabled,
  type,
  width,
  height,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="secundary-button"
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
    >
      {text}
    </button>
  );
};
