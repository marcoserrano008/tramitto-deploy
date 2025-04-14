import {useAuth} from "../context/AuthContext.tsx";
import {Navigate} from "react-router-dom";
import {RoleEnum} from "../types/enum/Role.enum.ts";

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  switch (user?.role) {
    case RoleEnum.APPLICANT:
      return <Navigate to="/applicant" replace />;
    case RoleEnum.ADMINISTRATOR:
      return <Navigate to="/administrator" replace />;
    case RoleEnum.ARCHIVES_MANAGER:
      return <Navigate to="/archives-manager" replace />;
    case RoleEnum.GENERAL_SECRETARY:
      return <Navigate to="/secretary" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;