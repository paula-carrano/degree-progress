import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">Preparando tu espacio...</div>;
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
};
