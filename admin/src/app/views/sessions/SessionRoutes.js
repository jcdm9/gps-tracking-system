import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const JwtLogin = Loadable(lazy(() => import('./JwtLogin')));
const JwtRegister = Loadable(lazy(() => import('./JwtRegister')));

const sessionRoutes = [
  { path: '/signup', element: <JwtRegister /> },
  { path: '/login', element: <JwtLogin /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/404', element: <NotFound /> },
];

export default sessionRoutes;
