import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { AuthProviderType } from "../@types/authTypes";


export const ProtectedRoute = () => {
  const { user } = useAuth() as AuthProviderType;

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
