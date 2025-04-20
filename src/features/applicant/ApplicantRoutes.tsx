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

const applicantRoutes: RouteObject[] = [
  {
    path: 'applicant',
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
        path: 'procedure-information/:procedureType',
        element: <ProcedureStepsLayout/>,
        children: [
          {
            index: true,
            element: <ApplicantProcedureInformationPage/>,
          },
          {
            path: 'payment',
            element: <ApplicantStepPaymentPage/>,
          },
          {
            path: 'upload-document',
            element: <ApplicantStepUploadDocumentPage/>,
          },
        ],
      }
    ],
  },
]

export default applicantRoutes;
