import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Container,
  Chip,
  Stack,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Vaccines as VaccinesIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import vaccinationCampaignApi from '../../../api/vaccinationCampaignApi';

const EditCampaign = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Get initial data from navigation state or fetch from API
  const initialCampaignData = location.state?.campaignData;
  const [formData, setFormData] = useState({
    vaccineName: '',
    vaccineType: '',
    vaccineDescription: '',
    injection: '',
    dosage: '',
    targetAudience: '',
    startDate: null,
    endDate: null,
    status: 'planned'
  });

  const [errors, setErrors] = useState({});

  // Fetch campaign data if not provided in navigation state
  const { data: campaignData, isLoading } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => vaccinationCampaignApi.getCampaignById(campaignId),
    enabled: !initialCampaignData,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => vaccinationCampaignApi.updateCampaign(campaignId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-campaigns-search'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      navigate(`/admin/vaccination-campaigns/${campaignId}`, {
        replace: true,
      });
    },
    onError: (error) => {
      console.error('Error updating campaign:', error);
    },
  });

  // Initialize form data when campaign data is available
  useEffect(() => {
    const campaign = initialCampaignData || campaignData?.data;
    if (campaign) {
      setFormData({
        vaccineName: campaign.vaccineName || '',
        vaccineType: campaign.vaccineType || '',
        vaccineDescription: campaign.vaccineDescription || '',
        injection: campaign.injection || '',
        dosage: campaign.dosage || '',
        targetAudience: campaign.targetAudience || '',
        startDate: campaign.startDate ? new Date(campaign.startDate) : null,
        endDate: campaign.endDate ? new Date(campaign.endDate) : null,
        status: campaign.status || 'planned',
      });
    }
  }, [initialCampaignData, campaignData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vaccineName.trim()) {
      newErrors.vaccineName = 'Tên vaccine là bắt buộc';
    }

    if (!formData.vaccineType.trim()) {
      newErrors.vaccineType = 'Loại vaccine là bắt buộc';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Đối tượng mục tiêu là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      vaccineName: formData.vaccineName,
      vaccineType: formData.vaccineType,
      vaccineDescription: formData.vaccineDescription,
      injection: formData.injection,
      dosage: formData.dosage,
      targetAudience: formData.targetAudience,
      startDate: formData.startDate ? formData.startDate.toISOString() : null,
      endDate: formData.endDate ? formData.endDate.toISOString() : null,
      status: formData.status,
    };

    updateMutation.mutate(submitData);
  };

  const handleCancel = () => {
    navigate(`/admin/vaccination-campaigns`);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      planned: 'info',
      ongoing: 'success',
      completed: 'primary',
      canceled: 'error',
      pending: 'warning'
    };
    return statusColors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      planned: 'Đã lên kế hoạch',
      ongoing: 'Đang hoạt động',
      completed: 'Hoàn thành',
      canceled: 'Đã hủy',
      pending: 'Chờ xử lý'
    };
    return statusLabels[status] || status;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}>
          <CircularProgress size={48} thickness={4} />
          <Typography variant="body1" color="text.secondary">
            Đang tải dữ liệu chiến dịch...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Breadcrumbs separator="›" sx={{ fontSize: '0.875rem' }}>
            <Link
              color="inherit"
              href="#"
              onClick={() => navigate('/admin/vaccination-campaigns')}
              sx={{ 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Quản lý Chiến dịch
            </Link>
            <Link
              color="inherit"
              href="#"
              onClick={() => navigate(`/admin/vaccination-campaigns/${campaignId}`)}
              sx={{ 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Chi tiết chiến dịch
            </Link>
            <Typography color="primary" fontWeight={500}>
              Chỉnh sửa
            </Typography>
          </Breadcrumbs>
        </Paper>

        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              variant="outlined"
              sx={{ 
                minWidth: 'auto',
                borderRadius: 2,
                px: 2
              }}
            >
              Quay lại
            </Button>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                <EditIcon fontSize="large" />
                Chỉnh sửa Chiến dịch Tiêm chủng
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Cập nhật thông tin chi tiết cho chiến dịch tiêm chủng
              </Typography>
            </Box>
            {formData.status && (
              <Chip 
                label={getStatusLabel(formData.status)}
                color={getStatusColor(formData.status)}
                variant="filled"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Stack>
        </Paper>

        {/* Form */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h6" fontWeight={600}>
              Thông tin Chiến dịch
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Điền đầy đủ thông tin để cập nhật chiến dịch tiêm chủng
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <VaccinesIcon color="primary" />
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Thông tin Vaccine
                  </Typography>
                </Stack>
                
                <Grid container spacing={8}>
                  <Grid item xs={12} md={6} width={'300px'}>
                    <TextField
                      fullWidth
                      label="Tên vaccine"
                      value={formData.vaccineName}
                      onChange={(e) => handleInputChange('vaccineName', e.target.value)}
                      error={!!errors.vaccineName}
                      helperText={errors.vaccineName}
                      required
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Loại vaccine"
                      value={formData.vaccineType}
                      onChange={(e) => handleInputChange('vaccineType', e.target.value)}
                      error={!!errors.vaccineType}
                      helperText={errors.vaccineType}
                      required
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} width={'300px'}>
                    <TextField
                      fullWidth
                      label="Mô tả vaccine"
                      multiline
                      rows={3}
                      value={formData.vaccineDescription}
                      onChange={(e) => handleInputChange('vaccineDescription', e.target.value)}
                      placeholder="Nhập mô tả chi tiết về vaccine và tác dụng..."
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Medical Information Section */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <DescriptionIcon color="primary" />
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Thông tin Y tế
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Số mũi tiêm"
                      value={formData.injection}
                      onChange={(e) => handleInputChange('injection', e.target.value)}
                      placeholder="Ví dụ: Tiêm bắp, Tiêm dưới da..."
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={8} >
                    <TextField
                      fullWidth
                      label="Liều lượng"
                      value={formData.dosage}
                      onChange={(e) => handleInputChange('dosage', e.target.value)}
                      placeholder="Ví dụ: 0.5ml, 1 liều..."
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Target & Schedule Section */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <GroupIcon color="primary" />
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Đối tượng & Lịch trình
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} width={'300px'}>
                    <TextField
                      fullWidth
                      label="Đối tượng mục tiêu"
                      value={formData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      error={!!errors.targetAudience}
                      helperText={errors.targetAudience}
                      required
                      placeholder="Ví dụ: Trẻ em 6-24 tháng tuổi..."
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} width={'300px'}>
                    <FormControl 
                      fullWidth 
                      variant="outlined"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        value={formData.status}
                        label="Trạng thái"
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <MenuItem value="planned">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                            <span>Đã lên kế hoạch</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="ongoing">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                            <span>Đang hoạt động</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="completed">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                            <span>Hoàn thành</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="canceled">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                            <span>Đã hủy</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="pending">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                            <span>Chờ xử lý</span>
                          </Stack>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Date Section */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <EventIcon color="primary" />
                  <Typography variant="h6" fontWeight={600} color="primary">
                    Thời gian thực hiện
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                      <DatePicker
                        label="Ngày bắt đầu"
                        value={formData.startDate}
                        onChange={(date) => handleInputChange('startDate', date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.startDate,
                            helperText: errors.startDate,
                            required: true,
                            sx: { 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                      <DatePicker
                        label="Ngày kết thúc"
                        value={formData.endDate}
                        onChange={(date) => handleInputChange('endDate', date)}
                        minDate={formData.startDate || undefined}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.endDate,
                            helperText: errors.endDate,
                            sx: { 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                  mt: 4
                }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    disabled={updateMutation.isPending}
                    sx={{ 
                      minWidth: 140,
                      borderRadius: 2,
                      py: 1.5
                    }}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={updateMutation.isPending}
                    sx={{ 
                      minWidth: 140,
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                      }
                    }}
                  >
                    {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Stack>
              </Paper>
            </form>

            {/* Error/Success Messages */}
            {updateMutation.isError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Có lỗi xảy ra khi cập nhật chiến dịch
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Vui lòng kiểm tra lại thông tin và thử lại.
                </Typography>
                {updateMutation.error?.response?.data?.message && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Chi tiết: {updateMutation.error.response.data.message}
                  </Typography>
                )}
              </Alert>
            )}
          </CardContent>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditCampaign;
