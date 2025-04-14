import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App.tsx";
import applicantRoutes from "../features/applicant/ApplicantRoutes.tsx";
import administratorRoutes from "../features/administrator/AdministratorRoutes.tsx";
import authenticationRoutes from "../features/authentication/AuthenticationRoutes.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App/>,
    children: [
      { index: true, element: <RootRedirect /> },
      ...applicantRoutes,
      ...administratorRoutes,
      ...authenticationRoutes,
      {path: '*', element: <div>404 Not Found</div>},
    ],
  },
]

const router = createBrowserRouter(rootRoutes)

export default function AppRoutes() {
  return <RouterProvider router={router}/>
}
