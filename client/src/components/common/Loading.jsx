import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  gap: theme.spacing(2),
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const Loading = ({ message = "Đang tải...", size = 40 }) => {
  return (
    <LoadingContainer>
      <LoadingSpinner size={size} className="loading-spinner" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </LoadingContainer>
  );
};

export default Loading;
