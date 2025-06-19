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
    Badge,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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
    const [query, setQuery] = useState({ page: 1 });
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
                    </Box>                </Paper>

                {/* Child Basic Information - Compact Card at Top */}
                <Card elevation={3} sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Person sx={{ fontSize: 24, color: '#1976d2', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Thông tin cơ bản
                            </Typography>
                        </Box>                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ display: 'flex', flex: 1, gap: 4, flexWrap: 'wrap', minWidth: '300px' }}>
                                <Box sx={{ flex: '1 1 150px' }}>
                                    <Typography variant="body2" color="text.secondary">Ngày sinh:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {new Date(child.birthdate).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 120px' }}>
                                    <Typography variant="body2" color="text.secondary">Giới tính:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child.gender === 'male' ? 'Nam' : child.gender === 'female' ? 'Nữ' : 'Khác'}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 150px' }}>
                                    <Typography variant="body2" color="text.secondary">Mã học sinh:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child.studentCode}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 150px' }}>
                                    <Typography variant="body2" color="text.secondary">Mã BHYT:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child.medicalConverageId || 'Chưa có'}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: '1 1 120px' }}>
                                    <Typography variant="body2" color="text.secondary">Trạng thái:</Typography>
                                    <Chip
                                        label={child.isActive ? 'Đang học' : 'Không hoạt động'}
                                        color={child.isActive ? 'success' : 'default'}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() => navigate(`/parent/children/${id}/edit`)}
                                    size="small"
                                >
                                    Chỉnh sửa
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                {/* Health Profiles - Full Width Table */}
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
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Chiều cao (cm)</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Cân nặng (kg)</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Nhóm máu</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Thị lực</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {healthProfiles.map((profile, index) => (
                                            <TableRow
                                                key={profile._id}
                                                sx={{
                                                    '&:hover': { bgcolor: '#f9f9f9' },
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => navigate(`/parent/health/profiles/${id}?profileId=${profile._id}`)}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                                        {profile.height}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                                                        {profile.weight}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={profile.bloodType}
                                                        color="primary"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {profile.vision || 'N/A'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                        {profile.allergies && profile.allergies !== '1' && (
                                                            <Chip
                                                                label={`Dị ứng: ${profile.allergies}`}
                                                                color="warning"
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        {profile.chronicDiseases && profile.chronicDiseases !== '1' && (
                                                            <Chip
                                                                label={`Bệnh mãn tính: ${profile.chronicDiseases}`}
                                                                color="error"
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        {profile.devicesSupport && profile.devicesSupport !== '1' && (
                                                            <Chip
                                                                label={`Thiết bị hỗ trợ: ${profile.devicesSupport}`}
                                                                color="info"
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Visibility />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/parent/health/profiles/${id}?profileId=${profile._id}`);
                                                        }}
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ChildDetailPage;
