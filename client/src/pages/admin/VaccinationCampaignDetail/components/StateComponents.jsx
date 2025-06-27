import React from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
} from '@mui/icons-material';

export const LoadingState = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    </Container>
  );
};

export const ErrorState = ({ error, onBack }) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
      <Button
        variant="contained"
        startIcon={<BackIcon />}
        onClick={onBack}
      >
        Quay lại danh sách
      </Button>
    </Container>
  );
};

export const NotFoundState = ({ onBack }) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Alert severity="warning" sx={{ mb: 2 }}>
        Không tìm thấy thông tin chiến dịch tiêm chủng
      </Alert>
      <Button
        variant="contained"
        startIcon={<BackIcon />}
        onClick={onBack}
      >
        Quay lại danh sách
      </Button>
    </Container>
  );
};
