import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import NurseLayout from '../components/layouts/NurseLayout';
import StudentsPage from '../pages/nurse/StudentsPage';
import HealthProfilesPage from '../pages/nurse/HealthProfilesPage';
import AddHealthProfilePage from '../pages/nurse/AddHealthProfilePage';
import EditHealthProfilePage from '../pages/nurse/EditHealthProfilePage';
import MedicationHistoryPage from '../pages/nurse/MedicationHistoryPage';
import MedicalEventsPage from '../pages/nurse/MedicalEventsPage';
import MedicalEventDetailPage from '../pages/nurse/MedicalEventDetailPage';
import AppLayout from '../components/layouts/AppLayout';
import LandingLayout from '../components/layouts/LandingLayout';


const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,        children: [
            {
                element: <LandingLayout />,
                children: [                    {
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
                    //   path: 'health-profiles',          
                    //   element: <HealthProfilesPage />,
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
                    },                    {
                        path: 'medication-history/:studentId',
                        element: <MedicationHistoryPage />,
                    },                    {
                        path: 'medical-events',
                        element: <MedicalEventsPage />,
                    },
                    {
                        path: 'medical-events/detail/:eventId',
                        element: <MedicalEventDetailPage />,
                    },
                    {
                        path: 'medical-events/add',
                        element: <div>Add Medical Event Page (General) - Coming Soon</div>, // Placeholder
                    },{
                        path: 'medical-events/:studentId',
                        element: <MedicalEventsPage />,
                    },
                    {
                        path: 'medical-events/:studentId/detail/:eventId',
                        element: <MedicalEventDetailPage />,
                    },
                    {
                        path: 'medical-events/:studentId/add',
                        element: <div>Add Medical Event Page - Coming Soon</div>, // Placeholder
                    },                    {
                        path: 'medical-events/:studentId/edit/:eventId',
                        element: <div>Edit Medical Event Page - Coming Soon</div>, // Placeholder
                    },
                    {
                        path: 'health-profile/:studentId/details/:profileId',
                        element: <div>Health Profile Details Page - Coming Soon</div>, // Placeholder
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
                ]
            },
        ]
    }
]
);

export default router;