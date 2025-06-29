import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Avatar
} from '@mui/material';
import {
  Vaccines as VaccinesIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import vaccinationApi from '../../api/vaccinationApi';

const VaccinationOverview = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalParticipations: 0,
    completedVaccinations: 0,
    pendingConsent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVaccinationData();
  }, []);

  const loadVaccinationData = async () => {
    try {
      setLoading(true);

      // Load campaigns
      const campaignsResponse = await vaccinationApi.campaigns.search({ limit: 5 });
      if (campaignsResponse.data && campaignsResponse.data.success) {
        const campaignData = campaignsResponse.data.data.campaigns || [];
        setCampaigns(campaignData);

        // Calculate basic stats
        const activeCampaigns = campaignData.filter(c => c.status === 'active').length;
        setStats(prev => ({
          ...prev,
          totalCampaigns: campaignData.length,
          activeCampaigns: activeCampaigns
        }));
      }
    } catch (error) {
      console.error('Error loading vaccination data:', error);
    } finally {
      setLoading(false);
    }
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

  const calculateProgress = (completed, total) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <Grid container spacing={3}>
      {/* Statistics Cards */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="h6">
                  Chiến dịch đang diễn ra
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  {stats.activeCampaigns}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trên tổng số {stats.totalCampaigns} chiến dịch
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#2e7d32', width: 56, height: 56 }}>
                <VaccinesIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom variant="h6">
                  Tỷ lệ hoàn thành
                </Typography>
                <Typography variant="h4" component="div" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {calculateProgress(stats.completedVaccinations, stats.totalParticipations).toFixed(1)}%
                </Typography>
                <Box sx={{ mt: 1, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(stats.completedVaccinations, stats.totalParticipations)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Box>
              <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                <TrendingUpIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Campaigns Table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Chiến dịch gần đây
              </Typography>
              <IconButton
                color="primary"
                onClick={() => navigate('/nurse/vaccination-campaigns')}
              >
                <ViewIcon />
              </IconButton>
            </Box>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Đang tải dữ liệu...
                </Typography>
              </Box>
            ) : campaigns.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <VaccinesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Chưa có chiến dịch tiêm chủng
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Tên vaccine</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Ngày kết thúc</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
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
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/nurse/vaccination-campaigns/${campaign._id}/participations`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default VaccinationOverview;
