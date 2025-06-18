import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Tooltip,
    useTheme,
    useMediaQuery,
    Chip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    ExitToApp as LogoutIcon,
    AccountCircle,
    Home,
    ChildCare,
    MedicalServices,
    HealthAndSafety,
    Person
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { clearUser } from '../../store/authSlice';

const drawerWidth = 280;

const ParentLayout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        {
            text: 'Trang chủ',
            icon: <DashboardIcon />,
            path: '/parent',
            active: location.pathname === '/parent'
        },
        {
            text: 'Quản lý con em',
            icon: <ChildCare />,
            path: '/parent/children',
            active: location.pathname.startsWith('/parent/children')
        },
        {
            text: 'Đơn thuốc',
            icon: <MedicalServices />,
            path: '/parent/medical-orders',
            active: location.pathname.startsWith('/parent/medical-orders')
        },
        {
            text: 'Hồ sơ sức khỏe',
            icon: <HealthAndSafety />,
            path: '/parent/health-profiles',
            active: location.pathname.startsWith('/parent/health-profiles')
        },
        {
            text: 'Thông báo',
            icon: <NotificationsIcon />,
            path: '/parent/notifications',
            active: location.pathname === '/parent/notifications'
        }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(clearUser());
        toast.success('Đăng xuất thành công!');
        navigate('/login');
        handleProfileMenuClose();
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawerContent = (
        <Box>
            {/* Header */}
            <Box sx={{ p: 3, bgcolor: '#1976d2', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            mr: 2
                        }}
                    >
                        <Person />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                            {user?.name || 'Phụ huynh'}
                        </Typography>
                        <Chip
                            label="Phụ huynh"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontSize: '0.75rem'
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            <Divider />

            {/* Navigation Menu */}
            <List sx={{ py: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                mx: 2,
                                borderRadius: 2,
                                minHeight: 48,
                                bgcolor: item.active ? '#1976d2' : 'transparent',
                                color: item.active ? 'white' : 'inherit',
                                '&:hover': {
                                    bgcolor: item.active ? '#1565c0' : 'rgba(25, 118, 210, 0.08)',
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: item.active ? 'white' : '#1976d2',
                                    minWidth: 40
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.95rem',
                                    fontWeight: item.active ? 600 : 500
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Settings and Logout */}
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleNavigation('/parent/settings')}
                        sx={{ mx: 2, borderRadius: 2, minHeight: 48 }}
                    >
                        <ListItemIcon sx={{ color: '#666', minWidth: 40 }}>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Cài đặt"
                            primaryTypographyProps={{ fontSize: '0.95rem' }}
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            mx: 2,
                            borderRadius: 2,
                            minHeight: 48,
                            color: '#d32f2f',
                            '&:hover': {
                                bgcolor: 'rgba(211, 47, 47, 0.08)'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Đăng xuất"
                            primaryTypographyProps={{ fontSize: '0.95rem' }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    bgcolor: 'white',
                    color: '#1a1a1a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        Hệ thống y tế trường học
                    </Typography>

                    {/* Notification and Profile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Thông báo">
                            <IconButton color="inherit">
                                <Badge badgeContent={3} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Tài khoản">
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                                sx={{ ml: 1 }}
                            >
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better mobile performance
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid #e0e0e0'
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Profile Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                sx={{ mt: 1 }}
            >
                <MenuItem onClick={() => { handleNavigation('/parent/profile'); handleProfileMenuClose(); }}>
                    <Person sx={{ mr: 2 }} />
                    Thông tin cá nhân
                </MenuItem>
                <MenuItem onClick={() => { handleNavigation('/parent/settings'); handleProfileMenuClose(); }}>
                    <SettingsIcon sx={{ mr: 2 }} />
                    Cài đặt
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <LogoutIcon sx={{ mr: 2 }} />
                    Đăng xuất
                </MenuItem>
            </Menu>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: '#f5f5f5',
                    mt: { xs: 7, md: 8 }
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default ParentLayout;
