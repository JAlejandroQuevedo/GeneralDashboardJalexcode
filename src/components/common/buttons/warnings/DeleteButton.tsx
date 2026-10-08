import { BeatLoader } from "react-spinners";
import type { WarningButtonProps } from "../../../../types/buttons/buttons_types";

export const DeleteButton = ({
  onClick,
  width,
  height,
  isLoading = false,
}: WarningButtonProps) => {
  return (
    <button
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
      onClick={onClick}
      type="button"
      className="delete-button"
    >
      {isLoading ? (
        <div className="loader-card">
          <BeatLoader size={8} color="#fdfdfd" />
        </div>
      ) : (
        "Eliminar"
      )}
    </button>
  );
};
