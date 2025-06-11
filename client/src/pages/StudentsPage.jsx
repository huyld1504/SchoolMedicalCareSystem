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
    Chip,
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
    Fab
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Male as MaleIcon,
    Female as FemaleIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    Download as DownloadIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import studentsApi from '../api/studentsApi';

const StudentsPage = () => {
    const { user } = useSelector((state) => state.auth);
    console.log(user)
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [filterGender, setFilterGender] = useState('');
    const [filterClass, setFilterClass] = useState('');

    useEffect(() => {
        loadStudents();
    }, [page, rowsPerPage, searchTerm, filterGender, filterClass]);

    const loadStudents = async () => {
        try {
            setLoading(true);
          

            const response = await studentsApi.getAllStudents();
            console.log(response)
            if (response && response.isSuccess) {
                const { records, total } = response;
                console.log(records)
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
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewStudent = async (student) => {
        try {
            const response = await studentsApi.getStudentHealthProfile(student._id);
            setSelectedStudent({
                ...student,
                healthProfile: response.data?.data || null
            });
            setDialogOpen(true);
        } catch (error) {
            console.error('Error loading student details:', error);
            toast.error('Không thể tải thông tin chi tiết học sinh');
        }
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getGenderChip = (gender) => {
        const isMale = gender === 'male' || gender === 'nam';
        return (
            <Chip
                icon={isMale ? <MaleIcon /> : <FemaleIcon />}
                label={isMale ? 'Nam' : 'Nữ'}
                size="small"
                color={isMale ? 'primary' : 'secondary'}
                variant="outlined"
            />
        );
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
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo tên, mã học sinh..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                    value={filterGender}
                                    label="Giới tính"
                                    onChange={(e) => setFilterGender(e.target.value)}
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="male">Nam</MenuItem>
                                    <MenuItem value="female">Nữ</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Lớp</InputLabel>
                                <Select
                                    value={filterClass}
                                    label="Lớp"
                                    onChange={(e) => setFilterClass(e.target.value)}
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="1A">1A</MenuItem>
                                    <MenuItem value="1B">1B</MenuItem>
                                    <MenuItem value="2A">2A</MenuItem>
                                    <MenuItem value="2B">2B</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Tooltip title="Làm mới">
                                    <IconButton onClick={handleRefresh} color="primary">
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => toast.info('Tính năng thêm học sinh đang được phát triển')}
                                >
                                    Thêm học sinh
                                </Button>
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
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Học sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Mã học sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Giới tính</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Tuổi</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Ngày sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Mã bảo hiểm</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Trạng thái sức khỏe</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
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
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                    {student.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    ID: {student._id}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={student.studentCode}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {getGenderChip(student.gender)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {calculateAge(student.birthdate)} tuổi
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(student.birthdate)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                            {student.medicalConverageId || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="Bình thường"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => handleViewStudent(student)}
                                                                >
                                                                    <ViewIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Chỉnh sửa">
                                                                <IconButton
                                                                    size="small"
                                                                    color="secondary"
                                                                    onClick={() => toast.info('Tính năng chỉnh sửa đang được phát triển')}
                                                                >
                                                                    <EditIcon />
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
                            <TablePagination
                                component="div"
                                count={totalStudents}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                labelRowsPerPage="Số dòng mỗi trang:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                                }
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Student Detail Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ pb: 2 }}>
                    <Typography variant="h6" component="div">
                        Thông tin chi tiết học sinh
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedStudent && (
                        <Box>
                            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
                                <Tab label="Thông tin cơ bản" />
                                <Tab label="Hồ sơ y tế" />
                                <Tab label="Lịch sử khám bệnh" />
                            </Tabs>

                            {tabValue === 0 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>Họ và tên</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>{selectedStudent.name}</Typography>

                                        <Typography variant="subtitle2" gutterBottom>Mã học sinh</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>{selectedStudent.studentCode}</Typography>

                                        <Typography variant="subtitle2" gutterBottom>Giới tính</Typography>
                                        <Box sx={{ mb: 2 }}>{getGenderChip(selectedStudent.gender)}</Box>

                                        <Typography variant="subtitle2" gutterBottom>Tuổi</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {calculateAge(selectedStudent.birthdate)} tuổi
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>Ngày sinh</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedStudent.birthdate)}</Typography>

                                        <Typography variant="subtitle2" gutterBottom>Mã bảo hiểm y tế</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>{selectedStudent.medicalConverageId || 'Chưa có'}</Typography>

                                        <Typography variant="subtitle2" gutterBottom>Trạng thái</Typography>
                                        <Chip label="Đang học" color="success" size="small" />
                                    </Grid>
                                </Grid>
                            )}

                            {tabValue === 1 && (
                                <Box>
                                    {selectedStudent.healthProfile ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>Chiều cao</Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {selectedStudent.healthProfile.height || 'N/A'} cm
                                                </Typography>

                                                <Typography variant="subtitle2" gutterBottom>Cân nặng</Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {selectedStudent.healthProfile.weight || 'N/A'} kg
                                                </Typography>

                                                <Typography variant="subtitle2" gutterBottom>Nhóm máu</Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {selectedStudent.healthProfile.bloodType || 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>Thị lực</Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {selectedStudent.healthProfile.vision || 'N/A'}
                                                </Typography>

                                                <Typography variant="subtitle2" gutterBottom>Dị ứng</Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {selectedStudent.healthProfile.allergies || 'Không có'}
                                                </Typography>

                                                <Typography variant="subtitle2" gutterBottom>Bệnh mãn tính</Typography>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {selectedStudent.healthProfile.chronicDiseases || 'Không có'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Alert severity="info">
                                            Chưa có hồ sơ y tế cho học sinh này
                                        </Alert>
                                    )}
                                </Box>
                            )}

                            {tabValue === 2 && (
                                <Alert severity="info">
                                    Tính năng lịch sử khám bệnh đang được phát triển
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
                    <Button variant="contained" color="primary">
                        Chỉnh sửa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => toast.info('Tính năng thêm học sinh đang được phát triển')}
            >
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default StudentsPage;
