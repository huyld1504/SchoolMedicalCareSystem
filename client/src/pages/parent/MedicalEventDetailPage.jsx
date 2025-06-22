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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  MedicalServices as MedicalIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';

const MedicalEventDetailPage = () => {
  const navigate = useNavigate();
  const { eventId, id: childId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalEvent, setMedicalEvent] = useState(null);

  useEffect(() => {
    const loadMedicalEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading medical event detail for eventId:', eventId);
        const response = await medicalEventAPI.getEventById(eventId);

        if (response && response.data) {
          setMedicalEvent(response.data);
        } else {
          setError('Không tìm thấy thông tin sự kiện y tế');
        }
      } catch (err) {
        console.error('Error loading medical event:', err);
        setError('Không thể tải thông tin sự kiện y tế');
        toast.error('❌ Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadMedicalEvent();
    }
  }, [eventId]);

  const handleBack = () => {
    navigate(childId ? `/parent/children/${childId}` : '/parent/children');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return 'Không có thông tin';
    if (value === '') return 'Không có thông tin';
    return value;
  };

  const getEventTypeLabel = (type) => {
    return type || 'Không xác định';
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 3:
        return '#d32f2f'; // Đỏ
      case 2:
        return '#ed6c02'; // Cam
      case 1:
        return '#2e7d32'; // Xanh lá
      default:
        return '#757575'; // Xám
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 3:
        return 'Khẩn cấp';
      case 2:
        return 'Trung bình';
      case 1:
        return 'Nhẹ';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã xử lí':
        return '#2e7d32'; // Xanh lá
      case 'Đang xử lí':
        return '#ed6c02'; // Cam
      case 'Chờ xử lí':
        return '#d32f2f'; // Đỏ
      default:
        return '#757575'; // Xám
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'Đã xử lí' || status === 'Đang xử lí' || status === 'Chờ xử lí') {
      return status;
    }
    return 'Đã xử lí'; // Giá trị mặc định
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !medicalEvent) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Chi tiết sự kiện y tế
          </Typography>
        </Box>
        <Alert severity="error">
          {error || 'Không tìm thấy sự kiện y tế'}
        </Alert>
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
              Chi tiết sự kiện y tế
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Content */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Thông tin chi tiết sự kiện y tế
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Table sx={{ '& .MuiTableCell-root': { fontSize: '1rem', py: 2.5 } }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: '25%', bgcolor: 'grey.50', fontSize: '1.1rem' }}>Ngày sự kiện:</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{formatDate(medicalEvent.dateHappened || medicalEvent.createdAt)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Loại sự kiện:</TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '1rem' }}>
                    {getEventTypeLabel(medicalEvent.type)}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Mức độ:</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: getLevelColor(medicalEvent.level),
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {getLevelLabel(medicalEvent.level)}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Nhân viên xử lý:</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{getDisplayValue(medicalEvent.userId?.name)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Mô tả chi tiết:</TableCell>
                <TableCell sx={{ maxWidth: '500px' }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                    {getDisplayValue(medicalEvent.description)}
                  </Typography>
                </TableCell>
              </TableRow>

              {medicalEvent.note && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Ghi chú:</TableCell>
                  <TableCell sx={{ maxWidth: '500px' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                      {medicalEvent.note}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {medicalEvent.solution && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Giải pháp/Điều trị:</TableCell>
                  <TableCell sx={{ maxWidth: '500px' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
                      {medicalEvent.solution}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {medicalEvent.symptoms && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Triệu chứng:</TableCell>
                  <TableCell sx={{ maxWidth: '500px' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1rem' }}>
                      {medicalEvent.symptoms}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {medicalEvent.treatment && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Điều trị:</TableCell>
                  <TableCell sx={{ maxWidth: '500px' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1rem' }}>
                      {medicalEvent.treatment}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Trạng thái:</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(medicalEvent.status)}
                    sx={{
                      fontSize: '0.95rem',
                      px: 2,
                      py: 1,
                      backgroundColor: getStatusColor(medicalEvent.status),
                      color: 'white',
                      fontWeight: 600
                    }}
                    size="medium"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MedicalEventDetailPage;
