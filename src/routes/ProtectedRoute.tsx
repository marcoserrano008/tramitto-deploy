import { Navigate } from "react-router-dom";
import {JSX} from "react";
import {RoleEnum} from "../types/enum/Role.enum.ts";
import {useAuth} from "../context/AuthContext.tsx";

interface ProtectedRouteProps {
  allowedRoles: RoleEnum[];
  children: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, user }= useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
