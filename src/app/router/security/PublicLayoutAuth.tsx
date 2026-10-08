import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuth } from "../../../hooks/useCheckAuth";
import { BeatLoader } from "react-spinners";
// Tus importaciones correctas para useCheckAuth y Loader

export const PublicAuthLayout = () => {
  const { isAuthenticated, isLoading } = useCheckAuth();

  if (isLoading) {
    return (
      <div className="loader-card-desktop">
        <BeatLoader size={20} color="#85b6ff" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
