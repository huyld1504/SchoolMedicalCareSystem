import React from 'react';
import {
    Box,
    Button
} from '@mui/material';
import {
    People,
    ArrowBack
} from '@mui/icons-material';

const NavigationBreadcrumb = ({ currentView, onBackToOverview }) => {
    if (currentView === 'overview') {
        return null;
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Button
                onClick={onBackToOverview}
                startIcon={<ArrowBack />}
                size="medium"
                sx={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#e3f2fd'
                    }
                }}
            >
                Quay lại danh sách con em
            </Button>
        </Box>
    );
};

export default NavigationBreadcrumb;
