import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const BookingTable = Loadable(lazy(() => import('./BookingTable')));

const bookingRoute = [{ path: '/booking', element: <BookingTable />, auth: authRoles.editor }];

export default bookingRoute;
