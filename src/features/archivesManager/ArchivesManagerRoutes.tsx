import {RouteObject} from "react-router-dom";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";
import ArchivesManagerLayout from "./layout/ArchivesManagerLayout.tsx";
import ArchivesManagerHomePage from "./pages/ArchivesManagerHomePage/ArchivesManagerHomePage.tsx";
import ArchivesManagerProceduresListPage
  from "./pages/ArchivesManagerProceduresListPage/ArchivesManagerProceduresListPage.tsx";
import ArchivesManagerReportsPage from "./pages/ArchivesManagerReportsPage/ArchivesManagerReportsPage.tsx";

const archivesManagerRoutes: RouteObject[] = [
  {
    path: 'archives-manager',
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.ARCHIVES_MANAGER]}>
        <ArchivesManagerLayout/>
      </ProtectedRoute>
    ),
    children: [
      {index: true, element: <ArchivesManagerHomePage/>},

      {path: 'procedures-list', element: <ArchivesManagerProceduresListPage/>},

      {path: 'reports', element: <ArchivesManagerReportsPage/>}
    ],
  },
]

export default archivesManagerRoutes;
