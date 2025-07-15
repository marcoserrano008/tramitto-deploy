import {RouteObject} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Profile from "./components/Profile/Profile.tsx";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler/OAuth2RedirectHandler.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";
import IdentityValidationPage from "./pages/IdentityValidationPage/IdentityValidationPage.tsx";
import CompleteProfilePage from "./pages/CompleteProfilePage/CompleteProfilePage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";

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
  },
  {
    path: "validation",
    element: <IdentityValidationPage/>
  },
  {
    path: "register",
    element: <RegisterPage/>
  },
  {
    path: "complete-profile",
    element: <CompleteProfilePage/>
  },
  {
    path: "mi-cuenta",
    element: <ProfilePage/>
  },
];

export default authenticationRoutes;

