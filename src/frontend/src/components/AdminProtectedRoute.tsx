/**
 * AdminProtectedRoute — wraps routes that require admin authentication.
 * Checks for a valid admin session token in localStorage.
 * If not found, redirects to /admin/login.
 */

import { useAdminSession } from "@/hooks/useAdminSession";
import { Navigate } from "@tanstack/react-router";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAdminAuthenticated } = useAdminSession();

  // If no admin session token exists, redirect to admin login
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}
