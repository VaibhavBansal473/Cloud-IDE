import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";

export default function ProtectedRoute() {
  const { authUser, isAuthLoading } = useAuthContext();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-sm text-muted-foreground">
        Restoring session...
      </div>
    );
  }

  if (authUser?.role !== "user") {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
