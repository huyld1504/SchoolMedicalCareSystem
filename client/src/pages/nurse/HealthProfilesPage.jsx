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
    Pagination,
    // --- THÊM CÁC COMPONENT CHO MODAL ---
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
} from '@mui/material';
import {
    Edit as EditIcon,
    Refresh as RefreshIcon,
    ArrowBack as BackIcon,
    Person as PersonIcon,
    // --- THÊM ICON MỚI ---
    Visibility as ViewIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
// Bỏ import không dùng đến
// import studentsApi from '../../api/studentsApi'; 
import healthProfileAPI from '../../api/healthProfileApi';

const formatArrayString = (jsonString) => {
    if (!jsonString) {
        return 'Không có';
    }
    try {
        const arr = JSON.parse(jsonString);
        if (Array.isArray(arr) && arr.length > 0) {
            return arr.join(', ');
        }
        return 'Không có';
    } catch (error)  {
        return jsonString;
    }
};

const HealthProfilesPage = () => {
    const { user } = useSelector((state) => state.auth);
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [query, setQuery] = useState({ page: 1, limit: 10 });
    const [healthProfile, setHealthProfile] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- BẮT ĐẦU: THÊM STATE VÀ HÀM XỬ LÝ CHO MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const handleViewDetails = (profile) => {
        setSelectedProfile(profile);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProfile(null);
    };
    // --- KẾT THÚC: THÊM STATE VÀ HÀM XỬ LÝ CHO MODAL ---

    useEffect(() => {
        loadHealthProfile();
    }, [studentId, query.page, query.limit]);

    const loadHealthProfile = async () => {
        try {
            setLoading(true);
            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId, query);
                if (response.isSuccess && response.data) {
                    setHealthProfile(response.data.records || []);
                    setPaginationInfo({
                        total: response.data.total || 0,
                        page: response.data.page || 1,
                        limit: response.data.limit || 10,
                        totalPages: response.data.totalPages || 0
                    });
                    if (response.data.records && response.data.records.length > 0 && response.data.records[0].studentId) {
                        setStudentInfo(response.data.records[0].studentId);
                    }
                } else {
                    setHealthProfile([]);
                    setPaginationInfo({ total: 0, page: 1, limit: 10, totalPages: 0 });
                }
            }
        } catch (error) {
            console.error('Error loading health profile:', error);
            toast.error('Lỗi khi tải hồ sơ y tế');
            setHealthProfile([]);
            setPaginationInfo({ total: 0, page: 1, limit: 10, totalPages: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({ ...prev, page: newPage }));
    };

    // Bỏ hàm không dùng đến
    // const handleRowsPerPageChange = (event) => {
    //     const newLimit = parseInt(event.target.value, 10);
    //     setQuery(prev => ({ ...prev, limit: newLimit, page: 1 }));
    // };

    const handleRefresh = () => {
        loadHealthProfile();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleBack = () => navigate(`/${user.role}/students`);
    const handleAddProfile = () => navigate(`/nurse/health-profiles/${studentId}/add`);
    const handleEditProfile = (profileId) => navigate(`/nurse/health-profiles/${studentId}/edit`);
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };
    
    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Phần Header không thay đổi */}
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
                            {studentInfo ? `${studentInfo.name} (Mã HS: ${studentInfo.studentCode})` : 'Đang tải thông tin...'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton onClick={handleRefresh} color="primary">
                        <RefreshIcon />
                    </IconButton>
                    <Button 
                        variant="contained" 
                        startIcon={<EditIcon />} 
                        onClick={handleAddProfile} 
                        // Sửa lại logic: Nút "Tạo mới" luôn được bật
                        // disabled={!healthProfile || healthProfile.length === 0}
                    >
                        Tạo hồ sơ mới
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : !healthProfile || healthProfile.length === 0 ? (
                // --- THÊM NÚT TẠO HỒ SƠ KHI DANH SÁCH RỖNG ---
                <Alert severity="info" action={
                    <Button color="primary" size="small" onClick={handleAddProfile}>
                        Tạo hồ sơ đầu tiên
                    </Button>
                }>Học sinh này chưa có hồ sơ y tế.</Alert>
            ) : (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Danh sách hồ sơ y tế ({paginationInfo.total} hồ sơ)
                            </Typography>
                        </Box>
                        
                        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
                            {/* Bỏ các style scrollbar tùy chỉnh để giữ code gốc */}
                            <Table stickyHeader sx={{ 
                                tableLayout: 'auto',
                                minWidth: 1200,
                                '& .MuiTableCell-root': {
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    verticalAlign: 'top',
                                    padding: '12px 8px'
                                }
                            }}>
                                {/* TableHead không thay đổi */}
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="center">STT</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="center">Ngày tạo</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="center">Chiều cao</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 100 }} align="center">Cân nặng</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 80 }} align="center">Nhóm máu</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 150 }} align="center">Thị lực</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 180 }} align="center">Thiết bị hỗ trợ</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 200 }} align="center">Dị ứng</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 200 }} align="center">Bệnh mãn tính</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }} align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {healthProfile.map((record, index) => {
                                        const devicesSupportDisplay = formatArrayString(record.devicesSupport);
                                        const allergiesDisplay = formatArrayString(record.allergies);
                                        const chronicDiseasesDisplay = formatArrayString(record.chronicDiseases);

                                        return (
                                            <TableRow key={record._id || index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }, '&:hover': { backgroundColor: 'inherit !important' } }}>
                                                <TableCell align="center"><Typography variant="body2" fontWeight={500}>{(paginationInfo.page - 1) * paginationInfo.limit + index + 1}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{formatDate(record.createdAt)}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{record.height ? `${record.height} cm` : 'N/A'}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{record.weight ? `${record.weight} kg` : 'N/A'}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{getDisplayValue(record.bloodType)}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="body2">{getDisplayValue(record.vision)}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="body2">{devicesSupportDisplay}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="body2">{allergiesDisplay}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="body2">{chronicDiseasesDisplay}</Typography></TableCell>
                                                
                                                {/* --- BẮT ĐẦU: CẬP NHẬT CỘT THAO TÁC --- */}
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                        <IconButton 
                                                            color="secondary"
                                                            onClick={() => handleViewDetails(record)}
                                                            size="small"
                                                            title="Xem chi tiết"
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                        {(paginationInfo.page === 1 && index === 0 && paginationInfo.total > 1) && (
                                                            <IconButton 
                                                                color="primary" 
                                                                onClick={() => handleEditProfile(studentId)}
                                                                size="small"
                                                                title="Chỉnh sửa hồ sơ mới nhất"
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                {/* --- KẾT THÚC: CẬP NHẬT CỘT THAO TÁC --- */}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'end' }}>
                            <Pagination count={paginationInfo.totalPages} page={paginationInfo.page} onChange={handlePageChange} showFirstButton showLastButton color="primary"/>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* --- BẮT ĐẦU: THÊM MODAL CHI TIẾT VÀO CUỐI COMPONENT --- */}
           {selectedProfile && (
                <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.5rem', fontWeight: 600 }}>
                        Chi tiết hồ sơ ngày {formatDate(selectedProfile.createdAt)}
                        <IconButton onClick={handleCloseModal} size="small">
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={5}>  {/* Tăng spacing để thoáng hơn */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Chiều cao</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{selectedProfile.height ? `${selectedProfile.height} cm` : 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Cân nặng</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{selectedProfile.weight ? `${selectedProfile.weight} kg` : 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Nhóm máu</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{getDisplayValue(selectedProfile.bloodType)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Thị lực</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{getDisplayValue(selectedProfile.vision)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Thiết bị hỗ trợ</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>{formatArrayString(selectedProfile.devicesSupport)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Dị ứng</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>{formatArrayString(selectedProfile.allergies)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Bệnh mãn tính</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>{formatArrayString(selectedProfile.chronicDiseases)}</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} variant="outlined" sx={{ fontSize: '1.1rem' }}>
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* --- KẾT THÚC: THÊM MODAL CHI TIẾT --- */}
        </Container>
    );
};

export default HealthProfilesPage;