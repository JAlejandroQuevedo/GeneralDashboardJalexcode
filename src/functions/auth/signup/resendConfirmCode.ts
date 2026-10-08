import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../../aws/cognitoConfig";

//Manejo de errores para reenviar el codigo de confirmacion

const cognitoResendErrors: Record<string, string> = {
  UserNotFoundException: "El usuario no existe. Verifica el correo ingresado.",
  InvalidParameterException:
    "Hay un error con los datos enviados. Revisa el correo.",
  LimitExceededException:
    "Has alcanzado el límite de intentos. Intenta más tarde.",
  TooManyRequestsException:
    "Se realizaron demasiadas solicitudes en poco tiempo. Espera un momento e intenta de nuevo.",
  NotAuthorizedException:
    "El usuario ya fue confirmado. Intenta iniciar sesión.",
  InternalErrorException: "Ocurrió un error interno. Intenta nuevamente.",
};

//Funcion para reenviar el codigo de confirmacion

export const resendConfirmationCode = async (
  username: string,
): Promise<void> => {
  try {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    await new Promise<void>((resolve, reject) => {
      user.resendConfirmationCode((err) => {
        if (err) {
          const message =
            (err as any).name && cognitoResendErrors[(err as any).name]
              ? cognitoResendErrors[(err as any).name]
              : "No se pudo reenviar el código. Intenta nuevamente.";
          return reject(new Error(message));
        }
        resolve();
      });
    });
  } catch (error) {
    console.error(error);
    throw error instanceof Error
      ? error
      : new Error("Error desconocido al reenviar el código.");
  }
};
