import { fetchAuthSession, signIn, signOut } from "aws-amplify/auth";
import type { LoginType } from "../../types";
import { useLoadingStore } from "../../stores/auth/LoadingStore";
import { useAuthStore } from "../../stores/userStore";
import { useSelectedStore } from "../../stores/auth/LateralMenuStore";
export const useAuth = () => {
  const { setLoading } = useLoadingStore();
  const { setUser } = useAuthStore();

  //Funcion para hacer login
  const login = async ({ emailUsername, password }: LoginType) => {
    try {
      const response = await signIn({ username: emailUsername, password });
      if (response.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        throw {
          name: "UserNotConfirmedException",
          message: "Usuario no confirmado.",
        };
      }

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) throw new Error("No se pudo obtener el token");

      return {
        success: true,
      };
    } catch (error) {
      throw error;
    }
  };

  //Funcion para cerrar sesion
  const { setSelected } = useSelectedStore();

  const logout = async () => {
    setLoading(true);
    try {
      await signOut();

      setUser(null);
      setSelected("Dashboard");

      return true;
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return { login, logout };
};
