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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Vaccines as VaccineIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as ApproveIcon,
  Cancel as DenyIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
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
      // Hiện tại backend chưa có endpoint này nên sẽ redirect về danh sách
      toast.error('Không tìm thấy thông tin thông báo');
      navigate('/parent/vaccination-notifications');
    }
  }, [notificationId, location.state, navigate]);

  const handleBack = () => {
    navigate('/parent/vaccination-notifications');
  };

  const handleRefresh = () => {
    if (location.state?.notificationData) {
      // Cập nhật lại dữ liệu từ state
      setNotification(location.state.notificationData);
      toast.success('Đã làm mới thông tin thông báo');
    } else {
      toast.info('Không có dữ liệu để làm mới');
    }
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

      // Chỉ gửi trường note khi có giá trị (không rỗng)
      const requestData = {
        consent: consentType
      };
      
      // Chỉ thêm note vào request khi có giá trị
      if (consentNote && consentNote.trim()) {
        requestData.note = consentNote.trim();
      }

      const response = await vaccinationApi.updateParentConsent(notification._id, requestData);

      if (response.isSuccess) {
        const isChangingDecision = notification.parentConsent !== 'pending';
        const actionText = isChangingDecision 
          ? `thay đổi quyết định thành ${consentType === 'approved' ? 'đồng ý' : 'từ chối'}`
          : `${consentType === 'approved' ? 'đồng ý' : 'từ chối'}`;
        
        toast.success(`Đã ${actionText} tiêm chủng cho con`);
        
        // Cập nhật thông tin notification
        setNotification(prev => ({
          ...prev,
          parentConsent: consentType,
          parentNote: consentNote?.trim() || prev.parentNote, // Chỉ cập nhật note khi có giá trị
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

  // Check if parent can change decision
  const canChangeDecision = () => {
    return !isCampaignStarted() && 
           notification.parentConsent !== 'pending' && 
           notification.vaccinationStatus !== 'completed';
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
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <VaccineIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Chi tiết thông báo tiêm chủng
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Thông tin chi tiết và phản hồi về chiến dịch tiêm chủng
            </Typography>
          </Box>
        </Box>
        
        {/* Nút làm mới */}
        <Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              boxShadow: 2
            }}
          >
            Làm mới
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Bảng thông tin tổng hợp */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Cột 1: Thông tin vaccine */}
                <Grid item xs={12} lg={4}>
                  <Box sx={{ bgcolor: 'primary.50', p: 3, borderRadius: 3, height: '100%', border: '2px solid', borderColor: 'primary.200', minHeight: '350px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: 'primary.main', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                      <VaccineIcon sx={{ mr: 1, fontSize: 22 }} />
                      Thông tin vaccine
                    </Typography>
                    
                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.85rem' }}>
                        Tên vaccine
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
                        Trạng thái chiến dịch
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
                <Grid item xs={12} lg={4}>
                  <Box sx={{ bgcolor: 'success.50', p: 3, borderRadius: 3, height: '100%', border: '2px solid', borderColor: 'success.200', minHeight: '350px' }}>
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
                <Grid item xs={12} lg={4}>
                  <Box sx={{ bgcolor: 'warning.50', p: 3, borderRadius: 3, height: '100%', border: '2px solid', borderColor: 'warning.200', minHeight: '350px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'warning.main', display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>
                      <EventIcon sx={{ mr: 1, fontSize: 20 }} />
                      Trạng thái và phản hồi
                    </Typography>
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                        Trạng thái tiêm chủng
                      </Typography>
                      <Chip
                        label={getVaccinationStatusLabel(notification.vaccinationStatus)}
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'white',
                          backgroundColor: getVaccinationStatusColor(notification.vaccinationStatus),
                          minWidth: '90px',
                          height: '26px'
                        }}
                      />
                    </Box>
                    
                    {notification.parentConsentDate && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                          Ngày phản hồi
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                          {formatDateTime(notification.parentConsentDate)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                        Phản hồi của phụ huynh
                      </Typography>
                      <Chip
                        label={getConsentLabel(notification.parentConsent)}
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'white',
                          backgroundColor: getConsentColor(notification.parentConsent),
                          minWidth: '90px',
                          height: '26px'
                        }}
                      />
                    </Box>
                    
                    {notification.vaccinationDate && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
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
                        >
                          Từ chối
                        </Button>
                      </Box>
                    )}
                    
                    {/* Nút thay đổi quyết định */}
                    {canChangeDecision() && (
                      <Box sx={{ mt: 1.5 }}>
                        <Alert severity="warning" sx={{ mb: 1, fontSize: '0.7rem', py: 0.3 }}>
                          Có thể thay đổi trước {formatDate(notification.campaign?.startDate)}
                        </Alert>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                          {notification.parentConsent === 'approved' && (
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DenyIcon />}
                              onClick={() => handleOpenConsentDialog('denied')}
                              fullWidth
                              size="small"
                              sx={{ py: 0.6, fontSize: '0.75rem', fontWeight: 500 }}
                            >
                              Thay đổi thành "Từ chối"
                            </Button>
                          )}
                          {notification.parentConsent === 'denied' && (
                            <Button
                              variant="outlined"
                              color="success"
                              startIcon={<ApproveIcon />}
                              onClick={() => handleOpenConsentDialog('approved')}
                              fullWidth
                              size="small"
                              sx={{ py: 0.6, fontSize: '0.75rem', fontWeight: 500 }}
                            >
                              Thay đổi thành "Đồng ý"
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Thông báo khi không thể thay đổi */}
                    {isCampaignStarted() && notification.parentConsent !== 'pending' && (
                      <Box sx={{ mt: 1.5 }}>
                        <Alert severity="info" sx={{ fontSize: '0.7rem', py: 0.3 }}>
                          Chiến dịch đã bắt đầu
                        </Alert>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Phần ghi chú */}
              {(notification.parentNote || notification.nurseNote) && (
                <Box sx={{ mt: 5, p: 4, bgcolor: 'grey.50', borderRadius: 3, border: '2px solid', borderColor: 'grey.200' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'text.primary', display: 'flex', alignItems: 'center', fontSize: '1.25rem' }}>
                    📝 Ghi chú của phụ huynh
                  </Typography>
                  <Grid container spacing={4}>
                    {notification.parentNote && (
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'grey.300', minHeight: '120px' }}>
                          <Typography variant="body1" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                            {notification.parentNote}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {notification.nurseNote && (
                      <Grid item xs={12} md={6}>
                        <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'grey.300', minHeight: '120px' }}>
                          <Typography variant="body1" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                            {notification.nurseNote}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}


            </CardContent>
          </Card>
        </Grid>

        {/* Thông tin thêm */}
        <Grid item xs={12}>
          <Alert severity="info" icon={<InfoIcon />} sx={{ p: 3, fontSize: '0.95rem' }}>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              <strong>Lưu ý:</strong> Sau khi bạn đồng ý cho con tiêm chủng, y tá trường học sẽ tiến hành tiêm theo 
              lịch trình của chiến dịch. Nếu bạn từ chối, con sẽ không tham gia chiến dịch tiêm chủng này. 
              Bạn có thể thay đổi quyết định trước khi chiến dịch bắt đầu.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Dialog xác nhận phản hồi */}
      <Dialog open={consentDialogOpen} onClose={handleCloseConsentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {notification.parentConsent === 'pending' 
            ? (consentType === 'approved' ? 'Xác nhận đồng ý tiêm chủng' : 'Xác nhận từ chối tiêm chủng')
            : (consentType === 'approved' ? 'Thay đổi thành đồng ý tiêm chủng' : 'Thay đổi thành từ chối tiêm chủng')
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            {notification.parentConsent === 'pending' ? (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {consentType === 'approved' 
                  ? `Bạn có chắc chắn muốn đồng ý cho con ${notification.student?.name} tham gia tiêm vaccine "${notification.campaign?.vaccineName}"?`
                  : `Bạn có chắc chắn muốn từ chối cho con ${notification.student?.name} tham gia tiêm vaccine "${notification.campaign?.vaccineName}"?`
                }
              </Typography>
            ) : (
              <>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Bạn chỉ có thể thay đổi quyết định trước khi chiến dịch bắt đầu ({formatDate(notification.campaign?.startDate)}).
                  </Typography>
                </Alert>
              </>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label={consentType === 'denied' ? "Lý do từ chối (bắt buộc)" : "Ghi chú (tùy chọn)"}
              placeholder={consentType === 'denied' 
                ? "Vui lòng nhập lý do tại sao bạn từ chối cho con tiêm vaccine này..."
                : "Nhập ghi chú của bạn về quyết định này..."
              }
              value={consentNote}
              onChange={(e) => setConsentNote(e.target.value)}
              variant="outlined"
              required={consentType === 'denied'}
              error={consentType === 'denied' && !consentNote.trim()}
              helperText={consentType === 'denied' && !consentNote.trim() ? "Vui lòng nhập lý do từ chối" : ""}
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
            disabled={saving || (consentType === 'denied' && !consentNote.trim())}
          >
            {saving ? (
              <CircularProgress size={24} />
            ) : (
              notification.parentConsent === 'pending'
                ? (consentType === 'approved' ? 'Xác nhận đồng ý' : 'Xác nhận từ chối')
                : (consentType === 'approved' ? 'Xác nhận thay đổi thành đồng ý' : 'Xác nhận thay đổi thành từ chối')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VaccinationNotificationDetailPage;
