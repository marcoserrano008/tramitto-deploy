import {RouteObject} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import Profile from "./components/Profile/Profile.tsx";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler/OAuth2RedirectHandler.tsx";

// const authenticationRoutes: RouteObject[] = [
//   {
//     path: 'autenticacion',
//     children: [
//       {index: true, element: <LoginPage></LoginPage>},
//       {path: 'registro', element: <SignUpPage></SignUpPage>}
//     ],
//   },
// ]
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
      <ProtectedRoute>
        <Profile/>
      </ProtectedRoute>
    )
  }
];

export default authenticationRoutes;
