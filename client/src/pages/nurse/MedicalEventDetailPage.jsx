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
    Edit as EditIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import studentsApi from '../../api/studentsApi';

const MedicalEventDetailPage = () => {
    const { studentId, eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [medicalEvent, setMedicalEvent] = useState(null);
    const [studentInfo, setStudentInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Kiểm tra xem có dữ liệu được truyền qua state không
        const eventDataFromState = location.state?.eventData;
          if (eventDataFromState) {
            console.log('Using event data from navigation state:', eventDataFromState);
            setMedicalEvent(eventDataFromState);
            setLoading(false);
            
            // Vẫn load thông tin student nếu có studentId
            if (studentId) {
                loadStudentInfo();
            } else if (eventDataFromState.studentJoin && eventDataFromState.studentJoin.length > 0) {
                // Nếu không có studentId từ URL nhưng có trong event data
                console.log('Setting student info from event data:', eventDataFromState.studentJoin[0].studentId);
                setStudentInfo(eventDataFromState.studentJoin[0].studentId);
            }
        } else {
            console.log('No event data in state, loading from API/sample data');
            loadMedicalEventDetail();
            if (studentId) {
                loadStudentInfo();
            }
        }
    }, [eventId, studentId, location.state]);const loadMedicalEventDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Loading medical event detail for eventId:', eventId);
            console.log('studentId:', studentId);

            const response = await medicalEventAPI.getById(eventId);
            console.log('Medical event detail response:', response);

            if (response.isSuccess && response.data) {
                setMedicalEvent(response.data);
            } else {
                // Fallback: sử dụng dữ liệu mẫu nếu API chưa sẵn sàng
                const sampleEvents = generateSampleMedicalEvents();
                console.log('Sample events:', sampleEvents);
                const foundEvent = sampleEvents.find(event => event._id === eventId);
                console.log('Found event:', foundEvent, 'for eventId:', eventId);
                  if (foundEvent) {
                    setMedicalEvent(foundEvent);
                } else {
                    // Nếu không tìm thấy event cụ thể, lấy event đầu tiên làm ví dụ
                    if (sampleEvents.length > 0) {
                        setMedicalEvent(sampleEvents[0]);
                        toast.info('Đang hiển thị dữ liệu mẫu - API chưa sẵn sàng');
                    } else {
                        setError('Không tìm thấy sự kiện y tế');
                    }
                }
            }
        } catch (error) {
            console.error('Error loading medical event detail:', error);
            
            // Fallback: sử dụng dữ liệu mẫu khi có lỗi API
            const sampleEvents = generateSampleMedicalEvents();
            console.log('Fallback sample events:', sampleEvents);
            const foundEvent = sampleEvents.find(event => event._id === eventId);
            console.log('Fallback found event:', foundEvent, 'for eventId:', eventId);
              if (foundEvent) {
                setMedicalEvent(foundEvent);
                toast.info('Đang hiển thị dữ liệu mẫu - API chưa sẵn sàng');
            } else {
                // Nếu không tìm thấy event cụ thể, lấy event đầu tiên làm ví dụ
                if (sampleEvents.length > 0) {
                    setMedicalEvent(sampleEvents[0]);
                    toast.info('Đang hiển thị dữ liệu mẫu - API chưa sẵn sàng');
                } else {
                    setError('Không tìm thấy sự kiện y tế');
                }
            }
        } finally {
            setLoading(false);
        }
    };    const loadStudentInfo = async () => {
        try {
            if (studentId) {
                const response = await studentsApi.getStudentById(studentId);
                if (response.isSuccess && response.data) {
                    setStudentInfo(response.data);
                } else {
                    // Fallback: thử lấy thông tin student từ event data
                    const eventData = location.state?.eventData;
                    if (eventData && eventData.studentJoin && eventData.studentJoin.length > 0) {
                        const studentFromEvent = eventData.studentJoin[0].studentId;
                        setStudentInfo(studentFromEvent);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading student info:', error);
            
            // Fallback: thử lấy thông tin student từ event data
            const eventData = location.state?.eventData;
            if (eventData && eventData.studentJoin && eventData.studentJoin.length > 0) {
                const studentFromEvent = eventData.studentJoin[0].studentId;
                setStudentInfo(studentFromEvent);
            }
        }
    };const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            navigate('/nurse/medical-events');
        }
    };

    const handleEdit = () => {
        navigate(`/nurse/medical-events/${studentId}/edit/${eventId}`);
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
    };    const getEventTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'cấp cứu':
            case 'emergency':
                return '#d32f2f'; // Đỏ
            case 'thường quy':
            case 'routine check':
            case 'routine':
                return '#1976d2'; // Xanh dương
            case 'tái khám':
            case 'follow-up':
            case 'followup':
                return '#ed6c02'; // Cam
            case 'tiêm chủng':
            case 'vaccination':
                return '#2e7d32'; // Xanh lá
            case 'chấn thương':
            case 'injury':
                return '#d32f2f'; // Đỏ
            case 'tư vấn':
            case 'consultation':
                return '#0288d1'; // Xanh nước biển
            case 'dị ứng':
            case 'allergy':
                return '#d32f2f'; // Đỏ
            default:
                return '#1976d2'; // Xanh dương
        }
    };

    const getEventTypeLabel = (type) => {
        // API trả về trực tiếp tiếng Việt, chỉ cần return luôn
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
                return 'Cao';
            case 2:
                return 'Trung bình';
            case 1:
                return 'Thấp';
            default:
                return 'Không xác định';
        }
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
                    <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Chi tiết sự kiện y tế
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>
            </Box>            {/* Content */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Thông tin chi tiết sự kiện y tế
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />                      <Table sx={{ '& .MuiTableCell-root': { fontSize: '1rem', py: 2.5 } }}>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: '25%', bgcolor: 'grey.50', fontSize: '1.1rem' }}>Ngày sự kiện:</TableCell>
                                <TableCell sx={{ fontSize: '1rem' }}>{formatDate(medicalEvent.dateHappened || medicalEvent.createdAt)}</TableCell>
                            </TableRow>

                            {medicalEvent.studentJoin && medicalEvent.studentJoin.length > 0 && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Thông tin học sinh tham gia:</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.8 }}>
                                            {medicalEvent.studentJoin.map((student, index) => {
                                                // Xử lý cả trường hợp có studentId nested và không có
                                                const studentData = student.studentId || student;
                                                return (
                                                    <Box key={index} sx={{ mb: index < medicalEvent.studentJoin.length - 1 ? 2 : 0 }}>
                                                        <strong>Tên:</strong> {studentData.name || 'N/A'}<br/>
                                                        <strong>Mã HS:</strong> {studentData.studentCode || studentData.code || 'N/A'}<br/>
                                                        <strong>Giới tính:</strong> {studentData.gender === 'male' ? 'Nam' : studentData.gender === 'female' ? 'Nữ' : 'N/A'}
                                                        {index < medicalEvent.studentJoin.length - 1 && <Divider sx={{ mt: 1 }} />}
                                                    </Box>
                                                );
                                            })}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Loại sự kiện:</TableCell>
                                <TableCell>
                                    <Typography 
                                        sx={{ 
                                            fontSize: '1rem'
                                        }}
                                    >
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
                                        label={medicalEvent.status || 'Đã xử lý'}
                                        color="success"
                                        size="medium"
                                        sx={{ fontSize: '0.95rem', px: 2, py: 1 }}
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
