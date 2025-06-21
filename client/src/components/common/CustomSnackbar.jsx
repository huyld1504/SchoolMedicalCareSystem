import React from 'react';
import { Snackbar, Alert, AlertTitle, Box, Typography } from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

const CustomSnackbar = ({
    open,
    onClose,
    severity = 'success',
    title,
    message,
    autoHideDuration = 4000
}) => {
    const getIcon = () => {
        switch (severity) {
            case 'success': return <CheckCircle />;
            case 'error': return <Error />;
            case 'warning': return <Warning />;
            default: return <Info />;
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (severity) {
            case 'success': return '🎉 Thành công!';
            case 'error': return '❌ Có lỗi xảy ra!';
            case 'warning': return '⚠️ Cảnh báo!';
            default: return 'ℹ️ Thông báo';
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                '& .MuiAlert-root': {
                    minWidth: '300px',
                    fontSize: '1rem',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.2)',
                }
            }}
        >
            <Alert
                severity={severity}
                onClose={onClose}
                icon={getIcon()}
                sx={{
                    '& .MuiAlert-icon': {
                        fontSize: '1.5rem'
                    }
                }}
            >
                <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {getTitle()}
                </AlertTitle>
                <Typography variant="body1">
                    {message}
                </Typography>
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
