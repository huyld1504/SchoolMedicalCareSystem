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
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Paper
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MoodIcon from '@mui/icons-material/Mood';
import GroupsIcon from '@mui/icons-material/Groups';

const HealthEducationSection = () => {
    const educationTopics = [
        {
            title: "Dinh dưỡng học đường",
            icon: <RestaurantIcon fontSize="large" sx={{ color: '#4caf50' }} />,
            description: "Hướng dẫn chế độ ăn uống lành mạnh và cân bằng cho học sinh các cấp",
            points: [
                "Xây dựng thực đơn cân bằng dinh dưỡng",
                "Thực phẩm tăng cường trí não cho mùa thi",
                "Phòng chống thừa cân và béo phì ở lứa tuổi học đường"
            ],
            color: '#4caf50'
        },
        {
            title: "Sức khỏe tâm lý",
            icon: <MoodIcon fontSize="large" sx={{ color: '#9c27b0' }} />,
            description: "Các kỹ năng quản lý stress và xây dựng sức khỏe tinh thần cho học sinh",
            points: [
                "Kỹ thuật thư giãn và quản lý stress",
                "Nhận diện dấu hiệu trầm cảm và lo âu ở tuổi học đường",
                "Xây dựng môi trường học tập tích cực"
            ],
            color: '#9c27b0'
        },
        {
            title: "Hoạt động thể chất",
            icon: <FitnessCenterIcon fontSize="large" sx={{ color: '#f44336' }} />,
            description: "Tầm quan trọng và hướng dẫn hoạt động thể chất phù hợp với lứa tuổi",
            points: [
                "Các bài tập thể dục ngắn trong lớp học",
                "Thể thao phù hợp với từng lứa tuổi học sinh",
                "Tác động của hoạt động thể chất đến kết quả học tập"
            ],
            color: '#f44336'
        },
        {
            title: "Giáo dục giới tính",
            icon: <GroupsIcon fontSize="large" sx={{ color: '#ff9800' }} />,
            description: "Chương trình giáo dục giới tính phù hợp lứa tuổi và văn hóa",
            points: [
                "Thay đổi cơ thể trong tuổi dậy thì",
                "Kỹ năng xây dựng mối quan hệ lành mạnh",
                "Bảo vệ bản thân và tôn trọng người khác"
            ],
            color: '#ff9800'
        }
    ];



    return (
        <Box sx={{ py: 12, backgroundColor: '#f8fafc', position: 'relative' }}>
            <Container
                maxWidth="xl"
                sx={{
                    '@media (min-width: 1200px)': {
                        maxWidth: '1400px'
                    }
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 10 }}>                    <Chip
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
                        Tài nguyên
                        <Box component="span" sx={{ color: 'primary.main' }}> Giáo dục sức khỏe</Box>
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            maxWidth: '850px',
                            mx: 'auto',
                            lineHeight: 1.6,
                            fontSize: '1.2rem'
                        }}
                    >
                        Nâng cao nhận thức và giáo dục sức khỏe toàn diện cho học sinh
                        với các tài liệu, hướng dẫn và chương trình được thiết kế bởi đội ngũ chuyên gia
                    </Typography>
                </Box>

                {/* Main Topics */}
                <Typography
                    variant="h4"
                    sx={{
                        mb: 5,
                        fontWeight: 700,
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-10px',
                            left: 0,
                            width: 80,
                            height: 4,
                            backgroundColor: 'primary.main',
                            borderRadius: 2
                        }
                    }}
                >
                    Chủ đề giáo dục sức khỏe
                </Typography>

                <Grid container spacing={4} sx={{ mb: 10 }}  >
                    {educationTopics.map((topic, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} >
                            <Paper
                                elevation={0}
                                sx={{


                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',

                                    '&:hover': {
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        transform: 'translateY(-5px)',
                                        '&:before': {
                                            transform: 'translateY(0)'
                                        }
                                    },
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '5px',
                                        background: topic.color,
                                        transform: 'translateY(-100%)',
                                        transition: 'transform 0.3s ease'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                                    {topic.icon}
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
                                    {topic.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 3, textAlign: 'center' }}
                                >
                                    {topic.description}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <List dense sx={{ flex: 1, pb: 2 }}>
                                    {topic.points.map((point, i) => (
                                        <ListItem key={i} sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 30 }}>
                                                <CheckCircleIcon sx={{ fontSize: 20, color: topic.color }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={point}
                                                primaryTypographyProps={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant="text"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        alignSelf: 'center',
                                        mt: 'auto',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: topic.color,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    Khám phá chủ đề
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>





                {/* CTA */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mt: 10,
                        py: 6,
                        px: { xs: 3, md: 10 },
                        backgroundColor: 'primary.main',
                        borderRadius: 4,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                            zIndex: 0
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                            Tài liệu giáo dục sức khỏe miễn phí!
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 400,
                                mb: 4,
                                opacity: 0.9,
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            Tải xuống tài liệu giáo dục sức khỏe miễn phí cho giáo viên, phụ huynh và học sinh.
                            Các tài liệu được xây dựng bởi đội ngũ y tế và giáo dục chuyên nghiệp.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                    }
                                }}
                            >
                                Tải tài liệu
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    borderRadius: 2,
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    }
                                }}
                            >
                                Tìm hiểu thêm
                            </Button>
                        </Box>
                    </Box>
                    <SchoolIcon
                        sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            fontSize: 200,
                            opacity: 0.1,
                            transform: 'rotate(15deg)'
                        }}
                    />
                    <HealthAndSafetyIcon
                        sx={{
                            position: 'absolute',
                            bottom: -15,
                            left: -15,
                            fontSize: 150,
                            opacity: 0.1,
                            transform: 'rotate(-15deg)'
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default HealthEducationSection;
