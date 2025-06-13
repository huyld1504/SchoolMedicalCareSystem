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
        Divider,
        List,
        ListItem,
        ListItemText,
        ListItemIcon
    } from '@mui/material';
    import {
        Search as SearchIcon,
        Visibility as ViewIcon,
        Edit as EditIcon,
        Person as PersonIcon,
        Height as HeightIcon,
        MonitorWeight as WeightIcon,
        Bloodtype as BloodIcon,
        Visibility as VisionIcon,
        Warning as AllergyIcon,
        LocalHospital as DiseaseIcon,
        Refresh as RefreshIcon,
        ArrowBack as BackIcon,
        DevicesOther as DevicesIcon
    } from '@mui/icons-material';
    import { useSelector } from 'react-redux';
    import { useParams, useNavigate } from 'react-router';
    import { toast } from 'react-toastify';
    import studentsApi from '../api/studentsApi';
    import healthProfileAPI from '../api/healthProfileApi';

    const HealthProfilesPage = () => {
        const { studentId } = useParams();
        const navigate = useNavigate();
        const { user } = useSelector((state) => state.auth);
        const [healthProfiles, setHealthProfiles] = useState([]);
        const [studentInfo, setStudentInfo] = useState(null);
        const [loading, setLoading] = useState(true);
        const [searchTerm, setSearchTerm] = useState('');
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);
        const [totalProfiles, setTotalProfiles] = useState(0);
        const [selectedProfile, setSelectedProfile] = useState(null);

        useEffect(() => {
            loadHealthProfiles();
        }, [studentId, page, rowsPerPage, searchTerm]); const loadHealthProfiles = async () => {
            try {
                setLoading(true);

                if (studentId) {
                    // Lấy thông tin học sinh trước


                    // Lấy hồ sơ y tế của học sinh cụ thể
                    const response = await healthProfileAPI.getByChildId(studentId);
                    console.log(response)
                    if (response.data.records) {
                        // Data trả về là object trực tiếp, không phải nested trong records
                        setHealthProfiles(response.data.records);
                        console.log(healthProfiles);
                        setTotalProfiles(1);
                    }
                }
                // else {
                //     // Lấy tất cả hồ sơ y tế
                //     const params = {
                //         page: page + 1,
                //         limit: rowsPerPage,
                //         search: searchTerm || undefined
                //     };
                //     const response = await healthProfileAPI.getByChildId(studentId);
                //     if (response.data) {
                //         const { records, total } = response.data;
                //         setHealthProfiles(records || []);
                //         setTotalProfiles(total || 0);
                //     }
                // }
            } catch (error) {
                console.error('Error loading health profiles:', error);
                toast.error('Lỗi khi tải hồ sơ y tế');
                setHealthProfiles([]);
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

        const handleRefresh = () => {
            loadHealthProfiles();
            toast.success('Đã làm mới dữ liệu');
        };

        const handleBack = () => {
            navigate('/nurse/students');
        };

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('vi-VN');
        };

        const HealthInfoItem = ({ icon, label, value, color = 'primary.main' }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{
                    bgcolor: `${color}15`,
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        {label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {value || 'N/A'}
                    </Typography>
                </Box>
            </Box>
        );

        return (
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {studentId && (
                            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                                <BackIcon />
                            </IconButton>
                        )}                    <Box>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                {studentId ? 'Hồ sơ y tế học sinh' : 'Tất cả hồ sơ y tế'}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {studentId && studentInfo ?
                                    `${studentInfo.name} (Mã HS: ${studentInfo.studentCode})` :
                                    `Tổng số hồ sơ: ${totalProfiles}`
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
                    </Box>
                </Box>

                {/* Search */}
                {!studentId && (
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo tên học sinh..."
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
                        </CardContent>
                    </Card>
                )}

                {/* Health Profiles Content */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : healthProfiles.length === 0 ? (
                    <Alert severity="info">
                        {studentId ? 'Học sinh này chưa có hồ sơ y tế' : 'Chưa có hồ sơ y tế nào'}
                    </Alert>
                ) : (
                    <>
                        {studentId ? (
                            // Hiển thị chi tiết hồ sơ y tế của một học sinh
                            <Grid container spacing={3}>
                                {healthProfiles.map((profile) => (
                                
                                    <React.Fragment key={profile._id}>
                                        {/* Thông tin cơ bản */}
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                                        Thông tin học sinh
                                                    </Typography>
                                                    <Grid container spacing={3}>                                                    <Grid item xs={12} md={4}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
                                                                {profile?.name?.charAt(0)?.toUpperCase() || 'N'}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                    {profile.studentId?.name || 'N/A'}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Mã HS: {profile.studentId?.studentCode || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                        <Grid item xs={12} md={8}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={6}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Ngày sinh
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        {formatDate(profile.studentId?.birthdate) || 'N/A'}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Giới tính
                                                                    </Typography>
                                                                    <Typography variant="body1">
                                                                        {profile.studentId?.gender === 'male' ? 'Nam' : studentInfo?.gender === 'female' ? 'Nữ' : 'N/A'}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        {/* Thông số sức khỏe */}
                                        <Grid item xs={12} md={6}>
                                            <Card sx={{ height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                                        Thông số cơ thể
                                                    </Typography>
                                                    <HealthInfoItem
                                                        icon={<HeightIcon />}
                                                        label="Chiều cao"
                                                        value={profile.height ? `${profile.height} cm` : 'N/A'}
                                                        color="#2e7d32"
                                                    />
                                                    <HealthInfoItem
                                                        icon={<WeightIcon />}
                                                        label="Cân nặng"
                                                        value={profile.weight ? `${profile.weight} kg` : 'N/A'}
                                                        color="#1976d2"
                                                    />
                                                    <HealthInfoItem
                                                        icon={<BloodIcon />}
                                                        label="Nhóm máu"
                                                        value={profile.bloodType}
                                                        color="#d32f2f"
                                                    />                                                <HealthInfoItem
                                                        icon={<VisionIcon />}
                                                        label="Thị lực"
                                                        value={profile.vision}
                                                        color="#ed6c02"
                                                    />                                                <HealthInfoItem
                                                        icon={<DevicesIcon />}
                                                        label="Thiết bị hỗ trợ"
                                                        value={profile.devicesSupport && profile.devicesSupport.trim() !== '' ? profile.devicesSupport : 'Không có'}
                                                        color="#9c27b0"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        {/* Tình trạng sức khỏe */}
                                        <Grid item xs={12} md={6}>
                                            <Card sx={{ height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                                        Tình trạng sức khỏe
                                                    </Typography>                                                <HealthInfoItem
                                                        icon={<AllergyIcon />}
                                                        label="Dị ứng"
                                                        value={profile.allergies && profile.allergies.trim() !== '' ? profile.allergies : 'Không có'}
                                                        color="#ff9800"
                                                    />
                                                    <HealthInfoItem
                                                        icon={<DiseaseIcon />}
                                                        label="Bệnh mãn tính"
                                                        value={profile.chronicDiseases && profile.chronicDiseases.trim() !== '' ? profile.chronicDiseases : 'Không có'}
                                                        color="#9c27b0"
                                                    />
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Ghi chú
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {profile.notes || 'Không có ghi chú'}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        {/* Thông tin cập nhật */}
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                                                        Thông tin cập nhật
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Ngày tạo
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                {formatDate(profile.createdAt)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} md={6}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Cập nhật lần cuối
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                {formatDate(profile.updatedAt)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </React.Fragment>
                                ))}
                            </Grid>
                        ) : (
                            // Hiển thị danh sách tất cả hồ sơ y tế
                            <Card>
                                <CardContent sx={{ p: 0 }}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                    <TableCell sx={{ fontWeight: 600 }}>Học sinh</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Chiều cao/Cân nặng</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Nhóm máu</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Thị lực</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Dị ứng</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Cập nhật</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }} align="center">Thao tác</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {healthProfiles.map((profile) => (
                                                    <TableRow key={profile._id} hover>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                                    {profile.student?.name?.charAt(0)?.toUpperCase()}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                        {profile.student?.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {profile.student?.studentCode}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {profile.height ? `${profile.height}cm` : 'N/A'} / {profile.weight ? `${profile.weight}kg` : 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={profile.bloodType || 'N/A'}
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {profile.vision || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {profile.allergies || 'Không có'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(profile.updatedAt)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => navigate(`/nurse/health-profiles/${profile.student._id}`)}
                                                                >
                                                                    <ViewIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Pagination */}
                                    <TablePagination
                                        component="div"
                                        count={totalProfiles}
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
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </Container>
        );
    };

    export default HealthProfilesPage;
