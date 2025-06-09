import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../components/pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import Dashboard from '../components/dashboard/Dashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';

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
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

export default router;