//Manejo de erroes para oAuth

export const amplifyRedirectErrorMessages: Record<string, string> = {
  OAuthNotConfigureException:
    "La configuración de OAuth/Hosted UI es inválida o está incompleta. Revisa callback URLs, sign-out URLs y dominios permitidos en Cognito.",

  AuthTokenConfigException:
    "La configuración del User Pool es inválida. Verifica el ID del User Pool, el App Client y su configuración de tokens.",
};

//Funcion para mappear los errores

export function mapLoginWithGoogleError(error: unknown): Error {
  if (error && typeof error === "object" && "name" in error) {
    const name = (error as { name?: string }).name || "";
    const mapped =
      (name && amplifyRedirectErrorMessages[name]) ||
      (error as { message?: string }).message;

    if (mapped) return new Error(mapped);
  }

  return new Error(
    "No se pudo iniciar el flujo con Google. Intenta nuevamente más tarde."
  );
}
