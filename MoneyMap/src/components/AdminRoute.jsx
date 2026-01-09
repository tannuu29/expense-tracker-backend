import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Beginner-friendly route guard for admin pages.
 * - Reads the role from localStorage ("role")
 * - Only allows rendering children when role === "ADMIN"
 */
export default function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    // You can change this to a dedicated "Not Authorized" page later.
    return <Navigate to="/login" replace />;
  }

  return children;
}


