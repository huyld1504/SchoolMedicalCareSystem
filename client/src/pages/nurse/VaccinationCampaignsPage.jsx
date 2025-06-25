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
  InputAdornment, FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Vaccines as VaccinesIcon,
  Visibility as ViewIcon,
  Edit as EditIcon, Search as SearchIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Clear as ClearIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ca, vi } from 'date-fns/locale';
import vaccinationApi from '../../api/vaccinationApi';

const VaccinationCampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // State cho query gọi API (theo pattern của các trang nurse khác)
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    keyword: '',
    status: '',
    startDateFrom: '',
    startDateTo: ''
  });

  // State cho pagination
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  // State cho search input
  const [searchInput, setSearchInput] = useState('');

  // State riêng cho date picker
  const [dateFromValue, setDateFromValue] = useState(null);
  const [dateToValue, setDateToValue] = useState(null);// Load campaigns khi query thay đổi
  useEffect(() => {
    loadCampaigns();
  }, [query.page, query.limit, query.keyword, query.status, query.startDateFrom, query.startDateTo]); const loadCampaigns = async () => {
    try {
      setLoading(true);
      console.log('Campaign search query:', query);

      const response = await vaccinationApi.campaigns.search(query);
      console.log(response)

      if (response?.isSuccess) {
        setCampaigns(response?.data?.records || []);
        setPaginationInfo({
          total: response?.data?.total || 0,
          page: response?.data?.page || 1,
          limit: response?.data?.limit || 10,
          totalPages: response?.data?.totalPages || 0
        });
        console.log(response?.data?.records)
        console.log('campaign ne: ', campaigns)
      } else {
        setCampaigns([]);
        setPaginationInfo({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
        toast.error('Không thể tải danh sách chiến dịch');
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      setCampaigns([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewCampaign = async (campaign) => {
    try {
      const response = await vaccinationApi.campaigns.getById(campaign._id);
      if (response?.isSuccess) {
        setSelectedCampaign(response.data);
        setDetailDialogOpen(true);
      }
    } catch (error) {
      console.error('Error loading campaign details:', error);
      toast.error('Không thể tải thông tin chi tiết chiến dịch');
    }
  }; const handleViewParticipations = (campaign) => {
    navigate(`/nurse/vaccination-campaigns/${campaign._id}/participations`);
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
  };  // Filter handlers
  const handleFilterChange = (field, value) => {
    setQuery(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset về page 1 khi filter thay đổi
    }));
  };
  const handleFilterClear = () => {
    setSearchInput('');
    setDateFromValue(null);
    setDateToValue(null);
    setQuery({
      page: 1,
      limit: 10,
      keyword: '',
      status: '',
      startDateFrom: '',
      startDateTo: '',
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned': return 'warning';
      case 'ongoing': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'planned': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VaccinesIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                Quản lý Tiêm chủng
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Theo dõi các chiến dịch tiêm chủng
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  placeholder="Tên vaccine, mô tả, v.v."
                  value={query.keyword}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={query.status}
                    label="Trạng thái"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                      '& .MuiSelect-select': { minWidth: '100px' }
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="planned">Sắp diễn ra</MenuItem>
                    <MenuItem value="ongoing">Đang diễn ra</MenuItem>
                    <MenuItem value="completed">Đã hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} md={2}>
                <DatePicker
                  label="Từ ngày"
                  value={query.startDateFrom ? new Date(query.startDateFrom) : null}
                  onChange={(date) => handleFilterChange('startDateFrom', date ? date.toISOString() : '')}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <DatePicker
                  label="Đến ngày"
                  value={query.startDateTo ? new Date(query.startDateTo) : null}
                  onChange={(date) => handleFilterChange('startDateTo', date ? date.toISOString() : '')}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid> */}
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

        {/* Campaigns Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Danh sách chiến dịch tiêm chủng
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : campaigns.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <VaccinesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Chưa có chiến dịch tiêm chủng nào
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Tên vaccine</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Ngày kết thúc</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign._id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <VaccinesIcon sx={{ mr: 2, color: 'primary.main' }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {campaign.vaccineName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{formatDate(campaign.startDate)}</TableCell>
                          <TableCell>{formatDate(campaign.endDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusText(campaign.status)}
                              color={getStatusColor(campaign.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {campaign.description || 'Không có mô tả'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Xem chi tiết">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleViewCampaign(campaign)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Quản lý tham gia">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleViewParticipations(campaign)}
                                >
                                  <AssignmentIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
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
          </CardContent>
        </Card>

        {/* Campaign Detail Dialog */}
        <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <VaccinesIcon sx={{ mr: 2 }} />
              Chi tiết chiến dịch tiêm chủng
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedCampaign && (
              <Grid container spacing={5} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Tên vaccine</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedCampaign.vaccineName}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Loại vaccine</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedCampaign.vaccineType}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Ngày bắt đầu</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedCampaign.startDate)}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Ngày kết thúc</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedCampaign?.endDate)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Trạng thái</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getStatusText(selectedCampaign.status)}
                      color={getStatusColor(selectedCampaign.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>Đối tượng tiêm</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedCampaign.targetAudience}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Ngày tạo</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedCampaign.createdAt)}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Cập nhật lần cuối</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedCampaign.updatedAt)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Mô tả</Typography>
                  <Typography variant="body1">
                    {selectedCampaign.description || 'Không có mô tả'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
            {selectedCampaign && (
              <Button
                variant="contained"
                onClick={() => handleViewParticipations(selectedCampaign)}
              >
                Xem danh sách tham gia
              </Button>)}          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default VaccinationCampaignsPage;
