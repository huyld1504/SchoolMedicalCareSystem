import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Refresh as RefreshIcon,
    ArrowBack as BackIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import studentsApi from '../../api/studentsApi';
import healthProfileAPI from '../../api/healthProfileApi';

const HealthProfilesPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [healthProfile, setHealthProfile] = useState([]);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealthProfile();
    }, [studentId]);

    const loadHealthProfile = async () => {
        try {
            setLoading(true);

            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId);
                console.log('Health profile response:', response);
                if (response.isSuccess && response.data.records && response.data.records.length > 0) {
                    setHealthProfile(response.data.records);
                    // Lấy thông tin student từ hồ sơ y tế đầu tiên
                    if (response.data.records[0].studentId) {
                        setStudentInfo(response.data.records[0].studentId);
                    }
                    console.log('Health profiles:', response.data.records);
                    console.log('Student Info:', response.data.records[0].studentId);
                }
            }
        } catch (error) {
            console.error('Error loading health profile:', error);
            toast.error('Lỗi khi tải hồ sơ y tế');
            setHealthProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadHealthProfile();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleBack = () => {
        navigate('/nurse/students');
    };

    const handleAddProfile = () => {
        navigate(`/nurse/health-profiles/${studentId}/add`);
    };

    const handleEditProfile = (profileId) => {
        navigate(`/nurse/health-profiles/${studentId}/edit`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
    };

    const getValueChip = (value, type, fullValue = value) => {
        if (value === 'N/A') {
            return <Chip label={value} size="small" variant="outlined" color="default" />;
        }

        if (value === 'Không có') {
            return <Chip label={value} size="small" variant="outlined" color="secondary" />;
        }

        const chipComponent = (() => {
            switch (type) {
                case 'bloodtype':
                    return <Chip label={value} size="small" color="error" variant="outlined" />;
                case 'measurement':
                    return <Chip label={value} size="small" color="primary" variant="outlined" />;
                case 'health':
                    return value === 'Không có'
                        ? <Chip label={value} size="small" color="success" variant="outlined" />
                        : <Chip label={value} size="small" color="warning" variant="outlined" />;
                case 'date':
                    return <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{value}</Typography>;
                default:
                    return <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{value}</Typography>;
            }
        })();

        // Nếu text dài hơn 20 ký tự hoặc có fullValue khác value, wrap trong Tooltip
        if (fullValue && (fullValue.length > 20 || fullValue !== value)) {
            return (
                <Tooltip 
                    title={fullValue} 
                    arrow 
                    placement="top"
                    enterDelay={300}
                    leaveDelay={200}
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            maxWidth: 300,
                            fontSize: '0.875rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        },
                        '& .MuiTooltip-arrow': {
                            color: 'rgba(0, 0, 0, 0.9)',
                        }
                    }}
                >
                    <Box sx={{ cursor: 'help', display: 'inline-block' }}>
                        {chipComponent}
                    </Box>
                </Tooltip>
            );
        }

        return chipComponent;
    };

    const getTruncatedValue = (value, maxLength = 15) => {
        if (!value || value.length <= maxLength) return value;
        return value.substring(0, maxLength) + '...';
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <BackIcon />
                    </IconButton>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Hồ sơ y tế học sinh
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {studentInfo ?
                                `${studentInfo.name} (Mã HS: ${studentInfo.studentCode})` :
                                'Đang tải thông tin...'
                            }
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Làm mới">
                        <IconButton onClick={handleRefresh} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleAddProfile}
                        disabled={!healthProfile || healthProfile.length === 0}
                    >
                        Tạo hồ sơ mới
                    </Button>
                </Box>
            </Box>

            {/* Content */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : !healthProfile || healthProfile.length === 0 ? (
                <Alert severity="info">
                    Học sinh này chưa có hồ sơ y tế
                </Alert>
            ) : (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Danh sách hồ sơ y tế ({healthProfile.length} hồ sơ)
                            </Typography>
                        </Box>
                        <TableContainer sx={{
                            maxHeight: 600,
                            overflowX: 'hidden', // Ẩn scroll ngang
                            overflowY: 'auto',   // Giữ scroll dọc
                            '&::-webkit-scrollbar': {
                                width: 6,
                                height: 0, // Ẩn scrollbar ngang
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: 3,
                            },
                            scrollbarWidth: 'thin', // Firefox
                            msOverflowStyle: 'none', // IE and Edge
                        }}>
                            <Table stickyHeader sx={{
                                tableLayout: 'fixed',
                                width: '100%'
                            }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 600, width: '8%' }} align="center">STT</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '12%' }} align="center">Ngày tạo</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Chiều cao</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Cân nặng</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '8%' }} align="center">Nhóm máu</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '10%' }} align="center">Thị lực</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '12%' }} align="center">Thiết bị hỗ trợ</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Dị ứng</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '15%' }} align="center">Bệnh mãn tính</TableCell>
                                        <TableCell sx={{ fontWeight: 600, width: '8%' }} align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {healthProfile
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo ngày tạo mới nhất
                                        .map((record, index) => (
                                            <TableRow
                                                key={record._id || index}
                                                hover
                                                sx={{
                                                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                                    '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                                                }}
                                            >
                                                <TableCell align="center">
                                                    <Chip
                                                        label={index + 1}
                                                        size="small"
                                                        color={index === 0 ? "primary" : "default"}
                                                        variant={index === 0 ? "filled" : "outlined"}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(formatDate(record.createdAt), 'date')}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(
                                                        record.height ? `${record.height}` : getDisplayValue(record.height),
                                                        'measurement'
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(
                                                        record.weight ? `${record.weight}` : getDisplayValue(record.weight),
                                                        'measurement'
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(getDisplayValue(record.bloodType), 'bloodtype')}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(
                                                        getTruncatedValue(getDisplayValue(record.vision), 10),
                                                        'text',
                                                        getDisplayValue(record.vision)
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(
                                                        getTruncatedValue(getDisplayValue(record.devicesSupport), 12),
                                                        'text',
                                                        getDisplayValue(record.devicesSupport)
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(
                                                        getTruncatedValue(getDisplayValue(record.allergies), 15),
                                                        'health',
                                                        getDisplayValue(record.allergies)
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getValueChip(
                                                        getTruncatedValue(getDisplayValue(record.chronicDiseases), 15),
                                                        'health',
                                                        getDisplayValue(record.chronicDiseases)
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {index === 0 ? (
                                                        <Tooltip title="Chỉnh sửa hồ sơ mới nhất">
                                                            <IconButton
                                                                color="primary"
                                                                size="small"
                                                                onClick={() => handleEditProfile(record._id)}
                                                                sx={{
                                                                    bgcolor: 'primary.light',
                                                                    '&:hover': { bgcolor: 'primary.main', color: 'white' }
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary">
                                                            Hồ sơ cũ
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default HealthProfilesPage;
