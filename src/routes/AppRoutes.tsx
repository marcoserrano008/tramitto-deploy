import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import App from "../App.tsx";
import applicantRoutes from "../features/applicant/Applicant.routes.tsx";
import administratorRoutes from "../features/administrator/Administrator.routes.tsx";

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <App/>,
    children: [
      ...applicantRoutes,
      ...administratorRoutes,
      {path: '*', element: <div>404 Not Found</div>},
    ],
  },
]

const router = createBrowserRouter(rootRoutes)

export default function AppRoutes() {
  return <RouterProvider router={router}/>
}