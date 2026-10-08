import { Navigate, Outlet, useLocation } from "react-router-dom";
import { objectRoutes } from "../routes";
import { useCheckAuth } from "../../../hooks/useCheckAuth";
import { BeatLoader } from "react-spinners";
import { useAuthStore } from "../../../stores/userStore";
import { useEffect, useRef } from "react";

export const ProtectedLayoutAuth = () => {
  const { isAuthenticated, isLoading } = useCheckAuth();

  const { user } = useAuthStore();
  const location = useLocation();

  const lastRoleRef = useRef<string | undefined>(user?.role);

  useEffect(() => {
    if (user?.role) {
      lastRoleRef.current = user.role;
    }
  }, [user]);

  if (isLoading)
    return (
      <div className="loader-card-desktop">
        <BeatLoader size={20} color="#85b6ff" />
      </div>
    );

  if (isAuthenticated) {
    return <Outlet />;
  }

  const customQueryParam =
    lastRoleRef.current === "user" ? "?role-type=user" : "";
  const finalSearch = location.search || customQueryParam;

  return <Navigate to={`${objectRoutes.login}${finalSearch}`} replace />;
};
