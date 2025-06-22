import React, { useState, useEffect, useCallback } from 'react';
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

// === THÊM HÀM HELPER MỚI TẠI ĐÂY ===
/**
 * Chuyển đổi một chuỗi JSON của mảng thành một chuỗi dễ đọc.
 * @param {string} jsonString - Chuỗi JSON từ API (VD: "[\"A\",\"B\"]")
 * @returns {string} - Chuỗi đã định dạng (VD: "A, B") hoặc 'Không có'
 */
const formatArrayString = (jsonString) => {
    if (!jsonString) {
        return 'Không có';
    }
    try {
        const arr = JSON.parse(jsonString);
        if (Array.isArray(arr) && arr.length > 0) {
            return arr.join(', '); // Nối các phần tử bằng ", "
        }
        return 'Không có'; // Mảng rỗng
    } catch (error) {
        // Nếu parse lỗi, có thể nó là một chuỗi thông thường, trả về chính nó
        return jsonString;
    }
};

const HealthProfilesPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    // State cho pagination
    const [query, setQuery] = useState({ page: 1, limit: 10 });
    // State cho data từ API
    const [healthProfile, setHealthProfile] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleRowsPerPageChange = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        setQuery(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    const handleRefresh = () => {
        loadHealthProfile();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleBack = () => navigate('/nurse/students');
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
    const getTruncatedValue = (value, maxLength = 15) => {
        if (!value || value.length <= maxLength) return value;
        return value.substring(0, maxLength) + '...';
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}><BackIcon /></IconButton>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>Hồ sơ y tế học sinh</Typography>
                        <Typography variant="h6" color="text.secondary">{studentInfo ? `${studentInfo.name} (Mã HS: ${studentInfo.studentCode})` : 'Đang tải thông tin...'}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Làm mới"><IconButton onClick={handleRefresh} color="primary"><RefreshIcon /></IconButton></Tooltip>
                    <Button variant="contained" startIcon={<EditIcon />} onClick={handleAddProfile} disabled={!healthProfile || healthProfile.length === 0}>Tạo hồ sơ mới</Button>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : !healthProfile || healthProfile.length === 0 ? (
                <Alert severity="info">Học sinh này chưa có hồ sơ y tế</Alert>
            ) : (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách hồ sơ y tế ({paginationInfo.total} hồ sơ)</Typography>
                        </Box>
                        <TableContainer sx={{ maxHeight: 600, overflowX: 'hidden', overflowY: 'auto' }}>
                            <Table stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
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
                                    {healthProfile.map((record, index) => {
                                        // ÁP DỤNG HÀM MỚI Ở ĐÂY
                                        const devicesSupportDisplay = formatArrayString(record.devicesSupport);
                                        const allergiesDisplay = formatArrayString(record.allergies);
                                        const chronicDiseasesDisplay = formatArrayString(record.chronicDiseases);

                                        return (
                                            <TableRow key={record._id || index} hover>
                                                <TableCell align="center"><Typography variant="body2">{(paginationInfo.page - 1) * paginationInfo.limit + index + 1}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{formatDate(record.createdAt)}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{record.height ? `${record.height} cm` : 'N/A'}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{record.weight ? `${record.weight} kg` : 'N/A'}</Typography></TableCell>
                                                <TableCell align="center"><Typography variant="body2">{getDisplayValue(record.bloodType)}</Typography></TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={getDisplayValue(record.vision)} placement="top">
                                                        <Typography variant="body2" sx={{ cursor: 'help' }}>{getTruncatedValue(getDisplayValue(record.vision), 10)}</Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                {/* HIỂN THỊ DỮ LIỆU ĐÃ SỬA */}
                                                <TableCell align="center">
                                                    <Tooltip title={devicesSupportDisplay} placement="top">
                                                        <Typography variant="body2" sx={{ cursor: 'help' }}>{getTruncatedValue(devicesSupportDisplay, 12)}</Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={allergiesDisplay} placement="top">
                                                        <Typography variant="body2" sx={{ cursor: 'help' }}>{getTruncatedValue(allergiesDisplay, 15)}</Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title={chronicDiseasesDisplay} placement="top">
                                                        <Typography variant="body2" sx={{ cursor: 'help' }}>{getTruncatedValue(chronicDiseasesDisplay, 15)}</Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {(paginationInfo.page === 1 && index === 0) && (
                                                        <Tooltip title="Chỉnh sửa hồ sơ">
                                                            <IconButton color="primary" onClick={() => handleEditProfile(studentId)}><EditIcon /></IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={paginationInfo.totalPages}
                                page={paginationInfo.page}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default HealthProfilesPage;