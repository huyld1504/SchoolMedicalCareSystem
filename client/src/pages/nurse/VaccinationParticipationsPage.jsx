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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Vaccines as VaccinesIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  MedicalServices as MedicalIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import vaccinationApi from '../../api/vaccinationApi';

const VaccinationParticipationsPage = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [consentFilter, setConsentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  // Recording vaccination state
  const [recordingDialog, setRecordingDialog] = useState(false);
  const [selectedParticipation, setSelectedParticipation] = useState(null);
  const [recordingData, setRecordingData] = useState({
    status: 'completed',
    vaccinationDate: new Date(),
    note: ''
  });

  // Load campaign and participations
  useEffect(() => {
    loadCampaignDetails();
    loadParticipations();
  }, [campaignId, page, searchTerm, statusFilter, consentFilter]);

  const loadCampaignDetails = async () => {
    try {
      const response = await vaccinationApi.campaigns.getById(campaignId);
      if (response?.isSuccess) {
        setCampaign(response?.data);
        toast.success('Tải thông tin chiến dịch thành công');
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error('Không thể tải thông tin chiến dịch');
    }
  };

  const loadParticipations = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(searchTerm && { keyword: searchTerm }),
        ...(statusFilter !== 'all' && { vaccinationStatus: statusFilter }),
        ...(consentFilter !== 'all' && { parentConsent: consentFilter })
      };

      const response = await vaccinationApi.campaigns.getParticipations(campaignId, params);

      if (response?.isSuccess) {
        setParticipations(response?.data?.records || []);
        setTotalPages(response?.data?.totalPages || 1);
      } else {
        setParticipations([]);
      }
    } catch (error) {
      console.error('Error loading participations:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      setParticipations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVaccination = async () => {
    try {
      const response = await vaccinationApi.participations.recordVaccination(
        selectedParticipation._id,
        recordingData
      );

      if (response.data && response.data.success) {
        toast.success('Đã ghi nhận kết quả tiêm chủng');
        setRecordingDialog(false);
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

  // Filter participations by tab
  const getFilteredParticipations = () => {
    switch (tabValue) {
      case 0: // Tất cả
        return participations;
      case 1: // Chờ phản hồi
        return participations.filter(p => p.parentConsent === 'pending');
      case 2: // Đã đồng ý
        return participations.filter(p => p.parentConsent === 'approved');
      case 3: // Đã tiêm
        return participations.filter(p => p.vaccinationStatus === 'completed');
      default:
        return participations;
    }
  };

  const filteredParticipations = getFilteredParticipations();

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
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái đồng ý</InputLabel>
                  <Select
                    value={consentFilter}
                    label="Trạng thái đồng ý"
                    onChange={(e) => setConsentFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="pending">Chờ phản hồi</MenuItem>
                    <MenuItem value="approved">Đã đồng ý</MenuItem>
                    <MenuItem value="denied">Từ chối</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái tiêm</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Trạng thái tiêm"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                    <MenuItem value="completed">Đã tiêm</MenuItem>
                    <MenuItem value="missed">Bỏ lỡ</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Tabs */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ px: 2 }}>
              <Tab label={`Tất cả (${participations.length})`} />
              <Tab label={`Chờ phản hồi (${participations.filter(p => p.parentConsent === 'pending').length})`} />
              <Tab label={`Đã đồng ý (${participations.filter(p => p.parentConsent === 'approved').length})`} />
              <Tab label={`Đã tiêm (${participations.filter(p => p.vaccinationStatus === 'completed').length})`} />
            </Tabs>
          </CardContent>
        </Card>

        {/* Participations Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Danh sách tham gia ({filteredParticipations.length} học sinh)
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredParticipations.length === 0 ? (
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
                        <TableCell sx={{ fontWeight: 600 }}>Ghi chú PH</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredParticipations.map((participation) => (
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
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
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
                </TableContainer>

                {/* Pagination */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, newPage) => setPage(newPage)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </>
            )}
          </CardContent>
        </Card>

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
