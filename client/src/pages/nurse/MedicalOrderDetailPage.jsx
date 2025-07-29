// ===== IMPORTS =====
import React, { useState, useEffect, useCallback } from 'react';
// Import các components UI từ Material-UI
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Grid, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, DialogContentText,
    Checkbox, Divider, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
// Import các icons từ Material-UI
import {
    ArrowBack as BackIcon, Person as PersonIcon,
    ThumbUpAlt as ApproveIcon, Cancel as CancelIcon,
    History as HistoryIcon, Warning as WarningIcon,
    PlaylistAddCheck as BatchRecordIcon, Add as AddIcon,
    Close as CloseIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
// Import hooks cho routing
import { useParams, useNavigate } from 'react-router';
// Import thư viện hiển thị toast notifications
import { toast } from 'react-toastify';
// Import API để gọi backend
import medicalOrderApi from '../../api/medicalOrderApi';
// Import utility functions cho xử lý ngày tháng
import { formattedDate } from '../../utils/date.utils';
// Import Redux hooks để lấy thông tin user
import { useSelector } from 'react-redux';

// ===== LIGHTBOX IMPORTS (Thư viện để zoom ảnh) =====
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// ===== THEME CONSTANTS (Định nghĩa style cho các modal) =====
const MODAL_THEME = {
    // Style cho container modal
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        border: '1px solid #e0e0e0',
    },
    // Style cho nội dung modal
    content: {
        backgroundColor: '#f8f9fa',
        borderRadius: 4,
    },
    // Style cho backdrop (lớp phủ mờ phía sau modal)
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.05)', // Backdrop rất nhẹ
    },
    // Style cho header modal
    header: {
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px 8px 0 0',
    },
    // Style cho footer modal
    footer: {
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
        padding: '16px 24px',
        borderRadius: '0 0 8px 8px',
    }
};

// ===== STATUS MAPPING (Mapping các trạng thái đơn thuốc) =====
const statusMap = {
    pending: { label: 'Chờ duyệt', color: 'warning' },
    approved: { label: 'Đã duyệt', color: 'success' },
    canceled: { label: 'Đã hủy', color: 'error' },
    completed: { label: 'Đã hoàn thành', color: 'primary' },
};

// ===== INITIAL STATE CHO FORM THÊM THUỐC MỚI =====
const initialNewMedicineState = {
    medicineName: '',    // Tên thuốc
    dosage: '',          // Liều lượng (vd: 500mg)
    type: 'viên',        // Loại thuốc (viên, gói, chai...)
    time: '',            // Thời gian uống
    note: '',            // Ghi chú
    quantity: 1,         // Số lượng
};

// ===== DROPDOWN OPTIONS CHO LOẠI THUỐC =====
const medicineTypeOptions = [
    { value: 'viên', label: 'Viên' },
    { value: 'gói', label: 'Gói' },
    { value: 'chai', label: 'Chai' },
    { value: 'ống', label: 'Ống' },
    { value: 'hộp', label: 'Hộp' },
    { value: 'lọ', label: 'Lọ' },
];

// ===== DROPDOWN OPTIONS CHO THỜI GIAN UỐNG THUỐC =====
const medicineTimeOptions = [
    { value: 'Sáng', label: 'Sáng (1 lần/ngày)' },
    { value: 'Trưa', label: 'Trưa (1 lần/ngày)' },
    { value: 'Chiều', label: 'Chiều (1 lần/ngày)' },
    { value: 'Sáng-Trưa', label: 'Sáng - Trưa (2 lần/ngày)' },
    { value: 'Sáng-Chiều', label: 'Sáng - Chiều (2 lần/ngày)' },
    { value: 'Trưa-Chiều', label: 'Trưa - Chiều (2 lần/ngày)' },
    { value: 'Sáng-Trưa-Chiều', label: 'Sáng - Trưa - Chiều (3 lần/ngày)' },
];

// ===== MAIN COMPONENT =====
const MedicalOrderDetailPage = () => {
    // ===== HOOKS =====
    // Lấy thông tin user từ Redux store
    const { user } = useSelector((state) => state.auth);
    // Lấy orderId từ URL parameters
    const { orderId } = useParams();
    // Hook để điều hướng
    const navigate = useNavigate();

    // ===== STATE MANAGEMENT =====
    // State lưu dữ liệu đơn thuốc (bao gồm thông tin đơn và danh sách thuốc)
    const [orderData, setOrderData] = useState(null);
    // State loading khi đang tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State lưu thông báo lỗi
    const [error, setError] = useState(null);
    // State loading khi đang cập nhật (duyệt, từ chối, thêm thuốc...)
    const [isUpdating, setIsUpdating] = useState(false);
    // State lưu lịch sử sử dụng thuốc
    const [usageHistory, setUsageHistory] = useState([]);

    // ===== MODAL STATES =====
    // State điều khiển modal ghi nhận sử dụng thuốc
    const [isAddRecordModalOpen, setAddRecordModalOpen] = useState(false);
    // State lưu các thuốc được chọn để ghi nhận (dạng: {detailId: {detail, quantity}})
    const [selectionForRecord, setSelectionForRecord] = useState({});
    // State điều khiển modal thêm thuốc mới
    const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
    // State lưu danh sách thuốc mới cần thêm (array)
    const [newMedicines, setNewMedicines] = useState([{ ...initialNewMedicineState }]);
    // State điều khiển modal từ chối đơn
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    // State lưu lý do từ chối
    const [rejectionReason, setRejectionReason] = useState('');
    // State điều khiển lightbox zoom ảnh
    const [isImageZoomOpen, setImageZoomOpen] = useState(false);

    // ===== DATA LOADING FUNCTION =====
    // Function để tải dữ liệu từ server (sử dụng useCallback để tránh re-render không cần thiết)
    const loadData = useCallback(async () => {
        if (!orderId) return; // Nếu không có orderId thì không làm gì
        setLoading(true);
        setError(null);
        try {
            // Gọi đồng thời 2 API: lấy chi tiết đơn thuốc và lấy lịch sử sử dụng
            const [detailsResponse, historyResponse] = await Promise.all([
                medicalOrderApi.getDetail(orderId),    // API lấy chi tiết đơn thuốc
                medicalOrderApi.getRecord(orderId)     // API lấy lịch sử sử dụng thuốc
            ]);

            // Xử lý response chi tiết đơn thuốc
            if (detailsResponse.isSuccess && detailsResponse.data) {
                setOrderData(detailsResponse.data);
            } else {
                setError('Không tìm thấy thông tin đơn gửi thuốc.');
            }

            // Xử lý response lịch sử sử dụng
            if (historyResponse.isSuccess && historyResponse.data) {
                setUsageHistory(historyResponse.data.records || []);
            }
        } catch (err) {
            // Xử lý lỗi
            setError('Đã xảy ra lỗi khi tải dữ liệu.');
            toast.error('Lỗi: không thể tải dữ liệu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    // ===== EFFECT HOOK =====
    // Tải dữ liệu khi component mount hoặc khi loadData thay đổi
    useEffect(() => {
        loadData();
    }, [loadData]);

    // ===== EVENT HANDLERS =====

    // Handler cập nhật trạng thái đơn thuốc (duyệt/từ chối/hoàn thành)
    const handleUpdateStatus = useCallback(async (payload) => {
        setIsUpdating(true);
        try {
            // Gọi API cập nhật trạng thái
            await medicalOrderApi.updateStatus(orderId, payload);
            const statusLabel = statusMap[payload.status]?.label || payload.status;
            toast.success(`Cập nhật trạng thái thành "${statusLabel}" thành công!`);
            // Reload dữ liệu sau khi cập nhật thành công
            await loadData();
        } catch (err) {
            toast.error('Cập nhật trạng thái thất bại.');
            console.error('Failed to update status:', err);
        } finally {
            setIsUpdating(false);
        }
    }, [orderId, loadData]);

    // Handler từ chối đơn thuốc
    const handleRejectOrder = async () => {
        // Kiểm tra xem có nhập lý do từ chối chưa
        if (!rejectionReason.trim()) {
            toast.warn('Vui lòng nhập lý do từ chối.');
            return;
        }
        // Cập nhật trạng thái thành 'canceled' kèm lý do
        await handleUpdateStatus({ status: 'canceled', note: rejectionReason });
        handleCloseRejectModal();
    };

    // Utility function chuyển đổi giới tính sang tiếng Việt
    const changeGenderToVN = (gender) => {
        if (!gender) return 'Không xác định';
        const genderMap = {
            'male': 'Nam',
            'female': 'Nữ',
        };
        return genderMap[gender.toString().toLowerCase()] || 'Không xác định';
    };

    // ===== AUTO-COMPLETE EFFECT =====
    // Effect để tự động chuyển trạng thái thành 'completed' khi tất cả thuốc đã hết
    useEffect(() => {
        // Chỉ thực hiện kiểm tra khi:
        // 1. Có dữ liệu đơn thuốc
        // 2. Đơn thuốc đã được duyệt (status = 'approved')
        if (!orderData || !orderData.order || !orderData.details || orderData.order.status !== 'approved') {
            return;
        }

        // Kiểm tra xem tất cả thuốc đã hết chưa (quantity = 0)
        const allMedicinesFinished = orderData.details.length > 0 &&
            orderData.details.every(detail => detail.quantity === 0);

        // Nếu tất cả thuốc đã hết, tự động chuyển sang trạng thái 'completed'
        if (allMedicinesFinished) {
            handleUpdateStatus({ status: 'completed' });
        }
    }, [orderData, handleUpdateStatus]);

    // ===== CHECKBOX SELECTION HANDLERS =====

    // Handler thay đổi lựa chọn từng thuốc trong bảng
    const handleSelectionChange = (detail) => {
        setSelectionForRecord(prev => {
            const newSelection = { ...prev };
            // Nếu thuốc đã được chọn thì bỏ chọn, ngược lại thì chọn
            if (newSelection[detail._id]) {
                delete newSelection[detail._id];
            } else {
                // Mặc định số lượng = 1 khi chọn
                newSelection[detail._id] = { detail: detail, quantity: 1 };
            }
            return newSelection;
        });
    };

    // Handler chọn/bỏ chọn tất cả thuốc
    const handleSelectAllClick = (event) => {
        if (event.target.checked && orderData && orderData.details) {
            // Chọn tất cả thuốc còn số lượng > 0
            const newSelections = {};
            orderData.details.forEach(detail => {
                if (detail.quantity > 0) {
                    newSelections[detail._id] = { detail: detail, quantity: 1 };
                }
            });
            setSelectionForRecord(newSelections);
            return;
        }
        // Bỏ chọn tất cả
        setSelectionForRecord({});
    };

    // ===== MODAL HANDLERS - GHI NHẬN SỬ DỤNG THUỐC =====

    // Mở modal ghi nhận sử dụng thuốc
    const handleOpenAddRecordModal = () => setAddRecordModalOpen(true);

    // Đóng modal và reset selections
    const handleCloseAddRecordModal = () => {
        setAddRecordModalOpen(false);
        setSelectionForRecord({});
    };

    // Thay đổi số lượng thuốc đã sử dụng trong modal
    const handleQuantityChangeInModal = (detailId, quantity) => {
        const newQuantity = Number(quantity);
        setSelectionForRecord(prev => ({
            ...prev,
            [detailId]: { ...prev[detailId], quantity: newQuantity }
        }));
    };

    // Submit ghi nhận sử dụng thuốc
    const handleSubmitRecord = async () => {
        // Lọc ra các thuốc có số lượng > 0
        const itemsToRecord = Object.values(selectionForRecord)
            .filter(item => item.quantity > 0)
            .map(item => ({
                medicalOrderDetailId: item.detail._id,
                quantity: item.quantity
            }));

        if (itemsToRecord.length === 0) {
            toast.warn('Vui lòng nhập số lượng.');
            return;
        }

        setIsUpdating(true);
        try {
            // Gọi API ghi nhận sử dụng thuốc
            await medicalOrderApi.addRecord(orderId, { items: itemsToRecord });
            toast.success(`Đã ghi nhận thành công ${itemsToRecord.length} loại thuốc.`);
            handleCloseAddRecordModal();
            // Reload dữ liệu để cập nhật số lượng còn lại
            await loadData();
        } catch (err) {
            toast.error('Ghi nhận thất bại.');
        } finally {
            setIsUpdating(false);
        }
    };

    // ===== MODAL HANDLERS - TỪ CHỐI ĐỢN =====

    // Mở modal từ chối đơn
    const handleOpenRejectModal = () => setRejectModalOpen(true);

    // Đóng modal và reset lý do từ chối
    const handleCloseRejectModal = () => {
        setRejectModalOpen(false);
        setRejectionReason('');
    };

    // ===== MODAL HANDLERS - THÊM THUỐC MỚI =====

    // Mở modal thêm thuốc mới
    const handleOpenAddNewModal = () => {
        // Reset form về trạng thái ban đầu (1 thuốc trống)
        setNewMedicines([{ ...initialNewMedicineState }]);
        setIsAddNewModalOpen(true);
    };

    // Đóng modal và reset form
    const handleCloseAddNewModal = () => {
        setIsAddNewModalOpen(false);
        setNewMedicines([{ ...initialNewMedicineState }]);
    };

    // Thêm một dòng thuốc mới vào form
    const addMedicineRow = () => {
        setNewMedicines([...newMedicines, { ...initialNewMedicineState }]);
    };

    // Xóa một dòng thuốc khỏi form (chỉ được xóa khi có > 1 dòng)
    const removeMedicineRow = (index) => {
        if (newMedicines.length > 1) {
            setNewMedicines(newMedicines.filter((_, i) => i !== index));
        }
    };

    // Thay đổi giá trị trong form thuốc
    const handleMedicineFormChange = (index, field, value) => {
        const updatedMedicines = [...newMedicines];
        updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
        setNewMedicines(updatedMedicines);
    };

    // Submit thêm thuốc mới
    const handleSubmitNewMedicines = async () => {
        // Lọc ra các thuốc hợp lệ (có tên, liều lượng và số lượng > 0)
        const validMedicines = newMedicines.filter(med =>
            med.medicineName.trim() &&
            med.dosage.trim() &&
            Number(med.quantity) > 0
        );

        if (validMedicines.length === 0) {
            toast.warn('Vui lòng nhập ít nhất một thuốc hợp lệ (tên, liều lượng, số lượng > 0).');
            return;
        }

        setIsUpdating(true);
        try {
            // Xử lý dữ liệu trước khi gửi lên server
            const processedMedicines = validMedicines.map(medicine => {
                const finalMedicineData = { ...medicine };
                // Xử lý trường 'time': chuyển từ string thành JSON array
                if (typeof finalMedicineData.time === 'string' && finalMedicineData.time.trim() !== '') {
                    // Với dropdown, time đã là giá trị đơn lẻ, chỉ cần chuyển thành array
                    const timeArray = [finalMedicineData.time.trim()];
                    finalMedicineData.time = JSON.stringify(timeArray);
                } else {
                    finalMedicineData.time = JSON.stringify([]);
                }
                return finalMedicineData;
            });

            // Gọi API thêm thuốc mới
            const payload = { medicalOrderDetails: processedMedicines };
            await medicalOrderApi.additionalDetail(orderId, payload);
            toast.success(`Đã thêm thành công ${validMedicines.length} loại thuốc mới!`);
            handleCloseAddNewModal();
            // Reload dữ liệu để hiển thị thuốc mới
            await loadData();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi không xác định';
            toast.error(`Thêm thuốc mới thất bại: ${errorMessage}`);
            console.error('Error adding medicines:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    // ===== UTILITY FUNCTIONS =====

    // Điều hướng về trang trước
    const handleBack = () => navigate(-1);

    // Format ngày tháng cho hiển thị
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');

    // Format thời gian uống thuốc từ JSON string thành chuỗi hiển thị
    const formatTime = (timeData) => {
        if (!timeData) return 'N/A';
        try {
            // Parse từ JSON string thành array
            const timeArray = Array.isArray(timeData) ? timeData : JSON.parse(timeData);
            if (!Array.isArray(timeArray) || timeArray.length === 0) return 'N/A';
            // Viết hoa chữ cái đầu và join bằng dấu phẩy
            return timeArray.map(t => String(t).charAt(0).toUpperCase() + String(t).slice(1)).join(', ');
        } catch (e) {
            // Fallback nếu parse lỗi
            return String(timeData);
        }
    };

    // ===== EARLY RETURNS (Xử lý các trường hợp đặc biệt) =====

    // Hiển thị loading spinner khi đang tải dữ liệu
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Hiển thị thông báo lỗi nếu có lỗi
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // Hiển thị thông báo không có dữ liệu nếu không tải được dữ liệu
    if (!orderData || !orderData.order || !orderData.details) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert severity="info">Không có dữ liệu.</Alert>
            </Container>
        );
    }

    // ===== DESTRUCTURE DATA =====
    // Tách dữ liệu từ orderData để dễ sử dụng
    const { order: medicalOrder, details: medicalOrderDetails } = orderData;
    // Tính toán số lượng thuốc được chọn và tổng số thuốc còn lại
    const numSelected = Object.keys(selectionForRecord).length;
    const rowCount = medicalOrderDetails.filter(d => d.quantity > 0).length;

    // ===== MAIN RENDER =====
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* ===== HEADER SECTION ===== */}
            {/* Header với title và các nút action (duyệt/từ chối) */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Nút quay lại */}
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}><BackIcon /></IconButton>
                    {/* Icon và title */}
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>Chi tiết Đơn gửi thuốc</Typography>
                </Box>
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Chỉ hiển thị nút duyệt/từ chối khi đơn đang pending và user là nurse */}
                    {medicalOrder.status === 'pending' && user.role === "nurse" && (
                        <>
                            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleOpenRejectModal} disabled={isUpdating}>Từ chối</Button>
                            <Button variant="contained" color="success" startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <ApproveIcon />} onClick={() => handleUpdateStatus({ status: 'approved' })} disabled={isUpdating}>Duyệt</Button>
                        </>
                    )}
                </Stack>
            </Box>

            {/* ===== MAIN CONTENT SECTION ===== */}
            {/* Phần hiển thị thông tin - Layout khác nhau tùy thuộc vào có ảnh hay không */}

            {/* LAYOUT CÓ ẢNH: Chia 2 cột (thông tin + ảnh bên trái, danh sách thuốc bên phải) */}
            {medicalOrder.imageURL ? (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
                    {/* CỘT TRÁI: Thông tin chung + Thông tin học sinh + Ảnh */}
                    <Card sx={{ flex: 1, maxWidth: { md: '50%' }, mb: { xs: 2, md: 0 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CardContent sx={{ width: '100%' }}>
                            {/* Thông tin chung về đơn thuốc */}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin chung</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography><strong>Ngày bắt đầu:</strong> {formatDate(medicalOrder.startDate)}</Typography>
                                <Typography><strong>Ngày kết thúc:</strong> {formatDate(medicalOrder.endDate)}</Typography>
                                <Typography><strong>Ghi chú/Lý do:</strong> {medicalOrder.note || 'không có'}</Typography>
                            </Box>

                            {/* Thông tin học sinh */}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Thông tin học sinh</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography><strong>Tên học sinh:</strong> {medicalOrder.ChildId.name}</Typography>
                                <Typography><strong>Giới tính:</strong> {changeGenderToVN(medicalOrder.ChildId.gender)}</Typography>
                                <Typography><strong>Ngày sinh:</strong> {formatDate(medicalOrder.ChildId.birthdate)}</Typography>
                                <Typography><strong>Mã học sinh:</strong> {medicalOrder.ChildId.studentCode}</Typography>
                            </Box>

                            {/* Ảnh đơn thuốc (có thể click để zoom) */}
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

                    {/* CỘT PHẢI: Danh sách thuốc */}
                    <Card sx={{ flex: 1, maxWidth: { md: '50%' }, display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ p: 0 }}>
                            {/* Header của bảng thuốc với các nút action */}
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách Thuốc</Typography>
                                <Stack direction="row" spacing={1}>
                                    {/* Chỉ hiển thị nút khi đơn đã duyệt và user là nurse */}
                                    {medicalOrder.status === 'approved' && user.role === "nurse" && (
                                        <>
                                            {/* Nút cho uống thuốc (hiển thị số thuốc đã chọn) */}
                                            <Button variant="contained" startIcon={<BatchRecordIcon />} disabled={numSelected === 0} onClick={handleOpenAddRecordModal}>Cho uống thuốc ({numSelected})</Button>
                                            {/* Nút thêm thuốc mới */}
                                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAddNewModal}>Thêm thuốc mới</Button>
                                        </>
                                    )}
                                </Stack>
                            </Box>

                            {/* Bảng danh sách thuốc */}
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
                // LAYOUT KHÔNG CÓ ẢNH: Layout đơn giản với thông tin chung ở trên, danh sách thuốc ở dưới
                <>
                    {/* Card thông tin chung */}
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

                    {/* Card danh sách thuốc */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 0 }}>
                            {/* Header với các nút action */}
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

                            {/* Bảng thuốc (giống với layout có ảnh) */}
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

            {/* ===== LỊCH SỬ SỬ DỤNG THUỐC ===== */}
            {/* Chỉ hiển thị khi có lịch sử sử dụng */}
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
                                    {/* Flatten các records và items để hiển thị từng dòng */}
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

            {/* ===== MODAL GHI NHẬN SỬ DỤNG THUỐC ===== */}
            {/* Modal để ghi nhận số lượng thuốc đã sử dụng */}
            <Dialog open={isAddRecordModalOpen} onClose={handleCloseAddRecordModal} PaperProps={{ sx: { width: '35%' } }}>
                <DialogTitle>Ghi nhận sử dụng thuốc</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {Object.keys(selectionForRecord).length > 0 ? (
                            // Hiển thị danh sách thuốc được chọn với input số lượng
                            Object.values(selectionForRecord).map(({ detail, quantity }) => (
                                <Box key={detail._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography sx={{ flexGrow: 1 }}>{detail.medicineName}</Typography>
                                    <TextField
                                        label="SL đã dùng"
                                        type="number"
                                        size="small"
                                        variant="outlined"
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

            {/* ===== MODAL THÊM THUỐC MỚI ===== */}
            {/* Modal lớn với layout chia 2 cột: form bên trái, ảnh bên phải */}
            <Dialog
                open={isAddNewModalOpen}
                onClose={handleCloseAddNewModal}
                disableEscapeKeyDown={false}
                disableRestoreFocus={true}
                disableAutoFocus={false}
                disableEnforceFocus={false}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        ...MODAL_THEME.container,
                        height: '90vh',
                        width: '95%',
                        maxWidth: 1200,
                        margin: 'auto',
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
                                Thêm Thuốc
                            </Button>
                        </Tooltip>
                        <IconButton
                            onClick={handleCloseAddNewModal}
                            sx={{ color: 'white' }}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    ...MODAL_THEME.content,
                    p: 0,
                    height: '100%',
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        {/* ===== NỬA TRÁI: FORM THÊM THUỐC ===== */}
                        <Box sx={{
                            width: medicalOrder?.imageURL ? '50%' : '100%',
                            p: 3,
                            overflowY: 'auto',
                            borderRight: medicalOrder?.imageURL ? '1px solid #e0e0e0' : 'none',
                            backgroundColor: '#ffffff'
                        }}>
                            <Stack spacing={3}>
                                {/* Lặp qua từng thuốc trong mảng newMedicines */}
                                {newMedicines.map((medicine, index) => (
                                    <Box key={index} sx={{
                                        p: 2,
                                        border: 1,
                                        borderColor: 'grey.300',
                                        borderRadius: 2,
                                        position: 'relative',
                                        backgroundColor: '#ffffff',
                                    }}>
                                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                            Thuốc #{index + 1}
                                        </Typography>
                                        {/* Nút xóa thuốc (chỉ hiển thị khi có > 1 thuốc) */}
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
                                        {/* Form fields cho từng thuốc */}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    required
                                                    label="Tên thuốc"
                                                    value={medicine.medicineName}
                                                    onChange={(e) => handleMedicineFormChange(index, 'medicineName', e.target.value)}
                                                    fullWidth
                                                    size="small"
                                                    autoFocus={index === 0}
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
                                            <Grid item xs={12} sm={6} >
                                                <FormControl fullWidth size="small" w>
                                                    <InputLabel>Loại</InputLabel>
                                                    <Select
                                                        value={medicine.type}
                                                        label="Loại"
                                                        onChange={(e) => handleMedicineFormChange(index, 'type', e.target.value)}
                                                    >
                                                        {medicineTypeOptions.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    label="Số lượng"
                                                    type="number"
                                                    value={medicine.quantity}
                                                    onChange={(e) => handleMedicineFormChange(index, 'quantity', Number(e.target.value))}
                                                    fullWidth
                                                    size="small"
                                                    inputProps={{ min: 1 }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} width={'200px'}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Thời gian uống</InputLabel>
                                                    <Select
                                                        value={medicine.time}
                                                        label="Thời gian uống"
                                                        onChange={(e) => handleMedicineFormChange(index, 'time', e.target.value)}
                                                    >
                                                        {medicineTimeOptions.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
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
                        </Box>

                        {/* ===== NỬA PHẢI: HÌNH ẢNH ĐƠN THUỐC ===== */}
                        {/* Chỉ hiển thị khi có ảnh */}
                        {medicalOrder?.imageURL && (
                            <Box sx={{
                                width: '50%',
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'auto',
                                backgroundColor: '#f8f9fa',
                            }}>
                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    📷 Hình ảnh đơn thuốc
                                </Typography>
                                <Typography variant="caption" sx={{ mb: 2, color: 'text.secondary' }}>
                                    Nhấn vào ảnh để zoom phóng to
                                </Typography>
                                {/* Ảnh có thể click để zoom */}
                                <img
                                    src={medicalOrder.imageURL}
                                    alt="Đơn thuốc"
                                    onClick={() => setImageZoomOpen(true)}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '75vh',
                                        objectFit: 'contain',
                                        borderRadius: 8,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        cursor: 'pointer',
                                        border: '2px solid #e0e0e0',
                                        transition: 'transform 0.2s ease-in-out',
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    ...MODAL_THEME.footer,
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2
                }}>
                    <Button onClick={handleCloseAddNewModal} disabled={isUpdating}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmitNewMedicines}
                        variant="contained"
                        disabled={isUpdating || newMedicines.every(med => !med.medicineName.trim() || !med.dosage.trim() || Number(med.quantity) <= 0)}
                        sx={{ minWidth: 140 }}
                    >
                        {isUpdating ? <CircularProgress size={20} /> : `Thêm ${newMedicines.length} thuốc`}
                    </Button>
                </DialogActions>
            </Dialog>





            {/* ===== MODAL TỪ CHỐI ĐƠN ===== */}
            {/* Modal để nhập lý do từ chối đơn thuốc */}
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

            {/* ===== LIGHTBOX ZOOM ẢNH ===== */}
            {/* Component zoom ảnh sử dụng thư viện yet-another-react-lightbox */}
            <Lightbox
                open={isImageZoomOpen}
                close={() => setImageZoomOpen(false)}
                slides={medicalOrder.imageURL ? [{ src: medicalOrder.imageURL }] : []}
                plugins={[Zoom]} // Plugin zoom để phóng to/thu nhỏ ảnh
                styles={{
                    container: { zIndex: 1500 }, // Z-index cao để hiển thị trên tất cả
                }}
            />
        </Container>
    );
};

// ===== EXPORT COMPONENT =====
export default MedicalOrderDetailPage;
