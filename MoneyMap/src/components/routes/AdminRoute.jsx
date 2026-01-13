import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Beginner-friendly route guard for admin pages.
 * - Checks for authentication token
 * - Checks the role from localStorage ("role")
 * - Only allows rendering children when authenticated AND role === "ADMIN"
 * - Redirects to "/login" if not authenticated or not ADMIN
 */
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not authenticated or not ADMIN, redirect to login
  if (!token || role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
