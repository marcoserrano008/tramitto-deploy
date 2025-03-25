import {RouteObject} from "react-router-dom";
import ApplicantLegalizationListPage from "./pages/applicant-legalization-list/ApplicantLegalizationListPage.tsx";

const applicantRoutes: RouteObject[] = [
  {
    path: 'applicant',
    children: [
      {index: true, element: <ApplicantLegalizationListPage/>},
    ],
  },
]

export default applicantRoutes;
