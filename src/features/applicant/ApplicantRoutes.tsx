import {RouteObject} from "react-router-dom";
import ProtectedRoute from "../../routes/ProtectedRoute.tsx";
import {RoleEnum} from "../../types/enum/Role.enum.ts";
import ApplicantHomePage from "./pages/ApplicantHomePage/ApplicantHomePage.tsx";
import ApplicantLayout from "./layout/ApplicantLayout.tsx";
import ApplicantPersonalProceduresPage
  from "./pages/ApplicantPersonalProceduresPage/ApplicantPersonalProceduresPage.tsx";
import ApplicantProcedureInformationPage
  from "./pages/ApplicantProcedureInformationPage/ApplicantProcedureInformationPage.tsx";
import ProcedureStepsLayout from "./layout/ProcedureStepsLayout.tsx";
import ApplicantStepPaymentPage from "./pages/ApplicantStepPaymentPage/ApplicantStepPaymentPage.tsx";
import ApplicantStepUploadDocumentPage
  from "./pages/ApplicantStepUploadDocumentPage/ApplicantStepUploadDocumentPage.tsx";
import ApplicantStepSearchDocumentPage
  from "./pages/ApplicantStepSearchDocumentPage/ApplicantStepSearchDocumentPage.tsx";
import ApplicantStepSubmitDocumentPage
  from "./pages/ApplicantStepSubmitDocumentPage/ApplicantStepSubmitDocumentPage.tsx";

const applicantRoutes: RouteObject[] = [
  {
    path: 'usuario',
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.APPLICANT]}>
        <ApplicantLayout/>
      </ProtectedRoute>
    ),
    children: [
      {index: true, element: <ApplicantHomePage/>},
      {
        path: 'personal-procedures',
        element: <ApplicantPersonalProceduresPage/>
      },
      {
        path: 'informacion-tramite/:procedureType',
        element: <ProcedureStepsLayout/>,
        children: [
          {
            index: true,
            element: <ApplicantProcedureInformationPage/>,
          },
          {
            path: 'pagos',
            element: <ApplicantStepPaymentPage/>,
          },
          {
            path: 'subir-archivos',
            element: <ApplicantStepSubmitDocumentPage/>,
          },
        ],
      }
    ],
  },
]

export default applicantRoutes;
