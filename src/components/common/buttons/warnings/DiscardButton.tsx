import type { WarningButtonProps } from "../../../../types/buttons/buttons_types";

export const DiscardButton = ({
  onClick,
  width,
  height,
}: WarningButtonProps) => {
  return (
    <button
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
      }}
      onClick={onClick}
      type="button"
      className="discard-button"
    >
      Descartar
    </button>
  );
};
