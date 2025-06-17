import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Button,
    IconButton,
    Divider,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    LocalHospital,
    History,
    Person,
    ExpandMore,
    ExpandLess,
    HealthAndSafety
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import { medicalOrderApi } from '../../api/medicalOrderApi';
import healthProfileAPI from '../../api/healthProfileApi';

const ChildDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [medicalOrders, setMedicalOrders] = useState([]);
    const [healthProfiles, setHealthProfiles] = useState([]);
    const [showAllProfiles, setShowAllProfiles] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [childData, ordersData] = await Promise.all([
                    childApi.getChildById(id),
                    medicalOrderApi.getOrdersByChildId(id)
                ]);
                setChild(childData);
                setMedicalOrders(ordersData);

                // Load health profiles separately to avoid blocking if it fails
                try {
                    const healthData = await healthProfileAPI.getByChildId(id);
                    setHealthProfiles(healthData || []);
                } catch (healthErr) {
                    console.warn('Không thể tải hồ sơ sức khỏe:', healthErr);
                    setHealthProfiles([]);
                }
            } catch (err) {
                setError('Không thể tải thông tin con em');
                toast.error('❌ Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !child) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Không tìm thấy thông tin con em'}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/parent')}
                >
                    Quay lại trang chủ
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton
                    onClick={() => navigate('/parent')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" className="parent-title">
                    Thông tin chi tiết
                </Typography>
            </Box>            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={4}>
                    <Paper className="parent-card" sx={{ p: 3, height: 'fit-content' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Person sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {child.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(child.dateOfBirth).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Giới tính
                            </Typography>
                            <Typography>
                                {child.gender === 'male' ? 'Nam' : child.gender === 'female' ? 'Nữ' : 'Khác'}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Nhóm máu
                            </Typography>
                            <Typography>
                                {child.bloodType || 'Chưa cập nhật'}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Dị ứng
                            </Typography>
                            <Typography>
                                {child.allergies || 'Không có'}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Tình trạng sức khỏe
                            </Typography>
                            <Typography>
                                {child.medicalConditions || 'Bình thường'}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Người liên hệ khẩn cấp
                            </Typography>
                            <Typography>
                                {child.emergencyContact.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {child.emergencyContact.relationship} - {child.emergencyContact.phone}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={() => navigate(`/parent/children/${id}/edit`)}
                            >
                                Chỉnh sửa thông tin
                            </Button>
                        </Box>
                    </Paper>                </Grid>                {/* Health Profiles */}
                <Grid item xs={12} md={8}>
                    <Paper className="parent-card" sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HealthAndSafety sx={{ mr: 1, color: '#1976d2' }} />
                                Hồ sơ sức khỏe
                            </Typography>
                        </Box>

                        {healthProfiles.length === 0 ? (
                            <Box className="parent-empty-state">
                                <HealthAndSafety className="parent-empty-state-icon" />
                                <Typography variant="h6" className="parent-empty-state-text">
                                    Chưa có hồ sơ sức khỏe nào
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Hồ sơ sức khỏe sẽ được y tá tạo sau khi khám sức khỏe
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {/* Hiển thị hồ sơ mới nhất hoặc tất cả */}
                                {(showAllProfiles ? healthProfiles : healthProfiles.slice(0, 1))
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((profile, index) => (
                                        <Paper
                                            key={profile._id}
                                            sx={{
                                                p: 3,
                                                mb: 2,
                                                border: index === 0 && !showAllProfiles ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                position: 'relative',
                                                '&:hover': {
                                                    boxShadow: 2
                                                }
                                            }}
                                        >
                                            {index === 0 && !showAllProfiles && (
                                                <Chip
                                                    label="Mới nhất"
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        right: 12
                                                    }}
                                                />
                                            )}

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    Khám sức khỏe - {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Bác sĩ: {profile.doctorName || 'Chưa cập nhật'}
                                                </Typography>
                                            </Box>

                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={3}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Chiều cao
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {profile.height ? `${profile.height} cm` : 'Chưa cập nhật'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Cân nặng
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {profile.weight ? `${profile.weight} kg` : 'Chưa cập nhật'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Huyết áp
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {profile.bloodPressure || 'Chưa cập nhật'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Nhiệt độ
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {profile.temperature ? `${profile.temperature}°C` : 'Chưa cập nhật'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            {profile.notes && (
                                                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        Ghi chú của bác sĩ:
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {profile.notes}
                                                    </Typography>
                                                </Box>
                                            )}                                        {profile.recommendations && (
                                                <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                                                    <Typography variant="body2" color="primary.main" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                        Khuyến nghị:
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {profile.recommendations}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Paper>
                                    ))}

                                {/* Button xem tất cả / thu gọn */}
                                {healthProfiles.length > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setShowAllProfiles(!showAllProfiles)}
                                            startIcon={showAllProfiles ? <ExpandLess /> : <ExpandMore />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            {showAllProfiles
                                                ? 'Thu gọn'
                                                : `Xem tất cả (${healthProfiles.length} hồ sơ)`
                                            }
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}                    </Paper>

                    {/* Medical Orders */}
                    <Paper className="parent-card" sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">
                                Lịch sử yêu cầu y tế
                            </Typography>
                            <Button
                                variant="contained"
                                className="parent-button"
                                startIcon={<LocalHospital />}
                                onClick={() => navigate(`/parent/medical-orders/create?childId=${id}`)}
                            >
                                Tạo yêu cầu mới
                            </Button>
                        </Box>

                        {medicalOrders.length === 0 ? (
                            <Box className="parent-empty-state">
                                <History className="parent-empty-state-icon" />
                                <Typography variant="h6" className="parent-empty-state-text">
                                    Chưa có yêu cầu y tế nào
                                </Typography>
                                <Button
                                    variant="contained"
                                    className="parent-button"
                                    startIcon={<LocalHospital />}
                                    onClick={() => navigate(`/parent/medical-orders/create?childId=${id}`)}
                                >
                                    Tạo yêu cầu đầu tiên
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                {medicalOrders.map((order) => (
                                    <Paper
                                        key={order._id}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            }
                                        }}
                                        onClick={() => navigate(`/parent/medical-orders/${order._id}`)}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {order.type === 'medicine' ? 'Đơn thuốc' :
                                                        order.type === 'checkup' ? 'Khám sức khỏe' :
                                                            order.type === 'vaccination' ? 'Tiêm chủng' : 'Khác'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={order.status === 'pending' ? 'Đang xử lý' :
                                                    order.status === 'completed' ? 'Hoàn thành' :
                                                        order.status === 'cancelled' ? 'Đã hủy' : 'Khác'}
                                                color={order.status === 'pending' ? 'warning' :
                                                    order.status === 'completed' ? 'success' :
                                                        order.status === 'cancelled' ? 'error' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {order.description}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ChildDetailPage; 