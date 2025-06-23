import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Grid, Chip, Stack,
    FormControl, Select, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText,
    Checkbox,
} from '@mui/material';
import {
    ArrowBack as BackIcon, Print as PrintIcon, Person as PersonIcon,
    ThumbUpAlt as ApproveIcon, Cancel as CancelIcon, Edit as EditIcon, Save as SaveIcon,
    History as HistoryIcon, Warning as WarningIcon,
    PlaylistAddCheck as BatchRecordIcon, Add as AddIcon, Autorenew as RefillIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';
import { formattedDate } from '../../utils/date.utils';

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
    time: '[]',
    note: '',
    quantity: 10,
};

const MedicalOrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [usageHistory, setUsageHistory] = useState([]);

    const [isAddRecordModalOpen, setAddRecordModalOpen] = useState(false);
    const [selectionForRecord, setSelectionForRecord] = useState({});

    const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
    const [refillData, setRefillData] = useState({ detail: null, additionalQuantity: 10 });
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    const [newMedicine, setNewMedicine] = useState(initialNewMedicineState);

    // MỚI: State cho Dialog từ chối
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');


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
            console.log("[DEBUG] Kết quả từ medicalOrderApi.getDetail:", detailsResponse);
            console.log("[DEBUG] Kết quả từ medicalOrderApi.getRecord:", historyResponse);

            if (detailsResponse.isSuccess && detailsResponse.data) {
                setOrderData(detailsResponse.data);
                setNewStatus(detailsResponse.data.order.status);

            } else {
                setError('Không tìm thấy thông tin đơn thuốc.');
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
    // THAY ĐỔI: Chỉnh sửa hàm để có thể nhận payload là object
    const handleUpdateStatus = useCallback(async (payload) => {
        setIsUpdating(true);
        try {
            await medicalOrderApi.updateStatus(orderId, payload);
            const statusLabel = typeof payload === 'string' ? payload : payload.status;
            toast.success(`Cập nhật trạng thái thành "${statusMap[statusLabel]?.label || statusLabel}" thành công!`);
            setIsEditingStatus(false);
            await loadData();
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại.');
            console.error('Failed to update status:', err);
        } finally {
            setIsUpdating(false);
        }
    }, [orderId, loadData]);

    // MỚI: Handler cho việc từ chối đơn thuốc
    const handleRejectOrder = async () => {
        if (!rejectionReason.trim()) {
            toast.warn('Vui lòng nhập lý do từ chối.');
            return;
        }

        const payload = {
            status: 'canceled',
            note: rejectionReason, // Giả sử API của bạn nhận trường này
        };
        // Gọi hàm cập nhật chung
        await handleUpdateStatus(payload);
        // Đóng modal sau khi xử lý xong
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

    const handleSaveStatus = () => {
        if (newStatus !== orderData.order.status) {
            handleUpdateStatus({ status: newStatus });
        } else {
            setIsEditingStatus(false);
        }
    };

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
    const handleCloseAddRecordModal = () => setAddRecordModalOpen(false);

    const handleQuantityChangeInModal = (detailId, quantity) => {
        const newQuantity = Number(quantity);
        setSelectionForRecord(prev => ({
            ...prev,
            [detailId]: {
                ...prev[detailId],
                quantity: newQuantity,
            }
        }));
    };

    const handleSubmitRecord = async () => {
        const itemsToRecord = Object.values(selectionForRecord)
            .filter(item => item.quantity > 0)
            .map(item => ({
                medicalOrderDetailId: item.detail._id,
                quantity: item.quantity,
            }));

        if (itemsToRecord.length === 0) {
            toast.warn('Vui lòng nhập số lượng cho ít nhất một loại thuốc.');
            return;
        }

        setIsUpdating(true);
        try {
            const recordData = { items: itemsToRecord };
            await medicalOrderApi.addRecord(orderId, recordData);
            toast.success(`Đã ghi nhận thành công ${itemsToRecord.length} loại thuốc.`);
            handleCloseAddRecordModal();
            setSelectionForRecord({});
            await loadData();
        } catch (err) {
            toast.error('Ghi nhận thất bại.');
            console.error('Failed to add record:', err.response?.data || err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenRefillModal = (detail) => {
        setRefillData({ detail, additionalQuantity: 10 });
        setIsRefillModalOpen(true);
    };
    const handleCloseRefillModal = () => setIsRefillModalOpen(false);

    // MỚI: Handlers cho dialog từ chối
    const handleOpenRejectModal = () => setRejectModalOpen(true);
    const handleCloseRejectModal = () => {
        setRejectModalOpen(false);
        setRejectionReason(''); // Reset lý do khi đóng
    };

    const handleSubmitRefill = async () => {
        setIsUpdating(true);
        try {
            const { detail, additionalQuantity } = refillData;

            const payload = {
                medicalOrderDetails: [{
                    _id: detail._id,
                    medicineName: detail.medicineName,
                    dosage: detail.dosage,
                    type: detail.type,
                    time: detail.time,
                    note: detail.note,
                    quantity: detail.quantity + additionalQuantity,
                }]
            };

            await medicalOrderApi.additionalDetail(orderId, payload);
            toast.success(`Đã bổ sung ${additionalQuantity} viên ${detail.medicineName}.`);
            handleCloseRefillModal();
            await loadData();
        } catch (err) {
            toast.error("Bổ sung thuốc thất bại.");
            console.error("Refill failed:", err.response?.data || err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleOpenAddNewModal = () => {
        setNewMedicine(initialNewMedicineState);
        setIsAddNewModalOpen(true);
    };
    const handleCloseAddNewModal = () => setIsAddNewModalOpen(false);

    const handleNewMedicineFormChange = (e) => {
        const { name, value } = e.target;
        setNewMedicine(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitNewMedicine = async () => {
        if (!newMedicine.medicineName || !newMedicine.medicineName.trim()) {
            toast.warn('Vui lòng nhập tên thuốc.');
            return;
        }
        if (!newMedicine.dosage || !newMedicine.dosage.trim()) {
            toast.warn('Vui lòng nhập liều lượng.');
            return;
        }

        setIsUpdating(true);
        try {
            const medicineDataForPayload = {
                medicineName: newMedicine.medicineName,
                dosage: newMedicine.dosage,
                type: newMedicine.type,
                time: newMedicine.time,
                quantity: newMedicine.quantity,
            };
            if (newMedicine.note && newMedicine.note.trim() !== '') {
                medicineDataForPayload.note = newMedicine.note;
            }
            const payload = { medicalOrderDetails: [medicineDataForPayload] };

            await medicalOrderApi.additionalDetail(orderId, payload);
            toast.success(`Đã thêm thuốc mới: ${newMedicine.medicineName}.`);
            handleCloseAddNewModal();
            await loadData();
        } catch (err) {
            toast.error("Thêm thuốc mới thất bại.");
            console.error("Add new medicine failed:", err.response?.data || err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBack = () => navigate(-1);
    const handlePrint = () => window.print();
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
    const formatTime = (timeData) => {
        if (!timeData) return 'N/A';
        let timeArray = [];
        if (Array.isArray(timeData)) {
            timeArray = timeData;
        } else if (typeof timeData === 'string') {
            try {
                timeArray = JSON.parse(timeData);
            } catch (e) {
                const cleanedString = timeData.replace(/^\[|\]$/g, '');
                timeArray = cleanedString.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, ''));
            }
        } else {
            return String(timeData);
        }
        if (!Array.isArray(timeArray) || timeArray.length === 0) return 'N/A';
        return timeArray.map(t => (typeof t === 'string' && t.length > 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t)).join(', ');
    };

    if (loading) { return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>; }
    if (error) { return <Container maxWidth="lg" sx={{ py: 3 }}><Alert severity="error">{error}</Alert></Container>; }
    if (!orderData || !orderData.order || !orderData.details) { return <Container maxWidth="lg" sx={{ py: 3 }}><Alert severity="info">Không có dữ liệu.</Alert></Container>; }

    const { order: medicalOrder, details: medicalOrderDetails } = orderData;
    const currentStatusInfo = statusMap[medicalOrder.status] || { label: medicalOrder.status, color: 'default' };
    const numSelected = Object.keys(selectionForRecord).length;
    const rowCount = medicalOrderDetails.filter(d => d.quantity > 0).length;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}><BackIcon /></IconButton>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Chi tiết Đơn thuốc</Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* THAY ĐỔI: Thêm nút từ chối */}
                    {medicalOrder.status === 'pending' && (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={handleOpenRejectModal}
                                disabled={isUpdating}
                            >
                                Từ chối
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <ApproveIcon />}
                                onClick={() => handleUpdateStatus({ status: 'approved' })}
                                disabled={isUpdating}
                            >
                                Duyệt
                            </Button>
                        </>
                    )}
                </Stack>
            </Box>

            <Card sx={{ mb: 3 }}>
                {/* ... (Phần còn lại của Card thông tin chung không đổi) ... */}
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin chung</Typography>
                    <Grid container spacing={2} sx={{ mt: 1, alignItems: 'center' }}>
                        <Grid item xs={12} sm={4}><Typography><strong>Ngày bắt đầu:</strong> {formatDate(medicalOrder.startDate)}</Typography></Grid>
                        <Grid item xs={12} sm={4}><Typography><strong>Ngày kết thúc:</strong> {formatDate(medicalOrder.endDate)}</Typography></Grid>
                        <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography><strong>Trạng thái:</strong></Typography>
                                {isEditingStatus ? (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <FormControl size="small">
                                            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} disabled={isUpdating}>
                                                {Object.keys(statusMap).map(key => (<MenuItem key={key} value={key}>{statusMap[key].label}</MenuItem>))}
                                            </Select>
                                        </FormControl>
                                        <IconButton color="success" onClick={handleSaveStatus} disabled={isUpdating}>{isUpdating ? <CircularProgress size={22} /> : <SaveIcon />}</IconButton>
                                        <IconButton onClick={() => setIsEditingStatus(false)} disabled={isUpdating}><CancelIcon /></IconButton>
                                    </Stack>
                                ) : (
                                    <>
                                        <Chip label={currentStatusInfo.label} color={currentStatusInfo.color} size="small" />
                                        <Tooltip title="Chỉnh sửa trạng thái"><IconButton size="small" onClick={() => setIsEditingStatus(true)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                {/* ... (Phần còn lại của Card danh sách thuốc không đổi) ... */}
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách Thuốc</Typography>
                        <Stack direction="row" spacing={1}>
                            {medicalOrder.status === 'approved' && (
                                <Button variant="contained" startIcon={<BatchRecordIcon />} disabled={numSelected === 0} onClick={handleOpenAddRecordModal}>Cho uống thuốc  ({numSelected})</Button>
                            )}
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddNewModal}>Thêm thuốc mới</Button>
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
                                            <TableCell align="center">{detail.quantity}</TableCell>
                                            <TableCell>{formatTime(detail.time)}</TableCell>
                                            <TableCell>{detail.note || '—'}</TableCell>
                                            <TableCell align="center">
                                                {detail.quantity <= 2 && (
                                                    <Tooltip title="Bổ sung số lượng">
                                                        <IconButton color="primary" size="small" onClick={() => handleOpenRefillModal(detail)}><RefillIcon /></IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {usageHistory && usageHistory.length > 0 && (
                <Card>
                    {/* ... (Phần còn lại của Card lịch sử sử dụng không đổi) ... */}
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><HistoryIcon sx={{ mr: 1, color: 'primary.main' }} /><Typography variant="h6" sx={{ fontWeight: 600 }}>Lịch sử sử dụng thuốc</Typography></Box>
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

            {/* ... (Dialogs hiện có không đổi) ... */}
            <Dialog open={isAddRecordModalOpen} onClose={handleCloseAddRecordModal} PaperProps={{ sx: { width: '35%' } }}>
                <DialogTitle>Ghi nhận sử dụng thuốc</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {Object.keys(selectionForRecord).length > 0 ? (
                            Object.values(selectionForRecord).map(({ detail, quantity }) => (
                                <Box key={detail._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography sx={{ flexGrow: 1 }}>{detail.medicineName}</Typography>
                                    <TextField
                                        label="SL đã dùng" type="number" size="small" variant="outlined"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChangeInModal(detail._id, e.target.value)}
                                        inputProps={{ min: 1, max: detail.quantity }}
                                        sx={{ width: '120px' }}
                                    />
                                </Box>
                            ))
                        ) : (
                            <Typography>Không có thuốc nào được chọn.</Typography>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddRecordModal} disabled={isUpdating}>Hủy</Button>
                    <Button onClick={handleSubmitRecord} variant="contained" disabled={isUpdating || numSelected === 0}>
                        {isUpdating ? <CircularProgress size={24} /> : 'Xác nhận tất cả'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isRefillModalOpen} onClose={handleCloseRefillModal}>
                <DialogTitle>Bổ sung số lượng</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Bổ sung cho: <strong>{refillData.detail?.medicineName}</strong></Typography>
                    <TextField autoFocus margin="dense" label="Số lượng bổ sung" type="number" fullWidth variant="outlined" value={refillData.additionalQuantity} onChange={(e) => setRefillData(prev => ({ ...prev, additionalQuantity: Number(e.target.value) }))} inputProps={{ min: 1 }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRefillModal} disabled={isUpdating}>Hủy</Button>
                    <Button onClick={handleSubmitRefill} variant="contained" disabled={isUpdating}>{isUpdating ? <CircularProgress size={24} /> : 'Xác nhận'}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isAddNewModalOpen} onClose={handleCloseAddNewModal} PaperProps={{ sx: { width: '35%' } }}>
                <DialogTitle>Thêm thuốc mới vào đơn</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField required name="medicineName" label="Tên thuốc" value={newMedicine.medicineName} onChange={handleNewMedicineFormChange} fullWidth />
                        <TextField required name="dosage" label="Liều lượng (vd: 500mg)" value={newMedicine.dosage} onChange={handleNewMedicineFormChange} fullWidth />
                        <TextField name="time" label="Thời gian uống (vd: [sáng, tối])" value={newMedicine.time} onChange={handleNewMedicineFormChange} fullWidth />
                        <TextField name="quantity" label="Số lượng ban đầu" type="number" value={newMedicine.quantity} onChange={handleNewMedicineFormChange} fullWidth />
                        <TextField name="note" label="Ghi chú" value={newMedicine.note} onChange={handleNewMedicineFormChange} fullWidth multiline rows={2} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddNewModal} disabled={isUpdating}>Hủy</Button>
                    <Button onClick={handleSubmitNewMedicine} variant="contained" disabled={isUpdating}>{isUpdating ? <CircularProgress size={24} /> : 'Lưu thuốc'}</Button>
                </DialogActions>
            </Dialog>

            {/* MỚI: Dialog để nhập lý do từ chối */}
            <Dialog open={isRejectModalOpen} onClose={handleCloseRejectModal} fullWidth maxWidth="sm">
                <DialogTitle>Lý do từ chối đơn thuốc</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Vui lòng nhập lý do từ chối. Lý do này sẽ được ghi lại trong hệ thống.
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
                    <Button
                        onClick={handleRejectOrder}
                        variant="contained"
                        color="error"
                        disabled={isUpdating || !rejectionReason.trim()}
                    >
                        {isUpdating ? <CircularProgress size={24} /> : ' Từ chối'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default MedicalOrderDetailPage;