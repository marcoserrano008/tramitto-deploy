import {RouteObject} from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage/SignUpPage.tsx";

const authenticationRoutes: RouteObject[] = [
  {
    path: 'autenticacion',
    children: [
      {index: true, element: <LoginPage></LoginPage>},
      {path: 'registro', element: <SignUpPage></SignUpPage>}
    ],
  },
]

export default authenticationRoutes;
