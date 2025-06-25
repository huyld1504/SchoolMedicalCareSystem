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
import { useNavigate, useParams } from 'react-router';
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
  const [campaign, setCampaign] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho query gọi API (theo pattern của các trang nurse khác)
  const [query, setQuery] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    consentStatus: '',
    vaccinationStatus: '',
    vaccinationDate: ''
  });

  // State cho pagination
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // State cho search input
  const [searchInput, setSearchInput] = useState('');

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

  // Load participations khi query thay đổi
  useEffect(() => {
    loadParticipations();
  }, [campaignId, query.page, query.limit, query.keyword, query.consentStatus, query.vaccinationStatus, query.vaccinationDate]); const loadParticipations = async () => {
    try {
      setLoading(true);

      console.log('Participation search query:', query);

      const response = await vaccinationApi.campaigns.getParticipations(campaignId, query);

      if (response?.isSuccess) {
        setParticipations(response?.data?.records || []);
        setPaginationInfo({
          total: response?.data?.total || 0,
          page: response?.data?.page || 1,
          limit: response?.data?.limit || 20,
          totalPages: response?.data?.totalPages || 0
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

  // Search handlers
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    setQuery(prev => ({
      ...prev,
      keyword: searchInput,
      page: 1 // Reset về page 1 khi search
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    setQuery(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Filter handlers
  const handleFilterClear = () => {
    setSearchInput('');
    setQuery({
      page: 1,
      limit: 20,
      keyword: '',
      consentStatus: '',
      vaccinationStatus: '',
      vaccinationDate: ''
    });
  };

  const handleFilterChange = (field, value) => {
    setQuery(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filter changes
    }));
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
              {/* <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  placeholder="Tên học sinh"
                  value={query.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </Grid> */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Đồng ý PH</InputLabel>
                  <Select
                    value={query.consentStatus}
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
                    value={query.vaccinationStatus}
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

              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={handleFilterClear}
                  fullWidth
                >
                  Xóa
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
