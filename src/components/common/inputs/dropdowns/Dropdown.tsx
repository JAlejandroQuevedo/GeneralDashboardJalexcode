import { Controller } from "react-hook-form";
import type {
  DropdownFieldProps,
  DropdownOption,
} from "../../../../types/form/inputsType";
import Select from "react-select";

export const Dropdown = <T extends Record<string, any>>({
  label,
  id,
  errors,
  options,
  placeholder = "Selecciona una opción",
  control,
  disabled,
  width,
}: DropdownFieldProps<T>) => {
  const fieldError = errors[id];
  const errorMessage =
    fieldError && "message" in fieldError
      ? (fieldError.message as string)
      : undefined;

  return (
    <div className="inputsContainers">
      <label className="labelDropdown">{label}</label>

      {/* React-Select controlado por React Hook Form */}
      <Controller
        name={id}
        control={control}
        render={({ field }) => {
          const selectedOption = options.find(
            (opt) => opt.value === field.value,
          );

          return (
            <div style={width ? { width } : undefined}>
              <Select
                {...field}
                value={selectedOption || null}
                options={options}
                placeholder={placeholder}
                isDisabled={disabled}
                onChange={(selected) =>
                  field.onChange((selected as DropdownOption)?.value)
                }
                classNamePrefix="rs"
                className={errorMessage ? "errorDropdown" : "inputDropdown"}
              />
            </div>
          );
        }}
      />

      {errorMessage && <span className="errorMsg">{errorMessage}</span>}
    </div>
  );
};
