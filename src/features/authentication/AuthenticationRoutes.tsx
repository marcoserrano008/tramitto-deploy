import {RouteObject} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Profile from "./components/Profile/Profile.tsx";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler/OAuth2RedirectHandler.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";

const authenticationRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage/>
  },
  {
    path: "oauth2/redirect",
    element: <OAuth2RedirectHandler/>
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute
        allowedRoles={[RoleEnum.ADMINISTRATOR, RoleEnum.APPLICANT, RoleEnum.ARCHIVES_MANAGER, RoleEnum.GENERAL_SECRETARY]}>
        <Profile/>
      </ProtectedRoute>
    )
  }
];

export default authenticationRoutes;
