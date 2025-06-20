
import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import NurseLayout from '../components/layouts/NurseLayout';
import StudentsPage from '../pages/nurse/StudentsPage';
import HealthProfilesPage from '../pages/nurse/HealthProfilesPage';
import AddHealthProfilePage from '../pages/nurse/AddHealthProfilePage';
import EditHealthProfilePage from '../pages/nurse/EditHealthProfilePage';
import MedicationHistoryPage from '../pages/nurse/MedicationHistoryPage';
import AppLayout from '../components/layouts/AppLayout';
import LandingLayout from '../components/layouts/LandingLayout';
import MedicalOrdersPage from '../pages/nurse/MedicalOrdersPage';
import MedicalOrderDetailPage from '../pages/nurse/MedicalOrderDetailPage';


const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                element: <LandingLayout />,
                children: [
                    {
                        index: true,
                        path: '/',
                        element: <LandingPage />
                    }
                ]
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'nurse',
                element: (
                    <RoleProtectedRoute allowedRoles={["nurse"]}>
                        <NurseLayout />
                    </RoleProtectedRoute>
                ),
                children: [


                    {
                        path: 'students',
                        element: <StudentsPage />,
                    },
                    // {
                    //   path: 'health-profiles',
                    //   element: <HealthProfilesPage />,
                    //   path: 'health-profiles',          //   element: <HealthProfilesPage />,
                    // },
                    {
                        path: 'health-profiles/:studentId',
                        element: <HealthProfilesPage />,
                    }, {
                        path: 'health-profiles/:studentId/add',
                        element: <AddHealthProfilePage />,
                    },
                    {
                        path: 'health-profiles/:studentId/edit',
                        element: <EditHealthProfilePage />,
                    },
                    {
                        path: 'medication-history/:studentId',
                        element: <MedicationHistoryPage />,
                    },
                    {
                        path: 'health-profile/:studentId/details/:profileId',
                        element: <div>Health Profile Details Page - Coming Soon</div>, // Placeholder
                    },
                    {
                        path: 'medical-orders/:orderId',
                        element: <MedicalOrderDetailPage /> , // Placeholder
                    },
                    {
                        path: 'medical-orders',
                        element: <MedicalOrdersPage /> , // Placeholder
                    },
                    {
                        path: 'medical-orders/add',
                        element: <MedicalOrdersPage /> , // Placeholder
                    },
                    
                ]
            },
        ]
    }
]
);

export default router;