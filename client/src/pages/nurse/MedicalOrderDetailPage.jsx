// src/pages/nurse/MedicalOrderDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Grid, Chip
} from '@mui/material';
import { ArrowBack as BackIcon, Print as PrintIcon, CheckCircleOutline as CheckIcon, Person as PersonIcon, Info as InfoIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';

const MedicalOrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // SỬA LỖI 1: State bây giờ sẽ lưu toàn bộ object { order, details }
    const [orderData, setOrderData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrderDetails = useCallback(async () => {
        if (!orderId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await medicalOrderApi.getDetail(orderId);
            
            if (response.isSuccess && response.data) {
                // SỬA LỖI 2: Lưu toàn bộ object data, không chỉ 'details'
                setOrderData(response.data);
                console.log(response.data);
            } else {
                setError('Không tìm thấy thông tin đơn thuốc.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải dữ liệu.');
            toast.error('Lỗi: không thể tải chi tiết đơn thuốc.');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        loadOrderDetails();
    }, [loadOrderDetails]);

    const handleBack = () => navigate(-1);
    const handlePrint = () => window.print();

    const handleConfirmDose = (detailId, medicineName) => {
        toast.success(`Đã xác nhận cho trẻ uống ${medicineName}.`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    }
    
   const formatTime = (timeData) => {
    // 1. Xử lý trường hợp đầu vào rỗng
    if (!timeData) {
        return 'N/A';
    }

    let timeArray = [];

    // 2. KIỂM TRA ĐỊNH DẠNG ĐẦU VÀO
    // Trường hợp 1: Đầu vào ĐÃ LÀ MỘT MẢNG (ví dụ: ["sáng", "trưa"])
    if (Array.isArray(timeData)) {
        timeArray = timeData;
    }
    // Trường hợp 2: Đầu vào LÀ CHUỖI JSON (ví dụ: "[sáng, trưa]")
    else if (typeof timeData === 'string') {
        try {
            timeArray = JSON.parse(timeData);
        } catch (e) {
            // Nếu parse lỗi, trả về chuỗi gốc
            return timeData;
        }
    }
    // Trường hợp khác: Trả về dữ liệu gốc dưới dạng chuỗi
    else {
        return String(timeData);
    }
    
    // 3. XỬ LÝ MẢNG (code chung cho cả hai trường hợp trên)
    if (timeArray.length === 0) {
        return 'N/A';
    }

    return timeArray
        .map(t => {
            if (typeof t === 'string') {
                return t.charAt(0).toUpperCase() + t.slice(1);
            }
            return t;
        })
        .join(', ');
};    

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Container maxWidth="lg" sx={{ py: 3 }}><Alert severity="error">{error}</Alert></Container>;
    }
    // Check này rất quan trọng để đảm bảo orderData không phải là null
    if (!orderData || !orderData.order || !orderData.details) {
        return <Container maxWidth="lg" sx={{ py: 3 }}><Alert severity="info">Không có dữ liệu hợp lệ.</Alert></Container>;
    }

    // SỬA LỖI 3: Destructuring state theo đúng cấu trúc của API response
    const { order: medicalOrder, details: medicalOrderDetails } = orderData;
    // Giả định API chưa populate tên học sinh, ta sẽ hiển thị ChildId
    const studentInfo = medicalOrder.ChildId;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}><BackIcon /></IconButton>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Chi tiết Đơn thuốc</Typography>
                        {/* Hiển thị ID của trẻ nếu có */}
                        <Typography variant="h6" color="text.secondary">
                            Mã học sinh: {studentInfo || 'Không xác định'}
                        </Typography>
                    </Box>
                </Box>
                <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>In Đơn</Button>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin chung</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {/* SỬA LỖI 4: Sử dụng đúng trường startDate và endDate */}
                        <Grid item xs={12} sm={4}><Typography><strong>Ngày bắt đầu:</strong> {formatDate(medicalOrder.startDate)}</Typography></Grid>
                        <Grid item xs={12} sm={4}><Typography><strong>Ngày kết thúc:</strong> {formatDate(medicalOrder.endDate)}</Typography></Grid>
                    </Grid>
                    
                </CardContent>
            </Card>

            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách Thuốc</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tên thuốc</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Liều lượng</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Thời gian uống</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Bây giờ medicalOrderDetails đã là một mảng hợp lệ */}
                                {medicalOrderDetails.map((detail, index) => (
                                    <TableRow key={detail._id} hover>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{detail.medicineName}</TableCell>
                                        <TableCell align="center">{detail.dosage}</TableCell>
                                        <TableCell align="center">{detail.quantity}</TableCell>
                                        <TableCell>{formatTime(detail.time)}</TableCell>
                                        <TableCell>{detail.note || '—'}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Xác nhận đã cho uống">
                                                <IconButton color="success" onClick={() => handleConfirmDose(detail._id, detail.medicineName)}>
                                                    <CheckIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
};

export default MedicalOrderDetailPage;