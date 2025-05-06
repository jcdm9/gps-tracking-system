import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const UserTable = Loadable(lazy(() => import('./UserTable')));

const usersRoute = [{ path: '/users', element: <UserTable />, auth: authRoles.editor }];

export default usersRoute;
