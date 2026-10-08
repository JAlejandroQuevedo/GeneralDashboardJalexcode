import type { CSSProperties } from "react";
import type { AuthFormPropsType } from "../../../../../types";
import { useResponsive } from "../../../../../constants/reactResponsive";
import { usePlatformType } from "../../../../../stores/homeStore";

export const AuthForm = ({
  logo,
  title,
  subtitle,
  children,
}: AuthFormPropsType) => {
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  const { type } = usePlatformType();

  const subtitlePlatform =
    type === "user"
      ? "Dashboard de usuario"
      : "Dashboard de administración de WhatsApp Business";
  return (
    <>
      <div
        style={
          {
            "--dinamic-width": isSmall ? "100%" : "50%",
            "--dinamic-gap": isSmall ? "15px" : "10px",
          } as CSSProperties
        }
        className="authForm"
      >
        <div className="logoAuthForm">
          <img
            src={logo || "/img/icons/logo_auth.svg"}
            alt="Logo de la empresa"
          />
        </div>
        <div className="textAuthForm">
          <h1>{title || "Ingresar al Panel"}</h1>
          <h4>{subtitle || subtitlePlatform}</h4>
        </div>
        {children}
      </div>
    </>
  );
};
