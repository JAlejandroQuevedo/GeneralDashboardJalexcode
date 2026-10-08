import { useResponsive } from "../../../../../constants/reactResponsive";
import type { LoginPropsType } from "../../../../../types";

export const AuthBody = ({ children, author, slogan }: LoginPropsType) => {
  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  return (
    <>
      <section className="login">
        {children}
        {isSmall !== true && (
          <div className="authImg">
            <div className="authImgSlg">
              <p className="slgContent">
                {slogan || "“Construido para escalar. Diseñado para impactar.”"}
              </p>
              <p className="slgQuote">{author || "JAlexcode, 2026."}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
