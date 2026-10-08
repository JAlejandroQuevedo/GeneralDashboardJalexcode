import type { CheckboxProps } from "../../../../types/form/inputsType";

export const Checkbox = <T extends Record<string, any>>({
  id,
  label,
  register,
  errors,
  disabled = false,
}: CheckboxProps<T>) => {
  const fieldError = errors[id] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;
  return (
    <div className="checkboxWrapper">
      <label className={disabled ? "checkboxLabel disabled" : "checkboxLabel"}>
        <input
          type="checkbox"
          {...register(id)}
          disabled={disabled}
          className={fieldError ? "checkboxError" : ""}
        />
        <span className="checkmark"></span> {/* custom visual */}
        {label}
      </label>

      {fieldError && <span className="errorMsg">{errorMessage}</span>}
    </div>
  );
};
