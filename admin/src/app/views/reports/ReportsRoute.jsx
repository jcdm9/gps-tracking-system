import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const ReportsTable = Loadable(lazy(() => import('./ReportsTable')));

const reportsRoute = [{ path: '/reports', element: <ReportsTable />, auth: authRoles.editor }];

export default reportsRoute;
