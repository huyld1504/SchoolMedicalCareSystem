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

  // Trạng thái hộp thoại để đồng ý
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [consentType, setConsentType] = useState('');
  const [consentNote, setConsentNote] = useState('');

  // Tải chi tiết thông báo từ trạng thái hoặc API
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

  // Hàm mở dialog xin ý kiến phụ huynh (consent dialog)
  const handleOpenConsentDialog = (type) => {
    setConsentType(type);             // Đặt loại đồng ý (vắng mặt, tiêm, v.v.)
    setConsentNote('');               // Xóa nội dung ghi chú cũ (nếu có)
    setConsentDialogOpen(true);       // Hiển thị dialog
  };

  // Hàm đóng dialog xin ý kiến phụ huynh
  const handleCloseConsentDialog = () => {
    setConsentDialogOpen(false);      // Ẩn dialog
    setConsentType('');               // Reset loại đồng ý
    setConsentNote('');               // Xóa ghi chú
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
          vaccinationStatus: consentType === 'denied' ? 'canceled' : prev.vaccinationStatus
        }));

        handleCloseConsentDialog();

        // Chuyển về trang danh sách thông báo sau khi phản hồi thành công
        navigate('/parent/vaccination-notifications');
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Chưa có';
    }
  };

  // Hàm render an toàn để hiển thị giá trị (bao gồm cả object)
  const safeRender = (value) => {
    // Nếu giá trị là null, undefined hoặc chuỗi rỗng => trả về 'Chưa có'
    if (value === null || value === undefined || value === '') return 'Chưa có';

    // Nếu là object (ví dụ: object JS, mảng, v.v.) => chuyển thành chuỗi JSON
    if (typeof value === 'object') return JSON.stringify(value);

    // Nếu là kiểu dữ liệu khác (number, boolean, string, v.v.) => ép thành chuỗi
    return String(value);
  };


  // Get consent color and label
  const getConsentColor = (consent) => {
    switch (consent) {
      case 'approved':
        return '#2e7d32';
      case 'denied':
        return '#d32f2f';
      case 'pending':
        return '#ed6c02';
      default:
        return '#757575';
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
        return 'Chưa có';
    }
  };

  // Get vaccination status color and label
  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#2e7d32';
      case 'scheduled':
        return '#1976d2';
      case 'missed':
        return '#ed6c02';
      case 'canceled':
        return '#d32f2f';
      default:
        return '#757575';
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
      case 'canceled':
        return 'Đã hủy';
      default:
        return 'Chưa có';
    }
  };

  // Get campaign status color and label
  const getCampaignStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#ed6c02';
      case 'completed':
        return '#2e7d32';
      case 'planned':
        return '#1976d2';
      default:
        return '#757575';
    }
  };

  const getCampaignStatusLabel = (status) => {
    switch (status) {
      case 'planned':
        return 'Đã lên kế hoạch';
      case 'active':
        return 'Đang diễn ra';
      case 'completed':
        return 'Hoàn thành';
      default:
        return safeRender(status);
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

      {/* Card thông tin học sinh */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            mb: 3,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem'
          }}>
            <PersonIcon sx={{ mr: 1, fontSize: 32 }} />
            Thông tin học sinh
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Họ và tên
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.student?.name)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Mã học sinh
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.student?.studentCode)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Ngày sinh
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {formatDate(notification.student?.dateOfBirth || notification.student?.birthdate)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '120px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Giới tính
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {notification.student?.gender === 'male' ? 'Nam' :
                  notification.student?.gender === 'female' ? 'Nữ' : 'Chưa có'}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '180px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Mã BHYT
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: notification.student?.medicalConverageId ? 'text.primary' : 'text.secondary' }}>
                {safeRender(notification.student?.medicalConverageId)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Card thông tin chiến dịch */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            mb: 3,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem'
          }}>
            <VaccineIcon sx={{ mr: 1, fontSize: 32 }} />
            Thông tin chiến dịch
          </Typography>

          {/* Row 1: Basic vaccine info */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Tên chiến dịch
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.campaign?.vaccineName)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Loại vaccine
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.campaign?.vaccineType)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Đối tượng tiêm
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.campaign?.targetAudience)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '120px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Liều lượng (cc)
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.campaign?.dosage)}
              </Typography>
            </Box>
          </Box>

          {/* Row 2: Schedule and method info */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Số mũi tiêm
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.campaign?.injection)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Ngày bắt đầu
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {formatDate(notification.campaign?.startDate)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '150px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Ngày kết thúc
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {formatDate(notification.campaign?.endDate)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '120px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Trạng thái
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: getCampaignStatusColor(notification.campaign?.status)
                }}
              >
                {getCampaignStatusLabel(notification.campaign?.status)}
              </Typography>
            </Box>
          </Box>

          {/* Mô tả vaccine - hiển thị riêng để có nhiều không gian hơn */}
          {notification.campaign?.vaccineDescription && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}>
                Mô tả vaccine
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1.1rem', lineHeight: 1.6 }}>
                {safeRender(notification.campaign?.vaccineDescription)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Card trạng thái và phản hồi */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            mb: 3,
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem'
          }}>
            <EventIcon sx={{ mr: 1, fontSize: 32 }} />
            Trạng thái và phản hồi
          </Typography>

          {/* Hàng 1: Phản hồi của phụ huynh + Ngày phản hồi */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Phản hồi của phụ huynh
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: getConsentColor(notification.parentConsent)
                }}
              >
                {getConsentLabel(notification.parentConsent)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Ngày phản hồi
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {formatDate(notification.parentConsentDate)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '200px', flex: 1 }}>
              {/* Empty box để căn chỉnh */}
            </Box>
          </Box>

          {/* Ghi chú của phụ huynh */}
          {notification.parentNote && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}>
                {notification.parentConsent === 'denied' ? 'Lý do từ chối của phụ huynh' : 'Ghi chú của phụ huynh'}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1.1rem', lineHeight: 1.6 }}>
                {safeRender(notification.parentNote)}
              </Typography>
            </Box>
          )}

          {/* Hàng 2: Trạng thái tiêm chủng + Ngày tiêm + Y tá tiêm */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Trạng thái tiêm chủng
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: getVaccinationStatusColor(notification.vaccinationStatus)
                }}
              >
                {getVaccinationStatusLabel(notification.vaccinationStatus)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Ngày tiêm
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {formatDate(notification.vaccinationDate)}
              </Typography>
            </Box>

            <Box sx={{ minWidth: '200px', flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: '1rem' }}>
                Y tá tiêm
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                {safeRender(notification.vaccinatedNurse?.name)}
              </Typography>
            </Box>
          </Box>

          {/* Ghi chú của y tá */}
          {notification.nurseNote && (
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600, fontSize: '1rem' }}>
                Ghi chú của y tá
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '1.1rem', lineHeight: 1.6 }}>
                {safeRender(notification.nurseNote)}
              </Typography>
            </Box>
          )}

          {/* Nút hành động cho phụ huynh */}
          {notification.parentConsent === 'pending' && (
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => handleOpenConsentDialog('approved')}
                sx={{ fontSize: '1rem', px: 4, py: 1.5 }}
              >
                Đồng ý
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DenyIcon />}
                onClick={() => handleOpenConsentDialog('denied')}
                sx={{ fontSize: '1rem', px: 4, py: 1.5 }}
              >
                Từ chối
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

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
