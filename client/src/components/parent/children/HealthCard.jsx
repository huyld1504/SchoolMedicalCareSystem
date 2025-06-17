import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Button,
    Alert
} from '@mui/material';
import {
    LocalHospital,
    Warning,
    Favorite,
    Height,
    MonitorWeight,
    Visibility,
    BloodtypeOutlined
} from '@mui/icons-material';

const HealthCard = ({ profile, child }) => {
    if (!profile) {
        return (
            <Card sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #e3f2fd'
            }}>
                <Warning sx={{ fontSize: 60, color: 'warning.main', mb: 1.5 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Chưa có hồ sơ sức khỏe
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Vui lòng liên hệ y tá trường để tạo hồ sơ sức khỏe cho {child?.name}
                </Typography>
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<LocalHospital />}
                    sx={{
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' }
                    }}
                >
                    Liên hệ Y tá
                </Button>
            </Card>
        );
    }

    return (
        <Card sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e3f2fd'
        }}>
            <Typography variant="h6" gutterBottom sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                color: '#1976d2',
                fontWeight: 'bold'
            }}>
                <Favorite sx={{ mr: 1, color: 'error.main', fontSize: 24 }} />
                Hồ sơ sức khỏe - {child?.name}
            </Typography>

            <Grid container spacing={3}>
                {profile.height && (
                    <Grid item xs={6} sm={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 3,
                            backgroundColor: '#e3f2fd',
                            borderRadius: 3,
                            border: '1px solid #bbdefb'
                        }}>
                            <Height sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                                {profile.height} cm
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="500">
                                Chiều cao
                            </Typography>
                        </Box>
                    </Grid>
                )}

                {profile.weight && (
                    <Grid item xs={6} sm={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 3,
                            backgroundColor: '#e8f5e8',
                            borderRadius: 3,
                            border: '1px solid #c8e6c9'
                        }}>
                            <MonitorWeight sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                {profile.weight} kg
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="500">
                                Cân nặng
                            </Typography>
                        </Box>
                    </Grid>
                )}

                {profile.bloodType && (
                    <Grid item xs={6} sm={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 3,
                            backgroundColor: '#ffebee',
                            borderRadius: 3,
                            border: '1px solid #ffcdd2'
                        }}>
                            <BloodtypeOutlined sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                            <Typography variant="h4" fontWeight="bold" color="error.main">
                                {profile.bloodType}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="500">
                                Nhóm máu
                            </Typography>
                        </Box>
                    </Grid>
                )}

                {profile.vision && (
                    <Grid item xs={6} sm={3}>
                        <Box sx={{
                            textAlign: 'center',
                            p: 3,
                            backgroundColor: '#e1f5fe',
                            borderRadius: 3,
                            border: '1px solid #b3e5fc'
                        }}>
                            <Visibility sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                            <Typography variant="h4" fontWeight="bold" color="info.main">
                                {profile.vision}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="500">
                                Thị lực
                            </Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Thông tin đặc biệt */}
            {(profile.allergies || profile.chronicDiseases || profile.devicesSupport) && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" color="#1976d2">
                        Thông tin đặc biệt
                    </Typography>
                    {profile.allergies && (
                        <Alert severity="warning" sx={{ mb: 2, fontSize: '1rem' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Dị ứng:</Typography>
                            <Typography variant="body1">{profile.allergies}</Typography>
                        </Alert>
                    )}
                    {profile.chronicDiseases && (
                        <Alert severity="info" sx={{ mb: 2, fontSize: '1rem' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Bệnh mãn tính:</Typography>
                            <Typography variant="body1">{profile.chronicDiseases}</Typography>
                        </Alert>
                    )}
                    {profile.devicesSupport && (
                        <Alert severity="error" sx={{ mb: 2, fontSize: '1rem' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Thiết bị hỗ trợ:</Typography>
                            <Typography variant="body1">{profile.devicesSupport}</Typography>
                        </Alert>
                    )}
                </Box>
            )}
        </Card>
    );
};

export default HealthCard;
