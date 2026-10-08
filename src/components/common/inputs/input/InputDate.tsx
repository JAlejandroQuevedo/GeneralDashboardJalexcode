import { Controller } from "react-hook-form";
import type { InputDateProps } from "../../../../types/form/inputsType";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export const InputDate = <T extends Record<string, any>>({
  control,
  errors,
  label,
  name,
  minDate,
  maxDate,
  mode,
  timeIntervals,
  placeholder,
  width,
  showErrors = true,
}: InputDateProps<T>) => {
  const fieldError = errors[name] as { message?: string } | undefined;
  const errorMessage = fieldError?.message;

  const isDateTime = mode === "datetime";
  const isDateOnly = mode === "date";
  const isTimeOnly = mode === "time";
  return (
    <div className="inputsContainers">
      {label && <label className="labelDate">{label}</label>}
      <div
        style={
          {
            ...(width ? { ["--w" as any]: width } : {}),
          } as React.CSSProperties
        }
      >
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={onChange}
              isClearable
              dateFormat={
                isDateOnly
                  ? "dd/MM/yyyy"
                  : isTimeOnly
                  ? "HH:mm"
                  : "dd/MMM/yyyy HH:mm"
              }
              showTimeSelect={isDateTime || isTimeOnly}
              showTimeSelectOnly={isTimeOnly} // <-- SOLO HORA
              timeFormat="HH:mm"
              timeIntervals={timeIntervals}
              placeholderText={
                isDateOnly
                  ? placeholder || "Selecciona fecha"
                  : isTimeOnly
                  ? placeholder || "Selecciona hora"
                  : placeholder || "Selecciona fecha y hora"
              }
              minDate={minDate}
              maxDate={maxDate}
              className={
                showErrors
                  ? errorMessage
                    ? "errorInputDate"
                    : "inputDate"
                  : "inputDate"
              }
            />
          )}
        />
      </div>

      {showErrors
        ? errorMessage && <span className="errorMsg">{errorMessage}</span>
        : null}
    </div>
  );
};
