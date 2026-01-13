import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in → go to landing page
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
