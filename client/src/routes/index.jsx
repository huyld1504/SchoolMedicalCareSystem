import { createBrowserRouter } from 'react-router';
import LandingPage from '../components/pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layouts/AppLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ParentDashboard from '../components/parent/ParentDashboard';
import AddChildModal from '../components/parent/AddChildModal';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      }, {
        path: '/parent',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ParentDashboard />
          },
          {
            path: 'profile',
            element: <div>Profile Page (Coming Soon)</div>
          },
          {
            path: 'health',
            element: <div>Health Management (Coming Soon)</div>
          },
          {
            path: 'notifications',
            element: <div>Notifications (Coming Soon)</div>
          },
          {
            path: 'settings',
            element: <div>Settings (Coming Soon)</div>
          }
        ]
      }
    ]
  }
]);

export default router;