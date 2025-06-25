import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,  // ✅ Đổi tên giống EditCampaign
  Vaccines as VaccineIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const DetailHeader = ({
  onBack,
  onEdit,
  onDelete,
  campaignId,
  campaign
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* ✅ Chỉnh thành Button với startIcon giống EditCampaign */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          
        </Button>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0 }}>
            <VaccineIcon color="primary" />
            Chi tiết Chiến dịch Tiêm chủng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý thông tin chi tiết về chiến dịch tiêm chủng
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          Chỉnh sửa
        </Button>
      </Box>
    </Box>
  );
};

export default DetailHeader;
