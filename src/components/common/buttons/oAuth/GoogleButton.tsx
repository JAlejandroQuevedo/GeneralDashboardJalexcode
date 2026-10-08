import type { GoogleButtonPropsType } from "../../../../types/buttons/google_button_types";
import { loginWithGoogle } from "../../../../functions/OAuth/google/loginGoogle";
import { useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
export const GoogleButton = ({
  width,
  height,
  fontSize,
}: GoogleButtonPropsType) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const clickedRef = useRef(false);
  return (
    <button
      type="button"
      className="googleButton"
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(fontSize ? { fontSize } : {}),
      }}
      disabled={disabled}
      onClick={async () => {
        if (disabled || clickedRef.current) return;
        clickedRef.current = true;
        setDisabled(true);

        try {
          await loginWithGoogle();
        } catch (err) {
          setDisabled(false);
          clickedRef.current = false;
        }
      }}
    >
      {disabled === false && (
        <img
          className="iconGoogle"
          src="/img/icons/iconGoogle.svg"
          alt="Icono del logo de google"
        />
      )}

      {disabled ? (
        <div>
          <BeatLoader size={10} color="#ed3636" />
        </div>
      ) : (
        "Iniciar sesión con Google"
      )}
    </button>
  );
};
