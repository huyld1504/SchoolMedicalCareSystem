import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    CircularProgress,
    Alert,
    Tooltip,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Chip,
    TextField,
    InputAdornment,
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
    ArrowBack as BackIcon,
    MedicalServices as MedicalIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import studentsApi from '../../api/studentsApi';
import medicalEventAPI from '../../api/medicalEventApi';

const MedicalEventsPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State cho query gọi API
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        keyword: searchParams.get('keyword') || '',
        eventType: searchParams.get('eventType') || '',
        level: searchParams.get('level') || '',
        dateFrom: searchParams.get('dateFrom') || '',
        dateTo: searchParams.get('dateTo') || '',
        status: searchParams.get('status') || ''
    });    // State để quản lý date picker
    const [dateFromValue, setDateFromValue] = useState(() => {
        const dateFrom = searchParams.get('dateFrom');
        return dateFrom ? new Date(dateFrom) : null;
    });
    const [dateToValue, setDateToValue] = useState(() => {
        const dateTo = searchParams.get('dateTo');
        return dateTo ? new Date(dateTo) : null;
    });

    // State cho filter UI (tạm thời)
    const [filters, setFilters] = useState({
        eventType: searchParams.get('eventType') || '',
        level: searchParams.get('level') || '',
        dateFrom: searchParams.get('dateFrom') || '',
        dateTo: searchParams.get('dateTo') || '',
        status: searchParams.get('status') || ''
    });

    const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '');    // State cho data từ API
    const [medicalEvents, setMedicalEvents] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    }); const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingStudentInfo, setLoadingStudentInfo] = useState(false);// Sử dụng useEffect với dependency của query để load data khi thay đổi page/limit/search
    useEffect(() => {
        if (studentId) {
            loadMedicalEvents();
            loadStudentInfo();
        } else {
            loadAllMedicalEvents();
        }
    }, [studentId, query.page, query.limit, query.keyword, query.eventType, query.level, query.dateFrom, query.dateTo, query.status]); const loadMedicalEvents = async () => {
        try {
            setLoading(true);
            if (studentId) {
                // Chuẩn bị params cho API call
                const params = {};

                // Chỉ thêm param nếu có giá trị
                if (query.page) params.page = query.page;
                if (query.limit) params.limit = query.limit;
                if (query.keyword && query.keyword.trim()) params.keyword = query.keyword.trim();
                if (query.eventType && query.eventType.trim()) params.eventType = query.eventType.trim();
                if (query.level && query.level.trim()) params.level = query.level.trim();
                if (query.dateFrom && query.dateFrom.trim()) params.dateFrom = query.dateFrom.trim();
                if (query.dateTo && query.dateTo.trim()) params.dateTo = query.dateTo.trim();
                if (query.status && query.status.trim()) params.status = query.status.trim();

                console.log('Filter params being sent to API:', params);
                const response = await medicalEventAPI.getEventsByStudentId(studentId, params);
                console.log('Medical events response:', response);

                if (response.isSuccess && response.data) {
                    // Lấy data từ API response
                    setMedicalEvents(response.data.records || []);

                    // Cập nhật thông tin pagination từ API
                    setPaginationInfo({
                        total: response.data.total || 0,
                        page: response.data.page || 1,
                        limit: response.data.limit || 10,
                        totalPages: response.data.totalPages || 0
                    });

                    console.log('Medical events:', response.data.records);
                    console.log('Pagination info:', {
                        total: response.data.total,
                        page: response.data.page,
                        limit: response.data.limit,
                        totalPages: response.data.totalPages
                    });
                } else {
                    // Nếu không có data hoặc response không thành công
                    setMedicalEvents([]);
                    setPaginationInfo({
                        total: 0,
                        page: 1,
                        limit: 10,
                        totalPages: 0
                    });
                    console.log('No data from API or API failed');
                }
            }
        } catch (error) {
            console.error('Error loading medical events:', error);

            // Set empty data khi có lỗi API
            setMedicalEvents([]);
            setPaginationInfo({
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0
            });

            toast.error('Lỗi khi tải dữ liệu sự kiện y tế');
        } finally {
            setLoading(false);
        }
    }; const loadAllMedicalEvents = async () => {
        try {
            setLoading(true);
            // Chuẩn bị params cho API call
            const params = {};

            // Chỉ thêm param nếu có giá trị
            if (query.page) params.page = query.page;
            if (query.limit) params.limit = query.limit;
            if (query.keyword && query.keyword.trim()) params.keyword = query.keyword.trim();
            if (query.eventType && query.eventType.trim()) params.type = query.eventType.trim();
            if (query.level && query.level.trim()) params.level = query.level.trim();
            if (query.dateFrom && query.dateFrom.trim()) params.startDate = query.dateFrom.trim();
            if (query.dateTo && query.dateTo.trim()) params.endDate = query.dateTo.trim();
            if (query.status && query.status.trim()) params.status = query.status.trim();

            console.log('Filter params being sent to getAll API:', params);
            const response = await medicalEventAPI.getAll(params);
            console.log('All medical events response:', response);

            if (response.isSuccess && response.data) {
                // Lấy data từ API response
                setMedicalEvents(response.data.records || []);

                // Cập nhật thông tin pagination từ API
                setPaginationInfo({
                    total: response.data.total || 0,
                    page: response.data.page || 1,
                    limit: response.data.limit || 10,
                    totalPages: response.data.totalPages || 0
                });
            } else {
                // Nếu không có data hoặc response không thành công
                setMedicalEvents([]);
                setPaginationInfo({
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0
                });
                console.log('No data from API or API failed');
            }
        } catch (error) {
            console.error('Error loading all medical events:', error);

            // Set empty data khi có lỗi API
            setMedicalEvents([]);
            setPaginationInfo({
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0
            });

            toast.error('Lỗi khi tải dữ liệu sự kiện y tế');
        } finally {
            setLoading(false);
        }
    }; const loadStudentInfo = async () => {
        try {
            if (studentId) {
                setLoadingStudentInfo(true);
                const response = await studentsApi.getStudentById(studentId);
                if (response.isSuccess && response.data) {
                    setStudentInfo(response.data);
                } else {
                    console.error('Failed to load student info:', response);
                }
            }
        } catch (error) {
            console.error('Error loading student info:', error);
        } finally {
            setLoadingStudentInfo(false);
        }
    };

    // Sửa handlePageChange để cập nhật query state
    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Sửa handleRowsPerPageChange để cập nhật query state
    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        setQuery(prev => ({
            ...prev,
            limit: newLimit,
            page: 1 // Reset về page 1 khi thay đổi limit
        }));
    };    // Xử lý tìm kiếm
    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleApplyFilters();
        }
    };// Handler để áp dụng tất cả filter (chỉ gọi API khi nhấn nút này)
    const handleApplyFilters = () => {
        setQuery(prev => ({
            ...prev,
            keyword: searchInput, // Sử dụng searchInput thay vì filters.keyword
            eventType: filters.eventType,
            level: filters.level,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            status: filters.status,
            page: 1 // Reset về page 1 khi filter
        }));

        // Update URL params
        const newSearchParams = new URLSearchParams();
        if (searchInput.trim()) newSearchParams.set('keyword', searchInput.trim());
        if (filters.eventType) newSearchParams.set('eventType', filters.eventType);
        if (filters.level) newSearchParams.set('level', filters.level);
        if (filters.dateFrom) newSearchParams.set('dateFrom', filters.dateFrom);
        if (filters.dateTo) newSearchParams.set('dateTo', filters.dateTo);
        if (filters.status) newSearchParams.set('status', filters.status);
        setSearchParams(newSearchParams);
    };

    // Xử lý filter - chỉ cập nhật state filters, không gọi API
    const handleEventTypeChange = (event) => {
        const value = event.target.value;
        setFilters(prev => ({
            ...prev,
            eventType: value
        }));
    };

    const handleLevelChange = (event) => {
        const value = event.target.value;
        setFilters(prev => ({
            ...prev,
            level: value
        }));
    };    // Xử lý thay đổi date picker
    const handleDateFromChange = (newValue) => {
        setDateFromValue(newValue);
        // Format date để gửi cho API (YYYY-MM-DD)
        const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
        setFilters(prev => ({
            ...prev,
            dateFrom: dateString
        }));
    };

    const handleDateToChange = (newValue) => {
        setDateToValue(newValue);
        // Format date để gửi cho API (YYYY-MM-DD)
        const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
        setFilters(prev => ({
            ...prev,
            dateTo: dateString
        }));
    };

    const handleStatusChange = (event) => {
        const value = event.target.value;
        setFilters(prev => ({
            ...prev,
            status: value
        }));
    }; const handleClearFilters = () => {
        setSearchInput('');
        setDateFromValue(null);
        setDateToValue(null);
        setFilters({
            eventType: '',
            level: '',
            dateFrom: '',
            dateTo: '',
            status: ''
        });
        setQuery({
            page: 1,
            limit: 10,
            keyword: '',
            eventType: '',
            level: '',
            dateFrom: '',
            dateTo: '',
            status: ''
        });
        setSearchParams({});
    };

    const handleRefresh = () => {
        if (studentId) {
            loadMedicalEvents();
        } else {
            loadAllMedicalEvents();
        }
        toast.success('Đã làm mới dữ liệu');
    }; const handleBack = () => {
        navigate('/nurse/students');
    };

    const handleAddEvent = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}/add`);
        } else {
            navigate('/nurse/medical-events/add');
        }
    }; const handleEditEvent = (eventId) => {
        console.log('Editing event with ID:', eventId);

        // Tìm event trong danh sách hiện tại để truyền qua state
        const selectedEvent = medicalEvents.find(event => event._id === eventId);
        console.log('Selected event for editing:', selectedEvent);

        if (studentId) {
            console.log('Navigating to student-specific edit route:', `/nurse/medical-events/${studentId}/edit/${eventId}`);
            navigate(`/nurse/medical-events/${studentId}/edit/${eventId}`, {
                state: {
                    eventData: selectedEvent,
                    from: `/nurse/medical-events/${studentId}`
                }
            });
        } else {
            console.log('Navigating to general edit route:', `/nurse/medical-events/edit/${eventId}`);
            navigate(`/nurse/medical-events/edit/${eventId}`, {
                state: {
                    eventData: selectedEvent,
                    from: '/nurse/medical-events'
                }
            });
        }
    }; const handleViewEvent = (eventId) => {
        console.log('Viewing event with ID:', eventId);

        // Tìm event trong danh sách hiện tại để truyền qua state
        const selectedEvent = medicalEvents.find(event => event._id === eventId);
        console.log('Selected event:', selectedEvent);

        if (studentId) {
            console.log('Navigating to student-specific route:', `/nurse/medical-events/${studentId}/detail/${eventId}`);
            navigate(`/nurse/medical-events/${studentId}/detail/${eventId}`, {
                state: { eventData: selectedEvent }
            });
        } else {
            console.log('Navigating to general route:', `/nurse/medical-events/detail/${eventId}`);
            navigate(`/nurse/medical-events/detail/${eventId}`, {
                state: { eventData: selectedEvent }
            });
        }
    }; const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
    };

    const getTruncatedValue = (value, maxLength = 15) => {
        if (!value || value.length <= maxLength) return value;
        return value.substring(0, maxLength) + '...';
    }; const getEventTypeColor = (type) => {
        // Xử lý type tiếng Việt từ API
        if (type === 'cấp cứu') return 'error';
        if (type === 'chấn thương') return 'error';
        if (type === 'bệnh') return 'warning';
        return 'default';
    }; const getEventTypeLabel = (type) => {
        // Nếu type đã là tiếng Việt từ API, trả về trực tiếp
        if (type === 'cấp cứu' || type === 'chấn thương' || type === 'bệnh') {
            return type;
        }
        return 'Không xác định';
    }; const getLevelColor = (level) => {
        switch (level) {
            case 3:
                return '#d32f2f'; // Đỏ
            case 2:
                return '#ed6c02'; // Cam
            case 1:
                return '#2e7d32'; // Xanh lá
            default:
                return '#757575'; // Xám
        }
    }; const getLevelLabel = (level) => {
        switch (level) {
            case 3:
                return 'Khẩn cấp';
            case 2:
                return 'Trung bình';
            case 1:
                return 'Nhẹ';
            default:
                return 'Không xác định';
        }
    }; const getStatusColor = (status) => {
        switch (status) {
            case 'Đã xử lí':
                return '#2e7d32'; // Xanh lá
            case 'Đang xử lí':
                return '#ed6c02'; // Cam
            case 'Chờ xử lí':
                return '#d32f2f'; // Đỏ
            default:
                return '#757575'; // Xám
        }
    }; const getStatusLabel = (status) => {
        // Trả về status từ API hoặc giá trị mặc định
        if (status === 'Đã xử lí' || status === 'Đang xử lí' || status === 'Chờ xử lí') {
            return status;
        }
        return 'Đã xử lí'; // Giá trị mặc định
    }; return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                            <BackIcon />
                        </IconButton>
                        <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                {studentId ? 'Sự kiện y tế học sinh' : 'Quản lý sự kiện y tế'}
                            </Typography>
                            {!studentId && (
                                <Typography variant="h6" color="text.secondary">
                                    Danh sách tất cả sự kiện y tế trong hệ thống
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Tooltip title="Làm mới">
                            <IconButton onClick={handleRefresh} color="primary">
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddEvent}
                        >
                            Tạo sự kiện mới
                        </Button>
                    </Box>
                </Box>

                {/* Filters */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small" sx={{ minWidth: '140px' }}>
                                    <InputLabel>Loại sự kiện</InputLabel>
                                    <Select
                                        value={filters.eventType}
                                        label="Loại sự kiện"
                                        onChange={handleEventTypeChange}
                                        sx={{
                                            fontSize: '14px',
                                            '& .MuiSelect-select': {
                                                padding: '8px 14px',
                                                fontSize: '14px'
                                            }
                                        }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '14px' }}>Tất cả loại</MenuItem>
                                        <MenuItem value="cấp cứu" sx={{ fontSize: '14px' }}>Cấp cứu</MenuItem>
                                        <MenuItem value="chấn thương" sx={{ fontSize: '14px' }}>Chấn thương</MenuItem>
                                        <MenuItem value="bệnh" sx={{ fontSize: '14px' }}>Bệnh</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Level filter */}
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small" sx={{ minWidth: '120px' }}>
                                    <InputLabel>Mức độ</InputLabel>
                                    <Select
                                        value={filters.level}
                                        label="Mức độ"
                                        onChange={handleLevelChange}
                                        sx={{
                                            fontSize: '14px',
                                            '& .MuiSelect-select': {
                                                padding: '8px 14px',
                                                fontSize: '14px'
                                            }
                                        }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '14px' }}>Tất cả mức độ</MenuItem>
                                        <MenuItem value="3" sx={{ fontSize: '14px' }}>Khẩn cấp</MenuItem>
                                        <MenuItem value="2" sx={{ fontSize: '14px' }}>Trung bình</MenuItem>
                                        <MenuItem value="1" sx={{ fontSize: '14px' }}>Nhẹ</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>                        {/* Status filter */}
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small" sx={{ minWidth: '120px' }}>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={filters.status}
                                        label="Trạng thái"
                                        onChange={handleStatusChange}
                                        sx={{
                                            fontSize: '14px',
                                            '& .MuiSelect-select': {
                                                padding: '8px 14px',
                                                fontSize: '14px'
                                            }
                                        }}
                                    >
                                        <MenuItem value="" sx={{ fontSize: '14px' }}>Tất cả trạng thái</MenuItem>
                                        <MenuItem value="Đã xử lí" sx={{ fontSize: '14px' }}>Đã xử lí</MenuItem>
                                        <MenuItem value="Đang xử lí" sx={{ fontSize: '14px' }}>Đang xử lí</MenuItem>
                                        <MenuItem value="Chờ xử lí" sx={{ fontSize: '14px' }}>Chờ xử lí</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>                        {/* Date From */}
                            <Grid item xs={12} sm={6} md={1.5}>
                                <DatePicker
                                    label="Từ ngày"
                                    value={dateFromValue}
                                    onChange={handleDateFromChange}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            InputProps: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }
                                        },
                                        popper: {
                                            sx: {
                                                '& .MuiDayCalendar-weekDayLabel': {
                                                    '&:nth-of-type(1)': { '&::after': { content: '"T2"' } },
                                                    '&:nth-of-type(2)': { '&::after': { content: '"T3"' } },
                                                    '&:nth-of-type(3)': { '&::after': { content: '"T4"' } },
                                                    '&:nth-of-type(4)': { '&::after': { content: '"T5"' } },
                                                    '&:nth-of-type(5)': { '&::after': { content: '"T6"' } },
                                                    '&:nth-of-type(6)': { '&::after': { content: '"T7"' } },
                                                    '&:nth-of-type(7)': { '&::after': { content: '"CN"' } },
                                                    fontSize: 0,
                                                    '&::after': {
                                                        fontSize: '0.875rem'
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Date To */}
                            <Grid item xs={12} sm={6} md={1.5}>
                                <DatePicker
                                    label="Đến ngày"
                                    value={dateToValue}
                                    onChange={handleDateToChange}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            InputProps: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarIcon fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }
                                        },
                                        popper: {
                                            sx: {
                                                '& .MuiDayCalendar-weekDayLabel': {
                                                    '&:nth-of-type(1)': { '&::after': { content: '"T2"' } },
                                                    '&:nth-of-type(2)': { '&::after': { content: '"T3"' } },
                                                    '&:nth-of-type(3)': { '&::after': { content: '"T4"' } },
                                                    '&:nth-of-type(4)': { '&::after': { content: '"T5"' } },
                                                    '&:nth-of-type(5)': { '&::after': { content: '"T6"' } },
                                                    '&:nth-of-type(6)': { '&::after': { content: '"T7"' } },
                                                    '&:nth-of-type(7)': { '&::after': { content: '"CN"' } },
                                                    fontSize: 0,
                                                    '&::after': {
                                                        fontSize: '0.875rem'
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Action buttons */}
                            <Grid item xs={12} md>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleApplyFilters}
                                        color="primary"
                                        startIcon={<SearchIcon />}
                                    >
                                        Tìm kiếm
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleClearFilters}
                                        color="secondary"
                                        startIcon={<FilterIcon />}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Content */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : !medicalEvents || medicalEvents.length === 0 ? (
                    <Alert severity="info">
                        Chưa có sự kiện y tế nào theo bộ lọc hiện tại. Hãy tạo mới hoặc thay đổi bộ lọc để xem dữ liệu.
                    </Alert>
                ) : (
                    <Card>
                        <CardContent sx={{ p: 0 }}>
                            {/* Header với thông tin pagination */}
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Danh sách sự kiện y tế ({paginationInfo.total} sự kiện)
                                </Typography>
                            </Box>

                            <TableContainer sx={{
                                maxHeight: 600,
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: 6,
                                    height: 0,
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    borderRadius: 3,
                                },
                                scrollbarWidth: 'thin',
                                msOverflowStyle: 'none',
                            }}>
                                <Table stickyHeader sx={{
                                    tableLayout: 'fixed',
                                    width: '100%'
                                }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">STT</TableCell>
                                            <TableCell sx={{ fontWeight: 600, width: '25%' }} align="center">Ngày sự kiện</TableCell>
                                            <TableCell sx={{ fontWeight: 600, width: '20%' }} align="center">Loại sự kiện</TableCell>
                                            <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Mức độ</TableCell>
                                            <TableCell sx={{ fontWeight: 600, width: '20%' }} align="center">Trạng thái</TableCell>
                                            <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Hiển thị data từ API (đã được phân trang) */}
                                        {medicalEvents.map((event, index) => (
                                            <TableRow
                                                key={event._id || index}
                                                hover
                                                sx={{
                                                    '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                                    '&:hover': {
                                                        bgcolor: '#e3f2fd',
                                                        transform: 'scale(1.002)',
                                                        transition: 'all 0.2s ease-in-out',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    },
                                                    cursor: 'pointer',
                                                    height: '60px'
                                                }}
                                            >
                                                <TableCell align="center" sx={{ px: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: '#1976d2',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {/* Tính STT dựa trên page hiện tại */}
                                                        {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ px: 2 }}>
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#424242', fontWeight: 700 }}>
                                                        {formatDate(event.dateHappened || event.createdAt)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ px: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            color: '#424242',
                                                            fontWeight: 400
                                                        }}
                                                    >
                                                        {getEventTypeLabel(event.type)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ px: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            color: getLevelColor(event.level),
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {getLevelLabel(event.level)}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell align="center" sx={{ px: 2 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            color: getStatusColor(event.status),
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {getStatusLabel(event.status)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                        <Tooltip title="Xem chi tiết">
                                                            <IconButton
                                                                color="info"
                                                                size="small"
                                                                onClick={() => handleViewEvent(event._id)}
                                                            >
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Chỉnh sửa">
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handleEditEvent(event._id)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* Pagination component */}
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Pagination
                                    count={paginationInfo.totalPages}
                                    page={paginationInfo.page}
                                    onChange={handlePageChange}
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Container>
        </LocalizationProvider>
    );
};

export default MedicalEventsPage;
