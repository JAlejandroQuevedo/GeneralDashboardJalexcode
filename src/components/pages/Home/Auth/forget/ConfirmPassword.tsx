import { useForm } from "react-hook-form";
import { AuthBody } from "../components/AuthBody";
import { AuthForm } from "../components/AuthForm";
import {
  forgotConfirmationPasswordSchema,
  type ForgotConfirmationPasswordFormType,
} from "../../../../../types/form/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputPassword } from "../../../../common/inputs/input/InputPassword";
import { useState } from "react";
import { PrimaryButton } from "../../../../common/buttons/primary/PrimaryButton";
import { confirmPassword } from "../../../../../functions/auth/recovery/confirmPassword";
import {
  useVerificationCodeReset,
  useVerificationEmailStore,
} from "../../../../../stores/auth/ForgotPasswordStore";
import { Navigate, useNavigate } from "react-router-dom";
import { ShowError } from "../../../../common/error/ShowError";
import { objectRoutes } from "../../../../../app/router/routes";
import useDocumentSEO from "../../../../../hooks/useDocumentSEO";

export const ConfirmPassword = () => {
  //Navegacion

  const navigate = useNavigate();

  //Manejo del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotConfirmationPasswordFormType>({
    resolver: zodResolver(forgotConfirmationPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  //States para enviar el reset

  const { code } = useVerificationCodeReset();
  const { email } = useVerificationEmailStore();

  //Navegacion si los states no existen
  if (email === "") {
    return <Navigate to={objectRoutes.forgetPassword} replace />;
  }
  if (code === "") {
    return <Navigate to={objectRoutes.forgetPassword} replace />;
  }
  //Manejo de errores
  const [error, setError] = useState<string>();
  //Funcion par manejar la data del form
  const handleConfirm = async (data: ForgotConfirmationPasswordFormType) => {
    try {
      setError("");
      if (data.password === data.confirmPassword) {
        const password = data.password;
        await confirmPassword(email, code, password);

        setTimeout(() => {
          navigate(`${objectRoutes.login}?successpassword=true`, {
            replace: true,
          });
        }, 50);

        reset();
      } else {
        setError("Las contraseñas no son identicas");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };
  useDocumentSEO({
    title: "Actualiza tu contraseña",
  });
  return (
    <>
      <AuthBody>
        <AuthForm
          title="Nueva contraseña"
          subtitle="Crea una nueva contraseña para acceder a tu cuenta."
          linkContent="Inicia sesión"
          linkText="¿Sabes tu contraseña?"
          linkTo={objectRoutes.login}
        >
          <form className="formAuth" onSubmit={handleSubmit(handleConfirm)}>
            <InputPassword
              id="password"
              label="Contraseña"
              errors={errors}
              placeholder="**************"
              register={register}
              width="90%"
              height="62px"
            />
            <InputPassword
              id="confirmPassword"
              label="Confirmar contraseña"
              errors={errors}
              placeholder="**************"
              register={register}
              width="90%"
              height="62px"
            />{" "}
            {error && error !== "El código ingresado es incorrecto." && (
              <ShowError
                title="Error al restablecer la contraseña"
                message={error || ""}
                width="90%"
                margin="0 0 20px 0"
              />
            )}
            {error === "El código ingresado es incorrecto." && (
              <ShowError
                title="Error al intentar restablecer la contraseña"
                message={error || ""}
                width="90%"
                margin="0 0 20px 0"
                linkMessage="Ingresar nuevamente"
                linkRoute={objectRoutes.verificationForget}
                showLink={true}
              />
            )}
            <PrimaryButton
              width="90%"
              height="62px"
              text="Enviar"
              fontSize="16px"
              disabled={isSubmitting}
            />
          </form>
        </AuthForm>
      </AuthBody>
    </>
  );
};
