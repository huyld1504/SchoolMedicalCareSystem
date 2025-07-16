import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Grid, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText,
    Checkbox, Divider,
} from '@mui/material';
import {
    ArrowBack as BackIcon, Person as PersonIcon,
    ThumbUpAlt as ApproveIcon, Cancel as CancelIcon,
    History as HistoryIcon, Warning as WarningIcon,
    PlaylistAddCheck as BatchRecordIcon, Add as AddIcon,
    Close as CloseIcon, Delete as DeleteIcon,
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

// --- THEME CONSTANTS CHO MODAL CONSISTENCY ---
const MODAL_THEME = {
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        border: '1px solid #e0e0e0',
    },
    content: {
        backgroundColor: '#f8f9fa',
        borderRadius: 4,
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.05)', // Backdrop rất nhẹ
    },
    header: {
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px 8px 0 0',
    },
    headerImage: {
        background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px 8px 0 0',
    },
    footer: {
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
        padding: '16px 24px',
        borderRadius: '0 0 8px 8px',
    }
};

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
    type: 'viên',
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
    const [newMedicines, setNewMedicines] = useState([{ ...initialNewMedicineState }]);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // --- TÁCH BIỆT 2 CHỨC NĂNG ---
    const [isImageZoomOpen, setImageZoomOpen] = useState(false);
    const [isImageModalOpen, setImageModalOpen] = useState(false);
    const [isAddingMedicine, setIsAddingMedicine] = useState(false);

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

    const changeGenderToVN = (gender) => {
        if (!gender) return 'Không xác định';
        const genderMap = {
            'male': 'Nam',
            'female': 'Nữ',
        };
        return genderMap[gender.toString().toLowerCase()] || 'Không xác định';
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

    // --- HANDLERS CHO THÊM NHIỀU THUỐC ---
    const handleOpenAddNewModal = () => {
        setNewMedicines([{ ...initialNewMedicineState }]);
        setIsAddingMedicine(true);
        setIsAddNewModalOpen(true);
        if (orderData?.order?.imageURL) {
            setImageModalOpen(true);
        }
    };

    const handleCloseFormModal = () => {
        setIsAddNewModalOpen(false);
        setNewMedicines([{ ...initialNewMedicineState }]);
    };

    const handleCloseImageModal = () => {
        if (!isAddingMedicine) {
            setImageModalOpen(false);
        }
    };

    const handleCloseAllModals = () => {
        setIsAddNewModalOpen(false);
        setImageModalOpen(false);
        setIsAddingMedicine(false);
        setNewMedicines([{ ...initialNewMedicineState }]);
    };

    const addMedicineRow = () => {
        setNewMedicines([...newMedicines, { ...initialNewMedicineState }]);
    };

    const removeMedicineRow = (index) => {
        if (newMedicines.length > 1) {
            setNewMedicines(newMedicines.filter((_, i) => i !== index));
        }
    };

    const handleMedicineFormChange = (index, field, value) => {
        const updatedMedicines = [...newMedicines];
        updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
        setNewMedicines(updatedMedicines);
    };

    const handleSubmitNewMedicines = async () => {
        const validMedicines = newMedicines.filter(med =>
            med.medicineName.trim() && med.dosage.trim()
        );

        if (validMedicines.length === 0) {
            toast.warn('Vui lòng nhập ít nhất một thuốc với tên và liều lượng.');
            return;
        }

        setIsUpdating(true);
        try {
            const processedMedicines = validMedicines.map(medicine => {
                const finalMedicineData = { ...medicine };
                if (typeof finalMedicineData.time === 'string' && finalMedicineData.time.trim() !== '') {
                    const timeArray = finalMedicineData.time.split(',').map(t => t.trim()).filter(Boolean);
                    finalMedicineData.time = JSON.stringify(timeArray);
                } else {
                    finalMedicineData.time = '';
                }
                return finalMedicineData;
            });

            const payload = { medicalOrderDetails: processedMedicines };
            await medicalOrderApi.additionalDetail(orderId, payload);
            toast.success(`Đã thêm thành công ${validMedicines.length} loại thuốc mới!`);
            handleCloseAllModals();
            await loadData();
        } catch (err) {
            toast.error("Thêm thuốc mới thất bại.");
            console.error('Error adding medicines:', err);
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
            {/* Header */}
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

            {/* Phần hiển thị thông tin */}
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
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin học sinh</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography><strong>Tên học sinh:</strong> {medicalOrder.ChildId.name}</Typography>
                                <Typography><strong>Giới tính:</strong> {changeGenderToVN(medicalOrder.ChildId.gender)}</Typography>
                                <Typography><strong>Ngày sinh:</strong> {formatDate(medicalOrder.ChildId.birthdate)}</Typography>
                                <Typography><strong>Mã học sinh:</strong> {medicalOrder.ChildId.studentCode}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <img
                                    src={medicalOrder.imageURL}
                                    alt="Ảnh đơn thuốc"
                                    onClick={() => setImageZoomOpen(true)}
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

            {/* Lịch sử sử dụng thuốc */}
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

            {/* --- MODAL THÊM THUỐC (CẢI TIẾN VỚI THEME) --- */}
            <Dialog
                open={isAddNewModalOpen}
                onClose={handleCloseFormModal}
                disableEscapeKeyDown={false}
                disableRestoreFocus={true}
                disableAutoFocus={false}
                disableEnforceFocus={false}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        ...MODAL_THEME.container,
                        position: 'fixed',
                        left: 50,
                        top: 50,
                        width: '45%',
                        maxWidth: 600,
                        height: '85vh',
                        margin: 0,
                        zIndex: 1400,
                    }
                }}
                BackdropProps={{
                    sx: {
                        ...MODAL_THEME.backdrop,
                        zIndex: 1399,
                    }
                }}
            >
                <DialogTitle sx={{
                    ...MODAL_THEME.header,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    📋 Thêm thuốc mới ({newMedicines.length} thuốc)
                    <Box>
                        <Tooltip title="Thêm dòng thuốc mới">
                            <Button
                                onClick={addMedicineRow}
                                sx={{
                                    color: 'white',
                                    minWidth: 'auto',
                                    px: 1,
                                    mr: 1,
                                    fontSize: '0.75rem'
                                }}
                                size="small"
                                startIcon={<AddIcon />}
                            >
                                Thêm dòng
                            </Button>
                        </Tooltip>
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
                <DialogContent sx={{ 
                    ...MODAL_THEME.content,
                    px: 3, 
                    py: 2, 
                    maxHeight: '70vh', 
                    overflowY: 'auto' 
                }}>
                    <Stack spacing={3}>
                        {newMedicines.map((medicine, index) => (
                            <Box key={index} sx={{
                                p: 2,
                                border: 1,
                                borderColor: 'grey.300',
                                borderRadius: 2,
                                position: 'relative',
                                backgroundColor: '#ffffff', // Background trắng cho từng card
                            }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    Thuốc #{index + 1}
                                </Typography>

                                {newMedicines.length > 1 && (
                                    <IconButton
                                        onClick={() => removeMedicineRow(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            color: 'error.main'
                                        }}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            label="Tên thuốc"
                                            value={medicine.medicineName}
                                            onChange={(e) => handleMedicineFormChange(index, 'medicineName', e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            label="Liều lượng"
                                            value={medicine.dosage}
                                            onChange={(e) => handleMedicineFormChange(index, 'dosage', e.target.value)}
                                            fullWidth
                                            size="small"
                                            placeholder="vd: 500mg"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Loại"
                                            value={medicine.type}
                                            onChange={(e) => handleMedicineFormChange(index, 'type', e.target.value)}
                                            fullWidth
                                            size="small"
                                            placeholder="vd: viên, nước"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Số lượng"
                                            type="number"
                                            value={medicine.quantity}
                                            onChange={(e) => handleMedicineFormChange(index, 'quantity', e.target.value)}
                                            fullWidth
                                            size="small"
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Thời gian uống"
                                            value={medicine.time}
                                            onChange={(e) => handleMedicineFormChange(index, 'time', e.target.value)}
                                            fullWidth
                                            size="small"
                                            placeholder="vd: sáng, tối"
                                            helperText="Các buổi cách nhau bằng dấu phẩy"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Ghi chú"
                                            value={medicine.note}
                                            onChange={(e) => handleMedicineFormChange(index, 'note', e.target.value)}
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                </Grid>

                                {index < newMedicines.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ 
                    ...MODAL_THEME.footer,
                    px: 3, 
                    py: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2
                }}>
                    <Button onClick={handleCloseFormModal} disabled={isUpdating}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmitNewMedicines}
                        variant="contained"
                        disabled={isUpdating}
                        sx={{ minWidth: 140 }}
                    >
                        {isUpdating ? <CircularProgress size={20} /> : `Thêm ${newMedicines.length} thuốc`}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- DIV CONTAINER CHO MODAL ẢNH (CẢI TIẾN VỚI THEME) --- */}
            {isImageModalOpen && (
                <div
                    style={{
                        ...MODAL_THEME.container,
                        position: 'fixed',
                        right: 50,
                        top: 50,
                        width: '45%',
                        maxWidth: 700,
                        height: '85vh',
                        zIndex: 1200,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        ...MODAL_THEME.headerImage,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                                Hình ảnh đơn thuốc
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {isAddingMedicine && (
                                <Typography variant="body2" sx={{ mr: 2, opacity: 0.9, color: 'white' }}>
                                    (Đang thêm thuốc...)
                                </Typography>
                            )}
                            <IconButton
                                onClick={isAddingMedicine ? handleCloseAllModals : handleCloseImageModal}
                                sx={{ color: 'white' }}
                                size="small"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </div>

                    {/* Content */}
                    <div style={{
                        ...MODAL_THEME.content,
                        flex: 1,
                        padding: 16,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'auto',
                    }}>
                        {medicalOrder.imageURL && (
                            <img
                                src={medicalOrder.imageURL}
                                alt="Đơn thuốc"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        ...MODAL_THEME.footer,
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Button
                            onClick={isAddingMedicine ? handleCloseAllModals : handleCloseImageModal}
                            variant="outlined"
                            size="small"
                        >
                            {isAddingMedicine ? 'Đóng cả 2 modal' : 'Đóng ảnh'}
                        </Button>
                    </div>
                </div>
            )}

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

            {/* Lightbox cho zoom ảnh */}
            <Lightbox
                open={isImageZoomOpen}
                close={() => setImageZoomOpen(false)}
                slides={medicalOrder.imageURL ? [{ src: medicalOrder.imageURL }] : []}
                plugins={[Zoom]}
                styles={{
                    container: { zIndex: 1500 },
                }}
            />
        </Container>
    );
};

export default MedicalOrderDetailPage;
