import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";


/**
 * Protect routes that require user authentication.
 * If the user is not logged in, redirect to the login page.
 * If the user is logged in, allow access to the protected page.
 * **/

export default function ProtectedRoute({ children }) {
  // Get the current login status from AuthContext
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}