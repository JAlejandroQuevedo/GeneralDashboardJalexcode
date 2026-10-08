import type { CSSProperties } from "react";
import type { InputProps } from "../../../../types/form/inputsType";

export const InputText = <T extends Record<string, any>>({
  label,
  id,
  type,
  placeholder,
  register,
  errors,
  customError,
  disabled,
  width,
  height,
  onChange,
  dinamicFontSizeMobile,
}: InputProps<T>) => {
  const fieldError = errors[id] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;
  return (
    <>
      <div className="inputsContainers">
        <label
          style={
            {
              "--dinamic-font-size-mobile": dinamicFontSizeMobile
                ? dinamicFontSizeMobile
                : "16px",
            } as CSSProperties
          }
          className="labelText"
          htmlFor={id}
        >
          {label}
        </label>
        <input
          style={
            {
              ...(width ? { ["--w" as any]: width } : {}),
              ...(height ? { ["--h" as any]: height } : {}),
            } as React.CSSProperties
          }
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
          className={errorMessage || customError ? "errorInput" : "inputText"}
          onChange={onChange}
        />
        {errorMessage && <span className="errorMsg">{errorMessage}</span>}
      </div>
    </>
  );
};
