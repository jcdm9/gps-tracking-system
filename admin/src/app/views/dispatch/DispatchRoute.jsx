import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const DispatchTable = Loadable(lazy(() => import('./DispatchTable')));

const dispatchRoute = [{ path: '/dispatch', element: <DispatchTable />, auth: authRoles.editor }];

export default dispatchRoute;
