import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
    IconButton,
    Divider,
    Stack
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Email,
    Phone,
    LocationOn,
    Favorite
} from '@mui/icons-material';

const FooterSection = () => {
    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #2c5aa0 0%, #1e4472 100%)',
            color: 'white',
            py: 3
        }}>
            <Container maxWidth="xl">
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    {/* Company Info */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                background: 'linear-gradient(45deg, #bbe1fa, #ffffff)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            School Medical Care
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 2,
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: 1.5
                            }}
                        >
                            Hệ thống quản lý y tế học đường hiện đại và toàn diện.
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                                <IconButton
                                    key={index}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                                        width: 32,
                                        height: 32
                                    }}
                                    size="small"
                                >
                                    <Icon sx={{ fontSize: '0.9rem' }} />
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>
                            Liên kết nhanh
                        </Typography>
                        <Stack spacing={0.8}>
                            {['Trang chủ', 'Tính năng', 'Về chúng tôi', 'Hỗ trợ'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                        fontSize: '0.85rem',
                                        '&:hover': {
                                            color: '#bbe1fa',
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Services */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>
                            Dịch vụ
                        </Typography>
                        <Stack spacing={0.8}>
                            {[
                                'Quản lý hồ sơ y tế',
                                'Theo dõi sức khỏe',
                                'Lịch khám định kỳ',
                                'Thống kê báo cáo'
                            ].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        textDecoration: 'none',
                                        fontSize: '0.85rem',
                                        '&:hover': {
                                            color: '#bbe1fa',
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>
                            Liên hệ
                        </Typography>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: '0.9rem', color: '#bbe1fa' }} />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}
                                >
                                    support@smc.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: '0.9rem', color: '#bbe1fa' }} />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}
                                >
                                    1900 123 456
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <LocationOn sx={{ fontSize: '0.9rem', color: '#bbe1fa', mt: 0.1 }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.8rem',
                                        lineHeight: 1.3
                                    }}
                                >
                                    123 Đường ABC, Q.1, TP.HCM
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        © 2024 School Medical Care System. Made with{' '}
                        <Favorite sx={{ fontSize: '0.8rem', color: '#ff6b6b' }} />{' '}
                        for better healthcare
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Link
                            href="#"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                '&:hover': { color: '#bbe1fa' }
                            }}
                        >
                            Bảo mật
                        </Link>
                        <Link
                            href="#"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                textDecoration: 'none',
                                fontSize: '0.8rem',
                                '&:hover': { color: '#bbe1fa' }
                            }}
                        >
                            Điều khoản
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );

};
export default FooterSection;

