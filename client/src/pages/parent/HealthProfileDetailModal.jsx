import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  ArrowBack,
  LocalHospital,
  Person,
  Height,
  FitnessCenter,
  Bloodtype,
  RemoveRedEye,
  Warning,
  AccessibleForward
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import healthProfileAPI from '../../api/healthProfileApi';
import { removeBrackets, processHealthDataForDisplay } from '../../utils/string.utils';

const HealthProfileDetailModal = ({ open, onClose, profileId, childId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const loadData = async () => {
      if (!open || !profileId) return;

      try {
        setLoading(true); setError(null);
        const profileResponse = await healthProfileAPI.getById(profileId);
        const profileData = profileResponse.data;

        // Xử lý data để loại bỏ dấu ngoặc vuông khi hiển thị
        const processedProfile = processHealthDataForDisplay(profileData);
        setProfile(processedProfile);
        console.log('Health Profile Data:', profile);

      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Không thể tải dữ liệu');
        toast.error('❌ ' + (err.message || 'Có lỗi xảy ra khi tải dữ liệu'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, profileId]);

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
  // Hàm parse JSON data cho các field array với xử lý dấu ngoặc vuông
  const parseHealthData = (data) => {
    if (!data) return [];

    // Loại bỏ các giá trị không hợp lệ
    if (data === '1' || data === '' || data === '[]' || data === 'null' || data === 'undefined') {
      return [];
    }

    // Nếu data đã là array, return luôn
    if (Array.isArray(data)) {
      return data.filter(item => item && item.toString().trim() !== '');
    }

    // Convert to string để xử lý
    const dataStr = data.toString().trim();

    // Loại bỏ dấu ngoặc vuông nếu có
    const cleanData = dataStr.replace(/^\[|\]$/g, '').trim();

    if (!cleanData) return [];

    try {
      // Thử parse JSON trước
      const parsed = JSON.parse('[' + cleanData + ']');
      return Array.isArray(parsed) ? parsed.filter(item => item && item.toString().trim() !== '') : [];
    } catch {
      // Nếu không parse được, split bằng dấu phẩy
      return cleanData
        .split(',')
        .map(item => item.replace(/['"]/g, '').trim())
        .filter(item => item && item !== 'null' && item !== 'undefined');
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Lỗi</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            {error}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        py: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalHospital sx={{ color: '#1976d2', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              Hồ sơ sức khỏe - {profile?.studentId?.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Chi tiết thông tin sức khỏe học sinh
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Student Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person sx={{ fontSize: 20, color: '#1976d2' }} />
              Thông tin học sinh
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Họ và tên
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile?.studentId?.name || 'Chưa có thông tin'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Mã học sinh
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile?.studentId?.studentCode || 'Chưa có thông tin'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Mã BHYT
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {profile?.studentId?.medicalConverageId || 'Chưa có thông tin'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Health Profile Details */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalHospital sx={{ fontSize: 20, color: '#1976d2' }} />
              Chi tiết hồ sơ sức khỏe
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <Height sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Chiều cao
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {profile?.height || 'Không có'} cm
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <FitnessCenter sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Cân nặng
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {profile?.weight || 'Không có'} kg
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <Bloodtype sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Nhóm máu
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {profile?.bloodType || 'Không có'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <RemoveRedEye sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Thị lực
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {profile?.vision || 'Không có'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>            <Divider sx={{ my: 3 }} />

            {/* Additional Health Information */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Thông tin sức khỏe bổ sung
            </Typography>

            <Grid container spacing={2}>
              {/* Dị ứng */}
              {(() => {
                const allergiesData = parseHealthData(profile?.allergies);
                console.log('Allergies data:', profile?.allergies, 'Parsed:', allergiesData);

                if (allergiesData.length > 0) {
                  return (
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#fff8e1', borderRadius: 1, border: '1px solid #ffcc02' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Warning sx={{ color: '#f57c00', mr: 1, mt: 0.5, fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#e65100' }}>
                            Dị ứng
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {allergiesData.map((item, index) => (
                            <Chip
                              key={index}
                              label={item}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  );
                }
                return null;
              })()}

              {/* Bệnh mãn tính */}
              {(() => {
                const chronicDiseasesData = parseHealthData(profile?.chronicDiseases);
                console.log('Chronic diseases data:', profile?.chronicDiseases, 'Parsed:', chronicDiseasesData);

                if (chronicDiseasesData.length > 0) {
                  return (
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#fce4ec', borderRadius: 1, border: '1px solid #f8bbd9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <LocalHospital sx={{ color: '#c2185b', mr: 1, mt: 0.5, fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#ad1457' }}>
                            Bệnh mãn tính
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {chronicDiseasesData.map((item, index) => (
                            <Chip
                              key={index}
                              label={item}
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  );
                }
                return null;
              })()}

              {/* Thiết bị hỗ trợ */}
              {(() => {
                const devicesSupportData = parseHealthData(profile?.devicesSupport);
                console.log('Devices support data:', profile?.devicesSupport, 'Parsed:', devicesSupportData);

                if (devicesSupportData.length > 0) {
                  return (
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #90caf9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <AccessibleForward sx={{ color: '#1976d2', mr: 1, mt: 0.5, fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1565c0' }}>
                            Thiết bị hỗ trợ
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {devicesSupportData.map((item, index) => (
                            <Chip
                              key={index}
                              label={item}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  );
                }
                return null;
              })()}

              {/* Hiển thị thông báo nếu không có dữ liệu */}
              {(() => {
                const allergiesData = parseHealthData(profile?.allergies);
                const chronicDiseasesData = parseHealthData(profile?.chronicDiseases);
                const devicesSupportData = parseHealthData(profile?.devicesSupport);

                const hasAnyData = allergiesData.length > 0 || chronicDiseasesData.length > 0 || devicesSupportData.length > 0;

                if (!hasAnyData) {
                  return (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" color="text.secondary">
                          Không có thông tin sức khỏe bổ sung nào được ghi nhận
                        </Typography>
                      </Box>
                    </Grid>
                  );
                }
                return null;
              })()}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Timestamp Information */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Thông tin hồ sơ
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Ngày tạo hồ sơ
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDateTime(profile?.createdAt)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Cập nhật lần cuối
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatDateTime(profile?.updatedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          startIcon={<ArrowBack />}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthProfileDetailModal;
