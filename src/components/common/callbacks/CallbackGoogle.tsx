import { useEffect } from "react";
import { handleGoogleCallback } from "../../../functions/OAuth/google/handleGoogleCallback";
import { useNavigate } from "react-router-dom";
import { Loader } from "../loader/Loader";
import { objectRoutes } from "../../../app/router/routes";

export const CallbackGoogle = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        await handleGoogleCallback();
        navigate(objectRoutes.dashboard, { replace: true });
      } catch {
        navigate(`${objectRoutes.login}?errorgoogle=auth`, { replace: true });
      }
    })();
  }, [navigate]);
  return <Loader />;
};
