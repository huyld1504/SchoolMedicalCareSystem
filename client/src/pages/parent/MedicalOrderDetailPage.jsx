import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Grid,
  Avatar,
  Paper,
  TableHead,
  Dialog,
  DialogContent,
  DialogActions,
  CardMedia,
  Stack,
  DialogTitle,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocalHospital as MedicalIcon,
  Assignment as OrderIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Inventory as StockIcon,
  CalendarToday as CalendarIcon,
  ThumbUp,
  Image as ImageIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as ResetIcon,
  Close
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';

const MedicalOrderDetailPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = window.location;

  // Try multiple ways to extract orderId
  let orderId = params.id || params.orderId;

  // Fallback: extract from URL path manually
  if (!orderId) {
    const pathSegments = location.pathname.split('/');
    const orderIndex = pathSegments.indexOf('medical-orders');
    if (orderIndex !== -1 && pathSegments[orderIndex + 1]) {
      orderId = pathSegments[orderIndex + 1];
    }
  }


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalOrder, setMedicalOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [childInfo, setChildInfo] = useState(null);
  const [imageViewOpen, setImageViewOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const loadMedicalOrder = async () => {
      try {
        setLoading(true);
        setError(null); console.log('Loading medical order detail for orderId:', orderId);
        const response = await medicalOrderApi.getDetail(orderId);

        if (response && response.isSuccess && response.data) {
          const orderData = response.data.order || response.data;
          const detailsData = response.data.details || [];

          setMedicalOrder(orderData);
          setOrderDetails(detailsData);
          console.log('Medical order data:', orderData);

          // Load child info if we have ChildId
          if (orderData.ChildId) {
            await loadChildInfo(orderData.ChildId._id);
          }
        } else {
          setError('Không tìm thấy thông tin đơn thuốc');
        }
      } catch (err) {
        console.error('Error loading medical order:', err);
        setError('Không thể tải thông tin đơn thuốc');
        toast.error('❌ Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    }; const loadChildInfo = async (childId) => {
      try {
        const childResponse = await childApi.getChildById(childId);
        if (childResponse && childResponse.data) {
          console.log('Child info loaded:', childResponse.data);
          setChildInfo(childResponse.data);
        }
      } catch (err) {
        console.error('Error loading child info:', err);
        // Don't show error for child info as it's supplementary
      }
    }; if (orderId && orderId.trim() !== '') {
      loadMedicalOrder();
    } else {
      setError('Không tìm thấy ID đơn thuốc trong URL. Vui lòng kiểm tra lại đường dẫn.');
      setLoading(false);
    }
  }, [orderId]);

  const handleBack = () => {
    navigate('/parent/medical-orders');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleOpenImageView = () => {
    setZoomLevel(1); // Reset zoom when opening modal
    setImageViewOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return 'Không có thông tin';
    if (value === '') return 'Không có thông tin';
    return value;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9100';
      case 'approved': return '#00b0ff';
      case 'completed': return '#4caf50';
      case 'canceled': return '#f44336';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Đang xử lý';
      case 'approved': return 'Đã duyệt';
      case 'completed': return 'Hoàn thành';
      case 'canceled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />;
      case 'approved': return <ThumbUp />;
      case 'completed': return <CheckCircleIcon />;
      case 'canceled': return <CancelIcon />;
      default: return <MedicalIcon />;
    }
  };
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Đang tải đơn thuốc {orderId}...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !medicalOrder) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Chi tiết đơn thuốc
          </Typography>
        </Box>        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Không tìm thấy đơn thuốc'}
        </Alert>
        <TestRouteParams />
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', p: 0, m: 0 }}>
      <Container maxWidth={false} sx={{ width: '100%', px: 2, py: 2, m: 0 }}>
        {/* Header */}
        <Box sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'white',
          p: 2,
          borderRadius: 1,
          boxShadow: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <BackIcon />
            </IconButton>
            <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 36 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0, fontSize: '1.8rem' }}>
                Chi tiết đơn thuốc
              </Typography>
            </Box>
          </Box>

          {/* Status Badge */}
          <Chip
            icon={getStatusIcon(medicalOrder.status)}
            label={getStatusLabel(medicalOrder.status)}
            sx={{
              fontSize: '1.1rem',
              px: 4,
              py: 2.5,
              backgroundColor: getStatusColor(medicalOrder.status),
              color: 'white',
              fontWeight: 700,
              height: 48,
              '& .MuiChip-icon': {
                fontSize: 20
              }
            }}
            size="medium"
          />
        </Box>

        {/* Main Information - Full Width */}
        <Card sx={{ mb: 2, height: 'fit-content', boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <OrderIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.4rem' }}>
                Thông tin chi tiết đơn thuốc
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }} />

            <Table sx={{ '& .MuiTableCell-root': { fontSize: '1.1rem', py: 2 } }}>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                    Con em:
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                          {childInfo?.name || 'Không có'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                          ID: {childInfo?.studentCode || 'Không có'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                    Ngày bắt đầu:
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: 'success.main', fontSize: 24 }} />
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {formatDate(medicalOrder.startDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                    Ngày kết thúc:
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: 'error.main', fontSize: 24 }} />
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {formatDate(medicalOrder.endDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                    Tình trạng kho:
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    <Chip
                      icon={<StockIcon />}
                      label={medicalOrder.isStock ? 'Có sẵn trong kho' : 'Không có trong kho'}
                      color={medicalOrder.isStock ? 'success' : 'warning'}
                      sx={{ fontSize: '1rem', px: 2, py: 1 }}
                    />
                  </TableCell>
                </TableRow>                  <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                    Ghi chú:
                  </TableCell>
                  <TableCell sx={{ maxWidth: '400px' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
                      {getDisplayValue(medicalOrder.note)}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Prescription Image Row */}
                {medicalOrder.imageURL ? (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                      Ảnh đơn thuốc:
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'inline', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            src={medicalOrder.imageURL}
                            alt="Ảnh đơn thuốc"
                            sx={{
                              width: 140,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '2px solid #e0e0e0',
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 3,
                                border: '2px solid #1976d2'
                              }
                            }}
                            onClick={handleOpenImageView}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ ml: 1, color: 'primary.main', fontWeight: 500, fontSize: '0.95rem' }}>
                          Click ảnh để xem chi tiết
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.2rem', width: '30%' }}>
                      Ảnh đơn thuốc:
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<ImageIcon />}
                        label="Không có ảnh đơn thuốc"
                        color="default"
                        sx={{ fontSize: '1rem', px: 2, py: 1 }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Medicine Details Section */}
            {orderDetails && orderDetails.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', fontSize: '1.3rem' }}>
                  <MedicalIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
                  Chi tiết thuốc ({orderDetails.length} loại)
                </Typography>

                {/* Tất cả thuốc trong một bảng duy nhất */}
                <Box sx={{ p: 2, border: '2px solid #e0e0e0', borderRadius: 2, bgcolor: 'grey.50', boxShadow: 1 }}>
                  <Table sx={{ '& .MuiTableCell-root': { fontSize: '0.9rem', py: 1.5, border: '1px solid #e0e0e0' } }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'primary.main' }}>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>STT</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>Tên thuốc</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>Liều lượng</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>Loại</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>Thời gian uống</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>Số lượng</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center', py: 1.5, fontSize: '0.95rem' }}>Ghi chú</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetails.map((detail, index) => (
                        <TableRow key={detail._id} sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
                          <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            <Box
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '50%',
                                width: 28,
                                height: 28,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                mx: 'auto'
                              }}
                            >
                              {index + 1}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', fontWeight: 600, py: 1.5 }}>
                            <Typography variant="body2" sx={{ color: 'primary.main', fontSize: '1rem', fontWeight: 600 }}>
                              {detail.medicineName}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', fontWeight: 500, py: 1.5 }}>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.95rem', fontWeight: 600 }}>
                              {detail.dosage}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            <Chip
                              label={detail.type}
                              sx={{ bgcolor: 'info.light', color: 'info.contrastText', fontWeight: 500, fontSize: '0.85rem', height: 28, px: 1 }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', fontWeight: 500, py: 1.5 }}>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.95rem', fontWeight: 600 }}>
                              {detail.time}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                            <Chip
                              label={`${detail.quantity}`}
                              color="primary"
                              sx={{ fontWeight: 600, fontSize: '0.85rem', height: 28, px: 1 }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', maxWidth: 200, py: 1.5 }}>
                            <Typography variant="body2" sx={{
                              fontStyle: 'italic',
                              color: 'text.secondary',
                              fontSize: '0.85rem',
                              wordWrap: 'break-word',
                              whiteSpace: 'normal'
                            }}>
                              {detail.note || 'Không có ghi chú'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>



        {/* Image Preview Modal with Zoom */}
        <Dialog
          open={imageViewOpen}
          onClose={() => setImageViewOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              minHeight: '80vh',
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Ảnh đơn thuốc</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {Math.round(zoomLevel * 100)}%
                </Typography>
                <IconButton
                  onClick={handleZoomOut}
                  size="small"
                  disabled={zoomLevel <= 0.5}
                  title="Thu nhỏ"
                >
                  <ZoomOutIcon />
                </IconButton>
                <IconButton
                  onClick={handleZoomIn}
                  size="small"
                  disabled={zoomLevel >= 3}
                  title="Phóng to"
                >
                  <ZoomInIcon />
                </IconButton>
                <IconButton
                  onClick={handleResetZoom}
                  size="small"
                  title="Đặt lại kích thước"
                >
                  <ResetIcon />
                </IconButton>
                <IconButton
                  onClick={() => setImageViewOpen(false)}
                  size="small"
                  title="Đóng"
                >
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            backgroundColor: '#f5f5f5'
          }}>
            {medicalOrder?.imageURL && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: 'auto',
                  cursor: zoomLevel < 3 ? 'zoom-in' : 'zoom-out'
                }}
                onClick={() => {
                  if (zoomLevel < 3) {
                    handleZoomIn();
                  } else {
                    handleZoomOut();
                  }
                }}
              >
                <Box
                  component="img"
                  src={medicalOrder.imageURL}
                  alt="Ảnh đơn thuốc chi tiết"
                  sx={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-in-out',
                    maxWidth: '100%',
                    maxHeight: '150%',
                    objectFit: 'contain',
                    borderRadius: 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Click vào ảnh để zoom hoặc sử dụng các nút điều khiển
            </Typography>
            <Button onClick={() => setImageViewOpen(false)} variant="contained">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MedicalOrderDetailPage;
