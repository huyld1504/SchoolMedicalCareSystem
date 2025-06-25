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
  InputAdornment
} from '@mui/material';
import {
  Vaccines as VaccinesIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon
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
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  // Load campaigns
  useEffect(() => {
    loadCampaigns();
  }, [page, searchTerm]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { keyword: searchTerm })
      };

      const response = await vaccinationApi.campaigns.search(params);
      console.log(response)

      if (response?.isSuccess) {
        setCampaigns(response?.data?.records || []);
        setTotalPages(response?.data?.totalPages || 1);
        console.log(response?.data?.records)
        console.log('campaign ne: ', campaigns)
      } else {
        setCampaigns([]);
        toast.error('Không thể tải danh sách chiến dịch');
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
      setCampaigns([]);
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
  };

  const handleViewParticipations = (campaign) => {
    navigate(`/nurse/vaccination-campaigns/${campaign._id}/participations`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm theo tên vaccine hoặc mô tả..."
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
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => toast.info('Tính năng lọc đang được phát triển')}
                  >
                    Lọc
                  </Button>
                </Box>
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
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Tên vaccine</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{selectedCampaign.vaccineName}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Ngày bắt đầu</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedCampaign.startDate)}</Typography>

                  <Typography variant="subtitle2" gutterBottom>Ngày kết thúc</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedCampaign.endDate)}</Typography>
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
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default VaccinationCampaignsPage;
