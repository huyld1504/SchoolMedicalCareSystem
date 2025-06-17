import { createBrowserRouter } from 'react-router';

// Public Pages
import LandingPage from '../components/pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';

// Layout Components
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layouts/AppLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';

// Parent Components
import ParentDashboard from '../components/parent/ParentDashboard';

// Parent Pages (using the ones in /pages directory - these are the full pages)
import AddChildPage from '../pages/parent/AddChildPage';
import ChildDetailPage from '../pages/parent/ChildDetailPage';
import CreateMedicalOrderPage from '../pages/parent/CreateMedicalOrderPage';

// Temporary placeholder component for unimplemented features
const ComingSoonPage = ({ title = "Tính năng" }) => (
  <div style={{
    padding: '40px',
    textAlign: 'center',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <h2>{title}</h2>
    <p>Tính năng này đang được phát triển...</p>
    <button onClick={() => window.history.back()}>← Quay lại</button>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Public Routes
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },

      // Parent Routes
      {
        path: 'parent',
        children: [
          // Main Dashboard - Full Width Layout (No Sidebar)
          {
            index: true,
            element: (
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            ),
          },

          // Child Management Routes - With Sidebar Layout
          {
            path: 'children',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                path: 'add',
                element: <AddChildPage />
              },
              {
                path: ':id',
                element: <ChildDetailPage />
              },
              {
                path: ':id/edit',
                element: <AddChildPage /> // Reuse AddChildPage in edit mode
              }
            ]
          },

          // Medical Orders Routes - With Sidebar Layout
          {
            path: 'medical-orders',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                path: 'create',
                element: <CreateMedicalOrderPage />
              },
              {
                path: ':id',
                element: <ComingSoonPage title="Chi tiết đơn thuốc" />
              }
            ]
          },

          // Profile & Settings Routes - With Sidebar Layout
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <ComingSoonPage title="Thông tin cá nhân" />
              },
              {
                path: 'edit',
                element: <ComingSoonPage title="Chỉnh sửa thông tin" />
              }
            ]
          },          // Health Management Routes - With Sidebar Layout
          {
            path: 'health',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <ComingSoonPage title="Tổng quan sức khỏe" />
              },
              {
                path: 'profiles/:childId',
                element: <ComingSoonPage title="Hồ sơ sức khỏe chi tiết" />
              }
            ]
          },

          // Notifications Route - With Sidebar Layout
          {
            path: 'notifications',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <ComingSoonPage title="Thông báo" />
              }
            ]
          },

          // Settings Route - With Sidebar Layout
          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <ComingSoonPage title="Cài đặt" />
              }
            ]
          }
        ]
      },

      // Future role-based routes (placeholder for expansion)
      {
        path: 'nurse',
        element: (
          <ProtectedRoute requiredRole="nurse">
            <ComingSoonPage title="Nurse Dashboard" />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <ComingSoonPage title="Admin Dashboard" />
          </ProtectedRoute>
        ),
      },

      // Error Routes
      {
        path: '*',
        element: (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h1>404 - Trang không tìm thấy</h1>
            <p>Trang bạn đang tìm kiếm không tồn tại.</p>
            <button onClick={() => window.location.href = '/'}>← Về trang chủ</button>
          </div>
        )
      }
    ]
  }
]);

export default router;