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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { setUser } from '../../store/authSlice';
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
  const [isLogin, setIsLogin] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLogin(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await authApi.login(values); if (response.isSuccess) {
          const user = { id: response.data.id, email: response.data.email, role: response.data.role };
          const accessToken = response.data.token;
          const refreshToken = response.data.refreshToken;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          dispatch(setUser({ user }));
          toast.success(response.message);

          // Redirect based on user role
          switch (user.role) {
            case 'parent':
              navigate("/parent");
              break;
            case 'admin':
              navigate("/admin");
              break;
            case 'nurse':
              navigate("/nurse");
              break;
            default:
              navigate("/");
          }
        }
        setIsLogin(false);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
        setIsLogin(false);
      }
    },
  });
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
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
            }} sx={{ mb: 2 }}
            disabled={isLogin}
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
            disabled={isLogin}
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            size="large"
            disabled={isLogin}
            sx={{
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            className="custom-button">
            {isLogin ? (
              <CircularProgress size={24}
                color="inherit" />
            ) : (
              'Đăng nhập')}
          </Button>
        </Box>
      </LoginPaper>
    </LoginContainer>
  );
};

export default LoginPage;