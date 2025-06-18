import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    IconButton,
    Badge
} from '@mui/material';
import {
    ChildCare,
    PersonAdd,
    LocalHospital,
    HealthAndSafety,
    TrendingUp,
    EventNote,
    Visibility,
    Add,
    Refresh,
    NotificationImportant,
    CheckCircle,
    Schedule,
    Warning
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import { medicalOrderApi } from '../../api/medicalOrderApi';
import healthProfileAPI from '../../api/healthProfileApi';
import ParentLayout from '../../components/layouts/ParentLayout';
import { extractArrayFromResponse, safeSlice } from '../../utils/apiResponseHelper';

const ParentDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [medicalOrders, setMedicalOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Statistics
    const [stats, setStats] = useState({
        totalChildren: 0,
        pendingOrders: 0,
        completedOrders: 0,
        healthAlerts: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []); const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load children
            const childrenResponse = await childApi.getAllChildren();
            setChildren(childrenResponse.data.records);

            // Load recent medical orders
            const ordersResponse = await medicalOrderApi.getMyOrders({ limit: 5 });
            const ordersData = extractArrayFromResponse(ordersResponse, 'orders');
            setMedicalOrders(ordersData);

            // Calculate stats
            const pendingCount = ordersData.filter(order => order.status === 'pending').length;
            const completedCount = ordersData.filter(order => order.status === 'completed').length; setStats({
                totalChildren: childrenResponse.data.records.length,
                pendingOrders: pendingCount,
                completedOrders: completedCount,
                healthAlerts: 2 // Mock data
            });

            // Mock notifications
            setNotifications([
                {
                    id: 1,
                    title: 'Đơn thuốc đã được duyệt',
                    message: 'Đơn thuốc cho con bạn đã được y tá phê duyet',
                    time: '2 giờ trước',
                    type: 'success'
                },
                {
                    id: 2,
                    title: 'Lịch khám sức khỏe',
                    message: 'Nhắc nhở: Lịch khám định kỳ vào thứ 5 tuần tới',
                    time: '1 ngày trước',
                    type: 'info'
                },
                {
                    id: 3,
                    title: 'Cập nhật hồ sơ sức khỏe',
                    message: 'Hồ sơ sức khỏe mới đã được cập nhật',
                    time: '3 ngày trước',
                    type: 'warning'
                }
            ]);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadDashboardData();
        toast.success('Đã làm mới dữ liệu');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Đang xử lý';
            case 'approved': return 'Đã duyệt';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle color="success" />;
            case 'warning': return <Warning color="warning" />;
            case 'info': return <NotificationImportant color="info" />;
            default: return <NotificationImportant />;
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
        <Card
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick ? { transform: 'translateY(-2px)', boxShadow: 4 } : {},
                transition: 'all 0.3s ease'
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="h6">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    // if (loading) {
    //     return (
    //         <ParentLayout>
    //             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    //                 <CircularProgress />
    //             </Box>
    //         </ParentLayout>
    //     );
    // }

    return (
        <ParentLayout>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Dashboard Phụ huynh
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Chào mừng trở lại, {user?.name || 'Phụ huynh'}!
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        sx={{ height: 'fit-content' }}
                    >
                        Làm mới
                    </Button>
                </Box>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Tổng số con em"
                            value={stats.totalChildren}
                            icon={<ChildCare />}
                            color="#1976d2"
                            subtitle="Đang theo dõi"
                            onClick={() => navigate('/parent/children')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Đơn chờ xử lý"
                            value={stats.pendingOrders}
                            icon={<Schedule />}
                            color="#ed6c02"
                            subtitle="Cần theo dõi"
                            onClick={() => navigate('/parent/medical-orders')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Đơn hoàn thành"
                            value={stats.completedOrders}
                            icon={<CheckCircle />}
                            color="#2e7d32"
                            subtitle="Trong tháng này"
                            onClick={() => navigate('/parent/medical-orders')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Cảnh báo sức khỏe"
                            value={stats.healthAlerts}
                            icon={<Warning />}
                            color="#d32f2f"
                            subtitle="Cần chú ý"
                            onClick={() => navigate('/parent/health-profiles')}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Children Overview */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Con em của bạn
                                </Typography>
                                <Button
                                    startIcon={<PersonAdd />}
                                    onClick={() => navigate('/parent/children/add')}
                                    variant="contained"
                                    size="small"
                                >
                                    Thêm con
                                </Button>
                            </Box>                            {children.length === 0 ? (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Chưa có thông tin con em. Hãy thêm thông tin con em để bắt đầu!
                                </Alert>
                            ) : (<List>
                                {safeSlice(children, 0, 3).map((child, index) => (
                                    <React.Fragment key={child._id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                                    <ChildCare />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={child.name}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {child.studentCode}
                                                        </Typography>
                                                        {` — ${formatDate(child.birthdate)}`}
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => navigate(`/parent/children/${child._id}`)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < Math.min(children.length, 3) - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                            )}                            {children.length > 3 && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Button onClick={() => navigate('/parent/children')}>
                                        Xem tất cả ({Array.isArray(children) ? children.length : 0})
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Recent Medical Orders */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Đơn thuốc gần đây
                                </Typography>
                                <Button
                                    startIcon={<LocalHospital />}
                                    onClick={() => navigate('/parent/medical-orders/create')}
                                    variant="contained"
                                    size="small"
                                >
                                    Tạo đơn
                                </Button>
                            </Box>

                            {medicalOrders.length === 0 ? (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Chưa có đơn thuốc nào. Tạo đơn thuốc đầu tiên!
                                </Alert>) : (<List>
                                    {safeSlice(medicalOrders, 0, 3).map((order, index) => (
                                        <React.Fragment key={order._id}>
                                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: '#2e7d32' }}>
                                                        <LocalHospital />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Đơn thuốc #${order._id?.slice(-6)}`}
                                                    secondary={
                                                        <>
                                                            <Typography component="span" variant="body2" color="text.primary">
                                                                {formatDate(order.createdAt)}
                                                            </Typography>
                                                            <br />
                                                            <Chip
                                                                label={getStatusText(order.status)}
                                                                color={getStatusColor(order.status)}
                                                                size="small"
                                                                sx={{ mt: 0.5 }}
                                                            />
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => navigate(`/parent/medical-orders/${order._id}`)}
                                                    >
                                                        <Visibility />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>                                            {index < Math.min(Array.isArray(medicalOrders) ? medicalOrders.length : 0, 3) - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}

                            {(Array.isArray(medicalOrders) ? medicalOrders.length : 0) > 3 && (
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Button onClick={() => navigate('/parent/medical-orders')}>
                                        Xem tất cả ({Array.isArray(medicalOrders) ? medicalOrders.length : 0})
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Notifications */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Thông báo mới nhất
                                </Typography>
                                <Button onClick={() => navigate('/parent/notifications')}>
                                    Xem tất cả
                                </Button>
                            </Box>

                            <List>
                                {safeSlice(notifications, 0, 3).map((notification, index) => (
                                    <React.Fragment key={notification.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'transparent' }}>
                                                    {getNotificationIcon(notification.type)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={notification.title}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            {notification.message}
                                                        </Typography>
                                                        <br />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {notification.time}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < notifications.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ParentLayout>
    );
};

export default ParentDashboard;
