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
    Person
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import { medicalOrderApi } from '../../api/medicalOrderApi';

const ChildDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [medicalOrders, setMedicalOrders] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [childData, ordersData] = await Promise.all([
                    childApi.getChildById(id),
                    medicalOrderApi.getOrdersByChildId(id)
                ]);
                setChild(childData);
                setMedicalOrders(ordersData);
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
            </Box>

            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={4}>
                    <Paper className="parent-card" sx={{ p: 3, height: '100%' }}>
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
                    </Paper>
                </Grid>

                {/* Medical Orders */}
                <Grid item xs={12} md={8}>
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