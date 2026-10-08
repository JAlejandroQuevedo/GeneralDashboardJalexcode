import { fetchAuthSession, getCurrentUser } from "@aws-amplify/auth";

export async function handleGoogleCallback() {
  try {
    await fetchAuthSession();

    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error("Error procesando callback de Google:", error);
    throw error;
  }
}
