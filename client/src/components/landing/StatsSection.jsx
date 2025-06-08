import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DescriptionIcon from '@mui/icons-material/Description';
import ShieldIcon from '@mui/icons-material/Shield';

const StatsSection = () => {
    const stats = [
        {
            number: '50,000+',
            label: 'Học sinh được quản lý',
            icon: <GroupsIcon sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            bgColor: 'rgba(25, 118, 210, 0.1)'
        },
        {
            number: '100+',
            label: 'Nhân viên y tế tham gia',
            icon: <HealthAndSafetyIcon sx={{ fontSize: 40 }} />,
            color: '#2e7d32',
            bgColor: 'rgba(46, 125, 50, 0.1)'
        },
        {
            number: '250,000+',
            label: 'Hồ sơ y tế được lưu trữ',
            icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
            color: '#ed6c02',
            bgColor: 'rgba(237, 108, 2, 0.1)'
        },
        {
            number: '99.99%',
            label: 'Độ tin cậy hệ thống',
            icon: <ShieldIcon sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            bgColor: 'rgba(211, 47, 47, 0.1)'
        }
    ];

    return (
        <Box sx={{
            py: 12,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.03"%3E%3Cpolygon points="50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40"/%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.6
            }
        }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>                <Box sx={{ textAlign: 'center', mb: 8 }}>                <Chip
                label="🏥 Thống kê ấn tượng"
                sx={{
                    mb: 3,
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    px: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            />
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 800,
                        mb: 2,
                        color: '#1a1a1a',
                        fontSize: { xs: '2rem', md: '3rem' },
                        textAlign: 'center'
                    }}
                >
                    Được tin tưởng bởi hàng nghìn đơn
                    vị
                </Typography>                    <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        maxWidth: '600px',
                        mx: 'auto',
                        lineHeight: 1.6,
                        textAlign: 'center'
                    }}
                >
                    Những con số ấn tượng chứng minh chất lượng và độ tin cậy của hệ thống
                </Typography>
            </Box>                <Grid container spacing={4} justifyContent="center" alignItems="stretch">
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
                            <Card
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'white',
                                    borderRadius: 4,
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                        borderColor: stat.color
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>                                    <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        backgroundColor: stat.bgColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        mb: 3,
                                        fontSize: '2rem'
                                    }}
                                >
                                    {stat.icon}
                                </Box>                                    <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        color: stat.color,
                                        mb: 2,
                                        fontSize: { xs: '2.2rem', md: '2.8rem' },
                                        width: '100%',
                                        textAlign: 'center'
                                    }}
                                >
                                        {stat.number}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 600,
                                            lineHeight: 1.4,
                                            fontSize: '1rem',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>                {/* Additional trust indicators */}
                <Box sx={{ mt: 10, textAlign: 'center', width: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', fontWeight: 600 }}>
                        Được chứng nhận và tin tưởng bởi
                    </Typography>                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 4, opacity: 0.7 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>🏆 ISO 27001:2013</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>🔒 GDPR Compliant</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>🩺 Bộ Y tế chứng nhận</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>🛡️ SOC 2 Type II</Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default StatsSection;
