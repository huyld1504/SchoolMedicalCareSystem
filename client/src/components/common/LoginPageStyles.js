import { styled } from '@mui/material/styles';
import { Container, Paper, Box } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

export const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(2),
}));

export const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const LogoIcon = styled(LocalHospital)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));