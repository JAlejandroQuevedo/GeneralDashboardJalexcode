import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState, type CSSProperties } from "react";
import type { UserFormProps } from "../../../../../../../types/home/dashboardTypes";
import {
  userSchema,
  type UserFormType,
} from "../../../../../../../types/form/userForm";
import { useAuthStore } from "../../../../../../../stores/userStore";
import { generateCognitoPassword } from "../../../../../../../functions/generatePassword";
import { InputText } from "../../../../../../common/inputs/input/InputText";
import { InputPassword } from "../../../../../../common/inputs/input/InputPassword";
import { GeneratePasswordButton } from "../../../../../../common/buttons/oAuth/GeneratePasswordButton";
import { Dropdown } from "../../../../../../common/inputs/dropdowns/Dropdown";
import { DiscardButton } from "../../../../../../common/buttons/warnings/DiscardButton";
import { PrimaryButton } from "../../../../../../common/buttons/primary/PrimaryButton";

export const UserFormComponent = ({
  initialValues,
  onSubmitAction,
  handleDiscard,
  isLoading = false,
  error,
  isDiscardVisible = true,
  isElementsVisible = true,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    values: initialValues,
    defaultValues: {
      email: "",
      role: "",
      name: "",
      username: "",
    },
  });
  //Obtener la data del usuario

  const { user } = useAuthStore();
  const currentRole = user?.role || "staff";
  //Herramienta pra el boton de generar password

  const [passwordButtonState, setPasswordButtonState] = useState<
    "Generar" | "Copiar" | "¡Copiado!"
  >("Generar");

  const handlePasswordAction = async () => {
    if (passwordButtonState === "Generar") {
      const newPassword = generateCognitoPassword();
      setValue("password", newPassword, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setPasswordButtonState("Copiar");
    } else if (passwordButtonState === "Copiar") {
      const currentPassword = getValues("password");
      if (currentPassword) {
        await navigator.clipboard.writeText(currentPassword);
        setPasswordButtonState("¡Copiado!");
        setTimeout(() => {
          setPasswordButtonState("Copiar");
        }, 2000);
      }
    }
  };
  //Opciones para los roles del dropdown
  const allowedRolesMap: Record<string, { value: string; label: string }[]> = {
    "super-admin": [
      { value: "super-admin", label: "Super Administrador" },
      { value: "admin", label: "Administrador" },
      { value: "staff", label: "Asesor" },
      { value: "user", label: "Usuario" },
    ],
    admin: [
      { value: "staff", label: "Asesor" },
      { value: "user", label: "Usuario" },
    ],
    staff: [{ value: "user", label: "Usuario" }],
  };

  //Logica para mostrar el boton y cuando no mostrarlo

  const showButton = () => {
    if (user?.role === "super-admin") {
      return true;
    } else if (user?.role === "staff" && initialValues?.role === "user") {
      return true;
    } else if (user?.role === "admin" && initialValues?.role === "staff") {
      return true;
    } else if (user?.role === "admin" && initialValues?.role === "user") {
      return true;
    } else {
      return false;
    }
  };
  const roleOptions = allowedRolesMap[currentRole] || [];

  return (
    <form className="userForm" onSubmit={handleSubmit(onSubmitAction)}>
      <div className="bodyUserForm">
        <div className="form-inputs-container">
          <InputText
            id="name"
            label="Nombre Completo"
            dinamicFontSizeMobile="12px"
            type="text"
            width="100%"
            height="50px"
            placeholder="Juan Pérez"
            register={register}
            errors={errors}
          />
          <InputText
            id="username"
            width="100%"
            height="50px"
            label="Nombre de Usuario"
            dinamicFontSizeMobile="12px"
            type="text"
            placeholder="juanperez99"
            disabled={!!initialValues}
            register={register}
            errors={errors}
          />
        </div>
        <div className="form-inputs-container">
          <InputText
            id="email"
            width="100%"
            height="50px"
            dinamicFontSizeMobile="12px"
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@correo.com"
            register={register}
            errors={errors}
          />

          <div
            style={
              {
                "--dinamic-width": isDiscardVisible ? "80%" : "100%",
              } as CSSProperties
            }
            className="input-password-container"
          >
            {isElementsVisible && (
              <>
                <InputPassword
                  id="password"
                  width="100%"
                  height="50px"
                  label="Contraseña"
                  placeholder="pasword123"
                  register={register}
                  errors={errors}
                />
                <GeneratePasswordButton
                  passwordButtonState={passwordButtonState}
                  handlePasswordAction={handlePasswordAction}
                />
              </>
            )}
          </div>
        </div>
        <div className="form-inputs-container">
          {isElementsVisible && (
            <Dropdown
              width="100%"
              height="50px"
              id="role"
              label="Rol del Usuario"
              options={roleOptions}
              control={control}
              errors={errors}
              placeholder="Selecciona un rol"
            />
          )}
        </div>
        {error ? (
          <div
            style={{ "--dinamic-align": "center" } as CSSProperties}
            className="form-inputs-container-chat"
          >
            <div className="error-container">
              <img src="/img/icons/warning_icon.svg" alt="" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
        {showButton() && (
          <div
            style={
              {
                "--dinamic-align": isDiscardVisible
                  ? "space-between"
                  : "center",
              } as CSSProperties
            }
            className={`form-buttons-container`}
          >
            {isDiscardVisible && (
              <DiscardButton
                onClick={handleDiscard}
                width={isDiscardVisible ? "30%" : "800px"}
                height="50px"
              />
            )}

            <PrimaryButton
              text={initialValues ? "Actualizar Usuario" : "Crear Usuario"}
              type="submit"
              width={isDiscardVisible ? "30%" : "80%"}
              height="50px"
              disabled={isSubmitting || isLoading}
            />
          </div>
        )}
      </div>
    </form>
  );
};
