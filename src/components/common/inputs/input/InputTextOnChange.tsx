import type { Path } from "react-hook-form";
import type { InputProps } from "../../../../types/form/inputsType";

export const InputTextOnChange = <T extends Record<string, any>>({
  label,
  id,
  type,
  placeholder,
  register,
  setValue,
  watch,
  errors,
  customError,
  disabled,
  width,
  height,
}: InputProps<T> & {
  setValue: (
    name: Path<T>,
    value: any,
    options?: { shouldValidate?: boolean }
  ) => void;
  watch: (name: Path<T>) => any;
}) => {
  const fieldError = errors[id] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;
  const value = watch(id);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValue(id, raw as any, { shouldValidate: true });
  };
  return (
    <div className="inputsContainers">
      <label className="labelText" htmlFor={id}>
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
        value={value}
        {...register(id)}
        className={errorMessage || customError ? "errorInput" : "inputText"}
        onChange={handleChange}
      />
      {errorMessage && <span className="errorMsg">{errorMessage}</span>}
    </div>
  );
};
