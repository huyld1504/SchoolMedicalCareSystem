import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
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
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';
import vaccinationCampaignApi from "../../../../api/vaccinationCampaignApi";

const DetailView = ({ campaign }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [participationPage, setParticipationPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    parentConsent: '',
    vaccinationStatus: '',
    consentDateFrom: null,
    consentDateTo: null,
    vaccinationDateFrom: null,
    vaccinationDateTo: null,
  });
  // Query for participants from campaign
  const { data: participationsResponse, isLoading: participationsLoading } = useQuery({
    queryKey: ["campaign-participations", campaign._id],
    queryFn: () => vaccinationCampaignApi.GetAllParticipationsInCampaign(campaign._id),
    enabled: !!campaign._id,
  });
  // Get the participations data from the response
  const participationsData = participationsResponse?.data?.records || [];
  const totalParticipants = participationsData.length;

  // Apply filters and search locally
  const filteredParticipations = participationsData.filter(participant => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const studentInfo = participant.student;
      const studentName = `${studentInfo?.firstName || ''} ${studentInfo?.lastName || ''}`.toLowerCase();
      const studentClass = studentInfo?.class?.toLowerCase() || '';

      if (!studentName.includes(searchLower) && !studentClass.includes(searchLower)) {
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

    // Date filters
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

    if (filters.vaccinationDateFrom && participant.vaccinationDate) {
      const vacDate = new Date(participant.vaccinationDate);
      const fromDate = new Date(filters.vaccinationDateFrom);
      if (vacDate < fromDate) return false;
    }

    if (filters.vaccinationDateTo && participant.vaccinationDate) {
      const vacDate = new Date(participant.vaccinationDate);
      const toDate = new Date(filters.vaccinationDateTo);
      if (vacDate > toDate) return false;
    }

    return true;
  });

  // Apply pagination locally
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredParticipations.length / itemsPerPage);
  const startIndex = (participationPage - 1) * itemsPerPage;
  const paginatedParticipations = filteredParticipations.slice(startIndex, startIndex + itemsPerPage);// Handle searchmap
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setParticipationPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setParticipationPage(1);
  };

  const handleParticipationPageChange = (event, value) => {
    setParticipationPage(value);
  };

  // Handle filters
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setParticipationPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({
      parentConsent: '',
      vaccinationStatus: '',
      consentDateFrom: null,
      consentDateTo: null,
      vaccinationDateFrom: null,
      vaccinationDateTo: null,
    });
    setParticipationPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== null
  );

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
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

  // Format date
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

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Basic Information */}
      <Grid item xs={12}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon color="primary" />
              Thông tin cơ bản
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tên vaccine
                </Typography>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {campaign.vaccineName || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Loại vaccine
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {campaign.vaccineType || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Đối tượng mục tiêu
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {campaign.targetAudience || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày bắt đầu
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(campaign.startDate)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <Chip
                    label={campaign.status || 'N/A'}
                    color={getStatusColor(campaign.status)}
                    size="medium"
                  />
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Container cho 3 cards */}
      <Grid item xs={12}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr', // 3 columns đều nhau
          gap: 3,
          width: '100%',
          '@media (max-width: 900px)': {
            gridTemplateColumns: '1fr' // 1 column trên mobile
          }
        }}>
          {/* Schedule Card - 40% width */}
          <Card sx={{
            flexBasis: '40%',
            minWidth: '300px',
            flexGrow: 1,
            height: 'fit-content'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                Lịch trình
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ngày bắt đầu
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(campaign.startDate)}
                  </Typography>
                </Grid>

                {campaign.schedule && campaign.schedule.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Lịch chi tiết
                    </Typography>
                    <List dense>
                      {campaign.schedule.map((scheduleItem, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={`${formatDateTime(scheduleItem.date)}`}
                            secondary={scheduleItem.note || 'Không có ghi chú'}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Status Card - 30% width */}
          <Card sx={{
            flexBasis: '30%',
            minWidth: '250px',
            flexGrow: 1,
            height: 'fit-content'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trạng thái chiến dịch
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Chip
                  label={campaign.status || 'N/A'}
                  color={getStatusColor(campaign.status)}
                  size="large"
                  sx={{ fontSize: '1rem', py: 2 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" align="center">
                    Số lượng tham gia
                  </Typography>
                  <Typography variant="h4" align="center" color="primary">
                    {campaign.participantCount || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary" align="center">
                    Đã hoàn thành
                  </Typography>
                  <Typography variant="h4" align="center" color="success.main">
                    {campaign.completedCount || 0}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Metadata Card - 30% width */}
          <Card sx={{
            flexBasis: '30%',
            minWidth: '250px',
            flexGrow: 1,
            height: 'fit-content'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin khác
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Người tạo
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {campaign.createdBy?.name || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {campaign.createdBy?.email || ''}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ngày tạo
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(campaign.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cập nhật lần cuối
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(campaign.updatedAt)}
                </Typography>
              </Box>

              {campaign.notes && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ghi chú
                  </Typography>
                  <Typography variant="body2">
                    {campaign.notes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Grid>

      {/* Participants */}      {/* Participants List */}
      <Grid item xs={12}>
        <Card>
          <CardContent>            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon color="primary" />
            Danh sách tham gia
            {totalParticipants > 0 && (
              <Chip
                label={`${filteredParticipations.length}/${totalParticipants} người`}
                color="primary"
                size="small"
              />
            )}
          </Typography>
            <Divider sx={{ mb: 2 }} />            {/* Search Box */}
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên học sinh, lớp..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filter Controls */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FilterIcon />}
                  endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Bộ lọc nâng cao
                </Button>
                {hasActiveFilters && (
                  <Chip
                    label="Có bộ lọc"
                    color="primary"
                    size="small"
                    onDelete={handleClearFilters}
                  />
                )}
              </Box>

              <Collapse in={showFilters}>
                <Card variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Grid container spacing={2}>
                    {/* Parent Consent Filter */}
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Đồng ý của phụ huynh</InputLabel>
                        <Select
                          value={filters.parentConsent}
                          label="Đồng ý của phụ huynh"
                          onChange={(e) => handleFilterChange('parentConsent', e.target.value)}
                        >
                          <MenuItem value="">Tất cả</MenuItem>
                          <MenuItem value="pending">Chờ xử lý</MenuItem>
                          <MenuItem value="approved">Đã đồng ý</MenuItem>
                          <MenuItem value="denied">Từ chối</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Vaccination Status Filter */}
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
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

                    {/* Consent Date From */}
                    <Grid item xs={12} sm={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <DatePicker
                          label="Ngày đồng ý từ"
                          value={filters.consentDateFrom}
                          onChange={(date) => handleFilterChange('consentDateFrom', date)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    {/* Consent Date To */}
                    <Grid item xs={12} sm={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <DatePicker
                          label="Ngày đồng ý đến"
                          value={filters.consentDateTo}
                          onChange={(date) => handleFilterChange('consentDateTo', date)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    {/* Vaccination Date From */}
                    <Grid item xs={12} sm={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <DatePicker
                          label="Ngày tiêm từ"
                          value={filters.vaccinationDateFrom}
                          onChange={(date) => handleFilterChange('vaccinationDateFrom', date)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    {/* Vaccination Date To */}
                    <Grid item xs={12} sm={6} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                        <DatePicker
                          label="Ngày tiêm đến"
                          value={filters.vaccinationDateTo}
                          onChange={(date) => handleFilterChange('vaccinationDateTo', date)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              fullWidth: true,
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    {/* Clear Filters Button */}
                    <Grid item xs={12} sm={6} md={6}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleClearFilters}
                        disabled={!hasActiveFilters}
                      >
                        Xóa tất cả bộ lọc
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Collapse>
            </Box>

            {/* Participants Table */}
            {participationsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined">
                  <Table>                    <TableHead>
                    <TableRow>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>Lớp</TableCell>
                      <TableCell>Ngày sinh</TableCell>
                      <TableCell>Đồng ý PH</TableCell>
                      <TableCell>Trạng thái tiêm</TableCell>
                      <TableCell>Ngày tiêm</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>                    <TableBody>
                      {paginatedParticipations.length > 0 ? (
                        paginatedParticipations.map((participant, index) => {
                          const studentInfo = participant.student;
                          return (
                            <TableRow key={participant._id || index}>
                              <TableCell>
                                <Typography variant="subtitle2">
                                  {studentInfo ? `${studentInfo.firstName || ''} ${studentInfo.lastName || ''}`.trim() : 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>{studentInfo?.class || 'N/A'}</TableCell>
                              <TableCell>{formatDate(studentInfo?.dateOfBirth)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    participant.parentConsent === 'approved' ? 'Đã đồng ý' :
                                      participant.parentConsent === 'pending' ? 'Chờ xử lý' :
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
                                {participant.vaccinationDate ?
                                  formatDate(participant.vaccinationDate) :
                                  'Chưa tiêm'
                                }
                              </TableCell>
                              <TableCell>{participant.notes || 'Không có'}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography color="text.secondary">
                              {searchTerm || hasActiveFilters ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có người tham gia'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={participationPage}
                      onChange={handleParticipationPageChange}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DetailView;
