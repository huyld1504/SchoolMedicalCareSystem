import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';

// Nurse components
import NurseLayout from '../components/layouts/NurseLayout';
import StudentsPage from '../pages/nurse/StudentsPage';
import HealthProfilesPage from '../pages/nurse/HealthProfilesPage';
import AddHealthProfilePage from '../pages/nurse/AddHealthProfilePage';
import EditHealthProfilePage from '../pages/nurse/EditHealthProfilePage';
import MedicationHistoryPage from '../pages/nurse/MedicationHistoryPage';

// Layout components
import AppLayout from '../components/layouts/AppLayout';
import LandingLayout from '../components/layouts/LandingLayout';
import ParentLayout from '../components/layouts/ParentLayout';

// Parent pages (new structure)
import ParentDashboardPage from '../pages/parent/ParentDashboard';
import ChildrenPage from '../pages/parent/ChildrenPage';
import MedicalOrdersPage from '../pages/parent/MedicalOrdersPage';
import ParentHealthProfilesPage from '../pages/parent/HealthProfilesPage';
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
    path: "/",
    element: <AppLayout />,
    children: [
      // Parent routes
      {
        path: 'parent',
        element: (
          <ProtectedRoute>
            <ParentLayout />
          </ProtectedRoute>
        ),
        children: [
          // Main Dashboard
          {
            index: true,
            element: <ParentDashboardPage />
          },

          // Children Management
          {
            path: 'children',
            children: [
              {
                index: true,
                element: <ChildrenPage />
              },
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
                element: <AddChildPage />
              }
            ]
          },

          // Medical Orders Management
          {
            path: 'medical-orders',
            children: [
              {
                index: true,
                element: <MedicalOrdersPage />
              },
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

          // Health Profiles Management
          {
            path: 'health-profiles',
            children: [
              {
                index: true,
                element: <ParentHealthProfilesPage />
              },
              {
                path: ':childId',
                element: <ParentHealthProfilesPage />
              }
            ]
          },

          // Notifications
          {
            path: 'notifications',
            element: <ComingSoonPage title="Thông báo" />
          },

          // Settings
          {
            path: 'settings',
            element: <ComingSoonPage title="Cài đặt" />
          },

          // Profile
          {
            path: 'profile',
            element: <ComingSoonPage title="Thông tin cá nhân" />
          }
        ]
      },

      // Nurse routes
      {
        path: 'nurse',
        element: (
          <RoleProtectedRoute allowedRoles={['nurse']}>
            <NurseLayout />
          </RoleProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <StudentsPage />
          },
          {
            path: 'students',
            element: <StudentsPage />
          },
          {
            path: 'health-profiles/:studentId',
            element: <HealthProfilesPage />
          },
          {
            path: 'health-profiles/:studentId/add',
            element: <AddHealthProfilePage />
          },
          {
            path: 'health-profiles/:studentId/edit',
            element: <EditHealthProfilePage />
          },
          {
            path: 'medication-history/:studentId',
            element: <MedicationHistoryPage />
          },
          {
            path: 'health-profile/:studentId/details/:profileId',
            element: <ComingSoonPage title="Chi tiết hồ sơ sức khỏe" />
          },
          {
            path: 'medical-orders',
            element: <ComingSoonPage title="Quản lý đơn thuốc" />
          },
          {
            path: 'reports',
            element: <ComingSoonPage title="Báo cáo" />
          }
        ]
      },      // Landing page
      {
        element: <LandingLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />
          }
        ]
      },

      // Public routes
      {
        path: 'login',
        element: <LoginPage />
      },

      // Admin routes (placeholder)
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <ComingSoonPage title="Admin Dashboard" />
          </ProtectedRoute>
        )
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
