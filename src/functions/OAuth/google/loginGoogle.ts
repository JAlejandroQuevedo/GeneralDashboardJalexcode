import { signInWithRedirect } from "@aws-amplify/auth";
import { mapLoginWithGoogleError } from "../errors/errorManage";

export async function loginWithGoogle() {
  try {
    await signInWithRedirect({ provider: "Google" });
  } catch (error) {
    const err = mapLoginWithGoogleError(error);
    console.error(err);
    throw error;
  }
}
