import type { Path } from "react-hook-form";
import type { InputProps } from "../../../../types/form/inputsType";

export const InputCurrency = <T extends Record<string, any>>({
  label,
  id,
  placeholder,
  register,
  errors,
  customError,
  disabled,
  width,
  height,
  setValue,
  watch,
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

  const formatCurrency = (val: string) => {
    const numericValue = val.replace(/\D/g, "");
    if (!numericValue) return "";
    const number = parseInt(numericValue, 10);
    return `$${number.toLocaleString("en-US")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatCurrency(raw);
    setValue(id, formatted as any, { shouldValidate: true });
  };

  return (
    <div className="inputsContainers">
      <label className="labelCurrency" htmlFor={id}>
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
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        {...register(id)}
        onChange={handleChange}
        className={
          errorMessage || customError ? "errorInputCurrency" : "inputCurrency"
        }
      />
      {errorMessage && <span className="errorMsg">{errorMessage}</span>}
    </div>
  );
};
