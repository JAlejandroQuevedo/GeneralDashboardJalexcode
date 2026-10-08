import { useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useLoadingStore } from "../stores/auth/LoadingStore";
import { useAuthStore, type userAuthType } from "../stores/userStore";
import { useApiToken } from "./useApiToken";

export const useCheckAuth = () => {
  // 1. Obtenemos el usuario del store global
  const { user, setUser } = useAuthStore();
  const { setLoading, isLoading } = useLoadingStore();
  const { getApiToken } = useApiToken();

  const isAuthenticated = !!user;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const checkCognitoSession = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (idToken) {
          const sbData = await getApiToken({
            url: "auth-token",
            token: idToken,
            responseKey: "supabaseData",
          });

          const sbToken = sbData?.supabaseToken;
          const role = sbData?.role;
          const uuId = sbData?.uuid;

          if (!sbToken)
            throw new Error("Faltan datos del backend para Supabase");

          if (isMounted) {
            const userData: userAuthType = {
              uuId: uuId,
              role: role,
              supabaseToken: sbToken,
            };
            setUser(userData);
          }
        } else {
          throw new Error("No hay sesión activa");
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkCognitoSession();

    const stopHubListener = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "tokenRefresh":
          checkCognitoSession();
          break;
        case "signedOut":
        case "tokenRefresh_failure":
          if (isMounted) setUser(null);
          break;
      }
    });

    return () => {
      isMounted = false;
      stopHubListener();
    };
  }, [setLoading, setUser]);

  return { isAuthenticated, isLoading };
};
