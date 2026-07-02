import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";

export default function ProtectedRoute() {
  const { authUser } = useAuthContext();
  const location = useLocation();

  if (authUser?.role !== "user") {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
