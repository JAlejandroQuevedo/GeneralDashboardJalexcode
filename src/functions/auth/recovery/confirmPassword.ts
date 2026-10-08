import { CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "../../../aws/cognitoConfig";

//Mensajes de error para la confirmacion de la contraseña

const cognitoConfirmPasswordErrors: Record<string, string> = {
  CodeMismatchException: "El código ingresado es incorrecto.",
  ExpiredCodeException: "El código ha expirado. Solicita uno nuevo.",
  InvalidPasswordException:
    "La nueva contraseña no cumple con los requisitos. Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
  InvalidParameterException:
    "Uno o más campos son inválidos. Verifica tu correo y el código.",
  UserNotFoundException:
    "El usuario no fue encontrado. Verifica el correo ingresado.",
  LimitExceededException:
    "Has excedido el número de intentos. Intenta más tarde.",
  TooManyFailedAttemptsException:
    "Demasiados intentos fallidos. Intenta nuevamente más tarde.",
  InternalErrorException: "Ocurrió un error interno. Intenta más tarde.",
  PasswordHistoryPolicyViolationException:
    "La contraseña ya ha sido utilizada anteriormente",
};

//Funcion para manejar la confirmacion de la contraseña

export const confirmPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  try {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    await new Promise<void>((resolve, reject) => {
      user.confirmPassword(code, newPassword, {
        onSuccess: () => resolve(),
        onFailure: (err) => {
          const message =
            (err as any).name && cognitoConfirmPasswordErrors[(err as any).name]
              ? cognitoConfirmPasswordErrors[(err as any).name]
              : "No se pudo actualizar la contraseña. Intenta nuevamente.";
          reject(new Error(message));
        },
      });
    });
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Error desconocido al cambiar la contraseña.");
  }
};
