import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../../aws/cognitoConfig";

//Mensajes de error para el forget

const cognitoForgotPasswordErrors: Record<string, string> = {
  UserNotFoundException:
    "El usuario no fue encontrado. Verifica tu correo electrónico.",
  InvalidParameterException: "El correo ingresado es inválido o malformado.",
  LimitExceededException:
    "Has excedido el número de intentos. Intenta más tarde.",
  TooManyRequestsException:
    "Demasiadas solicitudes. Por favor, espera un momento e inténtalo de nuevo.",
  NotAuthorizedException:
    "El usuario aún no ha sido confirmado. Confirma tu cuenta antes de restablecer la contraseña.",
  InternalErrorException: "Ocurrió un error interno. Intenta más tarde.",
};

//Funcion para solicitar el restablecimiento de contraseña
export const forgotPassword = async (email: string) => {
  try {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    await new Promise<void>((resolve, reject) => {
      user.forgotPassword({
        onSuccess: () => resolve(),
        onFailure: (err) => {
          const message =
            (err as any).name && cognitoForgotPasswordErrors[(err as any).name]
              ? cognitoForgotPasswordErrors[(err as any).name]
              : "No se pudo iniciar el proceso de restablecimiento. Intenta nuevamente.";
          reject(new Error(message));
        },
      });
    });
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(
          "Error desconocido al iniciar el restablecimiento de contraseña."
        );
  }
};
