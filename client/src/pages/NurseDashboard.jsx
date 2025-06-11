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
    Pagination,
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
    MenuItem
} from '@mui/material';
import {
    Search as SearchIcon,
    People as PeopleIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendingUpIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Male as MaleIcon,
    Female as FemaleIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import studentsApi from '../api/studentsApi';
import QuickActions from '../components/dashboard/QuickActions';

const NurseDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalStudents, setTotalStudents] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Statistics
    const [stats, setStats] = useState({
        totalStudents: 0,
        todayCheckups: 12,
        pendingOrders: 5,
        healthAlerts: 3
    }); useEffect(() => {
        loadStudents();
        loadStats();
    }, [page, rowsPerPage, searchTerm]);

    const loadStats = async () => {
        try {
            const response = await studentsApi.getStats();
            if (response.data && response.data.isSuccess) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadStudents = async () => {
        try {
            setLoading(true);
            const params = {
                page: page + 1,
                limit: rowsPerPage,
                search: searchTerm || undefined
            };

            const response = await studentsApi.getAllStudents(params);

            if (response.data && response.data.isSuccess) {
                const { records, total } = response.data.data;
                setStudents(records || []);
                setTotalStudents(total || 0);
                setStats(prev => ({
                    ...prev,
                    totalStudents: total || 0
                }));
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
        setPage(0); // Reset to first page when searching
    }; const handlePageChange = (event, newPage) => {
        setPage(newPage - 1); // Pagination component uses 1-based indexing
    };

    const getTotalPages = () => {
        return Math.ceil(totalStudents / rowsPerPage);
    };

    const handleViewStudent = async (student) => {
        try {
            // Load full student details including health profile
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
    }; const handleRefresh = () => {
        loadStudents();
        loadStats();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'add-student':
                toast.info('Tính năng thêm học sinh đang được phát triển');
                break;
            case 'schedule-checkup':
                toast.info('Tính năng lên lịch khám đang được phát triển');
                break;
            case 'create-order':
                toast.info('Tính năng tạo đơn khám đang được phát triển');
                break;
            case 'weekly-report':
                toast.info('Tính năng báo cáo tuần đang được phát triển');
                break;
            case 'view-all-alerts':
                toast.info('Tính năng xem tất cả thông báo đang được phát triển');
                break;
            default:
                console.log('Unknown action:', action);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getGenderIcon = (gender) => {
        return gender === 'male' ? <MaleIcon color="primary" /> : <FemaleIcon color="secondary" />;
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

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)` }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom variant="h6">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl">
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Dashboard Y tá
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Chào mừng trở lại, {user?.firstName} {user?.lastName}!
                </Typography>
            </Box>

            {/* Statistics Cards */}


            {/* Quick Actions */}
            <Box sx={{ mb: 4 }}>
                <QuickActions onAction={handleQuickAction} />
            </Box>

            {/* Students Table */}
            <Card>
                <CardContent>
                    {/* Table Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                            Danh sách học sinh
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                placeholder="Tìm kiếm học sinh..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                size="small"
                                sx={{ width: 300 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Tooltip title="Làm mới">
                                <IconButton onClick={handleRefresh} color="primary">
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {/* Handle add new student */ }}
                            >
                                Thêm học sinh
                            </Button>
                        </Box>
                    </Box>

                    {/* Loading State */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Table */}
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                                            <TableCell sx={{ fontWeight: 600 }}>Học sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Mã học sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Giới tính</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Ngày sinh</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Mã bảo hiểm</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {students.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
                                                        {formatDate(student.birthdate)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                            {student.medicalConverageId || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="Đang theo dõi"
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
                                                                    onClick={() => {/* Handle edit */ }}
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
                                </Table>                            </TableContainer>

                            {/* Pagination */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Hiển thị {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalStudents)} trong tổng số {totalStudents} học sinh
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                   
                                    <Pagination
                                        count={getTotalPages()}
                                        page={page + 1}
                                        onChange={handlePageChange}
                                        color="primary"
                                        showFirstButton
                                        showLastButton
                                        siblingCount={1}
                                        boundaryCount={1}
                                    />
                                </Box>
                            </Box>
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
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom>Ngày sinh</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedStudent.birthdate)}</Typography>

                                        <Typography variant="subtitle2" gutterBottom>Mã bảo hiểm y tế</Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>{selectedStudent.medicalConverageId || 'Chưa có'}</Typography>

                                        <Typography variant="subtitle2" gutterBottom>Trạng thái</Typography>
                                        <Chip label="Đang theo dõi" color="success" size="small" />
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
        </Container>
    );
};

export default NurseDashboard;
