import { useForm, type Path } from "react-hook-form";
import { AuthBody } from "../components/AuthBody";
import { AuthForm } from "../components/AuthForm";
import {
  verificationForgetSchema,
  type VerificationCodeForgetFormType,
} from "../../../../../types/form/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "../../../../common/buttons/primary/PrimaryButton";
import { Navigate, useNavigate } from "react-router-dom";
import {
  useVerificationCodeReset,
  useVerificationEmailStore,
} from "../../../../../stores/auth/ForgotPasswordStore";
import { forgotPassword } from "../../../../../functions/auth/recovery/forgotPassword";
import { useRef, useState } from "react";
import { InputVerificationCode } from "../../../../common/inputs/input/InputVerificationCode";
import { objectRoutes } from "../../../../../app/router/routes";
import useDocumentSEO from "../../../../../hooks/useDocumentSEO";
import { useResponsive } from "../../../../../constants/reactResponsive";

export const VerificationForgetPassword = () => {
  //Manejo del formulario de verificación
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerificationCodeForgetFormType>({
    resolver: zodResolver(verificationForgetSchema),
    mode: "onChange",
    defaultValues: {
      one: "",
      two: "",
      three: "",
      four: "",
      five: "",
      six: "",
    },
  });
  //Use responsive

  const { isSm, isMd, isLg, isIpadPro } = useResponsive();
  const isSmall = isSm || isMd || isLg || isIpadPro;
  //Ref para el input
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null!),
  );

  //Navegacion

  const navigate = useNavigate();
  //Manejo de errores
  const [error, setError] = useState<string>();
  //Data del state del usuario
  const { email } = useVerificationEmailStore();
  //Set code en el store
  const { setCode } = useVerificationCodeReset();
  //Redireccion si el email no existe
  if (email === "") {
    return <Navigate to={objectRoutes.forgetPassword} replace />;
  }
  //Funcion para manejar la verificación del código
  const handleVerificationCode = async (
    data: VerificationCodeForgetFormType,
  ) => {
    try {
      setError("");
      const verificationCode = `${data.one}${data.two}${data.three}${data.four}${data.five}${data.six}`;
      setCode(verificationCode);
      navigate(objectRoutes.setPassword);
      reset();
    } catch (err) {}
  };
  //Ids para el map del input verification

  const ids = ["one", "two", "three", "four", "five", "six"];

  useDocumentSEO({
    title: "Verifica tu identidad",
  });
  return (
    <>
      <AuthBody>
        <AuthForm
          title="Verifica tu identidad"
          subtitle="Ingresa el código de 6 dígitos que te enviamos por correo electrónico. Si el correo está registrado, recibirás un código de verificación"
          linkContent="Reenviar un código nuevo"
          linkText="¿No recibiste el código? "
          linkTo={objectRoutes.verificationForget}
          onClick={async () => {
            try {
              await forgotPassword(email);
            } catch (err) {
              if (err instanceof Error) {
                setError(err.message);
              }
            }
          }}
        >
          <form
            className="formAuth"
            onSubmit={handleSubmit(handleVerificationCode)}
          >
            <div className="verificationCode">
              {ids.map((id, index) => (
                <InputVerificationCode
                  key={id}
                  id={id as Path<VerificationCodeForgetFormType>}
                  index={index}
                  watch={watch}
                  inputRefs={inputRefs}
                  register={register}
                  setValue={setValue}
                  errors={errors}
                />
              ))}
            </div>
            <div className="errorContainer">
              {error && <span className="errorMsg">{error}</span>}
            </div>
            <PrimaryButton
              width={isSmall ? "100%" : "67%"}
              height="62px"
              text="Confirmar"
              fontSize="16px"
              disabled={isSubmitting}
            />
          </form>
        </AuthForm>
      </AuthBody>
    </>
  );
};
