import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthBody } from "./components/AuthBody";
import { AuthForm } from "./components/AuthForm";
import { InputPassword } from "../../../common/inputs/input/InputPassword";
import { useForm } from "react-hook-form";
import { authSchema, type AuthFormType } from "../../../../types/form/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "../../../common/inputs/input/InputText";
import { PrimaryButton } from "../../../common/buttons/primary/PrimaryButton";
import type { LoginType } from "../../../../types";
import { ShowError } from "../../../common/error/ShowError";
import { objectRoutes } from "../../../../app/router/routes";
import { useErrorHandler } from "../../../../error/useErrorHandler";
import { useAuth } from "../../../../functions/auth/useAuth";
import { useEffect, useState, type KeyboardEvent } from "react";
import useDocumentSEO from "../../../../hooks/useDocumentSEO";
import { ShowSuccess } from "../../../common/error/ShowSuccess";
import { usePlatformType } from "../../../../stores/homeStore";

export const LoginScreen = () => {
  //Query de success
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [successPassword, setSuccessPassword] = useState<string | null>();
  const { type, setType } = usePlatformType();

  useEffect(() => {
    const successParam = queryParams.get("successpassword");
    const type = queryParams.get("role-type");

    setSuccessPassword(successParam);
    setType(type || "");
  }, [search]);
  //Hook de login
  const { login } = useAuth();
  //Manejo de errores
  const { getError } = useErrorHandler();
  //Params para manejo de success

  //User
  //Error de autenticación
  const [error, setError] = useState("");

  //Navegación
  const navigate = useNavigate();

  //Manejo del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormType>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  //Funcion para manejar el inicio de sesión
  const handleLogin = async (data: AuthFormType) => {
    try {
      const user: LoginType = {
        emailUsername: data.username,
        password: data.password,
      };

      const loginResponse = await login(user);
      if (loginResponse.success) {
        navigate(objectRoutes.dashboard, { replace: true });
      }
      reset();
    } catch (err) {
      navigate(objectRoutes.login, { replace: true });
      // Manejo de errores
      console.error(err);

      const message = getError(err);
      setError(message);
    }
  };

  //Manejo de envio mediante tecla enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(handleLogin)();
    }
  };
  //Title de seccion
  const descriptionSEO =
    type === "user"
      ? "Accede al panel de usuario de TuAliadoSeguro"
      : "Accede al panel de administración de TuAliadoSeguro";
  useDocumentSEO({
    title: "Iniciar sesión - Dashboard",
    description: descriptionSEO,
  });
  return (
    <>
      <AuthBody>
        <AuthForm>
          <form className="formAuth" onSubmit={handleSubmit(handleLogin)}>
            <InputText
              id="username"
              type="username"
              label="Correo electrónico o nombre de usuario"
              placeholder="ejemplo@correo.com/ejemplousuario"
              register={register}
              dinamicFontSizeMobile="12px"
              errors={errors}
              customError={error}
              width="90%"
              height="62px"
            />
            <InputPassword
              id="password"
              label="Contraseña"
              errors={errors}
              customError={error}
              placeholder="**************"
              register={register}
              width="90%"
              height="62px"
              onKeyDown={handleKeyDown}
            />
            {type === "user" && (
              <div className="forgotPassword">
                <Link to={objectRoutes.forgetPassword}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            {successPassword === "true" ? (
              <ShowSuccess
                title="¡Restablecimiento exitoso!"
                message="Inicie sesión para continuar."
                width="90%"
                height="82px"
                margin="0 0 10px 0"
              />
            ) : null}
            {error && (
              <ShowError
                title="Error al intentar ingresar"
                message={error}
                width="90%"
                margin="0 0 10px 0"
              />
            )}
            <PrimaryButton
              width="90%"
              height="62px"
              text="Iniciar sesión"
              disabled={isSubmitting}
            />
          </form>
        </AuthForm>
      </AuthBody>
    </>
  );
};
