import {RouteObject} from "react-router-dom";
import AdministratorLegalizationListPage
  from "./pages/administrator-legalization-list/AdministratorLegalizationListPage.tsx";

const administratorRoutes: RouteObject[] = [
  {
    path: 'administrator',
    children: [
      {index: true, element: <AdministratorLegalizationListPage/>},
    ],
  },
]

export default administratorRoutes;
