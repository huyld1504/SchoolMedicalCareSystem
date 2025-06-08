import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { LoginContainer, LoginPaper, LogoContainer, LogoIcon } from '../common/LoginPageStyles';
import authApi from '../../api/authApi';

// Validation schema
const validationSchema = yup.object({
  email: yup
    .string('Nhập email')
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string('Nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Test function for toast notifications
  const testToastNotifications = () => {
    toast.success('Thông báo thành công! Sẽ tự động tắt sau 3 giây', {
      autoClose: 3000,
    });
    
    setTimeout(() => {
      toast.error('Thông báo lỗi! Cũng sẽ tự động tắt sau 3 giây', {
        autoClose: 3000,
      });
    }, 500);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,    
    onSubmit: async (values) => {
      dispatch(loginStart());
      
      try {
        const response = await authApi.login(values);
        
        if (response.data && response.data.data) {          
          const userData = response.data.data;
            // Hiển thị thông tin user đơn giản
          console.log('isSuccessful:', true);
          console.log('message:', 'Đăng nhập thành công');
          console.log('email:', userData.email || values.email);
          //console.log('Password:', values.password);
          console.log('role:', userData.role);
          console.log('name:', userData.name);
          console.log('id:', userData.id);
          console.log('token:', userData.token);
          console.log('refreshToken:', userData.refreshToken);
            // Store tokens in localStorage
          if (userData.token) {
            localStorage.setItem('accessToken', userData.token);
          }
          if (userData.refreshToken) {
            localStorage.setItem('refreshToken', userData.refreshToken);
          }
          
          const user = {
            id: userData.id,
            email: userData.email || values.email,
            name: userData.name,
            role: userData.role,
          };          dispatch(loginSuccess({
            user: user,
            token: userData.token,
            refreshToken: userData.refreshToken
          }));

          // Log Redux state sau khi dispatch
          console.log('=== REDUX STATE AFTER LOGIN ===');
          console.log('Redux Token:', userData.token);
          console.log('Redux RefreshToken:', userData.refreshToken);
          console.log('Redux User:', user);
          
          toast.success(`Đăng nhập thành công!`);
          navigate('/dashboard');
        }      } catch (apiError) {
        console.log('isSuccessful:', false);
        console.log('message:', 'Đăng nhập thất bại');
                
        let errorMessage = 'Đăng nhập thất bại';
        
        if (apiError.response) {
          console.log('Server Error Response:', apiError.response.data);
          
          const serverMessage = apiError.response.data?.message || apiError.response.data?.error || '';
          
          if (serverMessage.toLowerCase().includes('user or password is incorrect') || 
              serverMessage.toLowerCase().includes('invalid credentials') ||
              serverMessage.toLowerCase().includes('authentication failed')) {
            errorMessage = 'Email hoặc mật khẩu không chính xác';
          } else if (serverMessage.toLowerCase().includes('user not found')) {
            errorMessage = 'Tài khoản không tồn tại';
          } else if (serverMessage.toLowerCase().includes('password')) {
            errorMessage = 'Mật khẩu không chính xác';
          } else if (serverMessage.toLowerCase().includes('email')) {
            errorMessage = 'Email không hợp lệ';
          } else if (serverMessage) {
            errorMessage = serverMessage; // Giữ nguyên nếu đã là tiếng Việt
          } else {
            errorMessage = 'Email hoặc mật khẩu không chính xác';
          }
        } else if (apiError.request) {
          console.log('Network Error - Server không phản hồi');
          errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra server backend.';
        } else {
          errorMessage = apiError.message || 'Đăng nhập thất bại';
        }
        
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
      }
    },
  });
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Quick login functions
  const quickLogin = (email, password, role) => {
    formik.setValues({ email, password });
    console.log(`Quick login selected: ${role} (${email})`);
  };  return (
    <LoginContainer maxWidth={false} className="login-container">
      <LoginPaper elevation={3} className="login-paper">
        {/* Back to Home Button */}
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          left: 16,
          zIndex: 1
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{
              color: '#1976d2',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                transform: 'translateX(-3px)',
              },
              transition: 'all 0.3s ease',
              borderRadius: 2,
              px: 2,
              py: 1
            }}
          >
            Trang chủ
          </Button>
        </Box>

        <LogoContainer>
          <LogoIcon className="logo-icon" />
          <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
            School Medical Care
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hệ thống quản lý y tế trường học
          </Typography>
        </LogoContainer>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom>
          Đăng nhập
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
            disabled={loading}
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"            
            size="large"
            disabled={loading}            
            sx={{
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            className="custom-button">
            {loading ? (
              <CircularProgress size={24} 
              color="inherit" />
            ) : (
              'Đăng nhập'            )}
          </Button>         
        </Box>
      </LoginPaper>
    </LoginContainer>
  );
};

export default LoginPage;
