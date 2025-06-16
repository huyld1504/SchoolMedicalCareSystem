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
    TablePagination,
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
    Medication as MedicationIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import studentsApi from '../../api/studentsApi';
import { useFormik } from 'formik';

const StudentsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);
    const [filterGender, setFilterGender] = useState(searchParams.get('gender') || '');

    
    useEffect(() => {
        loadStudents();
    }, [page, rowsPerPage, searchTerm, filterGender]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                keyword: searchTerm || undefined,
                gender: filterGender || undefined,
            };

            const response = await studentsApi.getAllStudents(params);
            console.log(response.data)
            if (response.isSuccess) {
                const { records, total } = response.data;
                console.log(response.data)
                setStudents(records || []);
                setTotalStudents(total || 0);
            } else {
                toast.error('Không thể tải danh sách học sinh');
            }
        } catch (error) {
            console.error('Error loading students:', error);
            toast.error('Lỗi khi tải danh sách học sinh');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }; const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = () => {
        setSearchTerm(searchInput);
        setPage(0);

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

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRefresh = () => {
        loadStudents();
        toast.success('Đã làm mới dữ liệu');
    };    const handleExport = () => {
        toast.info('Tính năng xuất dữ liệu đang được phát triển');
    };

    const handlePrint = () => {
        toast.info('Tính năng in đang được phát triển');
    };

    const handleViewHealthProfile = (student) => {
        navigate(`/nurse/health-profiles/${student._id}`);
    };

    const handleViewMedicationHistory = (student) => {
        navigate(`/nurse/medication-history/${student._id}}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };    const getGenderText = (gender) => {
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
                        Tổng số học sinh: {totalStudents}
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
                        {/* === START: ĐOẠN CODE ĐƯỢC THAY ĐỔI === */}

                        {/* Search field - Chiếm phần lớn không gian */}
                        <Grid item xs>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo tên, mã học sinh..."
                                value={searchInput}
                                onChange={handleSearchChange}
                                onKeyPress={handleKeyPress}
                                size="small"
                                sx={{ width: '700px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    // Đã xóa endAdornment chứa nút tìm kiếm ở đây
                                }}
                            />
                        </Grid>

                        {/* Search Button - Nằm riêng biệt bên cạnh */}
                        <Grid item xs="auto">
                            <Button
                                variant="contained"
                                onClick={handleSearchSubmit}
                                // Căn chỉnh chiều cao của nút cho khớp với TextField
                                sx={{ height: '40px' }}
                            >
                                Tìm kiếm
                            </Button>
                        </Grid>

                        {/* === END: ĐOẠN CODE ĐƯỢC THAY ĐỔI === */}

                        {/* Gender filter */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small" sx={{ width: '100px' }}>
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                    value={filterGender}
                                    label="Giới tính"
                                    onChange={(e) => {
                                        setFilterGender(e.target.value);
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
                        <Grid item xs={12} sm={6} md>                            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchInput('');
                                        setSearchTerm('');
                                        setFilterGender('');
                                        setPage(0);
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
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
                                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                                    <Alert severity="info">
                                                        {searchTerm ? 'Không tìm thấy học sinh nào phù hợp' : 'Chưa có học sinh nào'}
                                                    </Alert>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            students.map((student) => (
                                                <TableRow key={student._id} hover>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                {student.name?.charAt(0)?.toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000000' }}>
                                                                    {student.name}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#000000' }}>
                                                                    ID: {student._id}
                                                                </Typography>
                                                            </Box>                                                        </Box>
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
                                                            </Tooltip>
                                                            <Tooltip title="Lịch sử dùng thuốc">
                                                                <IconButton
                                                                    size="small"
                                                                    color="warning"
                                                                    onClick={() => handleViewMedicationHistory(student)}
                                                                >
                                                                    <MedicationIcon />
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

                            {/* Pagination */}
                            <Pagination
                                component="div"
                                count={Math.ceil(totalStudents / 10)}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </>
                    )}
                </CardContent>
            </Card>




        </Container>
    );
};

export default StudentsPage;