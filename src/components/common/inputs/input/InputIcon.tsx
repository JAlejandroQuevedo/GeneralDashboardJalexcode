import { CiSearch } from "react-icons/ci";
import type { InputIconProps } from "../../../../types/form/inputsType";

export const InputIcon = <T extends Record<string, any>>({
  id,
  type,
  placeholder,
  register,
  errors,
  disabled,
  onChange,
  width,
  height,
}: InputIconProps<T>) => {
  const fieldError = errors[id] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;
  return (
    <div className="inputsContainers">
      <div className={errors.text ? "errorInputIcon" : "inputIcon"}>
        <CiSearch className="icon" />
        <input
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id)}
          onChange={onChange}
          style={
            {
              ...(width ? { ["--w" as any]: width } : {}),
              ...(height ? { ["--h" as any]: height } : {}),
            } as React.CSSProperties
          }
        />
      </div>
      {errorMessage && <span className="errorMsg">{errorMessage}</span>}
    </div>
  );
};
