import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import Dashboard from '../components/dashboard/Dashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import NurseLayout from '../components/layouts/NurseLayout';
import NurseDashboard from '../pages/NurseDashboard';
import StudentsPage from '../pages/StudentsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <NurseDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/nurse',
    element: (
      <RoleProtectedRoute allowedRoles={['nurse', 'admin']}>
        <NurseLayout />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <NurseDashboard />,
      }, {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'health-profiles',
        children: [
          {
            path: ':studentId',
            element: <div>Health Profile Details - Coming Soon</div>, // Placeholder
          },
          {
            path:"/",
            element: <div>All Health Profile</div>
          }
        ] // Placeholder
      },
      {
        path: 'medical-orders',
        element: <div>Medical Orders Page - Coming Soon</div>, // Placeholder
      },
      {
        path: 'reports',
        element: <div>Reports Page - Coming Soon</div>, // Placeholder
      },
      {
        path: 'settings',
        element: <div>Settings Page - Coming Soon</div>, // Placeholder
      },
    ],
  },
]);

export default router;