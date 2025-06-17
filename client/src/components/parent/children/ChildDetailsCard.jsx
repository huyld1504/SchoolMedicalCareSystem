import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Button,
    Chip
} from '@mui/material';
import {
    RequestPage
} from '@mui/icons-material';

const ChildDetailsCard = ({ child, onCreateOrder }) => {
    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <Box>
            {/* Breadcrumb */}
            <Typography variant="h5" sx={{
                mb: 3,
                fontWeight: 'bold',
                color: '#1976d2'
            }}>
                📋 Thông tin chi tiết - {child.name}
            </Typography>

            <Grid container spacing={3}>
                {/* Thông tin cá nhân */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid #e3f2fd'
                    }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="#1976d2">
                            Thông tin cá nhân
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: '#f8fafc',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                    Họ và tên:
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {child.name}
                                </Typography>
                            </Box>

                            <Box sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: '#f8fafc',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                    Ngày sinh:
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {new Date(child.birthdate).toLocaleDateString('vi-VN')}
                                    ({calculateAge(child.birthdate)} tuổi)
                                </Typography>
                            </Box>

                            <Box sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: '#f8fafc',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                    Giới tính:
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {child.gender === 'male' ? 'Nam' : 'Nữ'}
                                </Typography>
                            </Box>

                            <Box sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: '#f8fafc',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                    Mã học sinh:
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {child.studentCode}
                                </Typography>
                            </Box>

                            <Box sx={{
                                p: 2,
                                backgroundColor: '#f8fafc',
                                borderRadius: 2,
                                border: '1px solid #e2e8f0'
                            }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                    Mã bảo hiểm:
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                    {child.medicalConverageId}
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* Thống kê sức khỏe */}
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid #e3f2fd'
                    }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="#1976d2">
                            Thống kê sức khỏe
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{
                                mb: 3,
                                textAlign: 'center',
                                p: 3,
                                backgroundColor: '#e8f5e8',
                                borderRadius: 3,
                                border: '1px solid #c8e6c9'
                            }}>
                                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                    Tình trạng sức khỏe tổng quan
                                </Typography>
                                <Chip
                                    label="Tốt"
                                    color="success"
                                    size="large"
                                    sx={{
                                        fontSize: '1rem',
                                        py: 2,
                                        px: 3,
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => onCreateOrder(child)}
                                startIcon={<RequestPage />}
                                sx={{
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#1976d2',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                                    }
                                }}
                                fullWidth
                            >
                                Yêu Cầu Đơn Thuốc
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChildDetailsCard;
