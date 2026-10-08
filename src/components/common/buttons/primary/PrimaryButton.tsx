import type { ButtonProps } from "../../../../types/buttons/buttons_types";
import { BeatLoader } from "react-spinners";
export const PrimaryButton = ({
  text,
  onClick,
  disabled,
  disabledChat = false,
  type,
  width,
  height,
  fontSize,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || disabledChat}
      onClick={onClick}
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(fontSize ? { fontSize } : {}),
      }}
      className="primary-button"
    >
      {disabled ? (
        <div>
          <BeatLoader size={10} color="#fdfdfd" />
        </div>
      ) : (
        text
      )}
    </button>
  );
};
