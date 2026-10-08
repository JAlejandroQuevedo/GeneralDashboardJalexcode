import axios from "axios";

export const useErrorHandler = () => {
  const getError = (err: unknown) => {
    let message = "Error al iniciar sesión. Intenta nuevamente.";
    if (err && typeof err === "object" && "name" in err) {
      const errorName = (err as { name: string }).name;
      if (errorName === "UserNotFoundException") {
        message = "Usuario no encontrado. Verifica tu correo.";
      } else if (errorName === "NotAuthorizedException") {
        message = "Contraseña incorrecta o usuario incorrecto.";
      } else if (errorName === "UserNotConfirmedException") {
        message = "Tu cuenta aún no ha sido confirmada. Revisa tu correo.";
      } else if (errorName === "UserAlreadyAuthenticatedException") {
        message = "Usuario ya autenticado. Intenta cerrar sesión primero.";
      } else if (errorName === "PasswordResetRequiredException") {
        message = "Debes restablecer tu contraseña.";
      } else if (errorName === "TooManyFailedAttemptsException") {
        message = "Demasiados intentos fallidos. Intenta más tarde.";
      } else if (errorName === "InvalidParameterException") {
        message = "Parámetros inválidos. Revisa tus datos.";
      }
    } else {
      message = axios.isAxiosError(err)
        ? err.response?.data?.error || err?.response?.data.body || err.message
        : err instanceof Error
          ? err.message
          : "Error desconocido al conectar con el servidor";
    }

    if (axios.isAxiosError(err)) {
      message =
        err.response?.data?.error ||
        err.response?.data?.body ||
        err.message ||
        "Error desconocido al conectar con el servidor";
    }

    return message;
  };
  return { getError };
};
