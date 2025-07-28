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
    Card, CardContent,
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
    AccessibleForward,
    MedicalServices,
    Add,
    Event,
    Medication
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import healthProfileAPI from '../../api/healthProfileApi';
import medicalEventAPI from '../../api/medicalEventApi';
import HealthProfileDetailModal from './HealthProfileDetailModal';
import { removeBrackets, processHealthDataForDisplay } from '../../utils/string.utils';
import {
    getMedicalEventLevelColor,
    getMedicalEventLevelLabel,
    getMedicalEventStatusColor,
    getMedicalEventStatusLabel,
    getMedicalEventTypeColor,
    getMedicalEventTypeLabel,
    getHealthNoteColor,
    getHealthNoteLabel,
    getStudentStatusColor,
    getStudentStatusLabel,
    getBloodTypeColor
} from '../../utils/colorUtils';

const ChildDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); const [child, setChild] = useState({});
    const [healthProfiles, setHealthProfiles] = useState([]);
    const [medicalEvents, setMedicalEvents] = useState([]);
    const [medicalEventsLoading, setMedicalEventsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState(null); useEffect(() => {
        const loadData = async () => {
            try {
                const response = await healthProfileAPI.getByChildId(id);
                console.log("res", response);
                if (response && response.data && response.data.records && response.data.records.length > 0) {
                    // Xử lý data để loại bỏ dấu ngoặc vuông khi hiển thị
                    const processedProfiles = response.data.records.map(profile =>
                        processHealthDataForDisplay(profile)
                    );
                    setHealthProfiles(processedProfiles);
                    setChild(response.data.records[0].studentId);
                } else {
                    // If no health profiles, try to get child info directly
                    const childResponse = await childApi.getChildById(id);
                    setChild(childResponse.data || childResponse);
                    setHealthProfiles([]);
                }

                // Load medical events
                await loadMedicalEvents();
            } catch (err) {
                setError('Không thể tải thông tin con em');
                toast.error('❌ Có lỗi xảy ra khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const loadMedicalEvents = async () => {
        try {
            setMedicalEventsLoading(true);
            const response = await medicalEventAPI.getEventsByStudentId(id, {
                page: 1,
                limit: 10
            });
            if (response && response.data && response.data.records) {
                setMedicalEvents(response.data.records);
                console.log("Medical Events:", response.data.records);
            }
        } catch (err) {
            console.error('Error loading medical events:', err);
            setMedicalEvents([]);
        } finally {
            setMedicalEventsLoading(false);
        }
    };

    const handleViewProfile = (profileId) => {
        setSelectedProfileId(profileId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProfileId(null);
    };

    const hasHealthNotes = (profile) => {
        // Kiểm tra xem có dữ liệu ghi chú sức khỏe hay không
        const checkArray = (data) => {
            if (!data) return false;
            if (data === '1' || data === '' || data === '[]' || data === 'null') return false;

            // Nếu là array
            if (Array.isArray(data)) {
                return data.length > 0 && data.some(item => item && item.toString().trim() !== '');
            }

            // Nếu là string
            const dataStr = data.toString().trim();
            if (dataStr === '' || dataStr === '1' || dataStr === '[]' || dataStr === 'null') return false;

            // Thử parse JSON
            try {
                const parsed = JSON.parse(dataStr);
                if (Array.isArray(parsed)) {
                    return parsed.length > 0 && parsed.some(item => item && item.toString().trim() !== '');
                }
                return !!parsed;
            } catch {
                // Nếu không parse được, coi như string và kiểm tra có nội dung hay không
                return dataStr.length > 0;
            }
        };

        const hasAllergies = checkArray(profile?.allergies);
        const hasChronicDiseases = checkArray(profile?.chronicDiseases);
        const hasDevicesSupport = checkArray(profile?.devicesSupport);

        console.log('Health notes check for profile:', profile._id, {
            allergies: profile?.allergies,
            hasAllergies,
            chronicDiseases: profile?.chronicDiseases,
            hasChronicDiseases,
            devicesSupport: profile?.devicesSupport,
            hasDevicesSupport,
            result: hasAllergies || hasChronicDiseases || hasDevicesSupport
        });

        return hasAllergies || hasChronicDiseases || hasDevicesSupport;
    };

    const getEventLevelColor = (level) => {
        return getMedicalEventLevelColor(level);
    };

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
                    onClick={() => navigate('/parent/children')}
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
                }}>                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton
                            onClick={() => navigate('/parent/children')}
                            sx={{ mr: 2, color: 'white' }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
                            {child.name?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {child.name}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Thông tin chi tiết và hồ sơ sức khỏe
                            </Typography>
                        </Box>
                    </Box></Paper>

                {/* Child Basic Information - Compact Card at Top */}
                <Card elevation={3} sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Person sx={{ fontSize: 24, color: '#1976d2', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Thông tin cơ bản
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
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
                                        label={getStudentStatusLabel(child.isActive)}
                                        color={getStudentStatusColor(child.isActive)}
                                        size="small"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
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
                                        {healthProfiles.map((profile, index) => (<TableRow
                                            key={profile._id}
                                            sx={{
                                                '&:hover': { bgcolor: '#f9f9f9' }
                                            }}
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
                                                    color={getBloodTypeColor()}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {profile.vision || 'không có'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {hasHealthNotes(profile) ? (
                                                    <Chip
                                                        label={getHealthNoteLabel(true)}
                                                        color={getHealthNoteColor(true)}
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewProfile(profile._id);
                                                        }}
                                                        sx={{ cursor: 'pointer' }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label={getHealthNoteLabel(false)}
                                                        color={getHealthNoteColor(false)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Visibility />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewProfile(profile._id);
                                                    }}
                                                >
                                                    Chi tiết
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>)}                    </CardContent>
                </Card>

                {/* Medical Events Section */}
                <Card elevation={3} sx={{ mt: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MedicalServices sx={{ fontSize: 32, color: '#2196f3', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                                    Sự kiện y tế
                                </Typography>
                                <Badge badgeContent={medicalEvents.length} color="primary" sx={{ ml: 2 }} />
                            </Box>
                        </Box>

                        {medicalEventsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : medicalEvents.length === 0 ? (
                            <Box sx={{
                                textAlign: 'center',
                                py: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Event sx={{ fontSize: 64, color: 'text.secondary' }} />
                                <Typography variant="h6" color="text.secondary">
                                    Chưa có sự kiện y tế
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer component={Paper} variant="outlined">
                                <Table>                                    <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Ngày xảy ra</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Loại sự kiện</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Mức độ</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Triệu chứng</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                    <TableBody>
                                        {medicalEvents.map((event, index) => (
                                            <TableRow
                                                key={event._id}
                                                sx={{
                                                    '&:hover': { bgcolor: '#f9f9f9' }
                                                }}
                                            >
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    {new Date(event.date || event.createdAt).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getMedicalEventTypeLabel(event.type)}
                                                        color={getMedicalEventTypeColor(event.type)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getMedicalEventLevelLabel(event.level)}
                                                        color={getMedicalEventLevelColor(event.level)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                        {event.description || 'Không có mô tả'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                                        {event.note || 'Không có ghi chú'}
                                                    </Typography>
                                                </TableCell>                                                <TableCell>
                                                    <Chip
                                                        label={getMedicalEventStatusLabel(event.status)}
                                                        color={getMedicalEventStatusColor(event.status)}
                                                        size="small"
                                                    />
                                                </TableCell>                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Visibility />}
                                                        onClick={() => navigate(
                                                            `/parent/children/${child._id}/medical-events/${event._id}`,
                                                            {
                                                                state: {
                                                                    eventData: event,
                                                                    childData: child
                                                                }
                                                            }
                                                        )}
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

            {/* Health Profile Detail Modal */}
            <HealthProfileDetailModal
                open={modalOpen}
                onClose={handleCloseModal}
                profileId={selectedProfileId}
                childId={id}
            />
        </Box>
    );
};

export default ChildDetailPage;
