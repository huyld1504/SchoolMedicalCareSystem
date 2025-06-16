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
    FormControl,
    Select,
    MenuItem,
    InputLabel,
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
    
    // State cho pagination
    const [query, setQuery] = useState({
        page: 1,
        limit: 10
    });
    
    // State cho data từ API
    const [healthProfile, setHealthProfile] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });
    
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sử dụng useEffect với dependency của query để load data khi thay đổi page/limit
    useEffect(() => {
        loadHealthProfile();
    }, [studentId, query.page, query.limit]);

    const loadHealthProfile = async () => {
        try {
            setLoading(true);

            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId, query);
                console.log('Health profile response:', response);
                
                if (response.isSuccess && response.data) {
                    // Lấy data từ API response
                    setHealthProfile(response.data.records || []);
                    
                    // Cập nhật thông tin pagination từ API
                    setPaginationInfo({
                        total: response.data.total || 0,
                        page: response.data.page || 1,
                        limit: response.data.limit || 10,
                        totalPages: response.data.totalPages || 0
                    });
                    
                    // Lấy thông tin student từ hồ sơ y tế đầu tiên
                    if (response.data.records && response.data.records.length > 0 && response.data.records[0].studentId) {
                        setStudentInfo(response.data.records[0].studentId);
                    }
                    
                    console.log('Health profiles:', response.data.records);
                    console.log('Pagination info:', {
                        total: response.data.total,
                        page: response.data.page,
                        limit: response.data.limit,
                        totalPages: response.data.totalPages
                    });
                } else {
                    setHealthProfile([]);
                    setPaginationInfo({
                        total: 0,
                        page: 1,
                        limit: 10,
                        totalPages: 0
                    });
                }
            }
        } catch (error) {
            console.error('Error loading health profile:', error);
            toast.error('Lỗi khi tải hồ sơ y tế');
            setHealthProfile([]);
            setPaginationInfo({
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Sửa handlePageChange để cập nhật query state
    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Sửa handleRowsPerPageChange để cập nhật query state
    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        setQuery(prev => ({
            ...prev,
            limit: newLimit,
            page: 1 // Reset về page 1 khi thay đổi limit
        }));
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

    const 
    handleEditProfile = (profileId) => {
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
                        {/* Header với thông tin pagination */}
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Danh sách hồ sơ y tế ({paginationInfo.total} hồ sơ)
                            </Typography>
                            
                            {/* Dropdown cho rows per page */}
                           
                        </Box>
                        
                        <TableContainer sx={{
                            maxHeight: 600,
                            overflowX: 'hidden',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: 6,
                                height: 0,
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: 3,
                            },
                            scrollbarWidth: 'thin',
                            msOverflowStyle: 'none',
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
                                    {/* Hiển thị data từ API (đã được phân trang server-side) */}
                                    {healthProfile.map((record, index) => (
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
                                                    {/* Tính STT dựa trên page hiện tại */}
                                                    {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
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
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        {/* Pagination component được sửa */}
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            
                            <Pagination
                                count={paginationInfo.totalPages}
                                page={paginationInfo.page}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                                sx={{ display: 'flex', justifyContent: 'center' }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default HealthProfilesPage;
