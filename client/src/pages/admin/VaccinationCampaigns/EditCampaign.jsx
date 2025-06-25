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
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
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
    targetAudience: '',
    startDate: null,
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
    onSuccess: () => {      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['vaccination-campaigns-search'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });

      // Navigate back to detail page
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
        targetAudience: campaign.targetAudience || '',
        startDate: campaign.startDate ? new Date(campaign.startDate) : null,
        status: campaign.status || 'planned',
      });
    }
  }, [initialCampaignData, campaignData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
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



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    } const submitData = {
      vaccineName: formData.vaccineName,
      vaccineType: formData.vaccineType,
      targetAudience: formData.targetAudience,
      startDate: formData.startDate ? formData.startDate.toISOString() : null,
      status: formData.status,
    };

    updateMutation.mutate(submitData);
  };
  const handleCancel = () => {
    navigate(`/admin/vaccination-campaigns/${campaignId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={() => navigate('/admin/vaccination-campaigns')}
        >
          Quản lý Chiến dịch
        </Link>
        <Link
          color="inherit"
          href="#" onClick={() => navigate(`/admin/vaccination-campaigns/${campaignId}`)}
        >
          Chi tiết chiến dịch
        </Link>
        <Typography color="text.primary">Chỉnh sửa</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" />
          Chỉnh sửa Chiến dịch Tiêm chủng
        </Typography>
      </Box>

      {/* Form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Vaccine Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên vaccine *"
                  value={formData.vaccineName}
                  onChange={(e) => handleInputChange('vaccineName', e.target.value)}
                  error={!!errors.vaccineName}
                  helperText={errors.vaccineName}
                />
              </Grid>

              {/* Vaccine Type */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loại vaccine *"
                  value={formData.vaccineType}
                  onChange={(e) => handleInputChange('vaccineType', e.target.value)}
                  error={!!errors.vaccineType}
                  helperText={errors.vaccineType}
                />
              </Grid>

              {/* Target Audience */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Đối tượng mục tiêu *"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  error={!!errors.targetAudience}
                  helperText={errors.targetAudience}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={formData.status}
                    label="Trạng thái"
                    onChange={(e) => handleInputChange('status', e.target.value)}                  >
                    <MenuItem value="planned">Đã lên kế hoạch</MenuItem>
                    <MenuItem value="ongoing">Đang hoạt động</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                    <MenuItem value="pending">Chờ xử lý</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Start Date */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                  <DatePicker
                    label="Ngày bắt đầu *"
                    value={formData.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate,
                      }
                    }}
                  />
                </LocalizationProvider>              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    disabled={updateMutation.isPending}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>          {/* Error/Success Messages */}
          {updateMutation.isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Có lỗi xảy ra khi cập nhật chiến dịch. Vui lòng thử lại.
              {updateMutation.error?.response?.data?.message && (
                <>
                  <br />
                  {updateMutation.error.response.data.message}
                </>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditCampaign
