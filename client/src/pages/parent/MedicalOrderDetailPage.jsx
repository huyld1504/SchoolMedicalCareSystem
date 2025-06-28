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
  TableHead
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
  ThumbUp
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

          // Load child info if we have ChildId
          if (orderData.ChildId) {
            await loadChildInfo(orderData.ChildId);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              Chi tiết đơn thuốc
            </Typography>
          </Box>
        </Box>

        {/* Status Badge */}
        <Chip
          icon={getStatusIcon(medicalOrder.status)}
          label={getStatusLabel(medicalOrder.status)}
          sx={{
            fontSize: '1rem',
            px: 3,
            py: 2,
            backgroundColor: getStatusColor(medicalOrder.status),
            color: 'white',
            fontWeight: 600,
            height: 40
          }}
          size="medium"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <OrderIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Thông tin chi tiết đơn thuốc
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Table sx={{ '& .MuiTableCell-root': { fontSize: '1rem', py: 2.5 } }}>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                      Con em:
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 36, height: 36 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {childInfo?.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {medicalOrder.ChildId?.slice(-6) || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                      Ngày bắt đầu:
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1, color: 'success.main' }} />
                        {formatDate(medicalOrder.startDate)}
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                      Ngày kết thúc:
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1, color: 'error.main' }} />
                        {formatDate(medicalOrder.endDate)}
                      </Box>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                      Tình trạng kho:
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>
                      <Chip
                        icon={<StockIcon />}
                        label={medicalOrder.isStock ? 'Có sẵn trong kho' : 'Không có trong kho'}
                        color={medicalOrder.isStock ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                      Ghi chú:
                    </TableCell>
                    <TableCell sx={{ maxWidth: '400px' }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                        {getDisplayValue(medicalOrder.note)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>              {/* Medicine Details Section */}
              {orderDetails && orderDetails.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <MedicalIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Chi tiết thuốc ({orderDetails.length} loại)
                  </Typography>

                  {/* Mỗi detail thuốc là một section riêng biệt */}
                  {orderDetails.map((detail, index) => (
                    <Box key={detail._id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'grey.50' }}>
                      {/* Tiêu đề thuốc */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            mr: 2
                          }}
                        >
                          {index + 1}
                        </Box>
                        {detail.medicineName}
                      </Typography>

                      {/* Bảng thông tin thuốc - tất cả trên một hàng */}
                      <Table sx={{ '& .MuiTableCell-root': { fontSize: '0.9rem', py: 1.5, border: '1px solid #e0e0e0' } }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'primary.light' }}>
                            <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center' }}>Liều lượng</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center' }}>Loại</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center' }}>Thời gian uống</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center' }}>Số lượng</TableCell>
                            {detail.note && <TableCell sx={{ fontWeight: 600, color: 'white', textAlign: 'center' }}>Ghi chú</TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ bgcolor: 'white' }}>
                            <TableCell sx={{ textAlign: 'center', fontWeight: 500 }}>
                              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                {detail.dosage}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <Chip
                                label={detail.type}
                                size="small"
                                sx={{ bgcolor: 'info.light', color: 'info.contrastText', fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', fontWeight: 500 }}>
                              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                {detail.time}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <Chip
                                label={`${detail.quantity} ${detail.type}`}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            {detail.note && (
                              <TableCell sx={{ textAlign: 'center', maxWidth: 200 }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                  {detail.note}
                                </Typography>
                              </TableCell>
                            )}
                          </TableRow>
                        </TableBody>
                      </Table>                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>        {/* Side Information */}
        <Grid item xs={12} md={4}>

          {/* Timeline Information */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon sx={{ fontSize: 24, color: '#795548', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#795548' }}>
                  Thời gian
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Ngày tạo:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                {formatDateTime(medicalOrder.createdAt)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Cập nhật cuối:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                {formatDateTime(medicalOrder.updatedAt)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Thời gian điều trị:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Paper variant="outlined" sx={{ p: 1, mr: 1, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Từ: {formatDate(medicalOrder.startDate)}
                  </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 1, bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Đến: {formatDate(medicalOrder.endDate)}
                  </Typography>
                </Paper>
              </Box>

              {/* Duration calculation */}
              {medicalOrder.startDate && medicalOrder.endDate && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian điều trị:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {Math.ceil((new Date(medicalOrder.endDate) - new Date(medicalOrder.startDate)) / (1000 * 60 * 60 * 24))} ngày
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MedicalOrderDetailPage;
