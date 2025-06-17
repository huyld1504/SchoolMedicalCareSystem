import React from 'react';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Stack,
    Card,
    CardContent,
    useTheme,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Refresh,
    PersonAdd,
    WavingHand,
    Schedule,
    ExitToApp,
    MedicalServices
} from '@mui/icons-material';

const DashboardHeader = ({
    user,
    onRefresh,
    onLogout,
    onAddChild,
    onCreateOrder,
    refreshing = false
}) => {
    const theme = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    const getCurrentDateTime = () => {
        return new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }; return (
        <Box
            sx={{
                width: '100%',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white',
                padding: { xs: '16px 8px', sm: '20px 12px', md: '24px 16px' },
                margin: 0,
                boxSizing: 'border-box'
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                width: '100%'
            }}>
                {/* Left side - User info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: 'white'
                        }}
                    >
                        {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                    </Avatar>

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <WavingHand sx={{ fontSize: 28, color: '#ffd54f' }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {getGreeting()}, {user?.name || 'Phụ huynh'}!
                            </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                            Hệ thống chăm sóc y tế học đường
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ fontSize: 20, opacity: 0.8 }} />
                            <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                {getCurrentDateTime()}
                            </Typography>
                        </Box>
                    </Box>                </Box>

                {/* Right side - Action buttons */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                        disabled={refreshing}
                        sx={{
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            color: 'white',
                            borderWidth: 2,
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            '&:disabled': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color: 'rgba(255, 255, 255, 0.7)'
                            }
                        }}
                    >
                        {refreshing ? 'Đang làm mới...' : 'Làm mới'}
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={onAddChild}
                        sx={{
                            bgcolor: 'white',
                            color: '#1976d2',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                                bgcolor: '#f5f5f5',
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                            }
                        }}
                    >
                        Thêm con em                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<MedicalServices />}
                        onClick={onCreateOrder}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                            }
                        }}
                    >
                        Tạo đơn thuốc
                    </Button>

                    <Tooltip title="Đăng xuất">
                        <IconButton
                            onClick={onLogout}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                                }
                            }}
                        >
                            <ExitToApp />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Box>
    );

};

export default DashboardHeader;
