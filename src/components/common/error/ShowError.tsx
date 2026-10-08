import { Link } from "react-router-dom";
import type { ShowErrorProps } from "../../../types/error/errorSuccess";

export const ShowError = ({
  title,
  message,
  width,
  height,
  margin,
  linkMessage,
  linkRoute,
  showLink = false,
}: ShowErrorProps) => {
  return (
    <div
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(margin ? { margin } : {}),
      }}
      className="showError"
    >
      <img src="/img/icons/error_icon.svg" alt="Icono de error" />
      <div className="showErrorContainer">
        <p className="titleShowError">{title}</p>
        <div className="messageErrorConteiner">
          <p className="messageShowError">{message}</p>
          {showLink && <Link to={linkRoute || ""}>{linkMessage}</Link>}
        </div>
      </div>
    </div>
  );
};
