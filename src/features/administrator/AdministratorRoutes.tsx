import {RouteObject} from "react-router-dom";

const administratorRoutes: RouteObject[] = [
  {
    path: 'administrator',
    children: [
      {index: true, element: <></>},
    ],
  },
]

export default administratorRoutes;
