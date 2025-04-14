import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App.tsx";
import applicantRoutes from "../features/applicant/ApplicantRoutes.tsx";
import administratorRoutes from "../features/administrator/AdministratorRoutes.tsx";
import authenticationRoutes from "../features/authentication/AuthenticationRoutes.tsx";
import RootRedirect from "./RootRedirect.tsx";
import archivesManagerRoutes from "../features/archivesManager/ArchivesManagerRoutes.tsx";
import generalSecretaryRoutes from "../features/generalSecretary/GeneralSecretaryRoutes.tsx";

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App/>,
    children: [
      {
        index: true,
        element: <RootRedirect />
      },
      ...administratorRoutes,
      ...applicantRoutes,
      ...archivesManagerRoutes,
      ...authenticationRoutes,
      ...generalSecretaryRoutes,
      {path: '*', element: <div>404 Not Found</div>},
    ],
  },
]

const router = createBrowserRouter(rootRoutes)

export default function AppRoutes() {
  return <RouterProvider router={router}/>
}
