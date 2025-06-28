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
  Chip
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
    if (!data || data === '1' || data === '') return [];

    // Loại bỏ dấu ngoặc vuông trước khi xử lý
    const cleanData = removeBrackets(data);

    try {
      // Nếu data là JSON string, parse nó
      const parsed = JSON.parse(cleanData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Nếu không parse được, coi như string và split bằng dấu phẩy
      return cleanData.split(',').map(item => item.trim()).filter(item => item);
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
      <DialogTitle sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalHospital sx={{ color: '#1976d2' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Hồ sơ sức khỏe - {profile?.studentId?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chi tiết lịch sử sức khỏe
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Student Information */}
        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: 20 }} />
            Thông tin học sinh
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Họ và tên
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {profile?.studentId?.name || 'Chưa có thông tin'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mã học sinh
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {profile?.studentId?.studentCode || 'Chưa có thông tin'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mã BHYT
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {profile?.studentId?.medicalConverageId}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Health Profile Details */}
        <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital sx={{ fontSize: 20 }} />
            Chi tiết hồ sơ sức khỏe
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Height sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Chiều cao
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {profile?.height || 'N/A'} cm
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <FitnessCenter sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Cân nặng
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {profile?.weight || 'N/A'} kg
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <Bloodtype sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Nhóm máu
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {profile?.bloodType || 'N/A'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                <RemoveRedEye sx={{ fontSize: 24, color: '#666', mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Thị lực
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {profile?.vision || 'N/A'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Additional Health Information */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Thông tin sức khỏe bổ sung
          </Typography>          <Grid container spacing={2}>            {(() => {
            const allergiesData = parseHealthData(profile?.allergies?.deleteSpecical);
            return allergiesData.length > 0 && (
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffcc02' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Warning sx={{ color: '#ff9800', mr: 1, mt: 0.5, fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#e65100' }}>
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
          })()}            {(() => {
            const chronicDiseasesData = parseHealthData(profile?.chronicDiseases?.deleteSpecical);
            return chronicDiseasesData.length > 0 && (
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #ffcdd2' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocalHospital sx={{ color: '#d32f2f', mr: 1, mt: 0.5, fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#c62828' }}>
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
          })()}            {(() => {
            const devicesSupportData = parseHealthData(profile?.devicesSupport?.deleteSpecical);
            return devicesSupportData.length > 0 && (
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <AccessibleForward sx={{ color: '#1976d2', mr: 1, mt: 0.5, fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
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
          })()}            {(() => {
            const allergiesData = parseHealthData(profile?.allergies?.deleteSpecical);
            const chronicDiseasesData = parseHealthData(profile?.chronicDiseases?.deleteSpecical);
            const devicesSupportData = parseHealthData(profile?.devicesSupport?.deleteSpecical);

            return allergiesData.length === 0 && chronicDiseasesData.length === 0 && devicesSupportData.length === 0 && (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không có thông tin sức khỏe bổ sung nào được ghi nhận
                  </Typography>
                </Box>
              </Grid>
            );
          })()}
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Timestamp Information */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Thông tin hồ sơ
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Ngày tạo hồ sơ
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {formatDateTime(profile?.createdAt)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Cập nhật lần cuối
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {formatDateTime(profile?.updatedAt)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
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
