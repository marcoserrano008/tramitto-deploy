import {RouteObject} from "react-router-dom";

const applicantRoutes: RouteObject[] = [
  {
    path: 'applicant',
    children: [
      {index: true, element: <></>},
    ],
  },
]

export default applicantRoutes;
