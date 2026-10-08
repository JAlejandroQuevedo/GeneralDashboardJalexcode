import type { InputPasswordProps } from "../../../../types/form/inputsType";
import { useState, type CSSProperties } from "react";
import { IconInput } from "../../icons/IconInput";

export const InputPassword = <T extends Record<string, any>>({
  id,
  label,
  placeholder,
  register,
  errors,
  disabled,
  onKeyDown,
  width,
  height,
  customError,
}: InputPasswordProps<T>) => {
  const fieldError = errors[id] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="inputsContainers">
      <label className="labelPassword" htmlFor={id}>
        {label}
      </label>
      <div
        style={
          {
            ...(width ? { ["--w" as any]: width } : {}),
            ...(height ? { ["--h" as any]: height } : {}),
          } as CSSProperties
        }
        className={
          errorMessage || customError ? "errorInputPassword" : "inputPassword"
        }
      >
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="iconButtonEye"
        >
          {showPassword ? (
            <IconInput
              icon="/img/icons/showpassword_icon.svg"
              alt="Mostrar contraseña"
            />
          ) : (
            <IconInput
              icon="/img/icons/hidepassword_icon.svg"
              alt="Ocultar contraseña"
            />
          )}
        </button>
      </div>

      {errorMessage && <span className="errorMsg">{errorMessage}</span>}
    </div>
  );
};
