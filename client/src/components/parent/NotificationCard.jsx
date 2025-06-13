import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {
    Notifications,
    Warning,
    Info,
    CheckCircle,
    Schedule,
    LocalHospital,
    MedicalServices
} from '@mui/icons-material';

const NotificationCard = ({ children, medicalOrders, onNotificationClick }) => {
    // Tạo các thông báo dựa trên dữ liệu
    const generateNotifications = () => {
        const notifications = [];

        // Thông báo về đơn thuốc chờ duyệt
        const pendingOrders = medicalOrders.filter(order => order.status === 'pending');
        if (pendingOrders.length > 0) {
            notifications.push({
                type: 'warning',
                icon: <Schedule />,
                title: `${pendingOrders.length} đơn thuốc đang chờ duyệt`,
                description: 'Các đơn thuốc đang được y tá trường xem xét',
                action: 'Xem chi tiết',
                priority: 'high'
            });
        }

        // Thông báo về đơn thuốc được duyệt
        const approvedOrders = medicalOrders.filter(order => order.status === 'approved');
        if (approvedOrders.length > 0) {
            notifications.push({
                type: 'info',
                icon: <CheckCircle />,
                title: `${approvedOrders.length} đơn thuốc đã được duyệt`,
                description: 'Con em có thể đến phòng y tế để nhận thuốc',
                action: 'Xem lịch',
                priority: 'medium'
            });
        }

        // Thông báo về sức khỏe (giả lập)
        children.forEach(child => {
            // Thông báo khám sức khỏe định kỳ
            const nextCheckup = new Date();
            nextCheckup.setMonth(nextCheckup.getMonth() + 1);

            notifications.push({
                type: 'info',
                icon: <LocalHospital />,
                title: `Khám sức khỏe định kỳ - ${child.name}`,
                description: `Lịch khám tiếp theo: ${nextCheckup.toLocaleDateString('vi-VN')}`,
                action: 'Đặt lịch',
                priority: 'low'
            });
        });

        // Thông báo chung về hệ thống
        notifications.push({
            type: 'success',
            icon: <Info />,
            title: 'Hệ thống hoạt động bình thường',
            description: 'Tất cả dịch vụ y tế trường học đang hoạt động tốt',
            action: '',
            priority: 'low'
        });

        return notifications.sort((a, b) => {
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    };

    const notifications = generateNotifications();

    const getAlertSeverity = (type) => {
        switch (type) {
            case 'warning': return 'warning';
            case 'info': return 'info';
            case 'success': return 'success';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                    Thông báo & Nhắc nhở ({notifications.length})
                </Typography>

                {notifications.length === 0 ? (
                    <Alert severity="info">
                        Hiện tại không có thông báo mới nào.
                    </Alert>
                ) : (
                    <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    button
                                    onClick={() => onNotificationClick?.({
                                        ...notification,
                                        type: notification.type,
                                        orderId: notification.orderId
                                    })}
                                    sx={{
                                        bgcolor: `${getAlertSeverity(notification.type)}.light`,
                                        borderRadius: 1,
                                        mb: 1,
                                        border: `1px solid`,
                                        borderColor: `${getAlertSeverity(notification.type)}.main`,
                                        '&:hover': {
                                            bgcolor: `${getAlertSeverity(notification.type)}.main`,
                                            color: 'white',
                                            '& .MuiListItemIcon-root': {
                                                color: 'white'
                                            }
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <ListItemIcon>
                                        {notification.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {notification.title}
                                                </Typography>
                                                <Chip
                                                    label={notification.priority.toUpperCase()}
                                                    size="small"
                                                    color={getPriorityColor(notification.priority)}
                                                    sx={{ height: 18, fontSize: '0.6rem' }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {notification.description}
                                            </Typography>
                                        }
                                    />
                                    {notification.action && (
                                        <Chip
                                            label={notification.action}
                                            size="small"
                                            variant="outlined"
                                            clickable
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </ListItem>
                                {index < notifications.length - 1 && <Divider sx={{ my: 0.5 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default NotificationCard;
