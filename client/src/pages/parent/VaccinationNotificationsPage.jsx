import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Vaccines as VaccineIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import vaccinationApi from '../../api/vaccinationApi';

const VaccinationNotificationsPage = () => {
  const navigate = useNavigate();

  // State cho query gọi API
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    parentConsent: '',
    vaccinationStatus: '',
    consentDateFrom: '',
    consentDateTo: '',
    vaccinationDateFrom: '',
    vaccinationDateTo: ''
  });

  // State để quản lý date picker
  const [dateFromValue, setDateFromValue] = useState(null);
  const [dateToValue, setDateToValue] = useState(null);
  const [vaccinationDateFromValue, setVaccinationDateFromValue] = useState(null);
  const [vaccinationDateToValue, setVaccinationDateToValue] = useState(null);

  // State cho filter UI (tạm thời)
  const [filters, setFilters] = useState({
    parentConsent: '',
    vaccinationStatus: '',
    consentDateFrom: '',
    consentDateTo: '',
    vaccinationDateFrom: '',
    vaccinationDateTo: ''
  });

  const [searchInput, setSearchInput] = useState('');

  // State cho data từ API
  const [vaccinationNotifications, setVaccinationNotifications] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const [loading, setLoading] = useState(true);

  // Load dữ liệu khi query thay đổi
  useEffect(() => {
    loadVaccinationNotifications();
  }, [query.page, query.parentConsent, query.vaccinationStatus, 
      query.consentDateFrom, query.consentDateTo, query.vaccinationDateFrom, query.vaccinationDateTo]);

  const loadVaccinationNotifications = async () => {
    try {
      setLoading(true);
      
      // Chuẩn bị params cho API call (không bao gồm limit vì backend không hỗ trợ)
      const params = {};
      
      if (query.page) params.page = query.page;
      // Không truyền limit vì backend không hỗ trợ cho endpoint parent
      if (query.parentConsent && query.parentConsent.trim()) params.parentConsent = query.parentConsent.trim();
      if (query.vaccinationStatus && query.vaccinationStatus.trim()) params.vaccinationStatus = query.vaccinationStatus.trim();
      if (query.consentDateFrom && query.consentDateFrom.trim()) params.consentDateFrom = query.consentDateFrom.trim();
      if (query.consentDateTo && query.consentDateTo.trim()) params.consentDateTo = query.consentDateTo.trim();
      if (query.vaccinationDateFrom && query.vaccinationDateFrom.trim()) params.vaccinationDateFrom = query.vaccinationDateFrom.trim();
      if (query.vaccinationDateTo && query.vaccinationDateTo.trim()) params.vaccinationDateTo = query.vaccinationDateTo.trim();

      console.log('Filter params being sent to API:', params);
      
      // Chỉ sử dụng API getParentParticipations
      const response = await vaccinationApi.getParentParticipations(params);
      
      console.log('Vaccination notifications response:', response);

      if (response.isSuccess && response.data) {
        setVaccinationNotifications(response.data.records || []);
        setPaginationInfo({
          total: response.data.total || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 10,
          totalPages: response.data.totalPages || 0
        });
      } else {
        setVaccinationNotifications([]);
        setPaginationInfo({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error loading vaccination notifications:', error);
      setVaccinationNotifications([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
      toast.error('Lỗi khi tải dữ liệu thông báo tiêm chủng');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý phân trang
  const handlePageChange = (event, newPage) => {
    setQuery(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleApplyFilters();
    }
  };

  // Handler để áp dụng tất cả filter
  const handleApplyFilters = () => {
    setQuery(prev => ({
      ...prev,
      keyword: searchInput,
      parentConsent: filters.parentConsent,
      vaccinationStatus: filters.vaccinationStatus,
      consentDateFrom: filters.consentDateFrom,
      consentDateTo: filters.consentDateTo,
      vaccinationDateFrom: filters.vaccinationDateFrom,
      vaccinationDateTo: filters.vaccinationDateTo,
      page: 1 // Reset về page 1 khi filter
    }));
  };

  // Xử lý filter
  const handleParentConsentChange = (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      parentConsent: value
    }));
  };

  const handleVaccinationStatusChange = (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      vaccinationStatus: value
    }));
  };

  // Xử lý thay đổi date picker
  const handleConsentDateFromChange = (newValue) => {
    setDateFromValue(newValue);
    const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
    setFilters(prev => ({
      ...prev,
      consentDateFrom: dateString
    }));
  };

  const handleConsentDateToChange = (newValue) => {
    setDateToValue(newValue);
    const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
    setFilters(prev => ({
      ...prev,
      consentDateTo: dateString
    }));
  };

  const handleVaccinationDateFromChange = (newValue) => {
    setVaccinationDateFromValue(newValue);
    const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
    setFilters(prev => ({
      ...prev,
      vaccinationDateFrom: dateString
    }));
  };

  const handleVaccinationDateToChange = (newValue) => {
    setVaccinationDateToValue(newValue);
    const dateString = newValue ? newValue.toISOString().split('T')[0] : '';
    setFilters(prev => ({
      ...prev,
      vaccinationDateTo: dateString
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setDateFromValue(null);
    setDateToValue(null);
    setVaccinationDateFromValue(null);
    setVaccinationDateToValue(null);
    setFilters({
      parentConsent: '',
      vaccinationStatus: '',
      consentDateFrom: '',
      consentDateTo: '',
      vaccinationDateFrom: '',
      vaccinationDateTo: ''
    });
    setQuery({
      page: 1,
      limit: 10,
      keyword: '',
      parentConsent: '',
      vaccinationStatus: '',
      consentDateFrom: '',
      consentDateTo: '',
      vaccinationDateFrom: '',
      vaccinationDateTo: ''
    });
  };

  const handleRefresh = () => {
    loadVaccinationNotifications();
    toast.success('Đã làm mới dữ liệu');
  };

  // Xử lý xem chi tiết thông báo
  const handleViewNotification = (notificationId) => {
    // Tìm notification trong danh sách hiện tại để truyền qua state
    const selectedNotification = vaccinationNotifications.find(notification => notification._id === notificationId);
    console.log('Selected notification for viewing:', selectedNotification);

    navigate(`/parent/vaccination-notifications/${notificationId}`, {
      state: { notificationData: selectedNotification }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get consent color and label
  const getConsentColor = (consent) => {
    switch (consent) {
      case 'approved':
        return '#2e7d32'; // Xanh lá
      case 'denied':
        return '#d32f2f'; // Đỏ
      case 'pending':
        return '#ed6c02'; // Cam
      default:
        return '#757575'; // Xám
    }
  };

  const getConsentLabel = (consent) => {
    switch (consent) {
      case 'approved':
        return 'Đã đồng ý';
      case 'denied':
        return 'Đã từ chối';
      case 'pending':
        return 'Chờ phản hồi';
      default:
        return 'Không xác định';
    }
  };

  // Get vaccination status color and label
  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#2e7d32'; // Xanh lá
      case 'scheduled':
        return '#1976d2'; // Xanh dương
      case 'missed':
        return '#ed6c02'; // Cam
      case 'cancelled':
        return '#d32f2f'; // Đỏ
      default:
        return '#757575'; // Xám
    }
  };

  const getVaccinationStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã tiêm';
      case 'scheduled':
        return 'Đã lên lịch';
      case 'missed':
        return 'Bỏ lỡ';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VaccineIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Thông báo tiêm chủng
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Xem và phản hồi thông báo tiêm chủng cho con em
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ height: 'fit-content' }}
          >
            Làm mới
          </Button>
        </Box>

        {/* Filter section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Tìm kiếm vaccine, ghi chú..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Parent Consent Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small" sx={{ minWidth: '130px' }}>
                  <InputLabel>Phản hồi</InputLabel>
                  <Select
                    value={filters.parentConsent}
                    onChange={handleParentConsentChange}
                    label="Phản hồi"
                    sx={{
                      fontSize: '14px',
                      '& .MuiSelect-select': {
                        padding: '8px 14px',
                        fontSize: '14px'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '14px' }}>Tất cả</MenuItem>
                    <MenuItem value="pending" sx={{ fontSize: '14px' }}>Chờ phản hồi</MenuItem>
                    <MenuItem value="approved" sx={{ fontSize: '14px' }}>Đã đồng ý</MenuItem>
                    <MenuItem value="denied" sx={{ fontSize: '14px' }}>Đã từ chối</MenuItem>
                  </Select>
                </FormControl>
                
              </Grid>

              {/* Vaccination Status Filter */}
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small" sx={{ minWidth: '180px' }}>
                  <InputLabel>Trạng thái tiêm</InputLabel>
                  <Select
                    value={filters.vaccinationStatus}
                    onChange={handleVaccinationStatusChange}
                    label="Trạng thái tiêm"
                    sx={{
                      fontSize: '14px',
                      '& .MuiSelect-select': {
                        padding: '8px 14px',
                        fontSize: '14px'
                      }
                    }}
                  >
                    <MenuItem value="" sx={{ fontSize: '14px' }}>Tất cả</MenuItem>
                    <MenuItem value="scheduled" sx={{ fontSize: '14px' }}>Đã lên lịch</MenuItem>
                    <MenuItem value="completed" sx={{ fontSize: '14px' }}>Đã tiêm</MenuItem>
                    <MenuItem value="missed" sx={{ fontSize: '14px' }}>Bỏ lỡ</MenuItem>
                    <MenuItem value="cancelled" sx={{ fontSize: '14px' }}>Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Consent Date From */}
              <Grid item xs={12} sm={6} md={1.5}>
                <DatePicker
                  label="Từ ngày phản hồi"
                  value={dateFromValue}
                  onChange={handleConsentDateFromChange}
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

              {/* Consent Date To */}
              <Grid item xs={12} sm={6} md={1.5}>
                <DatePicker
                  label="Đến ngày phản hồi"
                  value={dateToValue}
                  onChange={handleConsentDateToChange}
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
        ) : !vaccinationNotifications || vaccinationNotifications.length === 0 ? (
          <Alert severity="info">
            Chưa có thông báo tiêm chủng nào. Hệ thống sẽ gửi thông báo khi có chiến dịch tiêm chủng mới.
          </Alert>
        ) : (
          <Card>
            <CardContent sx={{ p: 0 }}>
              {/* Header với thông tin pagination */}
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Danh sách thông báo tiêm chủng ({paginationInfo.total} thông báo)
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
                      <TableCell sx={{ fontWeight: 600, width: '6%', fontSize: '1rem' }} align="center">STT</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '12%', fontSize: '1rem' }} align="center">Ngày bắt đầu</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '18%', fontSize: '1rem' }} align="center">Tên chiến dịch</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '15%', fontSize: '1rem' }} align="center">Loại vaccine</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '13%', fontSize: '1rem' }} align="center">Tên học sinh</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '10%', fontSize: '1rem' }} align="center">Mã học sinh</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '14%', fontSize: '1rem' }} align="center">Phản hồi</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: '10%', fontSize: '1rem' }} align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vaccinationNotifications.map((notification, index) => (
                      <TableRow
                        key={notification._id || index}
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
                              fontSize: '1.1rem'
                            }}
                          >
                            {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ px: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '1.1rem', color: '#424242', fontWeight: 500 }}>
                            {formatDate(notification.campaign?.startDate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ px: 2 }}>
                          <Typography variant="body2" sx={{ fontSize: '1.1rem', color: '#424242', fontWeight: 400 }}>
                            {notification.campaign?.vaccineName || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ px: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '1.1rem', color: '#424242', fontWeight: 400 }}>
                            {notification.campaign?.vaccineType || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ px: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '1.1rem', color: '#424242', fontWeight: 400 }}>
                            {notification.student?.name || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ px: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '1.1rem', color: '#424242' }}>
                            {notification.student?.studentCode || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ px: 1 }}>
                          <Chip
                            label={getConsentLabel(notification.parentConsent)}
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: 'white',
                              backgroundColor: getConsentColor(notification.parentConsent)
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="Xem chi tiết">
                              <IconButton
                                color="info"
                                size="small"
                                onClick={() => handleViewNotification(notification._id)}
                              >
                                <ViewIcon fontSize="small" />
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

export default VaccinationNotificationsPage;
