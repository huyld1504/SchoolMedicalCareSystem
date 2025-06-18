import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    CircularProgress,
    Alert,
    Tooltip,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon,
    ArrowBack as BackIcon,
    MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import studentsApi from '../../api/studentsApi';
import medicalEventAPI from '../../api/medicalEventApi';
import { generateSampleMedicalEvents } from '../../data/sampleData';

const MedicalEventsPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    // State cho pagination
    const [query, setQuery] = useState({
        page: 1,
        limit: 10
    });

    // State cho data từ API
    const [medicalEvents, setMedicalEvents] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);    // Sử dụng useEffect với dependency của query để load data khi thay đổi page/limit
    useEffect(() => {
        if (studentId) {
            loadMedicalEvents();
            loadStudentInfo();
        } else {
            loadAllMedicalEvents();
        }
    }, [studentId, query.page, query.limit]);const loadMedicalEvents = async () => {
        try {
            setLoading(true);

            if (studentId) {
                const response = await medicalEventAPI.getEventsByStudentId(studentId, query);
                console.log('Medical events response:', response);

                if (response.isSuccess && response.data) {
                    // Lấy data từ API response
                    setMedicalEvents(response.data.records || []);

                    // Cập nhật thông tin pagination từ API
                    setPaginationInfo({
                        total: response.data.total || 0,
                        page: response.data.page || 1,
                        limit: response.data.limit || 10,
                        totalPages: response.data.totalPages || 0
                    });

                    console.log('Medical events:', response.data.records);
                    console.log('Pagination info:', {
                        total: response.data.total,
                        page: response.data.page,
                        limit: response.data.limit,
                        totalPages: response.data.totalPages
                    });
                } else {
                    // Fallback: sử dụng dữ liệu mẫu nếu API chưa sẵn sàng
                    const sampleEvents = generateSampleMedicalEvents();
                    const startIndex = (query.page - 1) * query.limit;
                    const endIndex = startIndex + query.limit;
                    const paginatedEvents = sampleEvents.slice(startIndex, endIndex);
                    
                    setMedicalEvents(paginatedEvents);
                    setPaginationInfo({
                        total: sampleEvents.length,
                        page: query.page,
                        limit: query.limit,
                        totalPages: Math.ceil(sampleEvents.length / query.limit)
                    });
                }
            }
        } catch (error) {
            console.error('Error loading medical events:', error);
            
            // Fallback: sử dụng dữ liệu mẫu khi có lỗi API
            const sampleEvents = generateSampleMedicalEvents();
            const startIndex = (query.page - 1) * query.limit;
            const endIndex = startIndex + query.limit;
            const paginatedEvents = sampleEvents.slice(startIndex, endIndex);
            
            setMedicalEvents(paginatedEvents);
            setPaginationInfo({
                total: sampleEvents.length,
                page: query.page,
                limit: query.limit,
                totalPages: Math.ceil(sampleEvents.length / query.limit)
            });
            
            toast.info('Đang hiển thị dữ liệu mẫu - API chưa sẵn sàng');
        } finally {
            setLoading(false);
        }
    };

    const loadAllMedicalEvents = async () => {
        try {
            setLoading(true);

            const response = await medicalEventAPI.getAll(query);
            console.log('All medical events response:', response);

            if (response.isSuccess && response.data) {
                // Lấy data từ API response
                setMedicalEvents(response.data.records || []);

                // Cập nhật thông tin pagination từ API
                setPaginationInfo({
                    total: response.data.total || 0,
                    page: response.data.page || 1,
                    limit: response.data.limit || 10,
                    totalPages: response.data.totalPages || 0
                });
            } else {
                // Fallback: sử dụng dữ liệu mẫu nếu API chưa sẵn sàng
                const sampleEvents = generateSampleMedicalEvents();
                const startIndex = (query.page - 1) * query.limit;
                const endIndex = startIndex + query.limit;
                const paginatedEvents = sampleEvents.slice(startIndex, endIndex);
                
                setMedicalEvents(paginatedEvents);
                setPaginationInfo({
                    total: sampleEvents.length,
                    page: query.page,
                    limit: query.limit,
                    totalPages: Math.ceil(sampleEvents.length / query.limit)
                });
            }
        } catch (error) {
            console.error('Error loading all medical events:', error);
            
            // Fallback: sử dụng dữ liệu mẫu khi có lỗi API
            const sampleEvents = generateSampleMedicalEvents();
            const startIndex = (query.page - 1) * query.limit;
            const endIndex = startIndex + query.limit;
            const paginatedEvents = sampleEvents.slice(startIndex, endIndex);
            
            setMedicalEvents(paginatedEvents);
            setPaginationInfo({
                total: sampleEvents.length,
                page: query.page,
                limit: query.limit,
                totalPages: Math.ceil(sampleEvents.length / query.limit)
            });
            
            toast.info('Đang hiển thị dữ liệu mẫu - API chưa sẵn sàng');
        } finally {
            setLoading(false);
        }
    };

    const loadStudentInfo = async () => {
        try {
            if (studentId) {
                const response = await studentsApi.getStudentById(studentId);
                if (response.isSuccess && response.data) {
                    setStudentInfo(response.data);
                }
            }
        } catch (error) {
            console.error('Error loading student info:', error);
        }
    };

    // Sửa handlePageChange để cập nhật query state
    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Sửa handleRowsPerPageChange để cập nhật query state
    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        setQuery(prev => ({
            ...prev,
            limit: newLimit,
            page: 1 // Reset về page 1 khi thay đổi limit
        }));
    };    const handleRefresh = () => {
        if (studentId) {
            loadMedicalEvents();
        } else {
            loadAllMedicalEvents();
        }
        toast.success('Đã làm mới dữ liệu');
    };

    const handleBack = () => {
        if (studentId) {
            navigate('/nurse/students');
        } else {
            navigate('/nurse');
        }
    };

    const handleAddEvent = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}/add`);
        } else {
            navigate('/nurse/medical-events/add');
        }
    };

    const handleEditEvent = (eventId) => {
        navigate(`/nurse/medical-events/${studentId}/edit/${eventId}`);
    };    const handleViewEvent = (eventId) => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}/details/${eventId}`);
        } else {
            // Sử dụng route tổng quát khi không có studentId
            navigate(`/nurse/medical-events/details/${eventId}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
    };

    const getTruncatedValue = (value, maxLength = 15) => {
        if (!value || value.length <= maxLength) return value;
        return value.substring(0, maxLength) + '...';
    };    const getEventTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'emergency':
                return 'error';
            case 'routine check':
            case 'routine':
                return 'primary';
            case 'follow-up':
            case 'followup':
                return 'warning';
            case 'vaccination':
                return 'success';
            case 'injury':
                return 'error';
            case 'consultation':
                return 'info';
            case 'allergy':
                return 'error';
            default:
                return 'default';
        }
    };

    const getEventTypeLabel = (type) => {
        switch (type?.toLowerCase()) {
            case 'emergency':
                return 'Cấp cứu';
            case 'routine check':
            case 'routine':
                return 'Thường quy';
            case 'follow-up':
            case 'followup':
                return 'Tái khám';
            case 'vaccination':
                return 'Tiêm chủng';
            case 'injury':
                return 'Chấn thương';
            case 'consultation':
                return 'Tư vấn';
            case 'allergy':
                return 'Dị ứng';
            default:
                return type || 'Không xác định';
        }
    };    const getLevelColor = (level) => {
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

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <BackIcon />
                    </IconButton>
                    <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            {studentId ? 'Sự kiện y tế học sinh' : 'Quản lý sự kiện y tế'}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {studentId ? (
                                studentInfo ?
                                    `${studentInfo.name} (Mã HS: ${studentInfo.studentCode})` :
                                    'Đang tải thông tin...'
                            ) : (
                                'Danh sách tất cả sự kiện y tế trong hệ thống'
                            )}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Làm mới">
                        <IconButton onClick={handleRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddEvent}
                    >
                        Tạo sự kiện mới
                    </Button>
                </Box>
            </Box>

            {/* Content */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : !medicalEvents || medicalEvents.length === 0 ? (
                <Alert severity="info">
                    Học sinh này chưa có sự kiện y tế nào
                </Alert>
            ) : (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        {/* Header với thông tin pagination */}
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Danh sách sự kiện y tế ({paginationInfo.total} sự kiện)
                            </Typography>

                            {/* Dropdown cho rows per page */}
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Hiển thị</InputLabel>
                                <Select
                                    value={paginationInfo.limit}
                                    label="Hiển thị"
                                    onChange={handleRowsPerPageChange}
                                >
                                    <MenuItem value={5}>5 dòng</MenuItem>
                                    <MenuItem value={10}>10 dòng</MenuItem>
                                    <MenuItem value={25}>25 dòng</MenuItem>
                                    <MenuItem value={50}>50 dòng</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <TableContainer sx={{
                            maxHeight: 600,
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: 6,
                                height: 0,
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: 3,
                            },
                            scrollbarWidth: 'thin',
                            msOverflowStyle: 'none',
                        }}>
                            <Table stickyHeader sx={{
                                tableLayout: 'fixed',
                                width: '100%'
                            }}>                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 600, width: '6%' }} align="center">STT</TableCell>                                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Ngày sự kiện</TableCell>                                        {!studentId && (
                                            <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Học sinh</TableCell>
                                        )}
                                        {!studentId && (
                                            <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Mã học sinh</TableCell>
                                        )}
                                        <TableCell sx={{ fontWeight: 600, width: '12%' }} align="center">Loại sự kiện</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: studentId ? '35%' : '20%' }} align="center">Mô tả</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Mức độ</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: studentId ? '20%' : '15%' }} align="center">Người tạo</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '12%' }} align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Hiển thị data từ API (đã được phân trang) */}
                                    {medicalEvents.map((event, index) => (                                        <TableRow
                                            key={event._id || index}
                                            hover
                                            sx={{
                                                '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                                '&:hover': { 
                                                    bgcolor: '#e3f2fd',
                                                    transform: 'scale(1.002)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                },
                                                cursor: 'pointer',
                                                height: '60px'
                                            }}
                                        >                                            <TableCell align="center" sx={{ px: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: '#1976d2',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {/* Tính STT dựa trên page hiện tại */}
                                                    {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
                                                </Typography>
                                            </TableCell>                                            <TableCell align="center" sx={{ px: 2 }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#424242', fontWeight: 700 }}>
                                                    {formatDate(event.dateHappened || event.createdAt)}
                                                </Typography>
                                            </TableCell>                                            {!studentId && (
                                                <TableCell align="center" sx={{ px: 2 }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#424242', fontWeight: 400 }}>
                                                        {event.studentJoin && event.studentJoin.length > 1 ? (
                                                            <span style={{ color: '#424242', fontWeight: 400 }}>
                                                                {event.studentJoin.length} học sinh liên quan
                                                            </span>
                                                        ) : event.studentJoin && event.studentJoin.length === 1 ? (
                                                            event.studentJoin[0].studentId?.name || 'N/A'
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                            )}
                                            {!studentId && (
                                                <TableCell align="center" sx={{ px: 1 }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#424242', fontWeight: 400 }}>
                                                        {event.studentJoin && event.studentJoin.length > 1 ? (
                                                            <span style={{ color: '#424242', fontWeight: 400 }}>
                                                                Nhiều HS
                                                            </span>
                                                        ) : event.studentJoin && event.studentJoin.length === 1 ? (
                                                            event.studentJoin[0].studentId?.studentCode || 'N/A'
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                            )}<TableCell align="center" sx={{ px: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        color: '#424242',
                                                        fontWeight: 400
                                                    }}
                                                >
                                                    {getEventTypeLabel(event.type)}
                                                </Typography>
                                            </TableCell><TableCell align="center" sx={{ px: 2 }}>
                                                <Tooltip title={getDisplayValue(event.description)} placement="top">                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            color: '#424242',
                                                            cursor: event.description && event.description.length > 40 ? 'help' : 'default',
                                                            lineHeight: 1.4,
                                                            fontWeight: 400
                                                        }}
                                                    >
                                                        {getTruncatedValue(getDisplayValue(event.description), 40)}
                                                    </Typography>
                                                </Tooltip>                                            </TableCell>                                            <TableCell align="center" sx={{ px: 1 }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontSize: '0.875rem', 
                                                        color: getLevelColor(event.level),
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {getLevelLabel(event.level)}
                                                </Typography>
                                            </TableCell>                                            <TableCell align="center" sx={{ px: 2 }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#424242', fontWeight: 400 }}>
                                                    {getDisplayValue(event.userId?.name)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            color="info"
                                                            size="small"
                                                            onClick={() => handleViewEvent(event._id)}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleEditEvent(event._id)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination component */}
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Hiển thị {(paginationInfo.page - 1) * paginationInfo.limit + 1} - {Math.min(paginationInfo.page * paginationInfo.limit, paginationInfo.total)} 
                                {' '}trong tổng số {paginationInfo.total} sự kiện
                            </Typography>

                            <Pagination
                                count={paginationInfo.totalPages}
                                page={paginationInfo.page}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                                sx={{ display: 'flex', justifyContent: 'center' }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default MedicalEventsPage;
