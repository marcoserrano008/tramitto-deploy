import {RouteObject} from "react-router-dom";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";
import GeneralSecretaryLayout from "./layout/GeneralSecrretaryLayout.tsx";
import GeneralSecretaryHomePage from "./pages/GeneralSecretaryHomePage/GeneralSecretaryHomePage.tsx";
import GeneralSecretaryProceduresListPage
  from "./pages/GeneralSecretaryProceduresListPage/GeneralSecretaryProceduresListPage.tsx";
import GeneralSecretaryReportsPage from "./pages/GeneralSecretaryReportsPage/GeneralSecretaryReportsPage.tsx";
import SignatureValidator
  from "../administrator/pages/AdministratorValidateSignaturePage/components/SignatureValidator/SignatureValidator.tsx";

const generalSecretaryRoutes: RouteObject[] = [
  {
    path: 'general-secretary',
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.GENERAL_SECRETARY]}>
        <GeneralSecretaryLayout/>
      </ProtectedRoute>
    ),
    children: [
      {index: true, element: <GeneralSecretaryHomePage/>},
      {
        path: 'procedures-list',
        element: <GeneralSecretaryProceduresListPage/>
      },
      {
        path: 'reports',
        element: <GeneralSecretaryReportsPage/>
      },
      {
        path: 'validar-firmas',
        element: <SignatureValidator/>
      }
    ],
  },
]

export default generalSecretaryRoutes;
