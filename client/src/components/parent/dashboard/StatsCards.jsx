import React from 'react';
import { Grid, Box, Typography, Paper, useTheme } from '@mui/material';
import {
    ChildCare,
    LocalHospital,
    Assignment,
    CheckCircle
} from '@mui/icons-material';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => {
    const theme = useTheme();
    
    return (
        <Paper 
            className="stats-card"
            sx={{
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    '& .stats-card-icon': {
                        transform: 'scale(1.1)',
                    }
                }
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.05,
                    background: `linear-gradient(45deg, ${color} 0%, transparent 100%)`,
                    zIndex: 0
                }}
            />

            {/* Content */}
            <Box 
                sx={{ 
                    position: 'relative',
                    zIndex: 1,
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Typography 
                        className="stats-card-title"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            mb: 1
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography 
                        className="stats-card-value"
                        sx={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.2,
                            mb: 1
                        }}
                    >
                        {value}
                    </Typography>
                </Box>

                {/* Icon Container */}
                <Box 
                    className="stats-card-icon"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'transform 0.3s ease-in-out'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: `${color}15`,
                            borderRadius: '12px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Icon sx={{ 
                            color: color, 
                            fontSize: 28,
                            transition: 'transform 0.3s ease-in-out'
                        }} />
                    </Box>
                    {trend && (
                        <Typography
                            sx={{
                                color: trend > 0 ? 'success.main' : 'error.main',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                            }}
                        >
                            {trend > 0 ? '+' : ''}{trend}%
                        </Typography>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

const StatsCards = ({ children = [], medicalOrders = [] }) => {
    // Ensure arrays are valid
    const safeChildren = Array.isArray(children) ? children : [];
    const safeMedicalOrders = Array.isArray(medicalOrders) ? medicalOrders : [];

    const stats = [
        {
            title: 'Tổng số con em',
            value: safeChildren.length,
            icon: ChildCare,
            color: '#1976d2',
        },
        {
            title: 'Đơn yêu cầu y tế',
            value: safeMedicalOrders.length,
            icon: LocalHospital,
            color: '#2e7d32',
        },
        {
            title: 'Đơn đang xử lý',
            value: safeMedicalOrders.filter(order => order?.status === 'pending').length,
            icon: Assignment,
            color: '#ed6c02',
        },
        {
            title: 'Đơn đã hoàn thành',
            value: safeMedicalOrders.filter(order => order?.status === 'completed').length,
            icon: CheckCircle,
            color: '#2e7d32',
        }
    ];

    return (
        <Grid 
            container 
            spacing={3}
            sx={{
                '& .MuiGrid-item': {
                    display: 'flex'
                }
            }}
        >
            {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <StatsCard {...stat} />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsCards;
