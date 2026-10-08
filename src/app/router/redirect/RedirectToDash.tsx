import { Navigate } from "react-router-dom";
import { objectRoutes } from "../routes";

export const RedirectToDashboard = () => {
  return <Navigate to={objectRoutes.dashboard} replace />;
};
