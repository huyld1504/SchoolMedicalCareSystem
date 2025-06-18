// src/pages/nurse/MedicalOrdersPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Pagination, Chip
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, Visibility as ViewIcon, LocalHospital as MedicalIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';

const MedicalOrdersPage = () => {
    const navigate = useNavigate();

    // State cho pagination
    const [query, setQuery] = useState({ page: 1, limit: 10 });
    // State cho data từ API
    const [medicalOrders, setMedicalOrders] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ total: 0, page: 1, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    const loadMedicalOrders = useCallback(async () => {
        try {
            setLoading(true);
              const response = await medicalOrderApi.getMedicalOrder();
            console.log(response)
            if (response && response.data) {
                setMedicalOrders(response.data.records || []);
                setPaginationInfo({
                    total: response.data.total || 0,
                    page: response.data.page || 1,
                    totalPages: response.data.totalPages || 0,
                    limit: response.data.limit || 10
                });
            } else {
                setMedicalOrders([]);
                setPaginationInfo({ total: 0, page: 1, totalPages: 0, limit: 10 });
            }
        } catch (error) {
            console.error('Error loading medical orders:', error);
            toast.error('Lỗi khi tải danh sách đơn thuốc');
            setMedicalOrders([]);
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        loadMedicalOrders();
    }, [loadMedicalOrders]);

    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    const handleRefresh = () => {
        loadMedicalOrders();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleViewDetails = (orderId) => {
        navigate(`/nurse/medical-orders/${orderId}`);
    };
    
    const handleAddOrder = () => {
        navigate('/nurse/medical-orders/add');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };
    
    const getStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (now < start) return <Chip label="Sắp tới" color="info" size="small" />;
        if (now > end) return <Chip label="Hoàn thành" color="success" size="small" />;
        return <Chip label="Đang diễn ra" color="warning" size="small" />;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, m: 0 }}>
                        Quản lý Đơn thuốc
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Làm mới">
                        <IconButton onClick={handleRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOrder}>
                        Tạo Đơn thuốc
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : medicalOrders.length === 0 ? (
                <Alert severity="info">Chưa có đơn thuốc nào.</Alert>
            ) : (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Danh sách đơn thuốc ({paginationInfo.total} đơn)
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 600, width: '5%' }}>STT</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '25%' }}>Tên Học sinh</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Ghi chú</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Ngày Bắt đầu</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Ngày Kết thúc</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Trạng thái</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, width: '10%' }}>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {medicalOrders.map((order, index) => (
                                        <TableRow key={order._id} hover>
                                            <TableCell align="center">
                                                {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
                                            </TableCell>
                                            <TableCell>{order.ChildId?.name || 'Không rõ'}</TableCell>
                                            <TableCell align="center"><code>{order.note}</code></TableCell>
                                            <TableCell align="center">{formatDate(order.startDate)}</TableCell>
                                            <TableCell align="center">{formatDate(order.endDate)}</TableCell>
                                            <TableCell align="center">{getStatus(order.startDate, order.endDate)}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Xem chi tiết">
                                                    <IconButton color="primary" onClick={() => handleViewDetails(order._id)}>
                                                        <ViewIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={paginationInfo.totalPages}
                                page={paginationInfo.page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default MedicalOrdersPage;