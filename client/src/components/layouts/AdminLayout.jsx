import React, { useState } from "react";
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
  Chip,
} from "@mui/material";
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
  MedicalServices,
  Report,
  Person,
  Vaccines as VaccinesIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router";
import { toast } from "react-toastify";
import { clearUser } from "../../store/authSlice";

const drawerWidth = 280;

const AdminLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user } = useSelector((state) => state.auth); const menuItems = [
    {
      text: "Quản lý tài khoản",
      icon: <PeopleIcon />,
      path: "/admin/users",
      active: location.pathname === "/admin/users",
    },
    {
      text: "Chiến dịch tiêm chủng",
      icon: <VaccinesIcon />,
      path: "/admin/vaccination-campaigns",
      active: location.pathname.includes("/admin/vaccination-campaigns"),
    },
    {
      text: "Quản lí tiêm chủng",
      icon: <AssignmentIcon />,
      path: "/admin/vaccinations",
      active: location.pathname === "/admin/vaccinations",
    },
    {
      text: "Sự kiện y tế",
      icon: <MedicalServices />,
      path: "/nurse/medical-events",
      active: location.pathname.includes("/medical-events"),
    },
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
    toast.success("Đăng xuất thành công!");
    navigate("/login");
    handleProfileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <HospitalIcon sx={{ fontSize: 32, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Y tế Học đường
          </Typography>
        </Box>        <Chip
          icon={<Person />}
          label="Quản trị viên"
          size="small"
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                backgroundColor: item.active ? "primary.main" : "transparent",
                color: item.active ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: item.active
                    ? "primary.dark"
                    : "action.hover",
                },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon
                sx={{
                  color: item.active ? "white" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: item.active ? 600 : 400,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Info */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.12)" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            sx={{
              flex: 1,
              color: "text.primary",
              fontWeight: 600,
            }}
          ></Typography>

          {/* Notifications */}
          <Tooltip title="Thông báo">
            <IconButton sx={{ mr: 1, color: "text.primary" }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Tài khoản">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ color: "text.primary" }}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(0,0,0,0.12)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: { width: 200, mt: 1 },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Hồ sơ cá nhân
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminLayout;
