import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import vaccinationCampaignApi from "../../../../api/vaccinationCampaignApi";

const CreateCampaignForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    vaccineName: "",
    vaccineType: "",
    targetAudience: "",
    status: "planned",
  });

  const [startDate, setStartDate] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); try {
      // Validate required fields
      if (!formData.vaccineName.trim()) {
        throw new Error("Tên vaccine là bắt buộc");
      }
      if (!formData.vaccineType.trim()) {
        throw new Error("Loại vaccine là bắt buộc");
      }
      if (!startDate) {
        throw new Error("Ngày bắt đầu là bắt buộc");
      }

      const campaignData = {
        ...formData,
        startDate: startDate.toISOString(),
      };

      console.log('Creating campaign with data:', campaignData);

      // Since we don't have a create API method yet, we'll simulate it
      // In real implementation, this would be:
      // const response = await vaccinationCampaignApi.createCampaign(campaignData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Tạo chiến dịch tiêm chủng thành công!");
      onSuccess();

      // Reset form
      setFormData({
        vaccineName: "",
        vaccineType: "",
        targetAudience: "",
        status: "planned",
      });
      setStartDate(null);

    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.message || "Có lỗi xảy ra khi tạo chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}      <Grid container spacing={2}>
        {/* Vaccine Name */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Tên vaccine"
            value={formData.vaccineName}
            onChange={(e) => handleInputChange('vaccineName', e.target.value)}
            placeholder="Nhập tên vaccine"
          />
        </Grid>

        {/* Vaccine Type */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Loại vaccine"
            value={formData.vaccineType}
            onChange={(e) => handleInputChange('vaccineType', e.target.value)}
            placeholder="VD: Pfizer, Moderna, AstraZeneca..."
          />
        </Grid>

        {/* Target Audience */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Đối tượng mục tiêu"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="VD: học sinh trong trường, học sinh lớp 12..."
          />
        </Grid>

        {/* Status */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={formData.status}
              label="Trạng thái"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <MenuItem value="planned">Đã lên kế hoạch</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date */}
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <DatePicker
              label="Ngày bắt đầu *"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Đang tạo...' : 'Tạo chiến dịch'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCampaignForm;
