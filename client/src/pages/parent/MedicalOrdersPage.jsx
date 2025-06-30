import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Pagination,
    Grid,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    LocalHospital as HospitalIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Refresh as RefreshIcon,
    Medication as MedicationIcon
} from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';
import {
    getMedicalOrderStatusColor,
    getMedicalOrderStatusLabel
} from '../../utils/colorUtils';

const MedicalOrdersPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State management
    const [orders, setOrders] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [medicationHistoryDialogOpen, setMedicationHistoryDialogOpen] = useState(false);
    const [medicationHistory, setMedicationHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter state (separate from applied search)
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
        childId: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10
    });

    // Applied search state (used for actual API calls)
    const [appliedSearch, setAppliedSearch] = useState({
        keyword: searchParams.get('keyword') || '',
        status: searchParams.get('status') || '',
        childId: searchParams.get('childId') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        page: parseInt(searchParams.get('page')) || 1,
        limit: 10
    });

    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    // Load initial data
    useEffect(() => {
        loadChildren();
    }, []);

    // Initialize filters from URL params on first load
    useEffect(() => {
        if (appliedSearch.keyword || appliedSearch.status || appliedSearch.childId || appliedSearch.startDate || appliedSearch.endDate) {
            // Copy appliedSearch to filters to show in form
            setFilters({
                keyword: appliedSearch.keyword,
                status: appliedSearch.status,
                childId: appliedSearch.childId,
                startDate: appliedSearch.startDate,
                endDate: appliedSearch.endDate,
                page: appliedSearch.page,
                limit: appliedSearch.limit
            });
        }
    }, []); // Only run once on mount

    // Load orders when appliedSearch changes or children loaded
    useEffect(() => {
        if (children.length > 0) {
            loadOrders();
        }
    }, [appliedSearch, children]);

    // Sync URL params with appliedSearch
    useEffect(() => {
        const newParams = new URLSearchParams();
        if (appliedSearch.keyword) newParams.set('keyword', appliedSearch.keyword);
        if (appliedSearch.status) newParams.set('status', appliedSearch.status);
        if (appliedSearch.childId) newParams.set('childId', appliedSearch.childId);
        if (appliedSearch.startDate) newParams.set('startDate', appliedSearch.startDate);
        if (appliedSearch.endDate) newParams.set('endDate', appliedSearch.endDate);
        if (appliedSearch.page > 1) newParams.set('page', appliedSearch.page.toString());

        setSearchParams(newParams);
    }, [appliedSearch, setSearchParams]);

    const loadChildren = async () => {
        try {
            const response = await childApi.getAllChildren();
            if (response && response.data && response.data.records) {
                setChildren(response.data.records);
            }
        } catch (error) {
            console.error('Error loading children:', error);
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 403) {
                setError('Bạn không có quyền truy cập trang này.');
            } else {
                setError('Không thể tải danh sách con em.');
            }
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query params for API
            const queryParams = {
                page: appliedSearch.page,
                limit: appliedSearch.limit
            };

            // Add child filter
            if (appliedSearch.childId) {
                queryParams.childId = appliedSearch.childId;
            }

            // Add other filters
            if (appliedSearch.status) {
                queryParams.status = appliedSearch.status;
            }
            if (appliedSearch.startDate) {
                queryParams.startDate = appliedSearch.startDate;
            }
            if (appliedSearch.endDate) {
                queryParams.endDate = appliedSearch.endDate;
            }
            console.log('Query Params:', queryParams);

            const response = await medicalOrderApi.getMedicalOrder(queryParams);


            if (response?.isSuccess) {
                let ordersData = response.data?.records || [];

                // Apply client-side keyword filter if needed
                if (appliedSearch.keyword) {
                    ordersData = ordersData.filter(order =>
                        order.note?.toLowerCase().includes(appliedSearch.keyword.toLowerCase()) ||
                        order._id?.toLowerCase().includes(appliedSearch.keyword.toLowerCase())
                    );
                }

                // Add child info to each order from populated ChildId
                ordersData = ordersData.map(order => ({
                    ...order,
                    childInfo: order.ChildId // API đã populate ChildId với thông tin con
                }));

                setOrders(ordersData);
                setPaginationInfo({
                    total: response.data?.total || 0,
                    page: response.data?.page || appliedSearch.page,
                    limit: response.data?.limit || appliedSearch.limit,
                    totalPages: response.data?.totalPages || 1
                });
            }
        } catch (error) {
            console.error('Error loading medical orders:', error);
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 403) {
                setError('Bạn không có quyền truy cập dữ liệu này.');
            } else {
                setError('Không thể tải danh sách đơn gửi thuốc.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePageChange = (event, page) => {
        setAppliedSearch(prev => ({ ...prev, page }));
    };

    const handleSearch = () => {
        // Apply current filters to search and reset page
        setAppliedSearch({
            ...filters,
            page: 1
        });
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            keyword: '',
            status: '',
            childId: '',
            startDate: '',
            endDate: '',
            page: 1,
            limit: 10
        };
        setFilters(clearedFilters);
        setAppliedSearch(clearedFilters);
    };

    const handleViewMedicationHistory = async (orderId) => {
        try {
            setHistoryLoading(true);
            setMedicationHistory([]); // Clear previous data
            setMedicationHistoryDialogOpen(true);

            console.log('Loading medication history for order:', orderId);
            const response = await medicalOrderApi.getRecord(orderId);

            console.log('Medication history response:', response);

            if (response?.isSuccess && response.data) {
                // Handle different response structures
                let historyData = [];

                if (response.data.records && Array.isArray(response.data.records)) {
                    historyData = response.data.records;
                } else if (Array.isArray(response.data)) {
                    historyData = response.data;
                } else if (response.data.items && Array.isArray(response.data.items)) {
                    historyData = [response.data]; // Wrap single record with items
                } else {
                    historyData = [response.data]; // Single record
                }

                setMedicationHistory(historyData);

                if (historyData.length === 0) {
                    toast.info('Chưa có lịch sử uống thuốc cho đơn này');
                }
            } else {
                setMedicationHistory([]);
                toast.info('Chưa có lịch sử uống thuốc cho đơn này');
            }
        } catch (error) {
            console.error('Error loading medication history:', error);
            setMedicationHistory([]);
            toast.error('Có lỗi xảy ra khi tải lịch sử uống thuốc');
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCloseMedicationHistoryDialog = () => {
        setMedicationHistoryDialogOpen(false);
        setMedicationHistory([]);
    };

    const handleViewOrder = (order) => {
        navigate(`/parent/medical-orders/${order._id}`, {
            state: {
                orderData: order,
                childData: order.childInfo || order.ChildId
            }
        });
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

    const getStatusChip = (status) => {
        return <Chip
            label={getMedicalOrderStatusLabel(status)}
            color={getMedicalOrderStatusColor(status)}
            size="small"
        />;
    };

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => window.location.reload()}>
                    Thử lại
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        Đơn gửi thuốc
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Theo dõi các đơn gửi thuốc của con em
                    </Typography>
                </Box>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                        Bộ lọc tìm kiếm
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm..."
                                value={filters.keyword}
                                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Trạng thái"
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                        '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                                        '& .MuiSelect-select': { minWidth: '100px' }
                                    }}
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="pending">Chờ xử lý</MenuItem>
                                    <MenuItem value="approved">Đã duyệt</MenuItem>
                                    <MenuItem value="canceled">Đã hủy</MenuItem>
                                    <MenuItem value="completed">Hoàn thành</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Từ ngày"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Đến ngày"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSearch}
                                    startIcon={<SearchIcon />}
                                    sx={{ minWidth: 100 }}
                                >
                                    Tìm kiếm
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleClearFilters}
                                    startIcon={<ClearIcon />}
                                >
                                    Xóa lọc
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                        Danh sách đơn gửi thuốc ({paginationInfo.total})
                    </Typography>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : orders.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <MedicationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                {appliedSearch.keyword || appliedSearch.status || appliedSearch.childId || appliedSearch.startDate || appliedSearch.endDate
                                    ? 'Không tìm thấy đơn gửi thuốc nào phù hợp'
                                    : 'Chưa có đơn gửi thuốc nào'
                                }
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Con em</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày bắt đầu</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày kết thúc</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order, index) => (
                                            <TableRow key={order._id} hover>
                                                <TableCell>{(appliedSearch.page - 1) * appliedSearch.limit + index + 1}</TableCell>
                                                <TableCell>{formatDate(order.createdAt)}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {order.childInfo?.name || order.ChildId?.name || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{getStatusChip(order.status)}</TableCell>
                                                <TableCell>{formatDate(order.startDate)}</TableCell>
                                                <TableCell>{formatDate(order.endDate)}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {order.note || 'Không có ghi chú'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleViewOrder(order)}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Lịch sử uống thuốc">
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            onClick={() => handleViewMedicationHistory(order._id)}
                                                        >
                                                            <HistoryIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            {paginationInfo.totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={paginationInfo.totalPages}
                                        page={appliedSearch.page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        showFirstButton
                                        showLastButton
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
            {/* Medication History Dialog */}
            <Dialog
                open={medicationHistoryDialogOpen}
                onClose={handleCloseMedicationHistoryDialog}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { minHeight: '400px' }
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="h6">Lịch sử uống thuốc</Typography>
                        </Box>
                        <IconButton
                            onClick={handleCloseMedicationHistoryDialog}
                            size="small"
                        >
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {historyLoading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                            <CircularProgress sx={{ mb: 2 }} />
                            <Typography color="text.secondary">
                                Đang tải lịch sử uống thuốc...
                            </Typography>
                        </Box>
                    ) : medicationHistory.length > 0 ? (
                        <Box>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Hiển thị {medicationHistory.reduce((total, record) => {
                                    if (record.items && Array.isArray(record.items)) {
                                        return total + record.items.length;
                                    }
                                    return total + 1;
                                }, 0)} lần cho uống thuốc
                            </Alert>
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Tên thuốc</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Y tá</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {medicationHistory.map((record, index) => {
                                            // Handle different data structures
                                            if (record.items && Array.isArray(record.items)) {
                                                // If record has items array
                                                return record.items.map((item, itemIndex) => (
                                                    <TableRow key={`${record._id || index}-${item._id || itemIndex}`} hover>
                                                        <TableCell>{index + 1}.{itemIndex + 1}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {item.name || item.medicineName || 'Không rõ tên thuốc'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={`${item.quantity || item.usedQuantity || 0} viên`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(record.createdAt || record.usedAt || item.createdAt)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {record.userId?.name || record.nurseId?.name || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {record.note || item.note || 'Không có ghi chú'}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ));
                                            } else {
                                                // If record is a direct medication record
                                                return (
                                                    <TableRow key={record._id || index} hover>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {record.medicineName || record.name || 'Không rõ tên thuốc'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={`${record.usedQuantity || record.quantity || 0} viên`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(record.usedAt || record.createdAt)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {record.nurseId?.name || record.userId?.name || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {record.note || 'Không có ghi chú'}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <MedicationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Chưa có lịch sử uống thuốc
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Đơn gửi thuốc này chưa có lịch sử cho uống thuốc nào
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleCloseMedicationHistoryDialog}
                        variant="outlined"
                        startIcon={<ClearIcon />}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MedicalOrdersPage;
