import React from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import {
  LocalHospital,
  School,
  Security,
  Speed,
  Login,
  MedicalServices,
  HealthAndSafety,
  People
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalHospital sx={{ fontSize: 40, color: '#4caf50' }} />,
      title: 'Quản lý Sức khỏe',
      description: 'Theo dõi và quản lý thông tin sức khỏe học sinh một cách toàn diện'
    },
    {
      icon: <School sx={{ fontSize: 40, color: '#2196f3' }} />,
      title: 'Tích hợp Trường học',
      description: 'Kết nối liền mạch với hệ thống quản lý trường học hiện tại'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#ff9800' }} />,
      title: 'Bảo mật Tuyệt đối',
      description: 'Đảm bảo thông tin y tế được bảo vệ theo tiêu chuẩn cao nhất'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#e91e63' }} />,
      title: 'Xử lý Nhanh chóng',
      description: 'Phản ứng nhanh trong các tình huống khẩn cấp về sức khỏe'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        py: 2, 
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <MedicalServices sx={{ fontSize: 32, color: 'white' }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            School Medical Care System
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Login />}
          onClick={() => navigate('/login')}
          sx={{
            bgcolor: 'white',
            color: '#667eea',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          Đăng nhập
        </Button>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip 
            label="🏥 Hệ thống Y tế Trường học" 
            sx={{ 
              mb: 3,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)'
            }} 
          />
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold', 
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Chăm sóc Sức khỏe
            <br />
            <span style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', 
                          WebkitBackgroundClip: 'text', 
                          WebkitTextFillColor: 'transparent' }}>
              Học sinh Toàn diện
            </span>
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Hệ thống quản lý y tế hiện đại, giúp theo dõi và bảo vệ sức khỏe học sinh một cách hiệu quả và an toàn
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<Login />}
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#45a049',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Bắt đầu Sử dụng
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HealthAndSafety />}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Tìm hiểu thêm
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                    background: 'rgba(255, 255, 255, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box sx={{ 
          mt: 8, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
            Tại sao chọn chúng tôi?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                99%
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', mt: 1 }}>
                Độ tin cậy
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                24/7
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', mt: 1 }}>
                Hỗ trợ
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                1000+
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', mt: 1 }}>
                Trường học tin dùng
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        py: 3, 
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          © 2025 School Medical Care System. Bảo lưu mọi quyền.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
