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
  Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  MedicalServices as MedicalIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventApi from '../../api/medicalEventApi';
import { childApi } from '../../api/childApi';

const MedicalEventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [events, setEvents] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination state
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    level: searchParams.get('level') || '',
    childId: searchParams.get('childId') || '',
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

  // Load events when filters change
  useEffect(() => {
    if (children.length > 0) {
      loadMedicalEvents();
    }
  }, [filters, children]);

  // Sync URL params with filters
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (filters.keyword) newParams.set('keyword', filters.keyword);
    if (filters.type) newParams.set('type', filters.type);
    if (filters.level) newParams.set('level', filters.level);
    if (filters.childId) newParams.set('childId', filters.childId);
    if (filters.page > 1) newParams.set('page', filters.page.toString());

    setSearchParams(newParams);
  }, [filters, setSearchParams]);

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

  const loadMedicalEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parent can only view events of their children
      let allEvents = [];

      // If specific child is selected, load only that child's events
      if (filters.childId) {
        const childEvents = await loadEventsForChild(filters.childId);
        allEvents = childEvents;
      } else {
        // Load events for all children
        console.log('Loading events for all children:', children);
        const promises = children.map(child => loadEventsForChild(child._id));
        const results = await Promise.all(promises);
        allEvents = results.flat();
      }

      // Apply filters
      let filteredEvents = allEvents;

      if (filters.keyword) {
        filteredEvents = filteredEvents.filter(event =>
          event.description?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          event.type?.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }

      if (filters.type) {
        filteredEvents = filteredEvents.filter(event => event.type === filters.type);
      }

      if (filters.level) {
        filteredEvents = filteredEvents.filter(event => event.level === parseInt(filters.level));
      }

      // Sort by date (newest first)
      filteredEvents.sort((a, b) => new Date(b.dateHappened) - new Date(a.dateHappened));

      // Client-side pagination
      const total = filteredEvents.length;
      const totalPages = Math.ceil(total / filters.limit);
      const startIndex = (filters.page - 1) * filters.limit;
      const paginatedEvents = filteredEvents.slice(startIndex, startIndex + filters.limit);

      setEvents(paginatedEvents);
      setPaginationInfo({
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages
      });

    } catch (error) {
      console.error('Error loading medical events:', error);
      if (error.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 403) {
        setError('Bạn không có quyền truy cập dữ liệu này.');
      } else {
        setError('Không thể tải danh sách sự kiện y tế.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEventsForChild = async (childId) => {
    try {
      const response = await medicalEventApi.getEventsByStudentId(childId);
      if (response?.isSuccess) {
        const events = response.data.records || [];
        console.log('Loaded events for child:', childId, events);
        // Add child info to each event
        const child = children.find(c => c._id === childId);
        return events.map(event => ({
          ...event,
          childInfo: child
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error loading events for child ${childId}:`, error);
      return [];
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      type: '',
      level: '',
      childId: '',
      page: 1,
      limit: 10
    });
  };

  const handleViewEvent = (event) => {
    navigate(`/parent/medical-events/${event._id}`, {
      state: {
        eventData: event,
        childData: event.childInfo
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

  const getTypeChip = (type) => {
    const typeMap = {
      'cấp cứu': { color: 'error', label: 'Cấp cứu' },
      'chấn thương': { color: 'warning', label: 'Chấn thương' },
      'bệnh': { color: 'info', label: 'Bệnh' },
    };
    const config = typeMap[type] || { color: 'default', label: type };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const getLevelChip = (level) => {
    const levelMap = {
      1: { color: 'success', label: 'Nhẹ' },
      2: { color: 'warning', label: 'Trung bình' },
      3: { color: 'error', label: 'Khẩn cấp' }
    };
    const config = levelMap[level] || { color: 'default', label: 'N/A' };
    return <Chip label={config.label} color={config.color} size="small" />;
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
            Sự kiện y tế
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Theo dõi các sự kiện y tế của con em
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Làm mới danh sách">
            <IconButton
              onClick={() => window.location.reload()}
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
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Bộ lọc tìm kiếm
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
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
                <InputLabel>Loại sự kiện</InputLabel>
                <Select
                  value={filters.type}
                  label="Loại sự kiện"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                    '& .MuiSelect-select': { minWidth: '100px' }
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="cấp cứu">Cấp cứu</MenuItem>
                  <MenuItem value="chấn thương">Chấn thương</MenuItem>
                  <MenuItem value="bệnh">Bệnh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Mức độ</InputLabel>
                <Select
                  value={filters.level}
                  label="Mức độ"
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                    '& .MuiSelect-select': { minWidth: '100px' }
                  }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="1">Nhẹ</MenuItem>
                  <MenuItem value="2">Trung bình</MenuItem>
                  <MenuItem value="3">Khẩn cấp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Con em</InputLabel>
                <Select
                  value={filters.childId}
                  label="Con em"
                  onChange={(e) => handleFilterChange('childId', e.target.value)}
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

      {/* Events Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Danh sách sự kiện y tế ({paginationInfo.total})
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : events.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {filters.keyword || filters.type || filters.level || filters.childId
                  ? 'Không tìm thấy sự kiện nào phù hợp'
                  : 'Chưa có sự kiện y tế nào'
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Ngày xảy ra</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Con em</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Loại sự kiện</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Mức độ</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow key={event._id} hover>
                        <TableCell>{(filters.page - 1) * filters.limit + index + 1}</TableCell>
                        <TableCell>{formatDate(event.dateHappened)}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {event.childInfo?.name || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {event.childInfo?.studentCode || 'N/A'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getTypeChip(event.type)}</TableCell>
                        <TableCell>{getLevelChip(event.level)}</TableCell>
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
                            {event.description || 'Không có mô tả'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Xem chi tiết">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewEvent(event)}
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
                    page={filters.page}
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
    </Container>
  );
};

export default MedicalEventsPage;
