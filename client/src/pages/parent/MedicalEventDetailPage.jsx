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
  TableHead,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  MedicalServices as MedicalIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import {
  getMedicalEventTypeLabel,
  getMedicalEventLevelLabel,
  getRawMedicalEventLevelColor,
  getRawMedicalEventStatusColor,
  getMedicalEventStatusLabel
} from '../../utils/colorUtils';

const MedicalEventDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, id: childId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicalEvent, setMedicalEvent] = useState(null);

  // Check if data was passed via state
  const passedEventData = location.state?.eventData;
  const passedChildData = location.state?.childData;
  console.log('📦 Passed event data:', passedEventData)
  console.log('📦 Passed child data:', passedChildData);
  useEffect(() => {
    const loadMedicalEvent = async () => {
      try {
        setLoading(true);

        // If data was passed via state, use it instead of API call
        if (passedEventData) {
          console.log('📦 Using passed event data:', passedEventData);
          setMedicalEvent(passedEventData);
          setLoading(false);
          return;
        }

        // Only call API if no data passed and we have eventId
        if (!eventId) {
          setError('Không tìm thấy ID sự kiện y tế');
          setLoading(false);
          return;
        }

        console.log('🔄 Fetching event data from API...');
        // Fallback to API call if no data passed
        const response = await medicalEventAPI.getEventsByStudentId(eventId, {
          page: 1,
          limit: 10
        });
        if (response && response.data && response.data.records && response.data.records) {
          setMedicalEvent(response.data.records);
          console.log("Medical Events:", response.data.records);
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

    // Only load if we have either passed data or eventId
    if (passedEventData || eventId) {
      loadMedicalEvent();
    } else {
      setError('Không tìm thấy thông tin sự kiện y tế');
      setLoading(false);
    }
  }, [eventId, passedEventData]);

  // Debug logs
  useEffect(() => { }, [eventId, childId, passedEventData, passedChildData, location.state]);
  const handleBack = () => {
    // If we have child data, navigate back with state preserved
    if (passedChildData && passedChildData._id) {
      navigate(-1, {
        state: {
          preserveData: true,
          fromEventDetail: true
        }
      });
    } else if (childId) {
      navigate(`/parent/children/${childId}`);
    } else {
      navigate('/parent/children');
    }
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
    return getMedicalEventTypeLabel(type);
  };

  const getLevelColor = (level) => {
    return getRawMedicalEventLevelColor(level);
  };

  const getLevelLabel = (level) => {
    return getMedicalEventLevelLabel(level);
  };

  const getStatusColor = (status) => {
    return getRawMedicalEventStatusColor(status);
  };

  const getStatusLabel = (status) => {
    return getMedicalEventStatusLabel(status);
  };

  const getChildDisplayName = () => {
    if (passedChildData && passedChildData.name) {
      return passedChildData.name;
    }
    return 'N/A';
  };

  const getChildDisplayInfo = () => {
    if (passedChildData) {
      return {
        name: passedChildData.name || 'N/A',
        studentId: passedChildData.studentCode || 'N/A',
        birthDate: passedChildData.birthdate || 'N/A'
      };
    }
    return {
      name: 'N/A',
      studentId: 'N/A',
      class: 'N/A',
      birthDate: 'N/A'
    };
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

              {medicalEvent.studentJoin && medicalEvent.studentJoin.length > 0 && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Học sinh tham gia:</TableCell>
                  <TableCell>
                    <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                          <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.9rem', py: 1 }}>Tên học sinh</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.9rem', py: 1 }}>Mã học sinh</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.9rem', py: 1 }}>Mã BHYT</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medicalEvent.studentJoin.map((student, index) => {
                          // Xử lý cả trường hợp có studentId nested và không có
                          const studentData = student.studentId || student;
                          return (
                            <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                              <TableCell align="center" sx={{ fontSize: '0.9rem', py: 1 }}>{studentData.name || 'N/A'}</TableCell>
                              <TableCell align="center" sx={{ fontSize: '0.9rem', py: 1 }}>{studentData.studentCode || 'N/A'}</TableCell>
                              <TableCell align="center" sx={{ fontSize: '0.9rem', py: 1 }}>
                                {studentData.medicalConverageId || 'N/A'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}

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
