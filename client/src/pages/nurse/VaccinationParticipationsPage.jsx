import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  Tooltip,
  Alert,
  Pagination,
  InputAdornment, Select,
  MenuItem,
  FormControl,
  InputLabel, Avatar,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Vaccines as VaccinesIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  MedicalServices as MedicalIcon, Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Clear as ClearIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import vaccinationApi from '../../api/vaccinationApi';

const VaccinationParticipationsPage = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaign, setCampaign] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state (separate from applied search)
  const [filters, setFilters] = useState({
    keyword: '',
    consentStatus: '',
    vaccinationStatus: '',
    vaccinationDateFrom: '',
    vaccinationDateTo: '',
    page: 1,
    limit: 20
  });

  // Applied search state (used for actual API calls)
  const [appliedSearch, setAppliedSearch] = useState({
    keyword: searchParams.get('keyword') || '',
    consentStatus: searchParams.get('consentStatus') || '',
    vaccinationStatus: searchParams.get('vaccinationStatus') || '',
    vaccinationDateFrom: searchParams.get('vaccinationDateFrom') || '',
    vaccinationDateTo: searchParams.get('vaccinationDateTo') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 20
  });

  // State cho pagination
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Recording vaccination state
  const [recordingDialog, setRecordingDialog] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState(null);
  const [recordingData, setRecordingData] = useState({
    status: 'completed',
    vaccinationDate: new Date(),
    note: ''
  });  // Load campaign details
  useEffect(() => {
    loadCampaignDetails();
  }, [campaignId]);

  // Initialize filters from URL params on first load
  useEffect(() => {
    if (appliedSearch.keyword || appliedSearch.consentStatus || appliedSearch.vaccinationStatus || appliedSearch.vaccinationDateFrom || appliedSearch.vaccinationDateTo) {
      // Copy appliedSearch to filters to show in form
      setFilters({
        keyword: appliedSearch.keyword,
        consentStatus: appliedSearch.consentStatus,
        vaccinationStatus: appliedSearch.vaccinationStatus,
        vaccinationDateFrom: appliedSearch.vaccinationDateFrom,
        vaccinationDateTo: appliedSearch.vaccinationDateTo,
        page: appliedSearch.page,
        limit: appliedSearch.limit
      });
    }
  }, []); // Only run once on mount

  // Load participations when appliedSearch changes
  useEffect(() => {
    if (campaignId) {
      loadParticipations();
    }
  }, [campaignId, appliedSearch]);

  // Sync URL params with appliedSearch
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (appliedSearch.keyword) newParams.set('keyword', appliedSearch.keyword);
    if (appliedSearch.consentStatus) newParams.set('consentStatus', appliedSearch.consentStatus);
    if (appliedSearch.vaccinationStatus) newParams.set('vaccinationStatus', appliedSearch.vaccinationStatus);
    if (appliedSearch.vaccinationDateFrom) newParams.set('vaccinationDateFrom', appliedSearch.vaccinationDateFrom);
    if (appliedSearch.vaccinationDateTo) newParams.set('vaccinationDateTo', appliedSearch.vaccinationDateTo);
    if (appliedSearch.page > 1) newParams.set('page', appliedSearch.page.toString());

    setSearchParams(newParams);
  }, [appliedSearch, setSearchParams]);

  const loadParticipations = async () => {
    try {
      setLoading(true);

      console.log('Participation search query:', appliedSearch);

      // Create API query without keyword and vaccinationDate (handled client-side)
      const apiQuery = {
        page: 1, // Load all data for client-side filtering
        limit: 99, // Large limit to get all data
        consentStatus: appliedSearch.consentStatus,
        vaccinationStatus: appliedSearch.vaccinationStatus
        // vaccinationDate removed - handled client-side
      };

      const response = await vaccinationApi.campaigns.getParticipations(campaignId, apiQuery);

      if (response?.isSuccess) {
        let allParticipations = response?.data?.records || [];

        // Apply keyword filter client-side (similar to MedicalEventsPage)
        if (appliedSearch.keyword) {
          allParticipations = allParticipations.filter(participation =>
            participation.student?.name?.toLowerCase().includes(appliedSearch.keyword.toLowerCase()) ||
            participation.student?.studentCode?.toLowerCase().includes(appliedSearch.keyword.toLowerCase()) ||
            participation.parentNote?.toLowerCase().includes(appliedSearch.keyword.toLowerCase()) ||
            participation.nurseNote?.toLowerCase().includes(appliedSearch.keyword.toLowerCase())
          );
        }

        // Apply vaccination date filter client-side (date range)
        if (appliedSearch.vaccinationDateFrom || appliedSearch.vaccinationDateTo) {
          allParticipations = allParticipations.filter(participation => {
            if (!participation.vaccinationDate) return false;
            
            const participationDate = new Date(participation.vaccinationDate);
            let isValid = true;
            
            // Check from date
            if (appliedSearch.vaccinationDateFrom) {
              const fromDate = new Date(appliedSearch.vaccinationDateFrom);
              fromDate.setHours(0, 0, 0, 0); // Start of day
              isValid = isValid && participationDate >= fromDate;
            }
            
            // Check to date
            if (appliedSearch.vaccinationDateTo) {
              const toDate = new Date(appliedSearch.vaccinationDateTo);
              toDate.setHours(23, 59, 59, 999); // End of day
              isValid = isValid && participationDate <= toDate;
            }
            
            return isValid;
          });
        }

        // Client-side pagination
        const total = allParticipations.length;
        const totalPages = Math.ceil(total / appliedSearch.limit);
        const startIndex = (appliedSearch.page - 1) * appliedSearch.limit;
        const paginatedParticipations = allParticipations.slice(startIndex, startIndex + appliedSearch.limit);

        setParticipations(paginatedParticipations);
        setPaginationInfo({
          total,
          page: appliedSearch.page,
          limit: appliedSearch.limit,
          totalPages
        });
      } else {
        setParticipations([]);
        setPaginationInfo({
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        });
      }
      console.log('Participations loaded:', response?.data?.records);
    } catch (error) {
      console.error('Error loading participations:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      setParticipations([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignDetails = async () => {
    try {
      const response = await vaccinationApi.campaigns.getById(campaignId);
      if (response?.isSuccess) {
        setCampaign(response?.data);
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error('Không thể tải thông tin chiến dịch');
    }
  };

  const handleRecordVaccination = async () => {
    try {
      const response = await vaccinationApi.participations.recordVaccination(
        selectedParticipation._id,
        recordingData
      ); if (response?.isSuccess) {
        toast.success('Đã ghi nhận kết quả tiêm chủng');
        setRecordingDialog(false);
        // Trigger reload by calling loadParticipations
        loadParticipations();
      } else {
        toast.error('Không thể ghi nhận kết quả');
      }
    } catch (error) {
      console.error('Error recording vaccination:', error);
      toast.error('Có lỗi xảy ra khi ghi nhận kết quả');
    }
  };
  const openRecordingDialog = (participation) => {
    setSelectedParticipation(participation);
    setRecordingData({
      status: 'completed',
      vaccinationDate: new Date(),
      note: ''
    });
    setRecordingDialog(true);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (event, newPage) => {
    setAppliedSearch(prev => ({ ...prev, page: newPage }));
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
      consentStatus: '',
      vaccinationStatus: '',
      vaccinationDateFrom: '',
      vaccinationDateTo: '',
      page: 1,
      limit: 20
    };
    setFilters(clearedFilters);
    setAppliedSearch(clearedFilters);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getConsentColor = (consent) => {
    switch (consent) {
      case 'approved': return 'success';
      case 'denied': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getConsentText = (consent) => {
    switch (consent) {
      case 'approved': return 'Đã đồng ý';
      case 'denied': return 'Từ chối';
      case 'pending': return 'Chờ phản hồi';
      default: return consent;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'missed': return 'error';
      case 'cancelled': return 'warning';
      case 'scheduled': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Đã tiêm';
      case 'missed': return 'Bỏ lỡ';
      case 'cancelled': return 'Đã hủy';
      case 'scheduled': return 'Đã lên lịch';
      default: return status;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/nurse/vaccination-campaigns')} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <VaccinesIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              Quản lý Tham gia Tiêm chủng
            </Typography>
            {campaign && (
              <Typography variant="h6" color="text.secondary">
                {campaign.vaccineName} - {formatDate(campaign.startDate)} đến {formatDate(campaign.endDate)}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Search and Filters */}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  placeholder="Tên, mã học sinh, ghi chú..."
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Đồng ý PH</InputLabel>
                  <Select
                    value={filters.consentStatus}
                    label="Đồng ý PH"
                    onChange={(e) => handleFilterChange('consentStatus', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                      '& .MuiSelect-select': { minWidth: '100px' }
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="pending">Chờ phản hồi</MenuItem>
                    <MenuItem value="approved">Đã đồng ý</MenuItem>
                    <MenuItem value="denied">Từ chối</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái tiêm</InputLabel>
                  <Select
                    value={filters.vaccinationStatus}
                    label="Trạng thái tiêm"
                    onChange={(e) => handleFilterChange('vaccinationStatus', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                      '& .MuiSelect-select': { minWidth: '100px' }
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                    <MenuItem value="completed">Đã tiêm</MenuItem>
                    <MenuItem value="missed">Bỏ lỡ</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={1.5}>
                <DatePicker
                  label="Từ ngày"
                  value={filters.vaccinationDateFrom ? new Date(filters.vaccinationDateFrom) : null}
                  onChange={(date) => handleFilterChange('vaccinationDateFrom', date ? date.toISOString() : '')}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <DatePicker
                  label="Đến ngày"
                  value={filters.vaccinationDateTo ? new Date(filters.vaccinationDateTo) : null}
                  onChange={(date) => handleFilterChange('vaccinationDateTo', date ? date.toISOString() : '')}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Tìm kiếm
                </Button>
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  fullWidth
                >
                  Xóa bộ lọc
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Participations Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Danh sách tham gia ({participations.length} học sinh)
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : participations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Chưa có học sinh nào tham gia
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Học sinh</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Phụ huynh đồng ý</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ngày đồng ý</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Trạng thái tiêm</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ngày tiêm</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ghi chú Phụ huynh</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ghi chú Y tá</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {participations.map((participation) => (
                        <TableRow key={participation._id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                <PersonIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {participation.student?.name || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {participation.student?.studentCode || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getConsentText(participation.parentConsent)}
                              color={getConsentColor(participation.parentConsent)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {formatDate(participation.parentConsentDate)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(participation.vaccinationStatus)}
                              color={getStatusColor(participation.vaccinationStatus)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {formatDateTime(participation.vaccinationDate)}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{
                              maxWidth: 150,
                              overflow: 'initial',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              title: participation.parentNote || 'Không có ghi chú'
                            }}>
                              {participation.parentNote || 'Không có ghi chú'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{
                              maxWidth: 150,
                              overflow: 'initial',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              title: participation.nurseNote || 'Không có ghi chú'
                            }}>
                              {participation.nurseNote || 'Không có ghi chú'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {participation.parentConsent === 'approved' &&
                              participation.vaccinationStatus === 'scheduled' && (
                                <Tooltip title="Ghi nhận kết quả tiêm">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => openRecordingDialog(participation)}
                                  >
                                    <MedicalIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>                {/* Pagination */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={paginationInfo.totalPages}
                    page={paginationInfo.page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </>
            )}
          </CardContent>        </Card>

        {/* Recording Vaccination Dialog */}
        <Dialog open={recordingDialog} onClose={() => setRecordingDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalIcon sx={{ mr: 2 }} />
              Ghi nhận kết quả tiêm chủng
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedParticipation && (
              <Box sx={{ pt: 2 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Học sinh: <strong>{selectedParticipation.student?.name}</strong> ({selectedParticipation.student?.studentCode})
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Kết quả tiêm</InputLabel>
                      <Select
                        value={recordingData.status}
                        label="Kết quả tiêm"
                        onChange={(e) => setRecordingData({ ...recordingData, status: e.target.value })}
                      >
                        <MenuItem value="completed">Đã tiêm thành công</MenuItem>
                        <MenuItem value="missed">Bỏ lỡ</MenuItem>
                        <MenuItem value="cancelled">Hủy tiêm</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {recordingData.status === 'completed' && (
                    <Grid item xs={12}>
                      <DateTimePicker
                        label="Ngày giờ tiêm"
                        value={recordingData.vaccinationDate}
                        onChange={(newValue) => setRecordingData({ ...recordingData, vaccinationDate: newValue })}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Ghi chú của y tá"
                      value={recordingData.note}
                      onChange={(e) => setRecordingData({ ...recordingData, note: e.target.value })}
                      placeholder="Ghi chú về phản ứng sau tiêm, tình trạng sức khỏe..."
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRecordingDialog(false)} startIcon={<CancelIcon />}>
              Hủy
            </Button>
            <Button
              onClick={handleRecordVaccination}
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Lưu kết quả
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default VaccinationParticipationsPage;
