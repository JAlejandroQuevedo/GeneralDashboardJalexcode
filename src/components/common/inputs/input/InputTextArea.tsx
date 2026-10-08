import type { CSSProperties, FormEvent } from "react";
import type { InputProps } from "../../../../types/form/inputsType";

export const TextArea = <T extends Record<string, any>>({
  label,
  id,
  placeholder,
  register,
  disabled,
  width,
  height,
  onKeyDownTextArea,
}: InputProps<T>) => {
  const handleAutoResize = (e: FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto"; // 1. Resetea la altura para saber si el usuario borró texto
    target.style.height = `${target.scrollHeight}px`; // 2. Le asigna el alto exacto del texto
  };
  return (
    <div className="inputsContainers">
      {label && (
        <label className="labelText" htmlFor={id}>
          {label}
        </label>
      )}

      <textarea
        style={
          {
            ...(width ? { ["--w" as any]: width } : {}),
            ...(height ? { ["--h" as any]: height } : {}),
          } as CSSProperties
        }
        onInput={handleAutoResize}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        {...register(id)}
        className={"input-text-area"}
        onKeyDown={onKeyDownTextArea}
        rows={1}
      />

      {/* {errorMessage && <span className="errorMsg">{errorMessage}</span>} */}
    </div>
  );
};
