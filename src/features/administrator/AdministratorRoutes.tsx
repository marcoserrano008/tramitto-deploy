import {RouteObject} from "react-router-dom";
import AdministratorLayout from "./layout/AdministratorLayout.tsx";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";
import AdministratorHomePage from "./pages/AdministratorHomePage/AdministratorHomePage.tsx";
import AdministratorProceduresStatusPage
  from "./pages/AdministratorProceduresStatusPage/AdministratorProceduresStatusPage.tsx";
import AdministratorReportsPage from "./pages/AdministratorReportsPage/AdministratorReportsPage.tsx";
import AdministratorProceduresListPage
  from "./pages/AdministratorProceduresListPage/AdministratorProceduresListPage.tsx";
import AdministratorEditProcedurePage from "./pages/AdministratorEditProcedurePage/AdministratorEditProcedurePage.tsx";
import AdministratorValidateSignaturePage
  from "./pages/AdministratorValidateSignaturePage/AdministratorValidateSignaturePage.tsx";

const administratorRoutes: RouteObject[] = [
  {
    path: 'administrator',
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.ADMINISTRATOR]}>
        <AdministratorLayout/>
      </ProtectedRoute>
    ),
    children: [
      {index: true, element: <AdministratorHomePage/>},

      {path: 'procedures-list/:procedureType', element: <AdministratorProceduresListPage/>},

      {path: 'historial', element: <AdministratorProceduresStatusPage/>},

      {path: 'editar-tramites', element: <AdministratorEditProcedurePage/>},

      {path: 'reports', element: <AdministratorReportsPage/>},

      {path: 'validar-firmas', element: <AdministratorValidateSignaturePage/>}
    ],
  },
]

export default administratorRoutes;
