import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    IconButton,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Schedule as ScheduleIcon,
    Assignment as AssignmentIcon,
    Warning as WarningIcon,
    Notifications as NotificationsIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const QuickActions = ({ onAction }) => {
    const quickActionButtons = [
        {
            title: 'Thêm học sinh mới',
            icon: <AddIcon />,
            color: 'primary',
            action: 'add-student'
        },
        {
            title: 'Lên lịch khám',
            icon: <ScheduleIcon />,
            color: 'secondary',
            action: 'schedule-checkup'
        },
        {
            title: 'Tạo đơn khám',
            icon: <AssignmentIcon />,
            color: 'success',
            action: 'create-order'
        },
      
    ];

    const recentAlerts = [
        {
            id: 1,
            message: 'Học sinh Nguyễn Văn A cần khám mắt',
            severity: 'warning',
            time: '10 phút trước'
        },
        {
            id: 2,
            message: 'Có 3 đơn khám chờ xử lý',
            severity: 'info',
            time: '30 phút trước'
        },
        {
            id: 3,
            message: 'Thuốc paracetamol sắp hết',
            severity: 'error',
            time: '1 giờ trước'
        }
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'default';
        }
    };

    return (
        <Grid container spacing={3}>
            {/* Quick Actions */}
          

            {/* Recent Alerts */}
        
        </Grid>
    );
};

export default QuickActions;
