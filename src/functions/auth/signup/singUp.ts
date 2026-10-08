import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { userPool } from "../../../aws/cognitoConfig";
import axios from "axios";
import { config } from "../../../config/config";

//Mensaje de error para iniciar el manejo del registro

const cognitoErrorMessages: Record<string, string> = {
  UsernameExistsException: "El usuario ya existe. Intenta usar otro correo.",
  InvalidPasswordException:
    "La contraseña no cumple con los requisitos. Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
  InvalidParameterException:
    "Hay un parámetro inválido. Verifica los datos ingresados.",
  UserLambdaValidationException:
    "No se pudo validar el usuario. Puede que haya una restricción adicional en el registro.",
  TooManyRequestsException:
    "Se realizaron demasiadas solicitudes en poco tiempo. Intenta nuevamente más tarde.",
  LimitExceededException:
    "Se ha alcanzado el límite de intentos de registro. Intenta más tarde.",
  NotAuthorizedException:
    "No estás autorizado para realizar esta acción. Contacta al soporte.",
  InternalErrorException:
    "Hubo un error interno. Por favor, intenta nuevamente más tarde.",
};

//Funcion para iniciar el registro

export const signUp = async (
  name: string,
  username: string,
  email: string,
  password: string,
): Promise<void> => {
  try {
    const attributeList: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "custom:role", Value: "client" }),
    ];

    await new Promise<void>((resolve, reject) => {
      userPool.signUp(
        username,
        password,
        attributeList,
        [],
        async (err, result) => {
          if (err) {
            const message =
              (err as any).name && cognitoErrorMessages[(err as any).name]
                ? cognitoErrorMessages[(err as any).name]
                : "Ocurrió un error al registrar el usuario. Intenta nuevamente.";
            return reject(new Error(message));
          }
          const userId = result?.userSub;
          try {
            await axios.post(`${config.API_URL}/create-user`, {
              name: name,
              uid: userId,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Error desconocido durante el registro.");
  }
};
