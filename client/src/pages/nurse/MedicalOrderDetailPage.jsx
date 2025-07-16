import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Grid, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText,
    Checkbox,
} from '@mui/material';
import {
    ArrowBack as BackIcon, Person as PersonIcon,
    ThumbUpAlt as ApproveIcon, Cancel as CancelIcon,
    History as HistoryIcon, Warning as WarningIcon,
    PlaylistAddCheck as BatchRecordIcon, Add as AddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';
import { formattedDate } from '../../utils/date.utils';
import { useSelector } from 'react-redux';

// --- CẢI TIẾN: Thêm import cho Lightbox để zoom ảnh ---
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// Các hằng số và state ban đầu không thay đổi...
const statusMap = {
    pending: { label: 'Chờ duyệt', color: 'warning' },
    approved: { label: 'Đã duyệt', color: 'success' },
    canceled: { label: 'Đã hủy', color: 'error' },
    completed: { label: 'Đã hoàn thành', color: 'primary' },
};

const initialNewMedicineState = {
    medicineName: '',
    dosage: '',
    type: 'kê đơn',
    time: '',
    note: '',
    quantity: 1,
};

const MedicalOrderDetailPage = () => {
    const { user } = useSelector((state) => state.auth);
    const { orderId } = useParams();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [usageHistory, setUsageHistory] = useState([]);
    const [isAddRecordModalOpen, setAddRecordModalOpen] = useState(false);
    const [selectionForRecord, setSelectionForRecord] = useState({});
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    const [newMedicine, setNewMedicine] = useState(initialNewMedicineState);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    
    // --- TÁCH BIỆT 2 CHỨC NĂNG ---
    const [isImageZoomOpen, setImageZoomOpen] = useState(false); // Cho lightbox zoom
    const [isImageModalOpen, setImageModalOpen] = useState(false); // Cho modal thêm thuốc

    // --- DATA LOADING ---
    const loadData = useCallback(async () => {
        if (!orderId) return;
        setLoading(true);
        setError(null);
        try {
            const [detailsResponse, historyResponse] = await Promise.all([
                medicalOrderApi.getDetail(orderId),
                medicalOrderApi.getRecord(orderId)
            ]);

            if (detailsResponse.isSuccess && detailsResponse.data) {
                setOrderData(detailsResponse.data);
            } else {
                setError('Không tìm thấy thông tin đơn gửi thuốc.');
            }

            if (historyResponse.isSuccess && historyResponse.data) {
                setUsageHistory(historyResponse.data.records || []);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải dữ liệu.');
            toast.error('Lỗi: không thể tải dữ liệu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // --- HANDLERS ---
    const handleUpdateStatus = useCallback(async (payload) => {
        setIsUpdating(true);
        try {
            await medicalOrderApi.updateStatus(orderId, payload);
            const statusLabel = statusMap[payload.status]?.label || payload.status;
            toast.success(`Cập nhật trạng thái thành "${statusLabel}" thành công!`);
            await loadData();
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại.');
            console.error('Failed to update status:', err);
        } finally {
            setIsUpdating(false);
        }
    }, [orderId, loadData]);

    const handleRejectOrder = async () => {
        if (!rejectionReason.trim()) {
            toast.warn('Vui lòng nhập lý do từ chối.');
            return;
        }
        await handleUpdateStatus({ status: 'canceled', note: rejectionReason });
        handleCloseRejectModal();
    };

    useEffect(() => {
        if (!orderData || !orderData.order || !orderData.details || orderData.order.status !== 'approved') {
            return;
        }
        const allMedicinesFinished = orderData.details.length > 0 && orderData.details.every(detail => detail.quantity === 0);
        if (allMedicinesFinished) {
            handleUpdateStatus({ status: 'completed' });
        }
    }, [orderData, handleUpdateStatus]);
    
    const handleSelectionChange = (detail) => {
        setSelectionForRecord(prev => {
            const newSelection = { ...prev };
            if (newSelection[detail._id]) {
                delete newSelection[detail._id];
            } else {
                newSelection[detail._id] = { detail: detail, quantity: 1 };
            }
            return newSelection;
        });
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && orderData && orderData.details) {
            const newSelections = {};
            orderData.details.forEach(detail => {
                if (detail.quantity > 0) {
                    newSelections[detail._id] = { detail: detail, quantity: 1 };
                }
            });
            setSelectionForRecord(newSelections);
            return;
        }
        setSelectionForRecord({});
    };

    const handleOpenAddRecordModal = () => setAddRecordModalOpen(true);
    const handleCloseAddRecordModal = () => {
        setAddRecordModalOpen(false);
        setSelectionForRecord({});
    };

    const handleQuantityChangeInModal = (detailId, quantity) => {
        const newQuantity = Number(quantity);
        setSelectionForRecord(prev => ({
            ...prev,
            [detailId]: { ...prev[detailId], quantity: newQuantity }
        }));
    };

    const handleSubmitRecord = async () => {
        const itemsToRecord = Object.values(selectionForRecord).filter(item => item.quantity > 0).map(item => ({ medicalOrderDetailId: item.detail._id, quantity: item.quantity }));
        if (itemsToRecord.length === 0) { toast.warn('Vui lòng nhập số lượng.'); return; }
        setIsUpdating(true);
        try {
            await medicalOrderApi.addRecord(orderId, { items: itemsToRecord });
            toast.success(`Đã ghi nhận thành công ${itemsToRecord.length} loại thuốc.`);
            handleCloseAddRecordModal();
            await loadData();
        } catch (err) {
            toast.error('Ghi nhận thất bại.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenRejectModal = () => setRejectModalOpen(true);
    const handleCloseRejectModal = () => {
        setRejectModalOpen(false);
        setRejectionReason('');
    };

    // --- HANDLERS CHO THÊM THUỐC (2 MODAL SONG SONG) ---
    const handleOpenAddNewModal = () => {
        setNewMedicine(initialNewMedicineState);
        setIsAddNewModalOpen(true);
        // Mở modal ảnh cùng lúc nếu có ảnh
        if (orderData?.order?.imageURL) {
            setImageModalOpen(true);
        }
    };

    // CHỈ đóng modal form, GIỮ NGUYÊN modal ảnh
    const handleCloseFormModal = () => {
        setIsAddNewModalOpen(false);
        setNewMedicine(initialNewMedicineState);
        // KHÔNG đóng modal ảnh ở đây
    };

    // Hàm đóng riêng cho modal ảnh
    const handleCloseImageModal = () => {
        setImageModalOpen(false);
    };

    // Hàm đóng CẢ 2 modal cùng lúc
    const handleCloseAllModals = () => {
        setIsAddNewModalOpen(false);
        setImageModalOpen(false);
        setNewMedicine(initialNewMedicineState);
    };

    const   handleNewMedicineFormChange = (e) => {
        const { name, value } = e.target;
        setNewMedicine(prev => ({ ...prev, [name]: value }));
    };

   const handleSubmitNewMedicine = async () => {
    if (!newMedicine.medicineName.trim() || !newMedicine.dosage.trim()) {
        toast.warn('Vui lòng nhập tên thuốc và liều lượng.');
        return;
    }
    setIsUpdating(true);
    try {
        const finalMedicineData = { ...newMedicine };
        
        // Nếu API mong đợi time là string, giữ nguyên format
        // Hoặc convert thành JSON string nếu cần
        if (typeof finalMedicineData.time === 'string' && finalMedicineData.time.trim() !== '') {
            // Nếu API cần array dưới dạng JSON string
            const timeArray = finalMedicineData.time.split(',').map(t => t.trim()).filter(Boolean);
            finalMedicineData.time = JSON.stringify(timeArray);
        } else {
            finalMedicineData.time = ''; // Hoặc '[]' nếu API cần JSON array string
        }
        
        const payload = { medicalOrderDetails: [finalMedicineData] };
        await medicalOrderApi.additionalDetail(orderId, payload);
        toast.success(`Đã thêm thuốc mới: ${newMedicine.medicineName}.`);
        handleCloseAllModals();
        await loadData();
    } catch (err) {
        toast.error("Thêm thuốc mới thất bại.");
        console.error('Error adding medicine:', err);
    } finally {
        setIsUpdating(false);
    }
};

    
    const handleBack = () => navigate(-1);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
    const formatTime = (timeData) => {
        if (!timeData) return 'N/A';
        try {
            const timeArray = Array.isArray(timeData) ? timeData : JSON.parse(timeData);
            if (!Array.isArray(timeArray) || timeArray.length === 0) return 'N/A';
            return timeArray.map(t => String(t).charAt(0).toUpperCase() + String(t).slice(1)).join(', ');
        } catch (e) {
            return String(timeData);
        }
    };

    if (loading) { return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>; }
    if (error) { return <Container maxWidth="lg" sx={{ py: 3 }}><Alert severity="error">{error}</Alert></Container>; }
    if (!orderData || !orderData.order || !orderData.details) { return <Container maxWidth="lg" sx={{ py: 3 }}><Alert severity="info">Không có dữ liệu.</Alert></Container>; }

    const { order: medicalOrder, details: medicalOrderDetails } = orderData;
    const numSelected = Object.keys(selectionForRecord).length;
    const rowCount = medicalOrderDetails.filter(d => d.quantity > 0).length;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}><BackIcon /></IconButton>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Chi tiết Đơn gửi thuốc</Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    {medicalOrder.status === 'pending' && user.role === "nurse" && (
                        <>
                            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleOpenRejectModal} disabled={isUpdating}>Từ chối</Button>
                            <Button variant="contained" color="success" startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <ApproveIcon />} onClick={() => handleUpdateStatus({ status: 'approved' })} disabled={isUpdating}>Duyệt</Button>
                        </>
                    )}
                </Stack>
            </Box>

            {medicalOrder.imageURL ? (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                    <Card sx={{ flex: 1, maxWidth: { md: '50%' }, mb: { xs: 2, md: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CardContent sx={{ width: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin chung</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography><strong>Ngày bắt đầu:</strong> {formatDate(medicalOrder.startDate)}</Typography>
                                <Typography><strong>Ngày kết thúc:</strong> {formatDate(medicalOrder.endDate)}</Typography>
                                <Typography><strong>Ghi chú/Lý do:</strong> {medicalOrder.note || 'không có'}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                {/* --- GIỮ NGUYÊN CHỨC NĂNG ZOOM --- */}
                                <img
                                    src={medicalOrder.imageURL}
                                    alt="Ảnh đơn thuốc"
                                    onClick={() => setImageZoomOpen(true)} // Mở lightbox zoom
                                    style={{
                                        maxWidth: 500,
                                        maxHeight: 550,
                                        borderRadius: 8,
                                        boxShadow: '0 2px 8px #0002',
                                        cursor: 'pointer',
                                    }}
                                />
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Ảnh đơn thuốc (Nhấn để xem & zoom)
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: 1, maxWidth: { md: '50%' }, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách Thuốc</Typography>
                                <Stack direction="row" spacing={1}>
                                    {medicalOrder.status === 'approved' && user.role === "nurse" && (
                                        <>
                                            <Button variant="contained" startIcon={<BatchRecordIcon />} disabled={numSelected === 0} onClick={handleOpenAddRecordModal}>Cho uống thuốc ({numSelected})</Button>
                                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddNewModal}>Thêm thuốc mới</Button>
                                        </>
                                    )}
                                </Stack>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                {medicalOrder.status === 'approved' && <Tooltip title="Chọn/Bỏ chọn tất cả"><Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={handleSelectAllClick} /></Tooltip>}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tên thuốc</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Liều lượng</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Loại</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>SL còn lại</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Thời gian uống</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {medicalOrderDetails.map((detail) => {
                                            const isItemSelected = !!selectionForRecord[detail._id];
                                            return (
                                                <TableRow key={detail._id} hover role="checkbox" tabIndex={-1} selected={isItemSelected}>
                                                    <TableCell padding="checkbox">
                                                        {medicalOrder.status === 'approved' && <Checkbox color="primary" checked={isItemSelected} onChange={() => handleSelectionChange(detail)} disabled={detail.quantity <= 0} />}
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>
                                                        {detail.medicineName}
                                                        {detail.quantity <= 2 && (<Tooltip title="Số lượng sắp hết!"><WarningIcon color="warning" sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle' }} /></Tooltip>)}
                                                    </TableCell>
                                                    <TableCell align="center">{detail.dosage}</TableCell>
                                                    <TableCell align="center">{detail.type}</TableCell>
                                                    <TableCell align="center">{detail.quantity}</TableCell>
                                                    <TableCell>{formatTime(detail.time)}</TableCell>
                                                    <TableCell>{detail.note || 'không có'}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin chung</Typography>
                            <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
                                <Grid item xs={12} sm={4}><Typography><strong>Ngày bắt đầu:</strong> {formatDate(medicalOrder.startDate)}</Typography></Grid>
                                <Grid item xs={12} sm={4}><Typography><strong>Ngày kết thúc:</strong> {formatDate(medicalOrder.endDate)}</Typography></Grid>
                                <Grid item xs={12} sm={4}><Typography><strong>Ghi chú/Lý do:</strong> {medicalOrder.note || '—'}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách Thuốc</Typography>
                                <Stack direction="row" spacing={1}>
                                    {medicalOrder.status === 'approved' && user.role === "nurse" && (
                                        <>
                                            <Button variant="contained" startIcon={<BatchRecordIcon />} disabled={numSelected === 0} onClick={handleOpenAddRecordModal}>Cho uống thuốc ({numSelected})</Button>
                                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddNewModal}>Thêm thuốc mới</Button>
                                        </>
                                    )}
                                </Stack>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                {medicalOrder.status === 'approved' && <Tooltip title="Chọn/Bỏ chọn tất cả"><Checkbox color="primary" indeterminate={numSelected > 0 && numSelected < rowCount} checked={rowCount > 0 && numSelected === rowCount} onChange={handleSelectAllClick} /></Tooltip>}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tên thuốc</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Liều lượng</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Loại</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>SL còn lại</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Thời gian uống</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {medicalOrderDetails.map((detail) => {
                                            const isItemSelected = !!selectionForRecord[detail._id];
                                            return (
                                                <TableRow key={detail._id} hover role="checkbox" tabIndex={-1} selected={isItemSelected}>
                                                    <TableCell padding="checkbox">
                                                        {medicalOrder.status === 'approved' && <Checkbox color="primary" checked={isItemSelected} onChange={() => handleSelectionChange(detail)} disabled={detail.quantity <= 0} />}
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>
                                                        {detail.medicineName}
                                                        {detail.quantity <= 2 && (<Tooltip title="Số lượng sắp hết!"><WarningIcon color="warning" sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle' }} /></Tooltip>)}
                                                    </TableCell>
                                                    <TableCell align="center">{detail.dosage}</TableCell>
                                                    <TableCell align="center">{detail.type}</TableCell>
                                                    <TableCell align="center">{detail.quantity}</TableCell>
                                                    <TableCell>{formatTime(detail.time)}</TableCell>
                                                    <TableCell>{detail.note || 'không có'}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </>
            )}

            {usageHistory && usageHistory.length > 0 && (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Lịch sử sử dụng thuốc</Typography>
                        </Box>
                        <TableContainer>
                            <Table size="normal">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tên thuốc</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số lượng đã dùng</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Thời gian</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Y tá cho uống </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usageHistory.map(record => (
                                        record.items.map(item => (
                                            <TableRow key={`${record._id}-${item._id}`}>
                                                <TableCell>{item.name || 'Không rõ tên thuốc'}</TableCell>
                                                <TableCell align="center">{item.quantity}</TableCell>
                                                <TableCell>{formattedDate(item.createdAt).toLocaleString('vi-VN')}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>{record.userId?.name}</TableCell>
                                            </TableRow>
                                        ))
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Modal ghi nhận sử dụng thuốc */}
            <Dialog open={isAddRecordModalOpen} onClose={handleCloseAddRecordModal} PaperProps={{ sx: { width: '35%' } }}>
                <DialogTitle>Ghi nhận sử dụng thuốc</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {Object.keys(selectionForRecord).length > 0 ? (
                            Object.values(selectionForRecord).map(({ detail, quantity }) => (
                                <Box key={detail._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography sx={{ flexGrow: 1 }}>{detail.medicineName}</Typography>
                                    <TextField label="SL đã dùng" type="number" size="small" variant="outlined" value={quantity} onChange={(e) => handleQuantityChangeInModal(detail._id, e.target.value)} inputProps={{ min: 1, max: detail.quantity }} sx={{ width: '120px' }} />
                                </Box>
                            ))
                        ) : (<Typography>Không có thuốc nào được chọn.</Typography>)}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddRecordModal} disabled={isUpdating}>Hủy</Button>
                    <Button onClick={handleSubmitRecord} variant="contained" disabled={isUpdating || numSelected === 0}>{isUpdating ? <CircularProgress size={24} /> : 'Xác nhận tất cả'}</Button>
                </DialogActions>
            </Dialog>

            {/* --- MODAL THÊM THUỐC (BÊN TRÁI) --- */}
            <Dialog
                open={isAddNewModalOpen}
                onClose={handleCloseFormModal}
                disableEscapeKeyDown={false}
                PaperProps={{
                    sx: {
                        position: 'fixed',
                        left: 50,
                        top: 50,
                        width: 450,
                        maxWidth: 450,
                        margin: 0,
                        zIndex: 1200,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        borderRadius: 2,
                    }
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        zIndex: 1199,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    📋 Thêm thuốc mới
                    <Box>
                        <Tooltip title="Đóng cả 2 modal">
                            <Button 
                                onClick={handleCloseAllModals}
                                sx={{ 
                                    color: 'white', 
                                    minWidth: 'auto',
                                    px: 1,
                                    mr: 1,
                                    fontSize: '0.75rem'
                                }}
                                size="small"
                            >
                                Đóng tất cả
                            </Button>
                        </Tooltip>
                        <IconButton 
                            onClick={handleCloseFormModal}
                            sx={{ color: 'white' }}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ px: 3, py: 2 }}>
                    <Stack spacing={2.5}>
                        <TextField 
                            required 
                            name="medicineName" 
                            label="Tên thuốc" 
                            value={newMedicine.medicineName} 
                            onChange={handleNewMedicineFormChange} 
                            fullWidth 
                            size="small"
                            autoFocus
                        />
                        <TextField 
                            required 
                            name="dosage" 
                            label="Liều lượng" 
                            value={newMedicine.dosage} 
                            onChange={handleNewMedicineFormChange} 
                            fullWidth 
                            size="small"
                            placeholder="vd: 500mg"
                        />
                         <TextField 
                            required 
                            name="medicineName" 
                            label="Loại" 
                            value={newMedicine.type} 
                            onChange={handleNewMedicineFormChange} 
                            fullWidth 
                            size="small"
                              placeholder="vd: viên,nước"
                            autoFocus
                        />
                        <TextField 
                            name="time" 
                            label="Thời gian uống" 
                            value={newMedicine.time} 
                            onChange={handleNewMedicineFormChange} 
                            fullWidth 
                            size="small"
                            placeholder="vd: sáng, tối"
                            helperText="Các buổi cách nhau bằng dấu phẩy"
                        />
                        <TextField 
                            name="quantity" 
                            label="Số lượng" 
                            type="number" 
                            value={newMedicine.quantity} 
                            onChange={handleNewMedicineFormChange} 
                            fullWidth 
                            size="small"
                            inputProps={{ min: 1 }}
                        />
                        <TextField 
                            name="note" 
                            label="Ghi chú" 
                            value={newMedicine.note} 
                            onChange={handleNewMedicineFormChange} 
                            fullWidth 
                            size="small"
                            multiline 
                            rows={2} 
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, bg: '#f8f9fa' }}>
                    <Button onClick={handleCloseFormModal} disabled={isUpdating}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmitNewMedicine} 
                        variant="contained" 
                        disabled={isUpdating}
                        sx={{ minWidth: 120 }}
                    >
                        {isUpdating ? <CircularProgress size={20} /> : 'Thêm thuốc'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- MODAL HIỂN THỊ ẢNH CHO THÊM THUỐC (BÊN PHẢI) --- */}
            <Dialog
                open={isImageModalOpen}
                onClose={handleCloseImageModal}
                disableEscapeKeyDown={true}
                PaperProps={{
                    sx: {
                        position: 'fixed',
                        right: 50,
                        top: 50,
                        width:600,
                        maxWidth: 1000,
                        margin: 0,
                        zIndex: 1201,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        borderRadius: 2,
                    }
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        zIndex: 1200,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    📄 Đơn thuốc tham khảo
                    <IconButton 
                        onClick={handleCloseImageModal}
                        sx={{ color: 'white' }}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 2, textAlign: 'center' }}>
                    {medicalOrder.imageURL && (
                        <img
                            src={medicalOrder.imageURL}
                            alt="Đơn thuốc"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, justifyContent: 'center' }}>
                    <Button 
                        onClick={handleCloseImageModal}
                        variant="outlined"
                    >
                        Đóng ảnh
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal từ chối đơn */}
            <Dialog open={isRejectModalOpen} onClose={handleCloseRejectModal} fullWidth maxWidth="sm">
                <DialogTitle>Lý do từ chối đơn gửi thuốc</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Vui lòng nhập lý do từ chối.
                    </DialogContentText>
                    <TextField 
                        autoFocus 
                        required 
                        margin="dense" 
                        id="rejectionReason" 
                        name="rejectionReason" 
                        label="Lý do từ chối" 
                        type="text" 
                        fullWidth 
                        variant="outlined" 
                        multiline 
                        rows={3} 
                        value={rejectionReason} 
                        onChange={(e) => setRejectionReason(e.target.value)} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRejectModal} disabled={isUpdating}>Hủy</Button>
                    <Button onClick={handleRejectOrder} variant="contained" color="error" disabled={isUpdating || !rejectionReason.trim()}>
                        {isUpdating ? <CircularProgress size={24} /> : 'Xác nhận Từ chối'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- GIỮ NGUYÊN LIGHTBOX CHO CHỨC NĂNG ZOOM --- */}
            <Lightbox
                open={isImageZoomOpen}
                close={() => setImageZoomOpen(false)}
                slides={medicalOrder.imageURL ? [{ src: medicalOrder.imageURL }] : []}
                plugins={[Zoom]}
                styles={{
                    container: { zIndex: 1500 }, // Cao nhất để zoom
                }}
            />
        </Container>
    );
};

export default MedicalOrderDetailPage;
