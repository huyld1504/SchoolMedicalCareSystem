import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout, AuthLayout, LoginLayout, PageLayout } from '../components/layouts';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import LoginForm from '../components/auth/LoginForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Demo components for routing
const Students = () => (
    <PageLayout title="Quản lý học sinh" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Quản lý học sinh', href: '/dashboard/students' }]}>
        <div>Danh sách học sinh và thông tin chi tiết</div>
    </PageLayout>
);

const MedicalRecords = () => (
    <PageLayout title="Hồ sơ y tế" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Hồ sơ y tế', href: '/dashboard/medical-records' }]}>
        <div>Quản lý hồ sơ y tế học sinh</div>
    </PageLayout>
);

const Appointments = () => (
    <PageLayout title="Lịch khám" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Lịch khám', href: '/dashboard/appointments' }]}>
        <div>Lập lịch và quản lý cuộc hẹn khám</div>
    </PageLayout>
);

const Medications = () => (
    <PageLayout title="Quản lý thuốc" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Quản lý thuốc', href: '/dashboard/medications' }]}>
        <div>Kho thuốc và phân phát</div>
    </PageLayout>
);

const Reports = () => (
    <PageLayout title="Báo cáo" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Báo cáo', href: '/dashboard/reports' }]}>
        <div>Báo cáo và thống kê</div>
    </PageLayout>
);

const HealthCheckup = () => (
    <PageLayout title="Khám sức khỏe định kỳ" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Khám sức khỏe', href: '/dashboard/health-checkup' }]}>
        <div>Lập lịch và theo dõi khám sức khỏe định kỳ</div>
    </PageLayout>
);

const Users = () => (
    <PageLayout title="Quản lý người dùng" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Người dùng', href: '/dashboard/users' }]}>
        <div>Quản lý tài khoản và phân quyền người dùng</div>
    </PageLayout>
);

const SettingsPage = () => (
    <PageLayout title="Cài đặt hệ thống" breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Cài đặt', href: '/dashboard/settings' }]}>
        <div>Cấu hình và tùy chỉnh hệ thống</div>
    </PageLayout>
);

const Login = () => <LoginForm />;

const Register = () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Đăng ký tài khoản</h2>
        <p>Form đăng ký sẽ được triển khai ở đây</p>
    </div>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/auth',
        element: <LoginLayout />,
        children: [
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    }, {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: 'students',
                element: <Students />
            },
            {
                path: 'medical-records',
                element: <MedicalRecords />
            },
            {
                path: 'appointments',
                element: <Appointments />
            },
            {
                path: 'medications',
                element: <Medications />
            }, {
                path: 'reports',
                element: <Reports />
            },
            {
                path: 'health-checkup',
                element: <HealthCheckup />
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: 'settings',
                element: <SettingsPage />
            }
        ]
    }
]);

export default router;
