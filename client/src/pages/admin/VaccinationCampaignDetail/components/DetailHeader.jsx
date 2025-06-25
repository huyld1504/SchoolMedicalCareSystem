import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
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
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
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
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Xóa
        </Button>
      </Box>
    </Box>
  );
};

export default DetailHeader;
