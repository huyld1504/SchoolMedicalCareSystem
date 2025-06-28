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
  Vaccines as VaccineIcon
} from '@mui/icons-material';
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
    keyword: ''
  });

  // State cho filter UI
  const [filters, setFilters] = useState({
    parentConsent: '',
    vaccinationStatus: ''
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
  }, [
    query.page,
    query.parentConsent,
    query.vaccinationStatus,
    query.keyword
  ]);

  const loadVaccinationNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (query.page) params.page = query.page;
      if (query.parentConsent && query.parentConsent.trim()) params.parentConsent = query.parentConsent.trim();
      if (query.vaccinationStatus && query.vaccinationStatus.trim()) params.vaccinationStatus = query.vaccinationStatus.trim();
      if (query.keyword && query.keyword.trim()) params.keyword = query.keyword.trim();

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

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({
      parentConsent: '',
      vaccinationStatus: ''
    });
    setQuery({
      page: 1,
      limit: 10,
      keyword: '',
      parentConsent: '',
      vaccinationStatus: ''
    });
  };

  const handleRefresh = () => {
    loadVaccinationNotifications();
    toast.success('Đã làm mới dữ liệu');
  };

  // Xử lý xem chi tiết thông báo
  const handleViewNotification = (notificationId) => {
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
                placeholder="Tìm kiếm"
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
              <FormControl fullWidth size="small" sx={{ minWidth: '170px' }}>
                <InputLabel>Trạng thái duyệt</InputLabel>
                <Select
                  value={filters.parentConsent}
                  onChange={handleParentConsentChange}
                  label="Trạng thái duyệt"
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
              <FormControl fullWidth size="small" sx={{ minWidth: '170px' }}>
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

            {/* Action buttons */}
            <Grid item xs={12} md>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  color="primary"
                  startIcon={<SearchIcon />}
                  size="small"
                >
                  Tìm kiếm
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  color="secondary"
                  startIcon={<FilterIcon />}
                  size="small"
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

            <TableContainer component={Paper} sx={{
              maxHeight: 600,
              overflowX: 'auto',
              borderRadius: 2,
              boxShadow: 2,
              border: '1px solid #e0e0e0',
              '&::-webkit-scrollbar': {
                height: 8,
                background: 'rgba(0,0,0,0.05)'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(25, 118, 210, 0.2)',
                borderRadius: 4
              },
            }}>
              <Table stickyHeader sx={{ minWidth: 1200, background: '#fff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '5%', fontSize: '1rem', whiteSpace: 'nowrap' }} align="center">STT</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '12%', fontSize: '1rem', whiteSpace: 'nowrap' }} align="center">Ngày bắt đầu</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '14%', fontSize: '1rem' }} align="center">Họ và tên</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '10%', fontSize: '1rem', whiteSpace: 'nowrap' }} align="center">Mã học sinh</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '15%', fontSize: '1rem' }} align="center">Tên chiến dịch</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '14%', fontSize: '1rem' }} align="center">Loại vaccine</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '9%', fontSize: '1rem' }} align="center">Trạng thái tiêm</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '9%', fontSize: '1rem' }} align="center">Trạng thái duyệt</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '12%', fontSize: '1rem' }} align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vaccinationNotifications.map((notification, index) => (
                    <TableRow
                      key={notification._id || index}
                      hover
                      sx={{
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        height: 56
                      }}
                    >
                      <TableCell align="center" sx={{ fontSize: '0.93rem', whiteSpace: 'nowrap', py: 1, color: '#1976d2', fontWeight: 700 }}>{(paginationInfo.page - 1) * paginationInfo.limit + index + 1}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.93rem', whiteSpace: 'nowrap', py: 1 }}>{formatDate(notification.campaign?.startDate)}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.93rem', whiteSpace: 'nowrap', py: 1 }}>{notification.student?.name || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.93rem', whiteSpace: 'nowrap', py: 1 }}>{notification.student?.studentCode || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.93rem', whiteSpace: 'nowrap', py: 1 }}>{notification.campaign?.vaccineName || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '0.93rem', whiteSpace: 'nowrap', py: 1 }}>{notification.campaign?.vaccineType || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Chip
                          label={getVaccinationStatusLabel(notification.vaccinationStatus)}
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'white',
                            backgroundColor: getVaccinationStatusColor(notification.vaccinationStatus),
                            px: 1.2,
                            height: 28,
                            borderRadius: 1.5,
                            whiteSpace: 'nowrap',
                            minWidth: 120
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
                        <Chip
                          label={getConsentLabel(notification.parentConsent)}
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: 'white',
                            backgroundColor: getConsentColor(notification.parentConsent),
                            px: 1.2,
                            height: 28,
                            borderRadius: 1.5,
                            whiteSpace: 'nowrap',
                            minWidth: 120
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 1 }}>
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
  );
};

export default VaccinationNotificationsPage;
