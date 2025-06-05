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
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { LoginContainer, LoginPaper, LogoContainer, LogoIcon } from '../common/LoginPageStyles';

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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,    onSubmit: async (values) => {
      dispatch(loginStart());
      
      try {
        // TODO: Replace with actual API call
        console.log('Login attempt:', values);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes - remove in production
        if (values.email === 'admin@school.com' && values.password === 'admin123') {
          const mockUser = {
            id: 1,
            email: values.email,
            name: 'Quản trị viên',
            role: 'admin'
          };
          const mockToken = 'mock-jwt-token-123';
          
          dispatch(loginSuccess({ user: mockUser, token: mockToken }));
          toast.success('Đăng nhập thành công!');
          navigate('/dashboard');
        } else {
          dispatch(loginFailure('Email hoặc mật khẩu không chính xác'));
        }
      } catch (err) {
        dispatch(loginFailure('Có lỗi xảy ra. Vui lòng thử lại.'));
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
            type="submit"            size="large"
            disabled={loading}            sx={{
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
            className="custom-button">
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Đăng nhập'
            )}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Demo: admin@school.com / admin123
            </Typography>
          </Box>
        </Box>
      </LoginPaper>
    </LoginContainer>
  );
};

export default LoginPage;
