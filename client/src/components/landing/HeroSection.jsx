import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';

const HeroSection = ({ onLoginClick, onLearnMoreClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (<Box
        sx={{
            background: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #bbe1fa 100%)',
            color: 'white',
            py: { xs: 10, md: 16 },
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Cpath d="M40 40c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm-20-20c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.4
            }
        }}
    >
        <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">                    <Grid item xs={12} md={6}>                        <Box sx={{ position: 'relative', zIndex: 1 }}>                <Box sx={{ mb: 3 }}>                <Chip
                label="🏥 Hệ thống y tế học đường thông minh"
                sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                }}
            />
            </Box>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '2.8rem', md: '4.5rem' },
                        fontWeight: 800,
                        mb: 3,
                        lineHeight: 1.1,
                        textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    Bảo vệ sức khỏe<br />
                    Học sinh toàn diện
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 5,
                        opacity: 0.95,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        maxWidth: '600px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                >
                    Nền tảng y tế học đường hiện đại với công nghệ AI phát hiện sớm dịch bệnh,
                    theo dõi sức khỏe thời gian thực và kết nối trực tiếp với bác sĩ chuyên khoa.
                </Typography>                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 6 }}>

                </Box>                {/* Trust indicators */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', opacity: 0.9 }}>                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>⭐ 4.9/5</Typography>
                    <Typography variant="body2">từ 1000+ người dùng</Typography>
                </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>🔒 ISO 27001</Typography>
                        <Typography variant="body2">Chứng nhận bảo mật</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>🩺 HIPAA</Typography>
                        <Typography variant="body2">Tuân thủ y tế</Typography>
                    </Box>
                </Box>
            </Box></Grid>                    <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: { xs: 280, md: 400 },
                                height: { xs: 280, md: 400 },
                            }}
                        >                            {/* Main circle */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: { xs: '4rem', md: '6rem' },
                                    backdropFilter: 'blur(20px)',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    position: 'relative',
                                    animation: 'pulse 4s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%, 100%': {
                                            transform: 'scale(1)',
                                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                                        },
                                        '50%': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 25px 80px rgba(0,0,0,0.4)'
                                        }
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -10,
                                        left: -10,
                                        right: -10,
                                        bottom: -10,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)',
                                        zIndex: -1
                                    }
                                }}
                            >
                                🏥
                            </Box>{/* Floating elements */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '10%',
                                    right: '-10%',
                                    width: 60,
                                    height: 60,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                    }
                                }}
                            >
                                🧬
                            </Box>

                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '15%',
                                    left: '-5%',
                                    width: 50,
                                    height: 50,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite 1s',
                                }}
                            >
                                🩺
                            </Box>                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '20%',
                                    left: '-15%',
                                    width: 45,
                                    height: 45,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.1rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite 2s',
                                }}
                            >
                                📈
                            </Box>

                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '5%',
                                    right: '-5%',
                                    width: 55,
                                    height: 55,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.3rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite 1.5s',
                                }}
                            >
                                💉
                            </Box>                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '-20%',
                                    width: 40,
                                    height: 40,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite 0.5s',
                                }}
                            >
                                🧪
                            </Box>

                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '5%',
                                    left: '-10%',
                                    width: 35,
                                    height: 35,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite 3s',
                                }}
                            >
                                🔬
                            </Box>

                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '25%',
                                    right: '-15%',
                                    width: 45,
                                    height: 45,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.1rem',
                                    backdropFilter: 'blur(10px)',
                                    animation: 'float 3s ease-in-out infinite 2.5s',
                                }}
                            >
                                🩹
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container >
    </Box >
    );
};

export default HeroSection;
