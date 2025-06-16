
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
    Button,
    CircularProgress,
    Alert,
    Tooltip,
    Pagination,
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
    const [query, setQuery] = useState({
        page: 1
    })
    const [healthProfile, setHealthProfile] = useState([]);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        loadHealthProfile();
    }, [studentId]);

    const loadHealthProfile = async () => {
        try {
            setLoading(true);

            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId, query);
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
    }; const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
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
                                </TableHead>                                <TableBody>
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
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: index === 0 ? 600 : 400,
                                                            color: '#000000',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#000000' }}>
                                                        {formatDate(record.createdAt)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#000000' }}>
                                                        {record.height ? `${record.height} cm` : getDisplayValue(record.height)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#000000' }}>
                                                        {record.weight ? `${record.weight} kg` : getDisplayValue(record.weight)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.875rem',
                                                            color: '#000000',
                                                            fontWeight: record.bloodType ? 500 : 400
                                                        }}
                                                    >
                                                        {getDisplayValue(record.bloodType)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={getDisplayValue(record.vision)} placement="top">
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: '0.875rem',
                                                                color: '#000000',
                                                                cursor: record.vision && record.vision.length > 10 ? 'help' : 'default'
                                                            }}
                                                        >
                                                            {getTruncatedValue(getDisplayValue(record.vision), 10)}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={getDisplayValue(record.devicesSupport)} placement="top">
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: '0.875rem',
                                                                color: '#000000',
                                                                cursor: record.devicesSupport && record.devicesSupport.length > 12 ? 'help' : 'default'
                                                            }}
                                                        >
                                                            {getTruncatedValue(getDisplayValue(record.devicesSupport), 12)}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={getDisplayValue(record.allergies)} placement="top">
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: '0.875rem',
                                                                color: '#000000',
                                                                cursor: record.allergies && record.allergies.length > 15 ? 'help' : 'default'
                                                            }}
                                                        >
                                                            {getTruncatedValue(getDisplayValue(record.allergies), 15)}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={getDisplayValue(record.chronicDiseases)} placement="top">
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: '0.875rem',
                                                                color: '#000000',
                                                                cursor: record.chronicDiseases && record.chronicDiseases.length > 15 ? 'help' : 'default'
                                                            }}
                                                        >
                                                            {getTruncatedValue(getDisplayValue(record.chronicDiseases), 15)}
                                                        </Typography>
                                                    </Tooltip>
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
                                                        null
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                                
                            </Table>
                        </TableContainer>
                        <Pagination
                                    component="div"
                                    count={Math.ceil(healthProfile.length / 10)}
                                    page={query.page}
                                    onPageChange={handlePageChange}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                />
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default HealthProfilesPage;