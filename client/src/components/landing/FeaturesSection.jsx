import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Button
} from '@mui/material';

const FeaturesSection = () => {
    const features = [
        {
            icon: '👨‍🎓',
            title: 'Quản lý học sinh thông minh',
            description: 'Hệ thống AI tiên tiến theo dõi thông tin cá nhân, lịch sử khám bệnh và phân tích xu hướng sức khỏe của từng học sinh.',
            color: '#1976d2',
            bgColor: 'rgba(25, 118, 210, 0.1)',
            features: ['AI phân tích', 'Theo dõi realtime', 'Dự đoán xu hướng']
        },
        {
            icon: '📋',
            title: 'Hồ sơ y tế điện tử bảo mật',
            description: 'Lưu trữ hồ sơ y tế với mã hóa cấp ngân hàng, tuân thủ HIPAA và GDPR, đảm bảo quyền riêng tư tuyệt đối.',
            color: '#2e7d32',
            bgColor: 'rgba(46, 125, 50, 0.1)',
            features: ['Mã hóa AES-256', 'Backup tự động', 'Tuân thủ GDPR']
        },
        {
            icon: '💊',
            title: 'Quản lý thuốc tự động',
            description: 'AI quản lý kho thuốc thông minh với cảnh báo hết hạn, tối ưu tồn kho và đề xuất đơn thuốc phù hợp.',
            color: '#ed6c02',
            bgColor: 'rgba(237, 108, 2, 0.1)',
            features: ['Cảnh báo thông minh', 'Tối ưu tồn kho', 'Đề xuất AI']
        },
        {
            icon: '📈',
            title: 'Phân tích dữ liệu sức khỏe',
            description: 'Dashboard phân tích sức khỏe toàn diện với các báo cáo và biểu đồ trực quan, giúp phát hiện vấn đề sức khỏe tập thể.',
            color: '#9c27b0',
            bgColor: 'rgba(156, 39, 176, 0.1)',
            features: ['Báo cáo thực thi', 'Thống kê xu hướng', 'Cảnh báo dịch bệnh']
        },
        {
            icon: '📱',
            title: 'Ứng dụng di động cho phụ huynh',
            description: 'Phụ huynh dễ dàng theo dõi sức khỏe con em, nhận thông báo quan trọng và tương tác trực tiếp với đội ngũ y tế.',
            color: '#0288d1',
            bgColor: 'rgba(2, 136, 209, 0.1)',
            features: ['Theo dõi realtime', 'Thông báo tức thì', 'Chat với bác sĩ']
        },



    ];

    return (<Box sx={{ py: 16, backgroundColor: 'white', position: 'relative' }}>
        <Container
            maxWidth="xl"
            sx={{
                '@media (min-width: 1200px)': {
                    maxWidth: '1400px'
                }
            }}
        >
            {/* Header Section - Properly Centered */}
            <Box sx={{ textAlign: 'center', mb: 12 }}>                <Chip
                label="🔬 Công nghệ tiên tiến"
                sx={{
                    mb: 3,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    px: 3,
                    py: 1
                }}
            />
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 800,
                        mb: 3,
                        color: '#1a1a1a',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        lineHeight: 1.2,
                        textAlign: 'center'
                    }}
                >
                    Nền tảng y tế học đường
                    <Box component="span" sx={{ color: 'primary.main' }}> thế hệ mới</Box>
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.6,
                        fontSize: '1.2rem',
                        textAlign: 'center'
                    }}
                >
                    Tích hợp AI, IoT và Machine Learning để mang đến trải nghiệm chăm sóc y tế
                    vượt trội với độ chính xác cao và bảo mật tuyệt đối                    </Typography>
            </Box>                {/* Features Grid - Single Row Layout */}
            <Grid
                container
                spacing={{ xs: 2, lg: 1.5 }}
                justifyContent="center"
                alignItems="stretch"
            >
                {features.map((feature, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2}
                        xl={2}
                        key={index}
                        sx={{
                            display: 'flex',
                            // Force 6 cards per row on large screens
                            '@media (min-width: 1200px)': {
                                flexBasis: '16.666667%',
                                maxWidth: '16.666667%'
                            }
                        }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                border: '1px solid rgba(0,0,0,0.08)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                                    borderColor: feature.color,
                                    '& .feature-icon': {
                                        transform: 'scale(1.1)',
                                        backgroundColor: feature.color,
                                        color: 'white'
                                    },
                                    '&::before': {
                                        opacity: 1
                                    }
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 3,
                                    background: `linear-gradient(90deg, ${feature.color}, ${feature.color}aa)`,
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>                                    <Box
                                className="feature-icon"
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '10px',
                                    backgroundColor: feature.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    mb: 1.5,
                                    fontSize: '2rem',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                {feature.icon}
                            </Box>                                    <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    mb: 1,
                                    color: '#1a1a1a',
                                    fontSize: '1.5rem',
                                    lineHeight: 1.2,
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                    {feature.title}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary" sx={{
                                        lineHeight: 1.4,
                                        mb: 1.5,
                                        fontSize: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}
                                >
                                    {feature.description}
                                </Typography>                                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.3, mb: 1.5 }}>
                                    {feature.features.slice(0, 2).map((item, idx) => (
                                        <Chip
                                            key={idx}
                                            label={item}
                                            size="small"
                                            sx={{
                                                backgroundColor: feature.bgColor,
                                                color: feature.color,
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                height: '18px'
                                            }}
                                        />
                                    ))}
                                </Box>

                              
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>            {/* Health Blog Section - Properly Centered */}
            <Box sx={{ mt: 16, width: '100%', overflowX: 'hidden', px: 1 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1a1a1a',
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        textAlign: 'center'
                    }}>
                        Blog Sức Khỏe Học Đường
                    </Typography>
                    <Typography variant="h6" sx={{
                        color: 'text.secondary',
                        fontWeight: 400,
                        textAlign: 'center',
                        maxWidth: '600px',
                        mx: 'auto',
                        lineHeight: 1.6
                    }}>
                        Cập nhật kiến thức y tế và xu hướng chăm sóc sức khỏe mới nhất
                    </Typography>                </Box>                <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="stretch"
                        sx={{
                            flexWrap: { xs: 'wrap', md: 'nowrap' }
                        }}
                    >                    {[
                        {
                            title: 'Hướng dẫn phòng chống COVID-19 trong trường học',
                            excerpt: 'Những biện pháp bảo vệ hiệu quả và an toàn cho học sinh trong môi trường học đường...',
                            author: 'BS. Nguyễn Văn An',
                            date: '15/01/2024',
                            category: 'Phòng chống dịch bệnh',
                            image: '🦠',
                            color: '#4CAF50'
                        },
                        {
                            title: 'Dinh dưỡng cân bằng cho học sinh tiểu học',
                            excerpt: 'Chế độ ăn uống khoa học giúp trẻ phát triển toàn diện về thể chất và trí tuệ...',
                            author: 'ThS. Trần Thị Bình',
                            date: '12/01/2024',
                            category: 'Dinh dưỡng',
                            image: '🍎',
                            color: '#FF9800'
                        },
                        {
                            title: 'Phát hiện sớm các vấn đề về mắt ở trẻ em',
                            excerpt: 'Tầm soát và chăm sóc thị lực cho học sinh - phương pháp hiện đại và hiệu quả...',
                            author: 'BS.CKII Lê Minh Cường',
                            date: '10/01/2024',
                            category: 'Chăm sóc mắt',
                            image: '👁️',
                            color: '#2196F3'
                        }].map((post, index) => (<Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={index}
                            sx={{
                                display: 'flex',
                                flex: { xs: '1 1 100%', sm: '1 1 50%', md: '1 1 33.333%' },
                                maxWidth: { xs: '100%', sm: '50%', md: '33.333%' }
                            }}
                        >                            <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                height: '100%',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                minWidth: 0,
                                m: 0.5,
                                overflow: 'hidden', // Prevent content overflow
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                                    borderColor: post.color
                                }
                            }}
                        >                                <Box sx={{
                            height: { xs: 80, md: 90 },
                            background: `linear-gradient(135deg, ${post.color}15 0%, ${post.color}25 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: { xs: '1.8rem', md: '2rem' },
                            position: 'relative'
                        }}
                        >
                                    {post.image}
                                    <Chip
                                        label={post.category}
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            backgroundColor: post.color,
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: '18px'
                                        }}
                                    />
                                </Box>                                <CardContent sx={{
                                    p: { xs: 1.2, md: 1 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    flex: 1
                                }}>                                    <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 0.5,
                                        color: '#1a1a1a',
                                        fontSize: '0.75rem',
                                        lineHeight: 1.2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        width: '100%',
                                        textAlign: 'center'
                                    }}
                                >
                                        {post.title}
                                    </Typography>                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.2,
                                            mb: 0.75,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            width: '100%',
                                            textAlign: 'center',
                                            fontSize: '0.65rem'
                                        }}
                                    >
                                        {post.excerpt}
                                    </Typography>                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0.5, width: '100%', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: post.color, textAlign: 'center', fontSize: '0.65rem' }}>
                                            {post.author}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.65rem' }}>
                                            {post.date}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 'auto' }}>                                        <Button
                                        variant="text"
                                        sx={{
                                            color: post.color,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            p: 0,
                                            fontSize: '0.75rem',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                color: post.color
                                            }
                                        }}
                                    >
                                        Đọc thêm →
                                    </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        ))}
                </Grid>
                <Box sx={{ textAlign: 'center', mt: 6 }}>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                            }
                        }}
                    >
                        Xem tất cả bài viết
                    </Button>
                </Box>
            </Box>
        </Container>
    </Box>
    );
};

export default FeaturesSection;
