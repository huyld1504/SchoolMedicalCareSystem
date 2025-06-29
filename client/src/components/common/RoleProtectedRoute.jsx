import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';
import { Alert, Box, Container } from '@mui/material';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Alert severity="error">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên.
                </Alert>
            </Container>
        );
    }

    return children;
};

export default RoleProtectedRoute;
