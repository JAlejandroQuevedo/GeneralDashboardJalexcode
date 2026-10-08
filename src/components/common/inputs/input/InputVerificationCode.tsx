import type { Path } from "react-hook-form";
import type { InputVerificationCodeProps } from "../../../../types/form/inputsType";

export const InputVerificationCode = <T extends Record<string, any>>({
  id,
  index,
  inputRefs,
  register,
  setValue,
  errors,
  customError,
  watch,
}: InputVerificationCodeProps<T>) => {
  const inputRef = inputRefs[index];

  const fieldError = errors[id] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;
  const value = watch(id);

  //Funcion para manejar los cambios del input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      setValue(id, value as any, { shouldValidate: true });
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current?.focus();
      }
    } else {
      setValue(id, "" as any, { shouldValidate: true });
    }
  };

  //Funcion para rellenar la data del portapapeles en el input

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    paste.split("").forEach((char, i) => {
      const ref = inputRefs[i];
      const fieldId = ref.current?.id as Path<T>;
      if (ref && fieldId) {
        setValue(fieldId, char as any, { shouldValidate: true });
      }
    });

    inputRefs[Math.min(paste.length, inputRefs.length - 1)]?.current?.focus();
  };

  return (
    <input
      id={id}
      {...register(id)}
      maxLength={1}
      type="text"
      inputMode="numeric"
      placeholder="-"
      ref={inputRef}
      onChange={handleChange}
      onPaste={handlePaste}
      value={value}
      className={
        errorMessage || customError
          ? "inputVerificationCodeError"
          : "inputVerificationCode"
      }
    />
  );
};
