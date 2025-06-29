// src/pages/nurse/MedicalOrdersPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Button, CircularProgress,
    Alert, Tooltip, Pagination, Chip, Grid, TextField, Select, MenuItem,
    FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails,
    Paper, Skeleton
} from '@mui/material';
import {
    Refresh as RefreshIcon, 
    Visibility as ViewIcon, 
    LocalHospital as MedicalIcon,
    ExpandMore as ExpandMoreIcon, 
    Search as SearchIcon, 
    Clear as ClearIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

// THAY ĐỔI MỚI 1: Import các thành phần Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Import dayjs để xử lý đối tượng ngày tháng

import medicalOrderApi from '../../api/medicalOrderApi';

// Constants
const DEFAULT_PAGINATION = { total: 0, page: 1, totalPages: 0, limit: 10 };
const DEFAULT_FILTERS = { status: '', startDate: '', endDate: '' };

const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ duyệt', color: 'warning' },
    { value: 'approved', label: 'Đã duyệt', color: 'info' },
     { value: 'canceled', label: 'Từ chối ', color: 'error' },
];

// Utility functions
const cleanObject = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => 
            value !== null && value !== undefined && value !== ''
        )
    );
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(dateString));
    } catch {
        return 'N/A';
    }
};

const formatDateToISO = (dateString, position = 'start') => {
    if (!dateString) return null;
    try {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        if (position === 'end') {
            date.setUTCHours(23, 59, 59, 999);
        }
        return date.toISOString();
    } catch {
        return null;
    }
};

const getStatusConfig = (status) => {
    const config = STATUS_OPTIONS.find(option => option.value === status);
    return config || { label: status || 'Không rõ', color: 'default' };
};

// Custom hooks
const useFilters = (searchParams) => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        const startDateFromUrl = searchParams.get('startDate');
        const endDateFromUrl = searchParams.get('endDate');

        setFilters({
            status: searchParams.get('status') || '',
            startDate: startDateFromUrl ? startDateFromUrl.substring(0, 10) : '',
            endDate: endDateFromUrl ? endDateFromUrl.substring(0, 10) : '',
        });
    }, [searchParams]);

    const handleFilterChange = useCallback((event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    return { filters, handleFilterChange, resetFilters };
};

const useMedicalOrders = (searchParams) => {
    const [medicalOrders, setMedicalOrders] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState(DEFAULT_PAGINATION);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMedicalOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const query = Object.fromEntries(searchParams.entries());
            if (!query.limit) query.limit = 10;
            
            const response = await medicalOrderApi.getMedicalOrder(query);
            console.log('API Response:', response);

            if (response?.data) {
                setMedicalOrders(response.data.records || []);
                setPaginationInfo({
                    total: response.data.total || 0,
                    page: parseInt(response.data.page || 1, 10),
                    totalPages: response.data.totalPages || 0,
                    limit: parseInt(response.data.limit || 10, 10),
                });
            } else {
                setMedicalOrders([]);
                setPaginationInfo(DEFAULT_PAGINATION);
            }
        } catch (error) {
            console.error('Error loading medical orders:', error);
            setError(error.message || 'Lỗi khi tải danh sách đơn thuốc');
            setMedicalOrders([]);
            setPaginationInfo(DEFAULT_PAGINATION);
            toast.error('Lỗi khi tải danh sách đơn thuốc');
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        loadMedicalOrders();
    }, [loadMedicalOrders]);

    return { medicalOrders, paginationInfo, loading, error, refetch: loadMedicalOrders };
};

// Components
// THAY ĐỔI MỚI 2: Cập nhật component FilterAccordion để sử dụng DatePicker
const FilterAccordion = ({ filters, onFilterChange, onSearch, onClear, loading }) => {
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => value !== '');
    }, [filters]);

    // Hàm này giúp DatePicker giao tiếp với hook `useFilters` mà không cần thay đổi hook.
    // Nó tạo ra một đối tượng `event` giả để `onFilterChange` có thể xử lý.
    const handleDateChange = (name, newValue) => {
        const fakeEvent = {
            target: {
                name: name,
                value: newValue ? newValue.format('YYYY-MM-DD') : ''
            }
        };
        onFilterChange(fakeEvent);
    };

    return (
        <Accordion defaultExpanded sx={{ mb: 3, boxShadow: 1 }}>
            <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ bgcolor: 'grey.50' }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterIcon />
                    <Typography sx={{ fontWeight: 600 }}>
                        Lọc theo
                    </Typography>
                    {hasActiveFilters && (
                        <Chip 
                            label="Đang lọc" 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                        />
                    )}
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                {/* Bọc các DatePicker trong LocalizationProvider */}
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                            <FormControl fullWidth size="small" disabled={loading}>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    label="Trạng thái"
                                    name="status"
                                    value={filters.status}
                                    onChange={onFilterChange}
                                >
                                    {STATUS_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <DatePicker
                                label="Từ ngày"
                                value={filters.startDate ? dayjs(filters.startDate) : null}
                                onChange={(newValue) => handleDateChange('startDate', newValue)}
                                disabled={loading}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={3}>
                            <DatePicker
                                label="Đến ngày"
                                value={filters.endDate ? dayjs(filters.endDate) : null}
                                onChange={(newValue) => handleDateChange('endDate', newValue)}
                                disabled={loading}
                                // Đảm bảo ngày kết thúc không thể trước ngày bắt đầu
                                minDate={filters.startDate ? dayjs(filters.startDate) : null}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={3}>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end'}, gap: 2, width: '100%' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={onClear}
                                    disabled={loading || !hasActiveFilters}
                                >
                                    Xóa lọc
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    onClick={onSearch}
                                    disabled={loading}
                                >
                                    Tìm kiếm
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </AccordionDetails>
        </Accordion>
    );
};

const StatusChip = ({ status }) => {
    const config = getStatusConfig(status);
    return (
        <Chip 
            label={config.label} 
            color={config.color} 
            size="small" 
            variant="outlined"
        />
    );
};

const MedicalOrdersTable = ({ orders, paginationInfo, onViewDetails, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    {[...Array(5)].map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Skeleton variant="text" width="5%" />
                            <Skeleton variant="text" width="20%" />
                            <Skeleton variant="text" width="15%" />
                            <Skeleton variant="text" width="15%" />
                            <Skeleton variant="text" width="15%" />
                            <Skeleton variant="text" width="20%" />
                            <Skeleton variant="text" width="10%" />
                        </Box>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (orders.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <MedicalIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Không tìm thấy đơn thuốc nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Thử điều chỉnh bộ lọc để tìm kiếm
                </Typography>
            </Paper>
        );
    }

    return (
        <Card elevation={2}>
            <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                    p: 3, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <MedicalIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Danh sách đơn thuốc ({paginationInfo.total} đơn)
                    </Typography>
                </Box>
                
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 700, width: '8%' }}>
                                    STT
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, width: '25%' }}>
                                    Tên Học sinh
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, width: '15%' }}>
                                    Ngày Bắt đầu
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, width: '15%' }}>
                                    Ngày Kết thúc
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, width: '12%' }}>
                                    Trạng thái
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, width: '15%' }}>
                                    Ghi chú
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700, width: '10%' }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow 
                                    key={order._id} 
                                    hover 
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight={600}>
                                            {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {order.ChildId?.name || 'Không rõ'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">
                                            {formatDateForDisplay(order.startDate)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2">
                                            {formatDateForDisplay(order.endDate)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <StatusChip status={order.status} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                maxWidth: 150,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                            title={order.note}
                                        >
                                            {order.note || 'Không có ghi chú'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => onViewDetails(order._id)}
                                                size="small"
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
            </CardContent>
        </Card>
    );
};

// Main component
const MedicalOrdersPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const { filters, handleFilterChange, resetFilters } = useFilters(searchParams);
    const { medicalOrders, paginationInfo, loading, error, refetch } = useMedicalOrders(searchParams);

    const handleSearch = useCallback(() => {
        const { startDate, endDate } = filters;
        
        const newParams = cleanObject({
            status: filters.status,
            startDate: formatDateToISO(startDate, 'start'),
            endDate: formatDateToISO(endDate, 'end'),
            page: 1,
            limit: paginationInfo.limit,
        });

        setSearchParams(newParams);
        toast.info('Đang tìm kiếm...');
    }, [filters, paginationInfo.limit, setSearchParams]);

    const handleClearFilters = useCallback(() => {
        resetFilters();
        setSearchParams({ page: '1', limit: String(paginationInfo.limit) });
        toast.success('Đã xóa bộ lọc');
    }, [resetFilters, paginationInfo.limit, setSearchParams]);

    const handlePageChange = useCallback((event, newPage) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        setSearchParams({ ...currentParams, page: String(newPage) });
    }, [searchParams, setSearchParams]);

    const handleRefresh = useCallback(() => {
        refetch();
        toast.success('Đã làm mới dữ liệu');
    }, [refetch]);

    const handleViewDetails = useCallback((orderId) => {
        navigate(`/nurse/medical-orders/${orderId}`);
    }, [navigate]);

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Alert 
                    severity="error" 
                    action={
                        <Button color="inherit" size="small" onClick={handleRefresh}>
                            Thử lại
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <MedicalIcon sx={{ color: 'primary.main', fontSize: 40 }} />
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                Quản lý Đơn thuốc
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Quản lý và theo dõi các đơn thuốc của học sinh
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Tooltip title="Làm mới dữ liệu">
                        <IconButton 
                            onClick={handleRefresh} 
                            color="primary" 
                            disabled={loading}
                            sx={{ bgcolor: 'action.hover' }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Paper>

            {/* Filters */}
            <FilterAccordion
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onClear={handleClearFilters}
                loading={loading}
            />

            {/* Table */}
            <MedicalOrdersTable
                orders={medicalOrders}
                paginationInfo={paginationInfo}
                onViewDetails={handleViewDetails}
                loading={loading}
            />

            {/* Pagination */}
            {!loading && paginationInfo.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
                    <Pagination 
                        count={paginationInfo.totalPages} 
                        page={paginationInfo.page} 
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Container>
    );
};

export default MedicalOrdersPage;