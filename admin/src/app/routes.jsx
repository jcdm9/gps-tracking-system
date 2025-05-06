import AuthGuard from "app/auth/AuthGuard";
import chartsRoute from "app/views/charts/ChartsRoute";
import usersRoute from "app/views/users/UsersRoute";
import bookingRoute from "app/views/booking/BookingRoute";
import dispatchRoute from "app/views/dispatch/DispatchRoute";
import dashboardRoutes from "app/views/dashboard/DashboardRoutes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import NotFound from "app/views/sessions/NotFound";
import sessionRoutes from "app/views/sessions/SessionRoutes";
import { Navigate } from "react-router-dom";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import reportsRoute from "./views/reports/ReportsRoute";
import trucksRoute from "./views/trucks/TrucksRoute";
import companiesRoute from "./views/companies/CompaniesRoute";

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...chartsRoute,
      ...materialRoutes,
      ...usersRoute,
      ...bookingRoute,
      ...dispatchRoute,
      ...reportsRoute,
      ...trucksRoute,
      ...companiesRoute,
    ],
  },
  ...sessionRoutes,
  { path: "/", element: <Navigate to="dashboard" /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
