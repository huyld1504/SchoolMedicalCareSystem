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
        {
            title: 'Báo cáo tuần',
            icon: <TrendingUpIcon />,
            color: 'info',
            action: 'weekly-report'
        }
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
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <AssignmentIcon sx={{ mr: 1 }} />
                            Thao tác nhanh
                        </Typography>
                        <Grid container spacing={2}>
                            {quickActionButtons.map((action, index) => (
                                <Grid item xs={6} key={index}>
                                    <Button
                                        variant="outlined"
                                        color={action.color}
                                        startIcon={action.icon}
                                        fullWidth
                                        onClick={() => onAction(action.action)}
                                        sx={{
                                            py: 1.5,
                                            textTransform: 'none',
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        {action.title}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Recent Alerts */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <NotificationsIcon sx={{ mr: 1 }} />
                            Thông báo gần đây
                        </Typography>
                        <List dense>
                            {recentAlerts.map((alert) => (
                                <React.Fragment key={alert.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={alert.message}
                                            secondary={alert.time}
                                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                                            secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                        />
                                        <ListItemSecondaryAction>
                                            <Chip
                                                size="small"
                                                color={getSeverityColor(alert.severity)}
                                                variant="outlined"
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {alert.id !== recentAlerts[recentAlerts.length - 1].id && (
                                        <Divider component="li" />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button size="small" onClick={() => onAction('view-all-alerts')}>
                                Xem tất cả thông báo
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default QuickActions;
