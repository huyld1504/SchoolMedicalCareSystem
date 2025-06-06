import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    IconButton
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BlogSection = () => {    const blogs = [
        {
            title: 'Dinh dưỡng hợp lý cho học sinh trong thời kỳ phát triển',
            excerpt: 'Hướng dẫn về chế độ ăn cân bằng giúp tăng cường sức khỏe và hỗ trợ phát triển trí tuệ cho học sinh trong giai đoạn học tập căng thẳng.',
            image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2340&auto=format&fit=crop',
            category: 'Dinh dưỡng',
            date: '15 Th12, 2024',
            readTime: '5 phút đọc',
            featured: true
        },
        {
            title: 'Kỹ năng sơ cứu cơ bản mọi học sinh cần biết',
            excerpt: 'Giới thiệu các kỹ thuật sơ cứu đơn giản nhưng hiệu quả mà học sinh có thể học và áp dụng trong các tình huống khẩn cấp tại trường học.',
            image: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?q=80&w=2206&auto=format&fit=crop',
            category: 'Sơ cứu',
            date: '12 Th12, 2024',
            readTime: '7 phút đọc',
            featured: true
        },
        {
            title: 'Sức khỏe tâm lý học đường - Phòng ngừa stress và lo âu',
            excerpt: 'Phương pháp giúp học sinh nhận biết dấu hiệu stress, các bài tập thư giãn và kỹ thuật quản lý cảm xúc hiệu quả trong môi trường học tập.',
            image: 'https://khoahoctamly.com/wp-content/uploads/2021/09/stress-hoc-duong-1-1.jpg',
            category: 'Tâm lý',
            date: '10 Th12, 2024',
            readTime: '6 phút đọc',
            featured: true
        },
        {
            title: 'Tầm quan trọng của giấc ngủ đối với học sinh',
            excerpt: 'Khám phá tác động của giấc ngủ đến khả năng học tập, trí nhớ và sức khỏe tổng thể. Hướng dẫn xây dựng thói quen ngủ khoa học cho học sinh.',
            image: 'https://th.bing.com/th/id/OIP.uu_aI1Tx5vlOiyO2YaRQagHaEO?w=275&h=180&c=7&r=0&o=5&cb=thvnextc1&dpr=1.3&pid=1.7',
            category: 'Giấc ngủ',
            date: '8 Th12, 2024',
            readTime: '4 phút đọc',
            featured: true
        },
        {
            title: 'Vận động thể thao phù hợp cho từng độ tuổi học sinh',
            excerpt: 'Gợi ý các hoạt động thể chất phù hợp từ tiểu học đến trung học phổ thông, giúp phát triển thể lực và kỹ năng vận động một cách toàn diện.',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2340&auto=format&fit=crop',
            category: 'Thể thao',
            date: '5 Th12, 2024',
            readTime: '6 phút đọc',
            featured: true
        },
        {
            title: 'An toàn thực phẩm trong bữa ăn học đường',
            excerpt: 'Hướng dẫn nhận biết thực phẩm an toàn, cách bảo quản đồ ăn và những lưu ý quan trọng khi mua sắm thực phẩm tại căng tin trường học.',
            image: 'https://th.bing.com/th/id/OIP.oR27Ks3wMSBFHg0CvVgRfQHaEU?r=0&cb=thvnextc1&rs=1&pid=ImgDetMain',
            category: 'An toàn thực phẩm',
            date: '3 Th12, 2024',
            readTime: '5 phút đọc',
            featured: true
        }

    ];

    // Component for rendering blog cards with consistent height
    const BlogCard = ({ blog, isSmall = false }) => (
        <Card
            elevation={0}
            sx={{
                display: 'flex',
                flexDirection: 'column', width: '100%',
                height: '100%',
                minHeight: isSmall ? '320px' : '350px',
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    '& .blog-image': {
                        transform: 'scale(1.03)'
                    }
                }
            }}
        >
            {/* Image */}            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                height: isSmall ? '120px' : '140px',
                flexShrink: 0
            }}>
                <CardMedia
                    className="blog-image"
                    component="img"
                    image={blog.image}
                    alt={blog.title}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                    }}
                />
                <Chip
                    label={blog.category}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                    }}
                    size="small"
                />
                {blog.featured && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: 'error.main',
                            color: 'white',
                            fontWeight: 600,
                            px: 1,
                            py: 0.5,
                            borderRadius: 4,
                            fontSize: '0.7rem',
                            letterSpacing: 0.5
                        }}
                    >
                        Mới
                    </Box>
                )}
            </Box>

            {/* Content */}            <CardContent sx={{
                p: isSmall ? 1.5 : 2,
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between'
            }}>
                <Box>
                    {/* Meta */}                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                        >
                            {blog.date}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                        >
                            {blog.readTime}
                        </Typography>
                    </Box>

                    {/* Title - Fixed height with line clamp */}                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            lineHeight: 1.3,
                            fontSize: isSmall ? '0.9rem' : '1rem',
                            height: isSmall ? '2.4em' : '2.6em',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {blog.title}
                    </Typography>

                    {/* Excerpt - Fixed height with line clamp */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            lineHeight: 1.4,
                            fontSize: isSmall ? '0.8rem' : '0.85rem',
                            height: isSmall ? '2.8em' : '3.36em',
                            display: '-webkit-box',
                            WebkitLineClamp: isSmall ? 2 : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {blog.excerpt}
                    </Typography>                </Box>

                {/* Read More Button */}
                <Button
                    variant="text"
                    color="primary"
                    endIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.8rem' }} />}
                    sx={{
                        mt: 'auto',
                        alignSelf: 'flex-start',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        p: 0,
                        minHeight: 'auto',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'primary.dark',
                            '& .MuiSvgIcon-root': {
                                transform: 'translateX(4px)'
                            }
                        },
                        '& .MuiSvgIcon-root': {
                            transition: 'transform 0.2s ease'
                        }
                    }}
                >
                    Đọc tiếp
                </Button>
            </CardContent>
        </Card>
    );return (<Box sx={{ py: 12, backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        <Container
            maxWidth="xl"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '@media (min-width: 1200px)': {
                    maxWidth: '1400px'
                },
                px: { xs: 2, md: 3 },
                position: 'relative'
            }}
        >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>                <Chip
                label="🩺 Giáo dục sức khỏe học sinh"
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
                        lineHeight: 1.2
                    }}
                >
                    Bài viết nổi bật về
                    <Box component="span" sx={{ color: 'primary.main' }}> Giáo dục sức khỏe</Box>
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.6,
                        fontSize: '1.2rem'
                    }}
                >
                    Cập nhật các xu hướng mới nhất, nghiên cứu và hướng dẫn thực tiễn trong lĩnh vực
                    giáo dục sức khỏe học đường nhằm nâng cao chất lượng sức khỏe thể chất và tinh thần cho học sinh
                </Typography>
            </Box>                {/* Featured Blog Posts */}
            <Box sx={{ mb: 6, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        fontWeight: 700,
                        textAlign: 'center',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 80,
                            height: 4,
                            backgroundColor: 'primary.main',
                            borderRadius: 2
                        }
                    }}
                >
                    Bài viết mới nhất
                </Typography>                <Box sx={{ width: '100%', position: 'relative', mx: 'auto', maxWidth: '1200px' }}>
                    {/* Navigation Buttons positioned with proper spacing */}
                    <IconButton
                        className="swiper-button-prev-featured"
                        sx={{
                            position: 'absolute',
                            left: { xs: 4, sm: 8, md: -16 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 30,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            width: { xs: 36, md: 44 },
                            height: { xs: 36, md: 44 },
                            border: '1px solid rgba(0,0,0,0.08)',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                transform: 'translateY(-50%) scale(1.05)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.3s ease',
                            '&:disabled': {
                                opacity: 0.5,
                                pointerEvents: 'none'
                            }
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }} />
                    </IconButton>

                    <IconButton
                        className="swiper-button-next-featured"
                        sx={{
                            position: 'absolute',
                            right: { xs: 4, sm: 8, md: -16 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 30,
                            backgroundColor: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            width: { xs: 36, md: 44 },
                            height: { xs: 36, md: 44 },
                            border: '1px solid rgba(0,0,0,0.08)',
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                transform: 'translateY(-50%) scale(1.05)',
                                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.3s ease',
                            '&:disabled': {
                                opacity: 0.5,
                                pointerEvents: 'none'
                            }
                        }}
                    >
                        <ArrowForwardIcon sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }} />
                    </IconButton>

                    {/* Swiper container with proper padding */}
                    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, overflow: 'hidden' }}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            centeredSlides={true}
                            navigation={{
                                nextEl: '.swiper-button-next-featured',
                                prevEl: '.swiper-button-prev-featured',
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1.2,
                                    spaceBetween: 20,
                                    centeredSlides: true,
                                },
                                768: {
                                    slidesPerView: 2.2,
                                    spaceBetween: 20,
                                    centeredSlides: true,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                    centeredSlides: false,
                                },
                            }}
                            style={{
                                paddingBottom: '50px',
                                width: '100%',
                                overflow: 'visible'
                            }}
                        >
                            {blogs
                                .filter(blog => blog.featured)
                                .map((blog, index) => (
                                    <SwiperSlide key={`featured-${index}`} style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        height: 'auto'
                                    }}>
                                        <BlogCard blog={blog} />
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </Box>
                </Box>            </Box>                {/* More Blog Posts Section */}
         


            {/* View All Button */}
          
        </Container>
    </Box>
    );
};

export default BlogSection;
