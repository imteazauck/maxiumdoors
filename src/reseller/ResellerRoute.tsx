import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResellerRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/resell/login" replace />;
  }

  if (user?.role !== "reseller") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}