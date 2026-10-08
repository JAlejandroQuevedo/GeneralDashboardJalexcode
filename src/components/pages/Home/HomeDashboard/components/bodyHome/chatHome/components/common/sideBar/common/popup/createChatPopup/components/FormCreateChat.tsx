import { Dropdown } from "../../../../../../../../../../../../../common/inputs/dropdowns/Dropdown";
import { InputText } from "../../../../../../../../../../../../../common/inputs/input/InputText";
import { useConstants } from "../../../../../../../../../../../../../../constants/useConstants";
import type { FormCreateChatTypeProps } from "../../../../../../../../../../../../../../types/form/inputsType";

export const FormCreateChat = ({
  control,
  errors,
  register,
}: FormCreateChatTypeProps) => {
  const { countryCodeOptions } = useConstants();

  return (
    <>
      <div className="form-inputs-container-chat">
        <InputText
          id="name"
          label="Nombre del cliente"
          dinamicFontSizeMobile="12px"
          type="text"
          width="100%"
          height="50px"
          placeholder="Juan Pérez"
          register={register}
          errors={errors}
        />
      </div>
      <div className="form-inputs-container-chat">
        <div className="phone-input-group">
          <Dropdown
            id="countryCode"
            label="Lada"
            options={countryCodeOptions}
            control={control}
            errors={errors}
            placeholder="🇲🇽 +52"
            width="135px"
          />

          <div className="phone-input-wrapper">
            <InputText
              id="phoneNumber"
              label="Número de teléfono"
              dinamicFontSizeMobile="12px"
              type="text"
              width="100%"
              height="50px"
              placeholder="6731152041"
              register={register}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </>
  );
};
