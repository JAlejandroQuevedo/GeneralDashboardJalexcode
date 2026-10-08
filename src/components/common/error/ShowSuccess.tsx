import type { ShowSuccessProps } from "../../../types/error/errorSuccess";

export const ShowSuccess = ({
  title,
  message,
  width,
  height,
  margin,
}: ShowSuccessProps) => {
  return (
    <div
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(margin ? { margin } : {}),
      }}
      className="showSuccess"
    >
      <img src="/img/icons/success_icon.svg" alt="Icono de éxito" />
      <div className="showSuccessContainer">
        <p className="titleShowSuccess">{title}</p>
        <p className="messageShowSuccess">{message}</p>
      </div>
    </div>
  );
};
