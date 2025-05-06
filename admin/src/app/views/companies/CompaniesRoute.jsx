import { authRoles } from "app/auth/authRoles";
import Loadable from "app/components/Loadable";
import { lazy } from "react";

const CompaniesTable = Loadable(lazy(() => import("./CompaniesTable")));

const trucksRoute = [
  { path: "/companies", element: <CompaniesTable />, auth: authRoles.editor },
];

export default trucksRoute;
