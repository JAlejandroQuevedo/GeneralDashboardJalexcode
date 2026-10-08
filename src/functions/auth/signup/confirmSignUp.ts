import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../../aws/cognitoConfig";

//Mensajes de error para confirmar el registro

const cognitoConfirmErrors: Record<string, string> = {
  CodeMismatchException:
    "El código ingresado es incorrecto. Verifica e intenta nuevamente.",
  ExpiredCodeException: "El código ha expirado. Solicita uno nuevo.",
  UserNotFoundException:
    "El usuario no fue encontrado. Verifica el correo ingresado.",
  NotAuthorizedException:
    "El usuario ya fue confirmado. Intenta iniciar sesión.",
  LimitExceededException:
    "Has excedido el número de intentos. Intenta más tarde.",
  TooManyFailedAttemptsException:
    "Demasiados intentos fallidos. Intenta nuevamente en unos minutos.",
  InternalErrorException: "Ocurrió un error interno. Intenta más tarde.",
};

//Funcion para manejar el registro del usuario

export const confirmSignUp = async (
  username: string,
  code: string,
): Promise<void> => {
  try {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    await new Promise<void>((resolve, reject) => {
      user.confirmRegistration(code, true, (err) => {
        if (err) {
          const message =
            (err as any).name && cognitoConfirmErrors[(err as any).name]
              ? cognitoConfirmErrors[(err as any).name]
              : "No se pudo confirmar el registro. Intenta nuevamente.";
          return reject(new Error(message));
        }
        resolve();
      });
    });
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Error desconocido al confirmar el registro.");
  }
};
