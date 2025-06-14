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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Badge,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    Medication as MedicationIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Sample medication history data
const sampleMedicationHistory = [
    {
        id: '1',
        medicationName: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 lần/ngày',
        duration: '5 ngày',
        prescribedBy: 'BS. Nguyễn Văn A',
        prescribedDate: '2024-01-15',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'completed',
        reason: 'Hạ sốt',
        notes: 'Uống sau ăn',
        administeredDoses: [
            { date: '2024-01-15', morning: true, afternoon: true, evening: true },
            { date: '2024-01-16', morning: true, afternoon: true, evening: false },
            { date: '2024-01-17', morning: true, afternoon: true, evening: true },
            { date: '2024-01-18', morning: true, afternoon: false, evening: true },
            { date: '2024-01-19', morning: true, afternoon: true, evening: true },
            { date: '2024-01-20', morning: true, afternoon: true, evening: true }
        ]
    },
    {
        id: '2',
        medicationName: 'Amoxicillin',
        dosage: '250mg',
        frequency: '2 lần/ngày',
        duration: '7 ngày',
        prescribedBy: 'BS. Trần Thị B',
        prescribedDate: '2024-01-10',
        startDate: '2024-01-10',
        endDate: '2024-01-17',
        status: 'completed',
        reason: 'Viêm họng',
        notes: 'Uống trước ăn 30 phút',
        administeredDoses: [
            { date: '2024-01-10', morning: true, evening: true },
            { date: '2024-01-11', morning: true, evening: true },
            { date: '2024-01-12', morning: true, evening: true },
            { date: '2024-01-13', morning: true, evening: true },
            { date: '2024-01-14', morning: true, evening: true },
            { date: '2024-01-15', morning: true, evening: true },
            { date: '2024-01-16', morning: true, evening: true }
        ]
    },
    {
        id: '3',
        medicationName: 'Vitamin C',
        dosage: '100mg',
        frequency: '1 lần/ngày',
        duration: '30 ngày',
        prescribedBy: 'BS. Lê Văn C',
        prescribedDate: '2024-01-01',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'ongoing',
        reason: 'Tăng cường sức đề kháng',
        notes: 'Uống vào buổi sáng',
        administeredDoses: []
    }
];

const MedicationHistoryPage = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [searchParams] = useSearchParams();
    const studentName = searchParams.get('name') || 'Học sinh';

    const [medications, setMedications] = useState([]);
    const [filteredMedications, setFilteredMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        loadMedicationHistory();
    }, [studentId]);

    useEffect(() => {
        filterMedications();
    }, [medications, searchTerm, statusFilter]);

    const loadMedicationHistory = async () => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMedications(sampleMedicationHistory);
        } catch (error) {
            console.error('Error loading medication history:', error);
            toast.error('Không thể tải lịch sử dùng thuốc');
        } finally {
            setLoading(false);
        }
    };

    const filterMedications = () => {
        let filtered = medications;

        if (searchTerm) {
            filtered = filtered.filter(med =>
                med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                med.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                med.reason.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(med => med.status === statusFilter);
        }

        setFilteredMedications(filtered);
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            completed: { label: 'Hoàn thành', color: 'success', icon: <CheckCircleIcon /> },
            ongoing: { label: 'Đang dùng', color: 'primary', icon: <ScheduleIcon /> },
            stopped: { label: 'Đã dừng', color: 'warning', icon: <WarningIcon /> },
            expired: { label: 'Hết hạn', color: 'error', icon: <CloseIcon /> }
        };

        const config = statusConfig[status] || statusConfig.completed;

        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                icon={config.icon}
                variant="outlined"
            />
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const calculateCompletionRate = (medication) => {
        if (!medication.administeredDoses || medication.administeredDoses.length === 0) {
            return 0;
        }

        const totalDoses = medication.administeredDoses.reduce((total, day) => {
            return total + (day.morning ? 1 : 0) + (day.afternoon ? 1 : 0) + (day.evening ? 1 : 0);
        }, 0);

        const expectedDoses = medication.administeredDoses.length *
            (medication.frequency.includes('3') ? 3 : medication.frequency.includes('2') ? 2 : 1);

        return Math.round((totalDoses / expectedDoses) * 100);
    };

    const handleViewDetails = (medication) => {
        setSelectedMedication(medication);
        setDialogOpen(true);
    };

    const handleRefresh = () => {
        loadMedicationHistory();
        toast.success('Đã làm mới dữ liệu');
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedMedications = filteredMedications.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={() => navigate('/nurse/students')} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <MedicationIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Lịch sử dùng thuốc
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Học sinh: {studentName} (ID: {studentId})
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        {medications.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tổng số đơn thuốc
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                    <MedicationIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        {medications.filter(m => m.status === 'completed').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Đã hoàn thành
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.light' }}>
                                    <CheckCircleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                                        {medications.filter(m => m.status === 'ongoing').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Đang điều trị
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.light' }}>
                                    <ScheduleIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                        {medications.filter(m => m.status === 'stopped').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Đã dừng
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.light' }}>
                                    <WarningIcon />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm thuốc, bác sĩ kê đơn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Trạng thái"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value="completed">Hoàn thành</MenuItem>
                                    <MenuItem value="ongoing">Đang dùng</MenuItem>
                                    <MenuItem value="stopped">Đã dừng</MenuItem>
                                    <MenuItem value="expired">Hết hạn</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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

            {/* Medication History Table */}
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
                                            <TableCell sx={{ fontWeight: 600 }}>Thuốc</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Liều dùng</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Bác sĩ kê đơn</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Lý do</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Tỷ lệ hoàn thành</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedMedications.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                                    <Alert severity="info">
                                                        {searchTerm || statusFilter !== 'all'
                                                            ? 'Không tìm thấy thuốc nào phù hợp'
                                                            : 'Chưa có lịch sử dùng thuốc'}
                                                    </Alert>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedMedications.map((medication) => (
                                                <TableRow key={medication.id} hover>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                {medication.medicationName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {medication.dosage}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {medication.frequency}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {medication.duration}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {formatDate(medication.startDate)} - {formatDate(medication.endDate)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Kê ngày: {formatDate(medication.prescribedDate)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {medication.prescribedBy}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {medication.reason}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusChip(medication.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {medication.status === 'completed' && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography variant="body2" sx={{ mr: 1 }}>
                                                                    {calculateCompletionRate(medication)}%
                                                                </Typography>
                                                                <Box
                                                                    sx={{
                                                                        width: 40,
                                                                        height: 4,
                                                                        bgcolor: 'grey.200',
                                                                        borderRadius: 2,
                                                                        overflow: 'hidden'
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            width: `${calculateCompletionRate(medication)}%`,
                                                                            height: '100%',
                                                                            bgcolor: calculateCompletionRate(medication) >= 80 ? 'success.main' : 'warning.main'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        )}
                                                        {medication.status === 'ongoing' && (
                                                            <Chip label="Đang dùng" size="small" color="primary" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Xem chi tiết">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleViewDetails(medication)}
                                                            >
                                                                <InfoIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={filteredMedications.length}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelRowsPerPage="Số hàng mỗi trang:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`
                                }
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Medication Details Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Chi tiết đơn thuốc</Typography>
                        <IconButton onClick={() => setDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedMedication && (
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Tên thuốc</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.medicationName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Liều dùng</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.dosage}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Tần suất</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.frequency}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Thời gian điều trị</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.duration}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Bác sĩ kê đơn</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.prescribedBy}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Lý do điều trị</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.reason}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Ghi chú</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedMedication.notes || 'Không có ghi chú'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                                        Lịch sử uống thuốc
                                    </Typography>
                                    {selectedMedication.administeredDoses && selectedMedication.administeredDoses.length > 0 ? (
                                        <Box>
                                            {selectedMedication.administeredDoses.map((dose, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ minWidth: 100 }}>
                                                        {formatDate(dose.date)}:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {dose.morning !== undefined && (
                                                            <Chip
                                                                label="Sáng"
                                                                size="small"
                                                                color={dose.morning ? 'success' : 'error'}
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        {dose.afternoon !== undefined && (
                                                            <Chip
                                                                label="Chiều"
                                                                size="small"
                                                                color={dose.afternoon ? 'success' : 'error'}
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        {dose.evening !== undefined && (
                                                            <Chip
                                                                label="Tối"
                                                                size="small"
                                                                color={dose.evening ? 'success' : 'error'}
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Chưa có lịch sử uống thuốc
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MedicationHistoryPage;
