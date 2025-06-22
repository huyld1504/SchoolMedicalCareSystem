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
    Warning as WarningIcon
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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        completed: 0,
        cancelled: 0
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        loadOrders();
    }, [query.page, query.limit, query.keyword, query.status, query.childId]); const loadInitialData = async () => {
        try {
            // Load children list for filter
            const childrenResponse = await childApi.getAllChildren();
            const childrenData = extractArrayFromResponse(childrenResponse, 'children');
            setChildren(childrenData);
            console.log('Children data:', childrenData);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setChildren([]);
        }
    };

    const loadOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: query.page,
                limit: query.limit,
                keyword: query.keyword || undefined,
                status: query.status || undefined,
                childId: query.childId || undefined,
            };

            const response = await medicalOrderApi.getMyOrders(params);
            console.log('Orders response:', response);

            // Extract data using helper functions
            const ordersData = extractArrayFromResponse(response.data.records, 'orders');
            const paginationData = extractPaginationFromResponse(response.data.records, {
                page: query.page,
                limit: query.limit
            });

            setOrders(ordersData);
            setPaginationInfo(paginationData);

            // Calculate stats
            const stats = ordersData.reduce((acc, order) => {
                acc.total += 1;
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, { total: 0, pending: 0, approved: 0, completed: 0, cancelled: 0 });
            setStats(stats);

        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Lỗi khi tải danh sách đơn thuốc');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setQuery(prev => ({
            ...prev,
            keyword: searchInput,
            page: 1
        }));

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if (searchInput) {
            newParams.set('keyword', searchInput);
        } else {
            newParams.delete('keyword');
        }
        setSearchParams(newParams);
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
    };

    const handleStatusChange = (event) => {
        setQuery(prev => ({
            ...prev,
            status: event.target.value,
            page: 1
        }));
    };

    const handleChildChange = (event) => {
        setQuery(prev => ({
            ...prev,
            childId: event.target.value,
            page: 1
        }));
    };

    const handleRefresh = () => {
        loadOrders();
        toast.success('Đã làm mới danh sách');
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

    const StatCard = ({ title, value, icon, color, status }) => (
        <Card
            sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
                transition: 'all 0.3s ease'
            }}
            onClick={() => setQuery(prev => ({ ...prev, status, page: 1 }))}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="h6">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

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

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/parent/medical-orders/create')}
                        sx={{ height: 'fit-content' }}
                    >
                        Tạo đơn thuốc
                    </Button>
                </Box>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Tổng đơn"
                            value={stats.total}
                            icon={<HospitalIcon />}
                            color="#1976d2"
                            status=""
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Chờ xử lý"
                            value={stats.pending}
                            icon={<ScheduleIcon />}
                            color="#ed6c02"
                            status="pending"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Đã duyệt"
                            value={stats.approved}
                            icon={<WarningIcon />}
                            color="#2196f3"
                            status="approved"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Hoàn thành"
                            value={stats.completed}
                            icon={<CheckCircleIcon />}
                            color="#2e7d32"
                            status="completed"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StatCard
                            title="Đã hủy"
                            value={stats.cancelled}
                            icon={<CancelIcon />}
                            color="#d32f2f"
                            status="cancelled"
                        />
                    </Grid>
                </Grid>

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
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        placeholder="Tìm kiếm đơn thuốc..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        onKeyPress={handleSearchKeyPress}
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Select
                                            value={query.status}
                                            label="Trạng thái"
                                            onChange={handleStatusChange}
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
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleSearch}
                                            startIcon={<SearchIcon />}
                                        >
                                            Tìm kiếm
                                        </Button>
                                        <Tooltip title="Làm mới">
                                            <IconButton onClick={handleRefresh} color="primary">
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
                                                    <TableCell>{order.ChildId.name}</TableCell>
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
