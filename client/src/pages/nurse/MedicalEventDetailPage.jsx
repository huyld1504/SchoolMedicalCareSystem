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
    TableHead,
    TableRow,
    Dialog
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

const MedicalEventDetailPage = () => {
    const { studentId, eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [medicalEvent, setMedicalEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    useEffect(() => {
        // Lấy dữ liệu sự kiện từ location.state nếu có
        const eventDataFromState = location.state?.eventData;
        const isUpdated = location.state?.updated;

        if (eventDataFromState) {
            // Nếu có dữ liệu sự kiện được truyền từ trang trước (qua location.state), thì set vào state local
            setMedicalEvent(eventDataFromState);
            setLoading(false);

            // Nếu là hành động cập nhật (isUpdated == true), hiển thị thông báo thành công
            if (isUpdated) toast.success('Dữ liệu sự kiện y tế đã được cập nhật');
        } else {
            // Nếu không có dữ liệu sẵn, gọi API để load chi tiết sự kiện y tế theo eventId
            loadMedicalEventDetail();
        }
    }, [eventId, location.state]); // Chạy lại khi eventId hoặc location.state thay đổi


    // Hàm tải thông tin chi tiết của một sự kiện y tế dựa trên eventId
    const loadMedicalEventDetail = async () => {
        try {
            // Bắt đầu hiển thị trạng thái loading
            setLoading(true);

            // Xóa thông báo lỗi cũ (nếu có)
            setError(null);

            // Gọi API để lấy thông tin sự kiện y tế theo eventId
            const response = await medicalEventAPI.getEventById(eventId);

            // Nếu gọi API thành công và có dữ liệu
            if (response.isSuccess && response.data) {
                // Lưu dữ liệu vào state để hiển thị lên UI
                setMedicalEvent(response.data);
            } else {
                // Trường hợp không có dữ liệu hoặc response thất bại
                setError('Không tìm thấy sự kiện y tế');
            }
        } catch (error) {
            // Xử lý lỗi xảy ra trong quá trình gọi API
            setError('Lỗi khi tải thông tin sự kiện y tế');
        } finally {
            // Tắt trạng thái loading sau khi xử lý xong
            setLoading(false);
        }
    };


    const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            navigate('/nurse/medical-events');
        }
    };

    const handleEdit = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}/edit/${eventId}`, {
                state: {
                    eventData: medicalEvent,
                    from: `/nurse/medical-events/${studentId}/detail/${eventId}`
                }
            });
        } else {
            navigate(`/nurse/medical-events/edit/${eventId}`, {
                state: {
                    eventData: medicalEvent,
                    from: `/nurse/medical-events/detail/${eventId}`
                }
            });
        }
    };

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    }) : 'Không có thông tin';

    const getDisplayValue = (value) => (value === null || value === undefined || value === '') ? 'Không có thông tin' : value;

    const getLevelColor = (level) => {
        if (level === 3) return '#d32f2f';
        if (level === 2) return '#ed6c02';
        if (level === 1) return '#2e7d32';
        return '#757575';
    };
    const getLevelLabel = (level) => {
        if (level === 3) return 'Khẩn cấp';
        if (level === 2) return 'Trung bình';
        if (level === 1) return 'Nhẹ';
        return 'Không xác định';
    };
    const getStatusColor = (status) => {
        if (status === 'Đã xử lí') return '#2e7d32';
        if (status === 'Đang xử lí') return '#ed6c02';
        if (status === 'Chờ xử lí') return '#d32f2f';
        return '#757575';
    };
    const getStatusLabel = (status) => status || 'Đã xử lí';

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
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </Button>
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
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Thông tin học sinh: *</TableCell>
                                    <TableCell>
                                        <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Tên</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Mã học sinh</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Tên phụ huynh</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Số điện thoại phụ huynh</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {medicalEvent.studentJoin.map((student, index) => {
                                                    const studentData = student.studentId || student;
                                                    return (
                                                        <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px' }}>{studentData.name || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px' }}>{studentData.studentCode || studentData.code || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px' }}>{studentData.userId?.name || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px' }}>{studentData.userId?.phone || 'Không có thông tin'}</TableCell>
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
                                        {medicalEvent.type || 'Không xác định'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Mức độ:</TableCell>
                                <TableCell>
                                    <Typography sx={{ color: getLevelColor(medicalEvent.level), fontWeight: 600, fontSize: '1rem' }}>
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

                            {/* Ghi chú */}
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

                            {/* Giải pháp/Điều trị */}
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

                            {/* Triệu chứng */}
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

                            {/* Trạng thái sự kiện */}
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

                            {/* Hình ảnh sự kiện */}
                            {medicalEvent.imageURL && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Hình ảnh:</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                display: 'inline-block',
                                                '&:hover': { boxShadow: 2 }
                                            }}
                                        >
                                            <img
                                                src={medicalEvent.imageURL}
                                                alt="Hình ảnh"
                                                style={{ width: 300, height: 200, objectFit: 'contain', display: 'block', cursor: 'zoom-in' }}
                                                onClick={() => {
                                                    setModalImageUrl(medicalEvent.imageURL);
                                                    setOpenImageModal(true);
                                                }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Image Modal */}
            <Dialog
                open={openImageModal}
                onClose={() => setOpenImageModal(false)}
                maxWidth={false}
                sx={{
                    '& .MuiDialog-paper': {
                        margin: 0,
                        maxHeight: '100vh',
                        maxWidth: '100vw',
                        overflow: 'hidden'
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                        maxHeight: '100vh',
                        width: 'auto',
                        overflow: 'hidden',
                        p: 2
                    }}
                >
                    <img
                        src={modalImageUrl}
                        alt="Zoom"
                        style={{
                            maxWidth: 'min(95vw, 1200px)',
                            maxHeight: 'min(90vh, 800px)',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            display: 'block'
                        }}
                    />
                    <Button
                        onClick={() => setOpenImageModal(false)}
                        variant="contained"
                        sx={{
                            mt: 2,
                            position: 'sticky',
                            bottom: 0
                        }}
                    >
                        Đóng
                    </Button>
                </Box>
            </Dialog>
        </Container>
    );
};

export default MedicalEventDetailPage;