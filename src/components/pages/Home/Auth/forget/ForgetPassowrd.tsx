import { useForm } from "react-hook-form";
import { AuthBody } from "../components/AuthBody";
import { AuthForm } from "../components/AuthForm";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormType,
} from "../../../../../types/form/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "../../../../common/inputs/input/InputText";
import { PrimaryButton } from "../../../../common/buttons/primary/PrimaryButton";
import { useVerificationEmailStore } from "../../../../../stores/auth/ForgotPasswordStore";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../../../functions/auth/recovery/forgotPassword";
import { useState } from "react";
import { objectRoutes } from "../../../../../app/router/routes";
import useDocumentSEO from "../../../../../hooks/useDocumentSEO";
import { useResponsive } from "../../../../../constants/reactResponsive";

export const ForgetPassowrd = () => {
  useDocumentSEO({
    title: "Recuperación de contraseña",
    description: "Recuperación de contraseña",
  });

  //Use responsive

  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  //Manejo del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  //Manejo de errores
  const [error, setError] = useState<string>();
  //Manejo de la navegacion
  const navigate = useNavigate();
  //Set email en el store
  const { setEmail } = useVerificationEmailStore();
  const handleForgotPassword = async (data: ForgotPasswordFormType) => {
    try {
      setError("");
      const email = data.email;
      setEmail(email);
      await forgotPassword(email);
      reset();
      navigate(objectRoutes.verificationForget);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };
  return (
    <>
      <AuthBody>
        <AuthForm
          title="¿Olvidaste tu contraseña?"
          subtitle="Ingresa el correo asociado a tu cuenta y te enviaremos instrucciones para recuperarla."
          linkContent="Inicia sesión"
          linkText="¿Sabes tu contraseña?"
          linkTo={objectRoutes.login}
        >
          <form
            className="formAuth"
            onSubmit={handleSubmit(handleForgotPassword)}
          >
            <InputText
              id="email"
              type="email"
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              register={register}
              errors={errors}
              width={isSmall ? "100%" : "90%"}
              height="62px"
            />
            <div className="errorContainer">
              {error && <span className="errorMsg">{error}</span>}
            </div>
            <PrimaryButton
              width={isSmall ? "100%" : "90%"}
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
