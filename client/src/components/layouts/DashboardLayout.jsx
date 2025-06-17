import React, { useState } from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft,
    Dashboard,
    Person,
    LocalHospital,
    Notifications,
    Settings,
    Logout,
    History
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../store/authSlice';
import logoImage from '../../assets/ChatGPT Image 18_26_19 4 thg 6, 2025.png';
import { styled } from '@mui/material/styles';

const drawerWidth = 280;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between'
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        borderRight: 'none',
        backgroundColor: theme.palette.background.default,
        boxShadow: '1px 0 5px rgba(0,0,0,0.1)'
    },
}));

const DashboardLayout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(clearUser());
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    }; const menuItems = [
        { text: 'Tổng quan', icon: <Dashboard />, path: '/parent' },
        { text: 'Thêm con em', icon: <Person />, path: '/parent/children/add' },
        { text: 'Tạo đơn thuốc', icon: <LocalHospital />, path: '/parent/medical-orders/create' },
        { text: 'Thông tin cá nhân', icon: <Person />, path: '/parent/profile' },
        { text: 'Quản lý sức khỏe', icon: <LocalHospital />, path: '/parent/health' },
        { text: 'Thông báo', icon: <Notifications />, path: '/parent/notifications' },
        { text: 'Cài đặt', icon: <Settings />, path: '/parent/settings' }
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    zIndex: theme.zIndex.drawer + 1
                }}
            >
                <Toolbar>
                    <IconButton
                        color="primary"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ marginRight: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <img src={logoImage} alt="Logo" style={{ height: 40, marginRight: 8 }} />
                        <Typography variant="h6" color="primary" fontWeight="bold">
                            School Medical Care
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleProfileMenuOpen}
                        sx={{
                            padding: 0.5,
                            border: '2px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 32,
                                height: 32,
                                fontSize: '1rem'
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleProfileMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Box sx={{ px: 3, py: 1.5 }}>
                            <Typography variant="subtitle1" fontWeight="bold">{user?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Divider />                        <MenuItem onClick={() => navigate('/parent/profile')}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Thông tin cá nhân" />
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/parent/settings')}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Cài đặt" />
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <ListItemIcon>
                                <Logout fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <StyledDrawer variant="persistent" anchor="left" open={open}>
                <DrawerHeader>
                    <Box sx={{ py: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Xin chào,
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                            {user?.name}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{ px: 2, pt: 2 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                                            color: 'white'
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </StyledDrawer>            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginLeft: 0,
                    marginTop: 0,
                    padding: 0,
                    backgroundColor: '#f5f5f5',
                    minHeight: '100vh',
                    width: '100vw',
                    position: 'relative',
                    zIndex: open ? 0 : 1
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
