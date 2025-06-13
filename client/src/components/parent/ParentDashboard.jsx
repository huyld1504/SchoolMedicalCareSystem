import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    Avatar,
    Chip,
    Alert,
    CircularProgress,
    IconButton,
    Stack,
    Tooltip,
    Divider
} from '@mui/material';
import {
    People,
    LocalHospital,
    Assessment,
    ExitToApp,
    Add,
    Refresh,
    ChildCare,
    MedicalServices,
    Schedule,
    CheckCircle,
    Warning,
    PersonAdd,
    RequestPage,
    HealthAndSafety,
    Favorite,
    Height,
    MonitorWeight,
    Visibility,
    BloodtypeOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';
import { clearUser } from '../../store/authSlice';
import { childApi } from '../../api/childApi';
import { medicalOrderApi } from '../../api/medicalOrderApi';
import AddChildModal from './AddChildModal';
import MedicalOrderDetailModal from './MedicalOrderDetailModal';
import NotificationCard from './NotificationCard';
import CreateMedicalOrderModal from './CreateMedicalOrderModal';
import ConfirmDialog from '../common/ConfirmDialog';
import ErrorBoundary from '../common/ErrorBoundary';


// Component Card con em đơn giản và thân thiện
const SimpleChildCard = ({ child, onViewHealth, onCreateOrder, onViewDetails }) => {
    const calculateAge = (birthdate) => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
            }
        }}>
            <CardContent sx={{ p: 4 }}>
                {/* Header với thông tin con */}
                <Box sx={{
                    textAlign: 'center',
                    mb: 3,
                    p: 3,
                    backgroundColor: child.gender === 'male' ? '#e3f2fd' : '#fce4ec',
                    borderRadius: 3
                }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: child.gender === 'male' ? '#1976d2' : '#e91e63',
                            mx: 'auto',
                            mb: 2,
                            fontSize: '2rem'
                        }}
                    >
                        <ChildCare />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {child.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {calculateAge(child.birthdate)} tuổi • {child.gender === 'male' ? 'Nam' : 'Nữ'}
                    </Typography>
                </Box>                {/* Thông tin cơ bản */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">Mã học sinh:</Typography>
                        <Chip label={child.studentCode} color="primary" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="bold">Bảo hiểm:</Typography>
                        <Chip label={child.medicalConverageId} color="secondary" size="small" />
                    </Box>
                </Box>

                {/* Nút chức năng */}
                <Stack spacing={1}>
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => onViewHealth(child)}
                        startIcon={<LocalHospital />}
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#4caf50',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#45a049' }
                        }}
                        fullWidth
                    >
                        Xem Sức Khỏe
                    </Button>

                    <Button
                        variant="contained"
                        size="medium"
                        onClick={() => onCreateOrder(child)}
                        startIcon={<RequestPage />}
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            backgroundColor: '#ff9800',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#f57c00' }
                        }}
                        fullWidth
                    >
                        Yêu Cầu Đơn Thuốc
                    </Button>

                    <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => onViewDetails(child)}
                        startIcon={<Assessment />}
                        sx={{
                            py: 1.2,
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            borderWidth: 2,
                            borderRadius: 2,
                            '&:hover': { borderWidth: 2 }
                        }}
                        fullWidth
                    >
                        Xem Chi Tiết
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

// Component hiển thị hồ sơ sức khỏe đơn giản
const SimpleHealthCard = ({ profile, child }) => {
    if (!profile) {
        return (
            <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Warning sx={{ fontSize: 60, color: 'warning.main', mb: 1.5 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Chưa có hồ sơ sức khỏe
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Vui lòng liên hệ y tá trường để tạo hồ sơ sức khỏe cho {child?.name}
                </Typography>
                <Button variant="contained" size="medium" startIcon={<LocalHospital />}>
                    Liên hệ Y tá
                </Button>
            </Card>
        );
    }

    return (
        <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Favorite sx={{ mr: 1, color: 'error.main', fontSize: 24 }} />
                Hồ sơ sức khỏe - {child?.name}
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
                        <Height sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {profile.height} cm
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Chiều cao
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
                        <MonitorWeight sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                            {profile.weight} kg
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Cân nặng
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
                        <BloodtypeOutlined sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="error.main">
                            {profile.bloodType}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Nhóm máu
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
                        <Visibility sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="info.main">
                            {profile.vision}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Thị lực
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Thông tin đặc biệt */}
            {(profile.allergies || profile.chronicDiseases || profile.devicesSupport) && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Thông tin đặc biệt
                    </Typography>
                    {profile.allergies && (
                        <Alert severity="warning" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            <Typography variant="h6" fontWeight="bold">Dị ứng:</Typography>
                            <Typography variant="body1">{profile.allergies}</Typography>
                        </Alert>
                    )}
                    {profile.chronicDiseases && (
                        <Alert severity="info" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            <Typography variant="h6" fontWeight="bold">Bệnh mãn tính:</Typography>
                            <Typography variant="body1">{profile.chronicDiseases}</Typography>
                        </Alert>
                    )}
                    {profile.devicesSupport && (
                        <Alert severity="info" sx={{ fontSize: '1.1rem' }}>
                            <Typography variant="h6" fontWeight="bold">Thiết bị hỗ trợ:</Typography>
                            <Typography variant="body1">{profile.devicesSupport}</Typography>
                        </Alert>
                    )}
                </Box>
            )}
        </Card>
    );
};

const ParentDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [currentView, setCurrentView] = useState('overview'); // overview, health, details
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [healthProfile, setHealthProfile] = useState(null);
    const [medicalOrders, setMedicalOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [addChildModalOpen, setAddChildModalOpen] = useState(false);
    const [medicalOrderDetailOpen, setMedicalOrderDetailOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'info',
        child: null
    });

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await childApi.getChildren();
            setChildren(response.data || []);
        } catch (error) {
            console.error('Error loading children:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu con em');
        } finally {
            setLoading(false);
        }
    };

    const loadChildDetails = async (childId) => {
        try {
            // Load health profile
            const healthResponse = await childApi.getHealthProfile(childId);
            setHealthProfile(healthResponse.data);

            // Load medical orders
            const ordersResponse = await medicalOrderApi.getMedicalOrdersByChild(childId);
            setMedicalOrders(ordersResponse.data || []);
        } catch (error) {
            console.error('Error loading child details:', error);
            toast.error('Có lỗi xảy ra khi tải thông tin chi tiết');
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        if (selectedChild) {
            await loadChildDetails(selectedChild._id);
        }
        setRefreshing(false);
        toast.success('Đã cập nhật dữ liệu mới nhất');
    };

    const handleLogout = () => {
        dispatch(clearUser());
        navigate('/login');
    };

    const handleViewChildHealth = (child) => {
        setSelectedChild(child);
        loadChildDetails(child._id);
        setCurrentView('health');
    };

    const handleViewChildDetails = (child) => {
        setSelectedChild(child);
        loadChildDetails(child._id);
        setCurrentView('details');
    };

    const handleCreateOrder = (child) => {
        // Show confirmation dialog for creating order
        const calculateAge = (birthdate) => {
            const today = new Date();
            const birth = new Date(birthdate);
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        };

        setConfirmDialog({
            open: true,
            title: 'Tạo yêu cầu đơn thuốc',
            message: `Bạn muốn tạo yêu cầu đơn thuốc cho con em? Y tá trường sẽ xem xét và phê duyệt đơn thuốc này.`,
            type: 'info',
            child: {
                ...child,
                age: calculateAge(child.birthdate)
            },
            onConfirm: () => {
                setSelectedChild(child);
                setCreateOrderModalOpen(true);
                setConfirmDialog({ ...confirmDialog, open: false });
            }
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    const handleBackToOverview = () => {
        setCurrentView('overview');
        setSelectedChild(null);
    };

    const handleAddChildSuccess = () => {
        loadData();
        toast.success('Đã thêm con em thành công!');
    };

    const handleCreateOrderSuccess = () => {
        if (selectedChild) {
            loadChildDetails(selectedChild._id);
        }
        toast.success('Đã tạo yêu cầu đơn thuốc thành công!');
    };

    // Stats
    const stats = [
        {
            title: 'Tổng số con em',
            value: children.length,
            icon: People,
            color: '#1976d2'
        },
        {
            title: 'Đơn thuốc chờ duyệt',
            value: medicalOrders.filter(o => o.status === 'pending').length,
            icon: Schedule,
            color: '#ed6c02'
        },
        {
            title: 'Đơn thuốc hoàn thành',
            value: medicalOrders.filter(o => o.status === 'completed').length,
            icon: CheckCircle,
            color: '#2e7d32'
        }
    ];

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f7fa'
            }}>
                <CircularProgress size={80} thickness={4} />
                <Typography variant="h4" sx={{ mt: 3, fontWeight: 'bold' }}>
                    Đang tải dữ liệu...
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                    Vui lòng đợi trong giây lát
                </Typography>
            </Box>
        );
    }

    return (
        <ErrorBoundary>
            <Box sx={{
                minHeight: '100vh',
                backgroundColor: '#f5f7fa'
            }}>
                {/* Header */}
                <Paper sx={{
                    borderRadius: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    mb: 3
                }}>
                    <Container maxWidth="lg">                        <Box sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HealthAndSafety sx={{ mr: 2, fontSize: 36 }} />
                                <Box>
                                    <Typography variant="h4" component="h1" fontWeight="bold">
                                        Chăm Sóc Sức Khỏe Con Em
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Theo dõi và quản lý sức khỏe một cách dễ dàng
                                    </Typography>
                                </Box>
                            </Box>                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Tooltip title="Làm mới dữ liệu">
                                    <IconButton
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    variant="outlined"
                                    startIcon={<ExitToApp />}
                                    onClick={handleLogout}
                                    size="small"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        py: 0.5,
                                        px: 2,
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </Box>
                        </Box>

                        {user && (
                            <Alert
                                severity="info"
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    py: 0.5,
                                    '& .MuiAlert-icon': { color: 'white' },
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}
                            >
                                <Typography variant="body2">
                                    Xin chào <strong>{user.name}</strong>! Chào mừng bạn đến với hệ thống chăm sóc sức khỏe học đường.
                                </Typography>
                            </Alert>
                        )}
                    </Box>
                    </Container>
                </Paper>                <Container maxWidth="lg" sx={{ pb: 1 }}>
                    {/* Navigation breadcrumb - Compact */}
                    {currentView !== 'overview' && (
                        <Box sx={{ mb: 1 }}>
                            <Button
                                onClick={handleBackToOverview}
                                startIcon={<People />}
                                size="small"
                                sx={{ fontSize: '0.9rem' }}
                            >
                                ← Quay lại danh sách con em
                            </Button>
                        </Box>
                    )}

                    {/* Quick Actions - Compact */}
                    {currentView === 'overview' && (
                        <Paper sx={{ p: 1.5, mb: 1.5, borderRadius: 1 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                🚀 Hành động nhanh
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    onClick={() => setAddChildModalOpen(true)}
                                    size="small"
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        fontSize: '0.95rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 2px 8px rgba(33, 203, 243, .3)',
                                        borderRadius: 1,
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Thêm Con Em Mới
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAdd />}
                                    onClick={() => setCreateOrderModalOpen(true)}
                                    size="small"
                                    sx={{
                                        py: 1,
                                        px: 2,
                                        fontSize: '0.95rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        boxShadow: '0 2px 8px rgba(33, 203, 243, .3)',
                                        borderRadius: 1,
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    Tạo đơn gửi thuốc
                                </Button>
                            </Stack>
                        </Paper>
                    )}                    {/* Stats Cards - Compact */}
                    {currentView === 'overview' && (
                        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                            {stats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{
                                            p: 1.5,
                                            borderRadius: 1,
                                            background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                                            border: `2px solid ${stat.color}30`,
                                            transition: 'transform 0.2s ease',
                                            '&:hover': { transform: 'translateY(-2px)' }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                <IconComponent sx={{ color: stat.color, fontSize: 24, mr: 1 }} />
                                                <Typography variant="body2" fontWeight="bold">
                                                    {stat.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h4" color={stat.color} fontWeight="bold">
                                                {stat.value}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}                    {/* Content based on current view */}
                    {currentView === 'overview' && (
                        <Box>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                👨‍👩‍👧‍👦 Danh sách con em ({children.length})
                            </Typography>

                            {children.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                                    <ChildCare sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h5" gutterBottom fontWeight="bold">
                                        Chưa có con em nào
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Hãy thêm thông tin con em để bắt đầu theo dõi sức khỏe
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<PersonAdd />}
                                        onClick={() => setAddChildModalOpen(true)}
                                        sx={{
                                            py: 1.5,
                                            px: 3,
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Thêm Con Em Đầu Tiên
                                    </Button>
                                </Paper>
                            ) : (
                                <Grid container spacing={2}>
                                    {children.map((child) => (
                                        <Grid item xs={12} md={6} lg={4} key={child._id}>
                                            <SimpleChildCard
                                                child={child}
                                                onViewDetails={handleViewChildDetails}
                                                onViewHealth={handleViewChildHealth}
                                                onCreateOrder={handleCreateOrder}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )}                    {currentView === 'health' && selectedChild && (
                        <Box>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                🏥 Sức khỏe - {selectedChild.name}
                            </Typography>
                            <SimpleHealthCard profile={healthProfile} child={selectedChild} />
                        </Box>
                    )}

                    {currentView === 'details' && selectedChild && (
                        <Box>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                                📋 Thông tin chi tiết - {selectedChild.name}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 2.5, borderRadius: 2 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Thông tin cá nhân
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="primary" fontWeight="bold">Họ và tên:</Typography>
                                                <Typography variant="body1">{selectedChild.name}</Typography>
                                            </Box>
                                            <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="primary" fontWeight="bold">Ngày sinh:</Typography>
                                                <Typography variant="body1">{new Date(selectedChild.birthdate).toLocaleDateString('vi-VN')}</Typography>
                                            </Box>
                                            <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="primary" fontWeight="bold">Giới tính:</Typography>
                                                <Typography variant="body1">{selectedChild.gender === 'male' ? 'Nam' : 'Nữ'}</Typography>
                                            </Box>
                                            <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="primary" fontWeight="bold">Mã học sinh:</Typography>
                                                <Typography variant="body1">{selectedChild.studentCode}</Typography>
                                            </Box>
                                            <Box sx={{ p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="primary" fontWeight="bold">Mã bảo hiểm:</Typography>
                                                <Typography variant="body1">{selectedChild.medicalConverageId}</Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 2.5, borderRadius: 2 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            Thống kê sức khỏe
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ mb: 3, textAlign: 'center', p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Tình trạng sức khỏe tổng quan
                                                </Typography>
                                                <Chip
                                                    label="Tốt"
                                                    color="success"
                                                    size="medium"
                                                    sx={{ fontSize: '1rem', py: 1.5 }}
                                                />
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={() => handleCreateOrder(selectedChild)}
                                                startIcon={<RequestPage />}
                                                sx={{
                                                    py: 1.5,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: '#ff9800',
                                                    borderRadius: 2,
                                                    '&:hover': { backgroundColor: '#f57c00' }
                                                }}
                                                fullWidth
                                            >
                                                Yêu Cầu Đơn Thuốc
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Container>

                {/* Modals */}
                <AddChildModal
                    open={addChildModalOpen}
                    onClose={() => setAddChildModalOpen(false)}
                    onSuccess={handleAddChildSuccess}
                />

                <MedicalOrderDetailModal
                    open={medicalOrderDetailOpen}
                    onClose={() => setMedicalOrderDetailOpen(false)}
                    orderId={selectedOrderId}
                />

                <CreateMedicalOrderModal
                    open={createOrderModalOpen}
                    onClose={() => setCreateOrderModalOpen(false)}
                    childId={selectedChild?._id}
                    childName={selectedChild?.name}
                    onSuccess={handleCreateOrderSuccess}
                />

                <ConfirmDialog
                    open={confirmDialog.open}
                    onClose={closeConfirmDialog}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    type={confirmDialog.type}
                />

                <Outlet />

                {/* Confirm Dialog */}
                <ConfirmDialog
                    open={confirmDialog.open}
                    onClose={closeConfirmDialog}
                    onConfirm={confirmDialog.onConfirm}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    type={confirmDialog.type}
                    child={confirmDialog.child}
                />
            </Box>
        </ErrorBoundary>
    );
};

export default ParentDashboard;
