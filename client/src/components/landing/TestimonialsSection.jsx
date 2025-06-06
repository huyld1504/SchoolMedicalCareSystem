import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Rating,
    Card,
    CardContent
} from '@mui/material';
// Import doctor images


const
    TestimonialsSection = () => {
        const awards = [
            { title: 'Vietnam ICT Awards 2024', icon: '🏆', category: 'Sản phẩm y tế xuất sắc' },
            { title: 'Asia Healthcare Innovation', icon: '🥇', category: 'Giải pháp AI tốt nhất' },
            { title: 'ASEAN Digital Award', icon: '🩺', category: 'Chuyển đổi số y tế' },
            { title: 'Global EdTech Leaders', icon: '💊', category: 'Health Management' }
        ];

        return (
            <Box sx={{
                py: 16,
                background: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #bbe1fa 100%)',
                color: 'white',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M60 60c0-16.569 13.431-30 30-30s30 13.431 30 30-13.431 30-30 30-30-13.431-30-30zm-30-30c0-16.569 13.431-30 30-30s30 13.431 30 30-13.431 30-30 30-30-13.431-30-30z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.4
                }
            }}>
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', mb: 12 }}>                        <Chip
                        label="🩺 Khách hàng tin tưởng"
                        sx={{
                            mb: 3,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 3,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                    />
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                            }}
                        >
                            Được tin tưởng bởi hàng triệu người dùng
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                maxWidth: '800px',
                                mx: 'auto',
                                opacity: 0.95,
                                fontSize: '1.2rem',
                                lineHeight: 1.6
                            }}
                        >
                            Lắng nghe chia sẻ từ các chuyên gia y tế, giáo dục và phụ huynh về trải nghiệm thực tế
                        </Typography>
                    </Box>



                    {/* Awards section */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 6,
                                fontWeight: 700,
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            Được vinh danh bởi các tổ chức uy tín
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            {awards.map((award, index) => (
                                <Grid item xs={6} md={3} key={index}>
                                    <Box
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: 3,
                                            p: 3,
                                            textAlign: 'center',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                transform: 'translateY(-5px)'
                                            }
                                        }}
                                    >
                                        <Typography variant="h3" sx={{ mb: 2 }}>
                                            {award.icon}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 700,
                                                mb: 1,
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {award.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                opacity: 0.9,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {award.category}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        );
    };

export default TestimonialsSection;
