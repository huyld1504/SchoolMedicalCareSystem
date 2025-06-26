import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Vaccines as VaccineIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as ApproveIcon,
  Cancel as DenyIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router';

import vaccinationApi from '../../api/vaccinationApi';

const VaccinationNotificationDetailPage = () => {
  const navigate = useNavigate();
  const { notificationId } = useParams();
  const location = useLocation();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog state for consent
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [consentType, setConsentType] = useState('');
  const [consentNote, setConsentNote] = useState('');

  // Load notification detail từ state hoặc API
  useEffect(() => {
    // Kiểm tra xem có data từ state không
    if (location.state?.notificationData) {
      setNotification(location.state.notificationData);
      setLoading(false);
    } else {
      // Nếu không có, sẽ cần implement API để lấy chi tiết theo ID
      toast.error('Không tìm thấy thông tin thông báo');
      navigate('/parent/vaccination-notifications');
    }
  }, [notificationId, location.state, navigate]);

  const handleBack = () => {
    navigate('/parent/vaccination-notifications');
  };

  const handleOpenConsentDialog = (type) => {
    setConsentType(type);
    setConsentNote('');
    setConsentDialogOpen(true);
  };

  const handleCloseConsentDialog = () => {
    setConsentDialogOpen(false);
    setConsentType('');
    setConsentNote('');
  };

  const handleSubmitConsent = async () => {
    // Kiểm tra bắt buộc nhập ghi chú khi từ chối
    if (consentType === 'denied' && !consentNote.trim()) {
      toast.error('Vui lòng nhập lý do từ chối tiêm chủng');
      return;
    }

    
    try {
      setSaving(true);

      const requestData = {
        consent: consentType
      };
      if (consentNote && consentNote.trim()) {
        requestData.note = consentNote.trim();
      }

      const response = await vaccinationApi.updateParentConsent(notification._id, requestData);

      if (response.isSuccess) {
        toast.success(`Đã ${consentType === 'approved' ? 'đồng ý' : 'từ chối'} tiêm chủng cho con`);

        // Cập nhật thông tin notification
        setNotification(prev => ({
          ...prev,
          parentConsent: consentType,
          parentNote: consentNote?.trim() || '',
          parentConsentDate: new Date().toISOString(),
          vaccinationStatus: consentType === 'denied' ? 'cancelled' : prev.vaccinationStatus
        }));

        handleCloseConsentDialog();
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật phản hồi');
      }
    } catch (error) {
      console.error('Error updating consent:', error);
      toast.error('Có lỗi xảy ra khi cập nhật phản hồi');
    } finally {
      setSaving(false);
    }
  };

  // Check if campaign has started
  const isCampaignStarted = () => {
    if (!notification.campaign?.startDate) return false;
    const startDate = new Date(notification.campaign.startDate);
    const currentDate = new Date();
    return currentDate >= startDate;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get consent color and label
  const getConsentColor = (consent) => {
    switch (consent) {
      case 'approved':
        return '#2e7d32'; // Xanh lá
      case 'denied':
        return '#d32f2f'; // Đỏ
      case 'pending':
        return '#ed6c02'; // Cam
      default:
        return '#757575'; // Xám
    }
  };

  const getConsentLabel = (consent) => {
    switch (consent) {
      case 'approved':
        return 'Đã đồng ý';
      case 'denied':
        return 'Đã từ chối';
      case 'pending':
        return 'Chờ phản hồi';
      default:
        return 'Không xác định';
    }
  };

  // Get vaccination status color and label
  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#2e7d32'; // Xanh lá
      case 'scheduled':
        return '#1976d2'; // Xanh dương
      case 'missed':
        return '#ed6c02'; // Cam
      case 'cancelled':
        return '#d32f2f'; // Đỏ
      default:
        return '#757575'; // Xám
    }
  };

  const getVaccinationStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã tiêm';
      case 'scheduled':
        return 'Đã lên lịch';
      case 'missed':
        return 'Bỏ lỡ';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!notification) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">
          Không tìm thấy thông tin thông báo tiêm chủng
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 3, px: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', maxWidth: '1600px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <VaccineIcon sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '2.5rem' }}>
              Chi tiết thông báo tiêm chủng
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              Thông tin chi tiết và phản hồi về chiến dịch tiêm chủng
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: '1400px', mx: 'auto', justifyContent: 'center' }}>
        {/* Bảng thông tin tổng hợp */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 4, borderRadius: 5, p: 2, transform: 'scale(1.08)', transition: 'transform 0.2s', maxWidth: '100%' }}>
            <CardContent sx={{ p: 5 }}>
              <Grid container spacing={4} alignItems="stretch">
                {/* Cột 1: Thông tin chiến dịch */}
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  <Box sx={{ bgcolor: 'primary.50', p: 4, borderRadius: 4, height: '100%', border: '2.5px solid', borderColor: 'primary.200', minHeight: '400px', fontSize: '1.1rem' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: 'primary.main', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                      <VaccineIcon sx={{ mr: 1, fontSize: 22 }} />
                      Thông tin chiến dịch
                    </Typography>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Tên chiến dịch
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                        {notification.campaign?.vaccineName || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Loại vaccine
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                        {notification.campaign?.vaccineType || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Đối tượng tiêm
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                        {notification.campaign?.targetAudience || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Ngày bắt đầu
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                        {formatDate(notification.campaign?.startDate)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Trạng thái
                      </Typography>
                      <Chip
                        label={notification.campaign?.status === 'planned' ? 'Đã lên kế hoạch' : notification.campaign?.status || 'N/A'}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '0.8rem', fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Cột 2: Thông tin học sinh */}
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  <Box sx={{ bgcolor: 'success.50', p: 4, borderRadius: 4, height: '100%', border: '2.5px solid', borderColor: 'success.200', minHeight: '400px', fontSize: '1.1rem' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: 'success.main', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 22 }} />
                      Thông tin học sinh
                    </Typography>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Họ và tên
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                        {notification.student?.name || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Mã học sinh
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                        {notification.student?.studentCode || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Ngày sinh
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                        {formatDate(notification.student?.dateOfBirth || notification.student?.birthdate) || 'Chưa có'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Giới tính
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                        {notification.student?.gender === 'male' ? 'Nam' :
                          notification.student?.gender === 'female' ? 'Nữ' : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Cột 3: Trạng thái và phản hồi */}
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  <Box sx={{ bgcolor: 'warning.50', p: 4, borderRadius: 4, height: '100%', border: '2.5px solid', borderColor: 'warning.200', minHeight: '400px', fontSize: '1.1rem' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'warning.main', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                      <EventIcon sx={{ mr: 1, fontSize: 20 }} />
                      Trạng thái và phản hồi
                    </Typography>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Trạng thái tiêm chủng
                      </Typography>
                      <Chip
                        label={getVaccinationStatusLabel(notification.vaccinationStatus)}
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'white',
                          backgroundColor: getVaccinationStatusColor(notification.vaccinationStatus),
                          minWidth: '110px',
                          height: '34px'
                        }}
                      />
                    </Box>

                    {notification.parentConsentDate && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                          Ngày phản hồi
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                          {formatDateTime(notification.parentConsentDate)}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Phản hồi của phụ huynh
                      </Typography>
                      <Chip
                        label={getConsentLabel(notification.parentConsent)}
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'white',
                          backgroundColor: getConsentColor(notification.parentConsent),
                          minWidth: '110px',
                          height: '34px'
                        }}
                      />
                      {notification.parentNote && (
                        <Box sx={{ mt: 1.5, width: '100%' }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.85rem', mb: 0.5, ml: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {notification.parentConsent === 'denied' ? 'Lý do từ chối của phụ huynh' : 'Ghi chú của phụ huynh'}
                          </Typography>
                          <Box
                            sx={{
                              bgcolor: 'white',
                              borderRadius: 2,
                              border: '1.5px solid',
                              borderColor: 'grey.300',
                              p: 1.5,
                              minHeight: 32,
                              fontSize: '0.8rem',
                              wordBreak: 'break-word',
                              width: '100%',
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {notification.parentNote.replace(/(.{36})/g, '$1\n')}
                          </Box>
                        </Box>
                      )}
                    </Box>

                    {notification.vaccinationDate && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                          Ngày tiêm
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {formatDateTime(notification.vaccinationDate)}
                        </Typography>
                      </Box>
                    )}

                    {notification.vaccinatedNurse && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {notification.vaccinatedNurse.name}
                        </Typography>
                      </Box>
                    )}

                    {/* Nút hành động */}
                    {notification.parentConsent === 'pending' && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.5 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<ApproveIcon />}
                          onClick={() => handleOpenConsentDialog('approved')}
                          fullWidth
                          size="small"
                          sx={{ py: 0.8, fontSize: '0.8rem', fontWeight: 600 }}
                          disabled={notification.parentConsent !== 'pending'}
                        >
                          Đồng ý
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DenyIcon />}
                          onClick={() => handleOpenConsentDialog('denied')}
                          fullWidth
                          size="small"
                          sx={{ py: 0.8, fontSize: '0.8rem', fontWeight: 600 }}
                          disabled={notification.parentConsent !== 'pending'}
                        >
                          Từ chối
                        </Button>
                      </Box>
                    )}                 
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>       
      </Grid>

      {/* Dialog xác nhận phản hồi */}
      <Dialog open={consentDialogOpen && notification.parentConsent === 'pending'} onClose={handleCloseConsentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {consentType === 'approved' ? 'Xác nhận đồng ý tiêm chủng' : 'Xác nhận từ chối tiêm chủng'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {consentType === 'approved'
                ? `Bạn có chắc chắn muốn đồng ý cho con ${notification.student?.name} tham gia tiêm vaccine "${notification.campaign?.vaccineName}"?`
                : `Bạn có chắc chắn muốn từ chối cho con ${notification.student?.name} tham gia tiêm vaccine "${notification.campaign?.vaccineName}"?`}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={consentType === 'denied' ? "Lý do từ chối (bắt buộc)" : "Ghi chú (nếu có)"}
              placeholder={consentType === 'denied'
                ? "Vui lòng nhập lý do tại sao bạn từ chối cho con tiêm vaccine này..."
                : "Nhập ghi chú của bạn về quyết định này..."}
              value={consentNote}
              onChange={(e) => setConsentNote(e.target.value)}
              variant="outlined"
              required={consentType === 'denied'}
              error={consentType === 'denied' && !consentNote.trim()}
              helperText={consentType === 'denied' && !consentNote.trim() ? "Vui lòng nhập lý do từ chối" : ""}
              disabled={notification.parentConsent !== 'pending'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConsentDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmitConsent}
            variant="contained"
            color={consentType === 'approved' ? 'success' : 'error'}
            disabled={saving || (consentType === 'denied' && !consentNote.trim()) || notification.parentConsent !== 'pending'}
          >
            {saving ? (
              <CircularProgress size={24} />
            ) : (
              consentType === 'approved' ? 'Xác nhận đồng ý' : 'Xác nhận từ chối'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VaccinationNotificationDetailPage;
