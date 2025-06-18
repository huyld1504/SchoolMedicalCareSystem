import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    Grid,
    Paper,
    IconButton,
    Avatar,
    Breadcrumbs,
    Link,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    MedicalServices as MedicalIcon,
    CalendarToday as CalendarIcon,
    Description as DescriptionIcon,
    LocalHospital as HospitalIcon,
    Home as HomeIcon,
    NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';

const MedicalEventDetailPage = () => {
    const { studentId, eventId } = useParams();
    const navigate = useNavigate();

    const [medicalEvent, setMedicalEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMedicalEvent();
    }, [eventId]);

    const loadMedicalEvent = async () => {
        try {
            setLoading(true);
            const response = await medicalEventAPI.getEventById(eventId);
            console.log('Medical event detail response:', response);

            if (response.isSuccess && response.data) {
                setMedicalEvent(response.data);
            } else {
                toast.error('Không thể tải thông tin sự kiện y tế');
                handleBack();
            }
        } catch (error) {
            console.error('Error loading medical event:', error);
            toast.error('Lỗi khi tải thông tin sự kiện y tế');
            handleBack();
        } finally {
            setLoading(false);
        }
    };    const handleBack = () => {
        if (studentId && studentId !== 'undefined') {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            // Nếu không có studentId hoặc studentId là 'undefined', quay về trang tổng quan
            navigate('/nurse/medical-events');
        }
    };    const handleEdit = () => {
        if (studentId && studentId !== 'undefined') {
            navigate(`/nurse/medical-events/${studentId}/edit/${eventId}`);
        } else {
            // Nếu không có studentId, lấy từ medical event
            const firstStudentId = medicalEvent?.studentJoin?.[0]?.studentId?._id || medicalEvent?.studentJoin?.[0]?.studentId;
            if (firstStudentId) {
                navigate(`/nurse/medical-events/${firstStudentId}/edit/${eventId}`);
            } else {
                toast.error('Không thể xác định học sinh để chỉnh sửa');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'emergency':
                return 'error';
            case 'routine check':
            case 'routine':
                return 'primary';
            case 'follow-up':
            case 'followup':
                return 'warning';
            case 'vaccination':
                return 'success';
            case 'injury':
                return 'error';
            case 'consultation':
                return 'info';
            case 'allergy':
                return 'error';
            default:
                return 'default';
        }
    };

    const getEventTypeLabel = (type) => {
        switch (type?.toLowerCase()) {
            case 'emergency':
                return 'Cấp cứu';
            case 'routine check':
            case 'routine':
                return 'Thường quy';
            case 'follow-up':
            case 'followup':
                return 'Tái khám';
            case 'vaccination':
                return 'Tiêm chủng';
            case 'injury':
                return 'Chấn thương';
            case 'consultation':
                return 'Tư vấn';
            case 'allergy':
                return 'Dị ứng';
            default:
                return type || 'Không xác định';
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 3:
                return '#d32f2f'; // Đỏ
            case 2:
                return '#ed6c02'; // Cam
            case 1:
                return '#2e7d32'; // Xanh lá
            default:
                return '#757575'; // Xám
        }
    };

    const getLevelLabel = (level) => {
        switch (level) {
            case 3:
                return 'Cao';
            case 2:
                return 'Trung bình';
            case 1:
                return 'Thấp';
            default:
                return 'Không xác định';
        }
    };    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    py: 8 
                }}>
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
                        Đang tải thông tin sự kiện y tế...
                    </Typography>
                </Box>
            </Container>
        );
    }    if (!medicalEvent) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <MedicalIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Không tìm thấy sự kiện y tế
                        </Typography>
                        <Typography variant="body2">
                            Sự kiện y tế không tồn tại hoặc đã bị xóa.
                        </Typography>
                    </Alert>
                    <Button
                        variant="outlined"
                        startIcon={<BackIcon />}
                        onClick={handleBack}
                        sx={{ mt: 3 }}
                    >
                        Quay lại danh sách
                    </Button>
                </Box>
            </Container>
        );
    }return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Breadcrumb */}
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 2 }}
                >
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/nurse')}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        Trang chủ
                    </Link>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={handleBack}
                        sx={{ 
                            textDecoration: 'none',
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Sự kiện y tế
                    </Link>
                    <Typography variant="body2" color="text.primary">
                        Chi tiết sự kiện
                    </Typography>
                </Breadcrumbs>
            </Box>

            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <BackIcon />
                    </IconButton>
                    <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Chi tiết sự kiện y tế
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Thông tin chi tiết về sự kiện y tế
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<BackIcon />}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Quay lại
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Thông tin cơ bản */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Thông tin sự kiện
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Ngày sự kiện
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                                        <CalendarIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
                                        {formatDate(medicalEvent.dateHappened || medicalEvent.createdAt)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Loại sự kiện
                                    </Typography>
                                    <Chip
                                        label={getEventTypeLabel(medicalEvent.type)}
                                        color={getEventTypeColor(medicalEvent.type)}
                                        size="medium"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Mức độ
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: getLevelColor(medicalEvent.level)
                                        }}
                                    >
                                        {getLevelLabel(medicalEvent.level)}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Người tạo
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                                            <PersonIcon fontSize="small" />
                                        </Avatar>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {medicalEvent.userId?.name || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Mô tả
                                    </Typography>
                                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                            {medicalEvent.description || 'Không có mô tả'}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {medicalEvent.note && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Ghi chú
                                        </Typography>
                                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                                {medicalEvent.note}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Thông tin học sinh */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <HospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Học sinh liên quan
                                </Typography>
                            </Box>                            {medicalEvent.studentJoin && medicalEvent.studentJoin.length > 0 ? (
                                <Box>
                                    {medicalEvent.studentJoin.map((student, index) => (
                                        <Box key={index} sx={{ 
                                            mb: 2, 
                                            p: 3, 
                                            bgcolor: 'grey.50', 
                                            borderRadius: 2,
                                            border: '1px solid',
                                            borderColor: 'grey.200',
                                            '&:hover': {
                                                bgcolor: 'grey.100',
                                                borderColor: 'primary.light'
                                            }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 40, height: 40 }}>
                                                    <PersonIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        {student.studentId?.name || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Mã học sinh: {student.studentId?.studentCode || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            
                                            <Grid container spacing={2}>
                                                {student.studentId?.class && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Lớp:
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {student.studentId.class}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                {student.studentId?.dateOfBirth && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Ngày sinh:
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {formatDate(student.studentId.dateOfBirth)}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                {student.studentId?.gender && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Giới tính:
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {student.studentId.gender === 'male' ? 'Nam' : 'Nữ'}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                {student.studentId?.phone && (
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                            Số điện thoại:
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {student.studentId.phone}
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Box>
                                    ))}
                                    
                                    {medicalEvent.studentJoin.length > 1 && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                <strong>Sự kiện này liên quan đến {medicalEvent.studentJoin.length} học sinh.</strong>
                                            </Typography>
                                        </Alert>
                                    )}
                                </Box>
                            ) : (
                                <Alert severity="warning">
                                    Không có thông tin học sinh liên quan
                                </Alert>
                            )}

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Thời gian tạo
                            </Typography>
                            <Typography variant="body2">
                                {formatDate(medicalEvent.createdAt)}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                                Cập nhật lần cuối
                            </Typography>
                            <Typography variant="body2">
                                {formatDate(medicalEvent.updatedAt)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MedicalEventDetailPage;
