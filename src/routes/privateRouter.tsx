import { Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { useAuth } from '../provider/authProvider'
import { AuthProviderType } from '../@types/authTypes'

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRoute({isAuthenticated, authenticationPath, outlet}: ProtectedRouteProps) {
  if(isAuthenticated) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
};
