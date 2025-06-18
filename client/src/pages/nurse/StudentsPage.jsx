import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Fab,
    Pagination
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Person as PersonIcon,
    Medication as MedicationIcon,
    MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import studentsApi from '../../api/studentsApi';
import { useFormik } from 'formik';

const StudentsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Sửa state để giống HealthProfilesPage
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        keyword: searchParams.get('keyword') || '',
        gender: searchParams.get('gender') || ''
    });
    
    // State cho data từ API
    const [students, setStudents] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });
    
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

    // Sửa useEffect để sử dụng query state
    useEffect(() => {
        loadStudents();
    }, [query.page, query.limit, query.keyword, query.gender]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const params = {
                page: query.page,
                limit: query.limit,
                keyword: query.keyword || undefined,
                gender: query.gender || undefined,
            };

            const response = await studentsApi.getAllStudents(params);
            console.log('Students response:', response);
            
            if (response.isSuccess && response.data) {
                // Lấy data từ API response
                setStudents(response.data.records || []);
                
                // Cập nhật thông tin pagination từ API
                setPaginationInfo({
                    total: response.data.total || 0,
                    page: response.data.page || 1,
                    limit: response.data.limit || 10,
                    totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / (response.data.limit || 10))
                });
                
                console.log('Students:', response.data.records);
                console.log('Pagination info:', {
                    total: response.data.total,
                    page: response.data.page,
                    limit: response.data.limit,
                    totalPages: response.data.totalPages
                });
            } else {
                setStudents([]);
                setPaginationInfo({
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0
                });
                toast.error('Không thể tải danh sách học sinh');
            }
        } catch (error) {
            console.error('Error loading students:', error);
            toast.error('Lỗi khi tải danh sách học sinh');
            setStudents([]);
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

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = () => {
        setQuery(prev => ({
            ...prev,
            keyword: searchInput,
            page: 1 // Reset về page 1 khi search
        }));

        // Update URL params
        const newSearchParams = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
            newSearchParams.set('search', searchInput.trim());
        } else {
            newSearchParams.delete('search');
        }
        setSearchParams(newSearchParams);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // Sửa handlePageChange để giống HealthProfilesPage
    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Sửa handleRowsPerPageChange để giống HealthProfilesPage
    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        setQuery(prev => ({
            ...prev,
            limit: newLimit,
            page: 1 // Reset về page 1 khi thay đổi limit
        }));
    };

    const handleRefresh = () => {
        loadStudents();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleExport = () => {
        toast.info('Tính năng xuất dữ liệu đang được phát triển');
    };

    const handlePrint = () => {
        toast.info('Tính năng in đang được phát triển');
    };

    const handleViewHealthProfile = (student) => {
        navigate(`/nurse/health-profiles/${student._id}`);
    };

    const handleViewMedicationHistory = (student) => {
        navigate(`/nurse/medication-history/${student._id}`);
    };

    const handleViewMedicalEvents = (student) => {
        navigate(`/nurse/medical-events/${student._id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getGenderText = (gender) => {
        const isMale = gender === 'male' || gender === 'nam';
        return isMale ? 'Nam' : 'Nữ';
    };

    const calculateAge = (birthdate) => {
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
        <Container maxWidth="xl">
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        Quản lý học sinh
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Tổng số học sinh: {paginationInfo.total}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                    >
                        Xuất Excel
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                    >
                        In danh sách
                    </Button>
                </Box>
            </Box>
            
            {/* Filters and Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        {/* Search field */}
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo tên, mã học sinh..."
                                value={searchInput}
                                onChange={handleSearchChange}
                                onKeyPress={handleKeyPress}
                                size="small"
                                sx={{ width: '600px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Search Button */}
                        <Grid item xs="auto">
                            <Button
                                variant="contained"
                                onClick={handleSearchSubmit}
                                sx={{ height: '40px' }}
                            >
                                Tìm kiếm
                            </Button>
                        </Grid>

                        {/* Gender filter */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small" sx={{ width: '100px' }}>
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                    value={query.gender}
                                    label="Giới tính"
                                    onChange={(e) => {
                                        setQuery(prev => ({
                                            ...prev,
                                            gender: e.target.value,
                                            page: 1 // Reset về page 1 khi filter
                                        }));
                                        
                                        const newSearchParams = new URLSearchParams(searchParams);
                                        if (e.target.value) {
                                            newSearchParams.set('gender', e.target.value);
                                        } else {
                                            newSearchParams.delete('gender');
                                        }
                                        setSearchParams(newSearchParams);
                                    }}
                                >
                                    <MenuItem value="">Tất cả giới tính</MenuItem>
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Action buttons */}
                        <Grid item xs={12} sm={6} md>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchInput('');
                                        setQuery({
                                            page: 1,
                                            limit: 10,
                                            keyword: '',
                                            gender: ''
                                        });
                                        setSearchParams({});
                                    }}
                                    color="secondary"
                                >
                                    Xóa bộ lọc
                                </Button>
                                <Tooltip title="Làm mới">
                                    <IconButton onClick={handleRefresh} color="primary">
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    {/* Header với thông tin pagination */}
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Danh sách học sinh ({paginationInfo.total} học sinh)
                        </Typography>
                        
                        {/* Dropdown cho rows per page */}
                      
                    </Box>
                    
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>STT</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Học sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Mã học sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Giới tính</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Tuổi</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Ngày sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Mã bảo hiểm</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }}>Trạng thái sức khỏe</TableCell>
                                            <TableCell sx={{ fontWeight: 600, color: '#000000' }} align="center">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                    <Alert severity="info">
                                                        {query.keyword ? 'Không tìm thấy học sinh nào phù hợp' : 'Chưa có học sinh nào'}
                                                    </Alert>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            students.map((student, index) => (
                                                <TableRow key={student._id} hover>
                                                    {/* Thêm cột STT */}
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000' }}>
                                                            {(paginationInfo.page - 1) * paginationInfo.limit + index + 1}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                {student.name?.charAt(0)?.toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000000' }}>
                                                                    {student.name}
                                                                </Typography>
                                                                
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#000000' }}>
                                                            {student.studentCode}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#000000' }}>
                                                            {getGenderText(student.gender)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#000000' }}>
                                                            {calculateAge(student.birthdate)} tuổi
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#000000' }}>
                                                            {formatDate(student.birthdate)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#000000' }}>
                                                            {student.medicalConverageId || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#000000' }}>
                                                            Bình thường
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Tooltip title="Hồ sơ y tế">
                                                                <IconButton
                                                                    size="small"
                                                                    color="info"
                                                                    onClick={() => handleViewHealthProfile(student)}
                                                                >
                                                                    <PersonIcon />
                                                                </IconButton>
                                                            </Tooltip>                                                            <Tooltip title="Lịch sử dùng thuốc">
                                                                <IconButton
                                                                    size="small"
                                                                    color="warning"
                                                                    onClick={() => handleViewMedicationHistory(student)}
                                                                >
                                                                    <MedicationIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Sự kiện y tế">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleViewMedicalEvents(student)}
                                                                >
                                                                    <MedicalServicesIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination component được sửa giống HealthProfilesPage */}
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
                        </>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default StudentsPage;
