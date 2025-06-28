import React, { useEffect, useState, useMemo } from 'react'; // Thêm useMemo
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
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
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
} from '@mui/material';
import {
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import vaccinationCampaignApi from "../../../../api/vaccinationCampaignApi";
import { formatnoTime } from '../../../../utils/date.utils';

const DetailView = ({ campaign }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [participationPage, setParticipationPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    parentConsent: '',
    vaccinationStatus: '',
    consentDateFrom: '',
    consentDateTo: '',
    vaccinationDateFrom: '',
    vaccinationDateTo: '',
  });

  // **SỬA LỖI: Lấy toàn bộ data**
  const { data: participationsResponse, isLoading: participationsLoading } = useQuery({
    queryKey: ["campaign-participations-all", campaign._id], // Bỏ participationPage
    queryFn: () => vaccinationCampaignApi.GetAllParticipationsInCampaign(campaign._id, { 
      page: 1,           // Luôn lấy trang 1
      limit: 100,       // Lấy toàn bộ data
    }),
    enabled: !!campaign._id,
  });

  // **SỬA LỖI: Lấy toàn bộ dữ liệu từ API**
  const allParticipationsData = participationsResponse?.data?.records || [];
  const totalParticipants = allParticipationsData.length;
  
  console.log('Tổng số người:', totalParticipants);
  console.log('Search term:', searchTerm);

  // **SỬA LỖI: Client-side filtering với useMemo**
  const filteredParticipations = useMemo(() => {
    return allParticipationsData.filter(participant => {
      // Search filter - tìm kiếm theo tên và mã học sinh
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const studentInfo = participant.student;
        const studentName = studentInfo?.name?.toLowerCase() || '';
        const studentCode = studentInfo?.studentCode?.toLowerCase() || '';

        if (!studentName.includes(searchLower) && !studentCode.includes(searchLower)) {
          return false;
        }
      }

      // Parent consent filter
      if (filters.parentConsent && participant.parentConsent !== filters.parentConsent) {
        return false;
      }

      // Vaccination status filter
      if (filters.vaccinationStatus && participant.vaccinationStatus !== filters.vaccinationStatus) {
        return false;
      }

      // Date filters (nếu có dữ liệu date)
      if (filters.consentDateFrom && participant.consentDate) {
        const consentDate = new Date(participant.consentDate);
        const fromDate = new Date(filters.consentDateFrom);
        if (consentDate < fromDate) return false;
      }

      if (filters.consentDateTo && participant.consentDate) {
        const consentDate = new Date(participant.consentDate);
        const toDate = new Date(filters.consentDateTo);
        if (consentDate > toDate) return false;
      }

      return true;
    });
  }, [allParticipationsData, searchTerm, filters]);

  // **SỬA LỖI: Client-side pagination**
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredParticipations.length / itemsPerPage);
  const startIndex = (participationPage - 1) * itemsPerPage;
  const paginatedParticipations = filteredParticipations.slice(startIndex, startIndex + itemsPerPage);

  console.log('Sau khi filter:', filteredParticipations.length);
  console.log('Trang hiện tại:', participationPage, '/', totalPages);

  // **SỬA LỖI: Reset trang khi search/filter thay đổi**
  useEffect(() => {
    setParticipationPage(1);
  }, [searchTerm, filters]);

  // **SỬA LỖI: Reset trang nếu vượt quá số trang hiện có**
  useEffect(() => {
    if (participationPage > totalPages && totalPages > 0) {
      setParticipationPage(totalPages);
    }
  }, [totalPages, participationPage]);

  // **SỬA LỖI: Event handlers**
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Reset sẽ được xử lý bởi useEffect
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleParticipationPageChange = (event, value) => {
    setParticipationPage(value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    // Reset sẽ được xử lý bởi useEffect
  };

  const handleClearFilters = () => {
    setFilters({
      parentConsent: '',
      vaccinationStatus: '',
      consentDateFrom: '',
      consentDateTo: '',
      vaccinationDateFrom: '',
      vaccinationDateTo: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== null
  );

  // Utility functions (giữ nguyên)
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
      case 'đang hoạt động':
        return 'success';
      case 'completed':
      case 'hoàn thành':
        return 'info';
      case 'cancelled':
      case 'đã hủy':
        return 'error';
      case 'pending':
      case 'chờ xử lý':
        return 'warning';
      case 'planned':
      case 'đã lên kế hoạch':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'grey.50',
      py: 3
    }}>
      <Box sx={{ 
        width: '100%',
        maxWidth: '1400px',
        px: { xs: 2, sm: 3, md: 4 },
        mx: 'auto'
      }}>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {/* Header Section */}
          <Grid item xs={12}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                mb: 1
              }}>
                {campaign.vaccineName || 'Chiến dịch tiêm chủng'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {campaign.vaccineType} - {campaign.targetAudience}
              </Typography>
              <Chip
                label={campaign.status || 'N/A'}
                color={getStatusColor(campaign.status)}
                size="large"
                sx={{ fontSize: '1rem', px: 3, py: 1 }}
              />
            </Box>
          </Grid>

          {/* Thông tin chiến dịch - giữ nguyên */}
          <Grid item xs={12}>
            <Card sx={{ width: '1010px' }}>
              <CardContent sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="primary" />
                    Thông tin chiến dịch
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />

                {/* Thông tin cơ bản */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Loại vaccine
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          {campaign.vaccineType || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Đối tượng mục tiêu
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          {campaign.targetAudience || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày bắt đầu
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          {formatnoTime(campaign.startDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày kết thúc
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          {formatnoTime(campaign.endDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Người tạo
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                          {campaign.createdBy?.name || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Lịch trình */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="primary" fontSize="small" />
                    Lịch trình
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày bắt đầu
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(campaign.startDate)}
                        </Typography>
                      </Box>
                    </Grid>

                    {campaign.endDate && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Ngày kết thúc
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(campaign.endDate)}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Thông tin bổ sung */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon color="primary" fontSize="small" />
                    Thông tin bổ sung
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Ngày tạo
                        </Typography>
                        <Typography variant="body2">
                          {formatnoTime(campaign.createdAt)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Cập nhật lần cuối
                        </Typography>
                        <Typography variant="body2">
                          {formatnoTime(campaign.updatedAt)}
                        </Typography>
                      </Box>
                    </Grid>

                    {campaign.notes && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Ghi chú
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            mt: 1, 
                            p: 2, 
                            backgroundColor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                          }}>
                            {campaign.notes}
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {campaign.description && (
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Mô tả
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            mt: 1, 
                            p: 2, 
                            backgroundColor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                          }}>
                            {campaign.description}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* **SỬA LỖI: Danh sách tham gia với client-side pagination** */}
          <Grid item xs={12}>
            <Card sx={{ width: '1010px' }}>
              <CardContent sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon color="primary" />
                    Danh sách tham gia
                    {totalParticipants > 0 && (
                      <Chip
                        label={`${filteredParticipations.length}/${totalParticipants} người | Trang ${participationPage}/${totalPages}`}
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 3 }} />

                {/* Search và Filter */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={handleClearSearch}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FilterIcon />}
                      endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      Bộ lọc
                    </Button>
                    {hasActiveFilters && (
                      <Chip
                        label="Có bộ lọc đang áp dụng"
                        color="primary"
                        size="small"
                        onDelete={handleClearFilters}
                      />
                    )}
                  </Box>

                  <Collapse in={showFilters}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4} sx={{width: '200px'}}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Đồng ý phụ huynh</InputLabel>
                            <Select
                              value={filters.parentConsent}
                              label="Đồng ý phụ huynh"
                              onChange={(e) => handleFilterChange('parentConsent', e.target.value)}
                            >
                              <MenuItem value="">Tất cả</MenuItem>
                              <MenuItem value="pending">Chờ xử lý</MenuItem>
                              <MenuItem value="approved">Đã đồng ý</MenuItem>
                              <MenuItem value="denied">Từ chối</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl fullWidth size="small" sx={{width: '200px'}}>
                            <InputLabel>Trạng thái tiêm</InputLabel>
                            <Select
                              value={filters.vaccinationStatus}
                              label="Trạng thái tiêm"
                              onChange={(e) => handleFilterChange('vaccinationStatus', e.target.value)}
                            >
                              <MenuItem value="">Tất cả</MenuItem>
                              <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                              <MenuItem value="completed">Đã tiêm</MenuItem>
                              <MenuItem value="missed">Bỏ lỡ</MenuItem>
                              <MenuItem value="cancelled">Đã hủy</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                            fullWidth
                          >
                            Xóa bộ lọc
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  </Collapse>
                </Box>

                {/* Table */}
                {participationsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2, width: '100%' }}>
                      <Table sx={{ width: '100%' }}>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: 'grey.50' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Học sinh</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Đồng ý PH</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái tiêm</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày tiêm</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedParticipations.length > 0 ? (
                            paginatedParticipations.map((participant, index) => {
                              const studentInfo = participant.student;
                              return (
                                <TableRow key={participant._id || index} hover>
                                  <TableCell>
                                    <Box>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                        {studentInfo?.name || 'N/A'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        Mã HS: {studentInfo?.studentCode || 'N/A'}
                                      </Typography>
                                    </Box>
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      label={
                                        participant.parentConsent === 'approved' ? 'Đã đồng ý' :
                                        participant.parentConsent === 'pending' ? 'Chờ phản hồi' :
                                        participant.parentConsent === 'denied' ? 'Từ chối' :
                                        'Chưa rõ'
                                      }
                                      color={
                                        participant.parentConsent === 'approved' ? 'success' :
                                        participant.parentConsent === 'pending' ? 'warning' :
                                        participant.parentConsent === 'denied' ? 'error' :
                                        'default'
                                      }
                                      size="small"
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      label={
                                        participant.vaccinationStatus === 'completed' ? 'Đã tiêm' :
                                        participant.vaccinationStatus === 'scheduled' ? 'Đã lên lịch' :
                                        participant.vaccinationStatus === 'missed' ? 'Bỏ lỡ' :
                                        participant.vaccinationStatus === 'cancelled' ? 'Đã hủy' :
                                        participant.vaccinationStatus || 'Chưa rõ'
                                      }
                                      color={
                                        participant.vaccinationStatus === 'completed' ? 'success' :
                                        participant.vaccinationStatus === 'scheduled' ? 'info' :
                                        participant.vaccinationStatus === 'missed' ? 'warning' :
                                        participant.vaccinationStatus === 'cancelled' ? 'error' :
                                        'default'
                                      }
                                      size="small"
                                    />
                                  </TableCell>

                                  <TableCell>
                                    <Typography variant="body2">
                                      {participant.vaccinationDate ? formatDate(participant.vaccinationDate) : 'Chưa tiêm'}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {participant.notes || 'Không có'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                <Typography color="text.secondary" variant="h6">
                                  {searchTerm || hasActiveFilters ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có người tham gia'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* **SỬA LỖI: Pagination sử dụng client-side data** */}
                    {totalPages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 3 }}>
                        <Pagination
                          count={totalPages}
                          page={participationPage}
                          onChange={handleParticipationPageChange}
                          color="primary"
                          showFirstButton
                          showLastButton
                        />
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DetailView;
