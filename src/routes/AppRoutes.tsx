import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App.tsx";
import applicantRoutes from "../features/applicant/ApplicantRoutes.tsx";
import administratorRoutes from "../features/administrator/AdministratorRoutes.tsx";
import KatrinPage from "./katrin/katrin.page.tsx";

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App/>,
    children: [
      ...applicantRoutes,
      ...administratorRoutes,
      {path: '*', element: <div>404 Not Found</div>},
      {path: 'katrin', element: <KatrinPage/>},
    ],
  },
]

const router = createBrowserRouter(rootRoutes)

export default function AppRoutes() {
  return <RouterProvider router={router}/>
}
