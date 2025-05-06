import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const TrucksTable = Loadable(lazy(() => import('./TrucksTable')));

const trucksRoute = [{ path: '/trucks', element: <TrucksTable />, auth: authRoles.editor }];

export default trucksRoute;
