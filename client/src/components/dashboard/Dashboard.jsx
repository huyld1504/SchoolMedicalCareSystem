import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  LocalHospital,
  Assessment,
  ExitToApp,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../store/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, refreshToken } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đã đăng xuất thành công!');
    navigate('/login');  };

  const getRoleBasedTitle = () => {
    const roleTitles = {
      admin: 'Dashboard - Quản trị viên',
      nurse: 'Dashboard - Y tá trường học',
      parent: 'Dashboard - Phụ huynh'
    };
    return roleTitles[user?.role] || 'Dashboard - School Medical Care';
  };

  const getRoleBasedStats = () => {
    if (user?.role === 'admin') {
      return [
        { title: 'Tổng học sinh', value: '1,234', icon: People, color: '#1976d2' },
        { title: 'Khám sức khỏe hôm nay', value: '45', icon: LocalHospital, color: '#2e7d32' },
        { title: 'Báo cáo tháng này', value: '89', icon: Assessment, color: '#ed6c02' },
      ];
    } else if (user?.role === 'nurse') {
      return [
        { title: 'Lịch khám hôm nay', value: '12', icon: LocalHospital, color: '#2e7d32' },
        { title: 'Học sinh cần theo dõi', value: '8', icon: People, color: '#d32f2f' },
        { title: 'Báo cáo đã tạo', value: '25', icon: Assessment, color: '#1976d2' },
      ];
    } else if (user?.role === 'parent') {
      return [
        { title: 'Con em của tôi', value: '2', icon: People, color: '#1976d2' },
        { title: 'Lịch khám gần nhất', value: '3 ngày', icon: LocalHospital, color: '#2e7d32' },
        { title: 'Thông báo mới', value: '5', icon: Assessment, color: '#ed6c02' },
      ];
    }
    return [
      { title: 'Tổng học sinh', value: '1,234', icon: People, color: '#1976d2' },
      { title: 'Khám sức khỏe hôm nay', value: '45', icon: LocalHospital, color: '#2e7d32' },
      { title: 'Báo cáo tháng này', value: '89', icon: Assessment, color: '#ed6c02' },
    ];
  };

  const stats = getRoleBasedStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {getRoleBasedTitle()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
          {user && (
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Xin chào, <strong>{user.name}</strong>
              </Typography>
              <Typography variant="caption" color="primary">
                {user.role === 'admin' && '👨‍💼 Quản trị viên'}
                {user.role === 'nurse' && '👩‍⚕️ Y tá'}
                {user.role === 'parent' && '👨‍👩‍👧‍👦 Phụ huynh'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }} className="dashboard-card">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComponent sx={{ color: stat.color, fontSize: 32, mr: 2 }} />
                    <Typography variant="h6" component="h2">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h3" component="div" color={stat.color} fontWeight="bold">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}      </Grid>

      {/* Redux State Debug Card */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          🔍 Redux State Debug - Token Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                User Information:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'white', p: 1, borderRadius: 1, mt: 1 }}>
                {user ? JSON.stringify(user, null, 2) : 'No user data'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Access Token:
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: 'monospace', 
                bgcolor: 'white', 
                p: 1, 
                borderRadius: 1, 
                mt: 1,
                wordBreak: 'break-all'
              }}>
                {token ? `${token.substring(0, 50)}...` : 'No token'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Refresh Token:
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: 'monospace', 
                bgcolor: 'white', 
                p: 1, 
                borderRadius: 1, 
                mt: 1,
                wordBreak: 'break-all'
              }}>
                {refreshToken ? `${refreshToken.substring(0, 50)}...` : 'No refresh token'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, p: 2, bgcolor: token && refreshToken ? '#e8f5e8' : '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" color={token && refreshToken ? 'success.main' : 'warning.main'}>
            ✅ Status: {token && refreshToken ? 'Tokens saved successfully in Redux!' : 'Missing tokens in Redux state'}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Chào mừng đến với Hệ thống Quản lý Y tế Trường học
        </Typography>
        <Typography variant="body1" paragraph>
          Đây là trang dashboard chính của hệ thống. Từ đây bạn có thể:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li">Quản lý thông tin học sinh</Typography>
          <Typography component="li">Theo dõi tình trạng sức khỏe</Typography>
          <Typography component="li">Lên lịch khám sức khỏe định kỳ</Typography>
          <Typography component="li">Tạo báo cáo y tế</Typography>
          <Typography component="li">Quản lý nhân viên y tế</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Dashboard;
