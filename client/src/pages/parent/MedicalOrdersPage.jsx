import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Chip,
    Fab,
    Pagination,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    LocalHospital as HospitalIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Warning as WarningIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';
import ParentLayout from '../../components/layouts/ParentLayout';
import { extractArrayFromResponse, extractPaginationFromResponse } from '../../utils/apiResponseHelper';

const MedicalOrdersPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Query state
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        keyword: searchParams.get('keyword') || '',
        status: searchParams.get('status') || '',
        childId: searchParams.get('childId') || ''
    });

    // Data state
    const [orders, setOrders] = useState([]);
    const [children, setChildren] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false); useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadOrders();
    }, [query.page, query.limit, query.keyword, query.status, query.childId]);

    // Sync searchInput with URL params on component mount
    useEffect(() => {
        const keyword = searchParams.get('keyword') || '';
        setSearchInput(keyword);
        setQuery(prev => ({
            ...prev,
            keyword: keyword,
            status: searchParams.get('status') || '',
            childId: searchParams.get('childId') || ''
        }));
    }, [searchParams]); const loadInitialData = async () => {
        try {
            // Load children list for filter
            const childrenResponse = await childApi.getAllChildren();
            console.log('📦 Children response:', childrenResponse);

            // Handle different response structures for children
            let childrenData = [];
            if (childrenResponse && childrenResponse.data && childrenResponse.data.records) {
                childrenData = childrenResponse.data.records;
            }

            setChildren(childrenData);
            console.log('👶 Children data:', childrenData);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setChildren([]);
        }
    }; const loadOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: query.page,
                limit: query.limit,
                keyword: query.keyword || "",
                status: query.status || "",
                childId: query.childId || "",
            };

            console.log('🔍 Loading orders with params:', params);
            const response = await medicalOrderApi.getMedicalOrder(params);
            console.log('📦 Orders response:', response);

            // Handle different response structures
            let ordersData = [];
            let paginationData = {
                total: 0,
                page: query.page,
                limit: query.limit,
                totalPages: 0
            };

            if (response && response.data) {
                // Try different possible response structures
                if (response.data.records) {
                    ordersData = response.data.records || [];
                    paginationData = {
                        total: response.data.total || ordersData.length,
                        page: response.data.page || query.page,
                        limit: response.data.limit || query.limit,
                        totalPages: response.data.totalPages || Math.ceil((response.data.total || ordersData.length) / query.limit)
                    };
                } else if (Array.isArray(response.data)) {
                    ordersData = response.data;
                    paginationData = {
                        total: ordersData.length,
                        page: query.page,
                        limit: query.limit,
                        totalPages: Math.ceil(ordersData.length / query.limit)
                    };
                } else {
                    ordersData = response.data.orders || response.data.data || [];
                    paginationData = {
                        total: response.data.total || ordersData.length,
                        page: response.data.page || query.page,
                        limit: response.data.limit || query.limit,
                        totalPages: response.data.totalPages || Math.ceil((response.data.total || ordersData.length) / query.limit)
                    };
                }
            }
            setOrders(ordersData);
            setPaginationInfo(paginationData);

        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Lỗi khi tải danh sách đơn thuốc');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }; const handleSearch = () => {
        const trimmedSearch = searchInput.trim();

        setQuery(prev => ({
            ...prev,
            keyword: trimmedSearch,
            page: 1
        }));        // Update URL params
        const newParams = new URLSearchParams();
        if (trimmedSearch) {
            newParams.set('keyword', trimmedSearch);
        }
        if (query.status) {
            newParams.set('status', query.status);
        }
        if (query.childId) {
            newParams.set('childId', query.childId);
        }

        setSearchParams(newParams);

        console.log('🔍 Search triggered with params:', {
            keyword: trimmedSearch,
            status: query.status,
            childId: query.childId
        });
    }; const handleClearSearch = () => {
        setSearchInput('');

        const updatedQuery = {
            ...query,
            keyword: '',
            page: 1
        };

        setQuery(updatedQuery);

        // Update URL params
        const newParams = new URLSearchParams();
        if (updatedQuery.status) {
            newParams.set('status', updatedQuery.status);
        }
        if (updatedQuery.childId) {
            newParams.set('childId', updatedQuery.childId);
        }

        setSearchParams(newParams);

        console.log('🧹 Search cleared');
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    }; const handleStatusChange = (event) => {
        const newStatus = event.target.value;

        const updatedQuery = {
            ...query,
            status: newStatus,
            page: 1
        };

        setQuery(updatedQuery);

        // Update URL params
        const newParams = new URLSearchParams();
        if (updatedQuery.keyword) {
            newParams.set('keyword', updatedQuery.keyword);
        }
        if (newStatus) {
            newParams.set('status', newStatus);
        }
        if (updatedQuery.childId) {
            newParams.set('childId', updatedQuery.childId);
        }

        setSearchParams(newParams);

        console.log('🔄 Status filter changed:', newStatus);
    };

    const handleChildChange = (event) => {
        const newChildId = event.target.value;

        const updatedQuery = {
            ...query,
            childId: newChildId,
            page: 1
        };

        setQuery(updatedQuery);

        // Update URL params
        const newParams = new URLSearchParams();
        if (updatedQuery.keyword) {
            newParams.set('keyword', updatedQuery.keyword);
        }
        if (updatedQuery.status) {
            newParams.set('status', updatedQuery.status);
        }
        if (newChildId) {
            newParams.set('childId', newChildId);
        }

        setSearchParams(newParams);

        console.log('🔄 Child filter changed:', newChildId);
    };

    const handleRefresh = () => {
        loadOrders();
        toast.success('Đã làm mới danh sách');

        const updatedQuery = {
            ...query,
            page: 1,
            keyword: '',
            status: '',
            childId: ''
        };
        setQuery(updatedQuery);
        const newParams = new URLSearchParams();
        setSearchParams(newParams);
    };

    const handleViewOrder = (order) => {
        navigate(`/parent/medical-orders/${order._id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Đang xử lý';
            case 'approved': return 'Đã duyệt';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <ScheduleIcon />;
            case 'approved': return <WarningIcon />;
            case 'completed': return <CheckCircleIcon />;
            case 'cancelled': return <CancelIcon />;
            default: return <HospitalIcon />;
        }
    };

    const getChildName = (childId) => {
        const child = children.find(c => c._id === childId);
        return child ? child.name : 'N/A';
    };

    return (
        <>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Quản lý đơn thuốc
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Theo dõi và quản lý các đơn thuốc của con em
                        </Typography>
                    </Box>
                </Box>

                {/* Orders Table */}
                <Card>
                    <CardContent>
                        {/* Table Header */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                                Danh sách đơn thuốc
                            </Typography>
                            {/* Filters */}
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        placeholder="Tìm kiếm theo mã đơn, ghi chú..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyPress={handleSearchKeyPress}
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchInput && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleClearSearch}
                                                        sx={{ color: 'text.secondary' }}
                                                    >
                                                        <ClearIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Select
                                            value={query.status}
                                            label="Trạng thái"
                                            onChange={handleStatusChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                                '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                                                '& .MuiSelect-select': { minWidth: '100px' }
                                            }}
                                        >
                                            <MenuItem value="">Tất cả</MenuItem>
                                            <MenuItem value="pending">Đang xử lý</MenuItem>
                                            <MenuItem value="approved">Đã duyệt</MenuItem>
                                            <MenuItem value="completed">Hoàn thành</MenuItem>
                                            <MenuItem value="cancelled">Đã hủy</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Con em</InputLabel>
                                        <Select
                                            value={query.childId}
                                            label="Con em"
                                            onChange={handleChildChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                                '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                                                '& .MuiSelect-select': { minWidth: '100px' }
                                            }}
                                        >
                                            <MenuItem value="">Tất cả</MenuItem>
                                            {children.map((child) => (
                                                <MenuItem key={child._id} value={child._id}>
                                                    {child.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSearch}
                                            startIcon={<SearchIcon />}
                                            sx={{ minWidth: 100 }}
                                        >
                                            Tìm kiếm
                                        </Button>
                                        <Tooltip title="Làm mới danh sách">
                                            <IconButton
                                                onClick={handleRefresh}
                                                color="primary"
                                                sx={{
                                                    border: '1px solid',
                                                    borderColor: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'primary.light'
                                                    }
                                                }}
                                            >
                                                <RefreshIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Loading State */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Empty State */}
                        {!loading && orders.length === 0 && (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                {query.keyword || query.status || query.childId ?
                                    'Không tìm thấy đơn thuốc nào phù hợp với bộ lọc' :
                                    'Chưa có đơn thuốc nào. Hãy tạo đơn thuốc đầu tiên!'
                                }
                            </Alert>
                        )}

                        {/* Table */}
                        {!loading && orders.length > 0 && (
                            <>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Mã đơn</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Con em</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Ngày kết thúc</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Ghi chú</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRow
                                                    key={order._id}
                                                    hover
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: getStatusColor(order.status) + '.main', mr: 2, width: 32, height: 32 }}>
                                                                {getStatusIcon(order.status)}
                                                            </Avatar>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                #{order._id?.slice(-6)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {typeof order.ChildId === 'object' && order.ChildId?.name
                                                            ? order.ChildId.name
                                                            : getChildName(order.ChildId)
                                                        }
                                                    </TableCell>
                                                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                                                    <TableCell>{formatDate(order.startDate)}</TableCell>
                                                    <TableCell>{formatDate(order.endDate)}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={getStatusText(order.status)}
                                                            color={getStatusColor(order.status)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
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
                                            page={query.page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Floating Action Button for mobile */}
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        display: { xs: 'flex', md: 'none' }
                    }}
                    onClick={() => navigate('/parent/medical-orders/create')}
                >
                    <AddIcon />
                </Fab>
            </Container>
        </>
    );
};

export default MedicalOrdersPage;
