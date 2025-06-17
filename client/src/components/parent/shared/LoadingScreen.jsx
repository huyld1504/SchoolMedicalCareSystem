import React from 'react';
import {
    Box,
    CircularProgress,
    Typography
} from '@mui/material';

const LoadingScreen = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: 3
        }}>
            <CircularProgress
                size={80}
                thickness={4}
                sx={{ color: '#1976d2', mb: 3 }}
            />
            <Typography variant="h4" sx={{
                mt: 3,
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'center'
            }}>
                Đang tải dữ liệu...
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{
                mt: 1,
                textAlign: 'center'
            }}>
                Vui lòng đợi trong giây lát
            </Typography>
        </Box>
    );
};

export default LoadingScreen;
