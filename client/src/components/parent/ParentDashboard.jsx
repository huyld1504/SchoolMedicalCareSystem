import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    IconButton,
    useTheme,
    useMediaQuery,
    Paper,
    Card,
    CardContent,
    Avatar,
    Chip,
    Divider,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    Menu,
    MenuItem
} from '@mui/material';
import {
    ChildCare,
    PersonAdd,
    Refresh,
    Notifications,
    Menu as MenuIcon,
    WavingHand,
    Dashboard,
    Person,
    LocalHospital,
    Settings,
    Logout,
    ChevronLeft,
    MoreVert,
    TrendingUp,
    EventNote,
    FavoriteOutlined
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';

// API imports
import { clearUser } from '../../store/authSlice';
import { childApi } from '../../api/childApi';
import healthProfileAPI from '../../api/healthProfileApi';

// Styled components
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
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    },
}));

const MainContent = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const ParentDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user } = useSelector(state => state.auth);

    // State management
    const [open, setOpen] = useState(true);
    const [children, setChildren] = useState([]);
    const [healthProfiles, setHealthProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    // Effects
    useEffect(() => {
        loadInitialData();
    }, []);

    // Data loading functions
    const loadInitialData = async () => {
        try {
            setLoading(true);
            const childrenResponse = await childApi.getChildren();
            if (childrenResponse && childrenResponse.data && childrenResponse.data.records) {
                setChildren(childrenResponse.data.records);

                // Load health profiles for all children
                const healthPromises = childrenResponse.data.records.map(child =>
                    healthProfileAPI.getByChildId(child._id).catch(() => null)
                );
                const healthData = await Promise.all(healthPromises);
                setHealthProfiles(healthData.filter(data => data && data.data));
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
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
        toast.info('Đã đăng xuất thành công!');
    };

    const handleRefresh = async () => {
        await loadInitialData();
        toast.success('Đã làm mới dữ liệu!');
    };

    // Menu items for sidebar
    const menuItems = [
        { text: 'Tổng quan', icon: <Dashboard />, path: '/parent', active: true },
        { text: 'Thêm con em', icon: <PersonAdd />, path: '/parent/children/add' },
        { text: 'Quản lý sức khỏe', icon: <LocalHospital />, path: '/parent/health' },
        { text: 'Thông báo', icon: <Notifications />, path: '/parent/notifications' },
        { text: 'Thông tin cá nhân', icon: <Person />, path: '/parent/profile' },
        { text: 'Cài đặt', icon: <Settings />, path: '/parent/settings' }
    ];

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* App Bar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { sm: `${open ? drawerWidth : 0}px` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    backgroundColor: '#1976d2'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Hệ thống chăm sóc y tế học đường
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color="inherit" onClick={handleRefresh}>
                            <Refresh />
                        </IconButton>
                        <IconButton color="inherit" onClick={() => navigate('/parent/notifications')}>
                            <Notifications />
                        </IconButton>
                        <IconButton
                            onClick={handleProfileMenuOpen}
                            sx={{ p: 0, ml: 1 }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                {user?.name?.charAt(0) || 'P'}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleProfileMenuClose}
                        >
                            <MenuItem onClick={() => navigate('/parent/profile')}>
                                <Person sx={{ mr: 1 }} /> Thông tin cá nhân
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Logout sx={{ mr: 1 }} /> Đăng xuất
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <StyledDrawer
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocalHospital sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            Y Tế Học Đường
                        </Typography>
                    </Box>
                    <IconButton onClick={handleDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                </DrawerHeader>
                <Divider />

                <List sx={{ px: 2, py: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: item.active ? 'primary.main' : 'transparent',
                                    color: item.active ? 'white' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: item.active ? 'primary.dark' : 'action.hover',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: item.active ? 'white' : 'inherit' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </StyledDrawer>

            {/* Main Content */}
            <MainContent open={open}>
                <DrawerHeader />

                {/* Welcome Section */}
                <Paper elevation={0} sx={{
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <WavingHand sx={{ fontSize: 48, color: '#ffd54f' }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Xin chào, {user?.name || 'Phụ huynh'}!
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                Chào mừng bạn đến với hệ thống chăm sóc y tế học đường
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Quick Actions */}
                

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Tổng số con em
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            {children.length}
                                        </Typography>
                                    </Box>
                                    <ChildCare sx={{ fontSize: 40, color: '#4caf50' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Hồ sơ sức khỏe
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            {healthProfiles.length}
                                        </Typography>
                                    </Box>
                                    <FavoriteOutlined sx={{ fontSize: 40, color: '#f44336' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            Thông báo mới
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            3
                                        </Typography>
                                    </Box>
                                    <Notifications sx={{ fontSize: 40, color: '#ff9800' }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    
                </Grid>

                {/* Children List */}
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Danh sách con em
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<PersonAdd />}
                            onClick={() => navigate('/parent/children/add')}
                        >
                            Thêm mới
                        </Button>
                    </Box>

                    {children.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <ChildCare sx={{ fontSize: 80, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary">
                                Chưa có thông tin con em
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<PersonAdd />}
                                onClick={() => navigate('/parent/children/add')}
                            >
                                Thêm thông tin con em đầu tiên
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {children.map((child) => (
                                <Grid item xs={12} md={6} lg={4} key={child._id}>
                                    <Card sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 3
                                        }
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                    {child.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {child.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date(child.birthdate).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Mã HS: {child.studentCode}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Giới tính: {child.gender === 'male' ? 'Nam' : child.gender === 'female' ? 'Nữ' : 'Khác'}
                                                </Typography>
                                                <Chip
                                                    label={child.isActive ? 'Đang học' : 'Không hoạt động'}
                                                    color={child.isActive ? 'success' : 'default'}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    onClick={() => navigate(`/parent/children/${child._id}`)}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/parent/children/${child._id}/edit`)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </MainContent>
        </Box>
    );
};

export default ParentDashboard;
