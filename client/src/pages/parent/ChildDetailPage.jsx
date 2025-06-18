import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Button,
    IconButton,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Avatar,
    Badge
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    LocalHospital,
    Person,
    FavoriteOutlined,
    Timeline,
    Cake,
    School,
    MedicalInformation,
    Visibility,
    Warning,
    AccessibleForward
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import healthProfileAPI from '../../api/healthProfileApi';

const ChildDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [child, setChild] = useState({});
    const [healthProfiles, setHealthProfiles] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await healthProfileAPI.getByChildId(id);
                console.log("res", response);
                if (response && response.data && response.data.records && response.data.records.length > 0) {
                    setHealthProfiles(response.data.records);
                    setChild(response.data.records[0].studentId);
                } else {
                    // If no health profiles, try to get child info directly
                    const childResponse = await childApi.getChildById(id);
                    setChild(childResponse.data || childResponse);
                    setHealthProfiles([]);
                }
            } catch (err) {
                setError('Không thể tải thông tin con em');
                toast.error('❌ Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !child) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || 'Không tìm thấy thông tin con em'}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/parent')}
                >
                    Quay lại trang chủ
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Paper elevation={0} sx={{
                    p: 3,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => navigate('/parent')}
                            sx={{ mr: 2, color: 'white' }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
                            {child.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {child.name}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Thông tin chi tiết và hồ sơ sức khỏe
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Grid container spacing={3}>
                    {/* Child Basic Information */}
                    <Grid item xs={12} lg={4}>
                        <Card elevation={3} sx={{ height: 'fit-content' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Person sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                        Thông tin cơ bản
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Cake sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Ngày sinh
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6">
                                        {new Date(child.birthdate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Giới tính
                                    </Typography>
                                    <Typography variant="h6">
                                        {child.gender === 'male' ? 'Nam' : child.gender === 'female' ? 'Nữ' : 'Khác'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <School sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Mã học sinh
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6">
                                        {child.studentCode}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Mã bảo hiểm y tế
                                    </Typography>
                                    <Typography variant="h6">
                                        {child.medicalConverageId}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Trạng thái
                                    </Typography>
                                    <Chip
                                        label={child.isActive ? 'Đang học' : 'Không hoạt động'}
                                        color={child.isActive ? 'success' : 'default'}
                                        sx={{ mt: 1 }}
                                    />
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        onClick={() => navigate(`/parent/children/${id}/edit`)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<FavoriteOutlined />}
                                        onClick={() => navigate(`/parent/health/profiles/${id}`)}
                                    >
                                        Hồ sơ sức khỏe
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Health Profiles */}
                    <Grid item xs={12} lg={8}>
                        <Card elevation={3}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <LocalHospital sx={{ fontSize: 32, color: '#f44336', mr: 2 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                                            Hồ sơ sức khỏe
                                        </Typography>
                                        <Badge badgeContent={healthProfiles.length} color="primary" sx={{ ml: 2 }} />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<Timeline />}
                                        onClick={() => navigate(`/parent/health/profiles/${id}`)}
                                    >
                                        Xem tất cả
                                    </Button>
                                </Box>

                                {healthProfiles.length === 0 ? (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 6,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <FavoriteOutlined sx={{ fontSize: 64, color: 'text.secondary' }} />
                                        <Typography variant="h6" color="text.secondary">
                                            Chưa có hồ sơ sức khỏe
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Hồ sơ sức khỏe sẽ được tạo tự động khi có khám sức khỏe
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {healthProfiles.map((profile, index) => (
                                            <Grid item xs={12} key={profile._id}>
                                                <Paper
                                                    sx={{
                                                        p: 3,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: 4
                                                        }
                                                    }}
                                                    onClick={() => navigate(`/parent/health/profiles/${id}?profileId=${profile._id}`)}
                                                >
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} md={8}>
                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                                                                📋 Hồ sơ khám sức khỏe #{index + 1}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                Ngày tạo: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                                                            </Typography>

                                                            <Grid container spacing={2}>
                                                                <Grid item xs={6} sm={3}>
                                                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">Chiều cao</Typography>
                                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                            {profile.height} cm
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={6} sm={3}>
                                                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f3e5f5', borderRadius: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">Cân nặng</Typography>
                                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                            {profile.weight} kg
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={6} sm={3}>
                                                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">Nhóm máu</Typography>
                                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                            {profile.bloodType}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={6} sm={3}>
                                                                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                                                                        <Typography variant="body2" color="text.secondary">Thị lực</Typography>
                                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                            {profile.vision || 'N/A'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>

                                                            {/* Additional Health Info */}
                                                            <Box sx={{ mt: 2 }}>
                                                                {profile.allergies && profile.allergies !== '1' && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Warning sx={{ mr: 1, color: '#ff9800' }} />
                                                                        <Typography variant="body2" sx={{ color: '#ff9800' }}>
                                                                            <strong>Dị ứng:</strong> {profile.allergies}
                                                                        </Typography>
                                                                    </Box>
                                                                )}

                                                                {profile.chronicDiseases && profile.chronicDiseases !== '1' && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <MedicalInformation sx={{ mr: 1, color: '#d32f2f' }} />
                                                                        <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                                                                            <strong>Bệnh mãn tính:</strong> {profile.chronicDiseases}
                                                                        </Typography>
                                                                    </Box>
                                                                )}

                                                                {profile.devicesSupport && profile.devicesSupport !== '1' && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <AccessibleForward sx={{ mr: 1, color: 'text.secondary' }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            <strong>Thiết bị hỗ trợ:</strong> {profile.devicesSupport}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </Grid>

                                                        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Chip
                                                                    label="Hồ sơ đầy đủ"
                                                                    color="success"
                                                                    sx={{ mb: 2 }}
                                                                />
                                                                <Typography variant="caption" display="block" color="text.secondary">
                                                                    Cập nhật lần cuối:
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {new Date(profile.updatedAt).toLocaleDateString('vi-VN')}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ChildDetailPage;
