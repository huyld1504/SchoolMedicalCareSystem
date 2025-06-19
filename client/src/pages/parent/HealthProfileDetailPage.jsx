import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  LocalHospital,
  Person,
  Timeline,
  Visibility,
  Height,
  FitnessCenter,
  Bloodtype,
  RemoveRedEye,
  Warning,
  AccessibleForward,
  CalendarToday
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import healthProfileAPI from '../../api/healthProfileApi';

const HealthProfileDetailPage = () => {
  const navigate = useNavigate();
  const { id: childId } = useParams(); // childId from URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [child, setChild] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading health profile details for child ID:', childId);

        // Load child information first
        let childData = null;
        try {
          const childResponse = await childApi.getChildById(childId);
          childData = childResponse.data.records;
          console.log('Child data loaded:', childData);
          setChild(childData);
        } catch (childErr) {
          console.error('Error loading child data:', childErr);
          throw new Error('Không thể tải thông tin con em');
        }

      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Không thể tải dữ liệu');
        toast.error('❌ ' + (err.message || 'Có lỗi xảy ra khi tải dữ liệu'));
      } finally {
        setLoading(false);
      }
    };

    if (childId) {
      loadData();
    }
  }, [childId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Ngày không hợp lệ';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Ngày không hợp lệ';
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      default: return 'Khác';
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="xl">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button
              variant="outlined"
              onClick={() => navigate('/parent/children')}
              sx={{ ml: 2 }}
            >
              Quay lại
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={0} sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={() => navigate(`/parent/children/${childId}`)}
              sx={{ mr: 2, color: 'white' }}
            >
              <ArrowBack />
            </IconButton>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
              <LocalHospital />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Hồ sơ sức khỏe - {child.name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Xem chi tiết lịch sử sức khỏe của con em
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Child Summary Card */}
          <Grid item xs={12}>
            <Card elevation={2} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Thông tin con em
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{
                        width: 50,
                        height: 50,
                        bgcolor: 'primary.main',
                        fontSize: '1.2rem'
                      }}>
                        {child.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {child.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {child.studentCode}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Ngày sinh
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatDate(child.birthdate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Giới tính
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {getGenderText(child.gender)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Box>
                      <Chip
                        label={child.isActive ? 'Đang học' : 'Không hoạt động'}
                        color={child.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Profiles Table */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalHospital sx={{ fontSize: 28, color: '#f44336', mr: 2 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Lịch sử hồ sơ sức khỏe
                      </Typography>
                      <Badge badgeContent={child.length} color="primary" sx={{ ml: 2 }} />
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate(`/parent/children/${childId}`)}
                    >
                      Quay lại
                    </Button>
                  </Box>
                </Box>

                {child.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: 'center' }}>
                    <LocalHospital sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Chưa có hồ sơ sức khỏe
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hồ sơ sức khỏe sẽ được cập nhật bởi y tá trường
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ fontSize: 18, mr: 1 }} />
                              Ngày tạo
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Height sx={{ fontSize: 18, mr: 1 }} />
                              Chiều cao (cm)
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FitnessCenter sx={{ fontSize: 18, mr: 1 }} />
                              Cân nặng (kg)
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Bloodtype sx={{ fontSize: 18, mr: 1 }} />
                              Nhóm máu
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <RemoveRedEye sx={{ fontSize: 18, mr: 1 }} />
                              Thị lực
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Warning sx={{ fontSize: 18, mr: 1 }} />
                              Dị ứng
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Bệnh mãn tính</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessibleForward sx={{ fontSize: 18, mr: 1 }} />
                              Thiết bị hỗ trợ
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {child.map((profile, index) => (
                          <TableRow
                            key={profile._id || index}
                            sx={{
                              '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                              '&:hover': { bgcolor: 'action.selected' }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {formatDateTime(profile.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {profile.height || 'Chưa có'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {profile.weight || 'Chưa có'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={profile.bloodType || 'Chưa xét nghiệm'}
                                variant="outlined"
                                size="small"
                                color={profile.bloodType ? 'primary' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {profile.vision || 'Chưa kiểm tra'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {profile.allergies ? (
                                <Tooltip title={profile.allergies}>
                                  <Chip
                                    label="Có dị ứng"
                                    color="warning"
                                    size="small"
                                    icon={<Warning />}
                                  />
                                </Tooltip>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Không có
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {profile.chronicDiseases ? (
                                <Tooltip title={profile.chronicDiseases}>
                                  <Typography variant="body2" sx={{
                                    maxWidth: '150px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {profile.chronicDiseases}
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Không có
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {profile.devicesSupport ? (
                                <Tooltip title={profile.devicesSupport}>
                                  <Chip
                                    label="Có thiết bị"
                                    color="info"
                                    size="small"
                                    icon={<AccessibleForward />}
                                  />
                                </Tooltip>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Không có
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HealthProfileDetailPage;
