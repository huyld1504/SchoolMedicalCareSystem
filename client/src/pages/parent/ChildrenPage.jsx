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
    Chip,
    Fab,
    Pagination,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    ChildCare as ChildCareIcon,
    LocalHospital as HospitalIcon,
    HealthAndSafety as HealthIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import ParentLayout from '../../components/layouts/ParentLayout';
import { extractArrayFromResponse, extractPaginationFromResponse } from '../../utils/apiResponseHelper';

const ChildrenPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Query state
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        keyword: searchParams.get('keyword') || '',
        gender: searchParams.get('gender') || ''
    });

    // Data state
    const [children, setChildren] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '');
    const [selectedChild, setSelectedChild] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuChild, setMenuChild] = useState(null);

    useEffect(() => {
        loadChildren();
    }, [query.page, query.limit, query.keyword, query.gender]); const loadChildren = async () => {
        try {
            setLoading(true);
            const params = {
                page: query.page,
                limit: query.limit,
                keyword: query.keyword || undefined,
                gender: query.gender || undefined,
            }; const response = await childApi.getAllChildren(params);
            console.log('Children response:', response);

            // Extract data using helper functions
            const childrenData = extractArrayFromResponse(response, 'children');
            const paginationData = extractPaginationFromResponse(response, {
                page: query.page,
                limit: query.limit
            });

            setChildren(childrenData);
            setPaginationInfo(paginationData);

        } catch (error) {
            console.error('Error loading children:', error);
            toast.error('Lỗi khi tải danh sách con em');
            setChildren([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setQuery(prev => ({
            ...prev,
            keyword: searchInput,
            page: 1
        }));

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if (searchInput) {
            newParams.set('keyword', searchInput);
        } else {
            newParams.delete('keyword');
        }
        setSearchParams(newParams);
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handlePageChange = (event, newPage) => {
        setQuery(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleRefresh = () => {
        loadChildren();
        toast.success('Đã làm mới danh sách');
    };

    const handleViewChild = (child) => {
        navigate(`/parent/children/${child._id}`);
    };

    const handleEditChild = (child) => {
        navigate(`/parent/children/${child._id}/edit`);
    };

    const handleCreateOrder = (child) => {
        navigate(`/parent/medical-orders/create?childId=${child._id}`);
    };

    const handleMenuClick = (event, child) => {
        setAnchorEl(event.currentTarget);
        setMenuChild(child);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuChild(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getGenderChip = (gender) => {
        const isMale = gender === 'male' || gender === 'nam';
        return (
            <Chip
                label={isMale ? 'Nam' : 'Nữ'}
                size="small"
                color={isMale ? 'primary' : 'secondary'}
                variant="outlined"
            />
        );
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
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
        <ParentLayout>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Quản lý con em
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Quản lý thông tin và hồ sơ sức khỏe của con em
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/parent/children/add')}
                        sx={{ height: 'fit-content' }}
                    >
                        Thêm con em
                    </Button>
                </Box>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976d215 0%, #1976d225 100%)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography color="text.secondary" gutterBottom variant="h6">
                                            Tổng số con em
                                        </Typography>
                                        <Typography variant="h4" component="div" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                            {paginationInfo.total}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                                        <ChildCareIcon />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* More stat cards can be added here */}
                </Grid>

                {/* Children Table */}
                <Card>
                    <CardContent>
                        {/* Table Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                                Danh sách con em
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    placeholder="Tìm kiếm theo tên..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
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
                                <Button
                                    variant="outlined"
                                    onClick={handleSearch}
                                    startIcon={<SearchIcon />}
                                >
                                    Tìm kiếm
                                </Button>
                                <Tooltip title="Làm mới">
                                    <IconButton onClick={handleRefresh} color="primary">
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Loading State */}
                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Empty State */}
                        {!loading && children.length === 0 && (
                            <Alert severity="info" sx={{ mb: 3 }}>
                                {query.keyword ?
                                    `Không tìm thấy con em nào với từ khóa "${query.keyword}"` :
                                    'Chưa có thông tin con em nào. Hãy thêm thông tin con em!'
                                }
                            </Alert>
                        )}

                        {/* Table */}
                        {!loading && children.length > 0 && (
                            <>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Họ và tên</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Mã học sinh</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Tuổi</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Giới tính</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Ngày sinh</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>BHYT</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {children.map((child) => (
                                                <TableRow
                                                    key={child._id}
                                                    hover
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ bgcolor: '#1976d2', mr: 2, width: 40, height: 40 }}>
                                                                <PersonIcon />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                    {child.name}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {child.studentCode}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{child.studentCode}</TableCell>
                                                    <TableCell>{calculateAge(child.birthdate)} tuổi</TableCell>
                                                    <TableCell>{getGenderChip(child.gender)}</TableCell>
                                                    <TableCell>{formatDate(child.birthdate)}</TableCell>
                                                    <TableCell>{child.medicalConverageId || 'Chưa có'}</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Tooltip title="Xem chi tiết">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => handleViewChild(child)}
                                                                >
                                                                    <ViewIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Chỉnh sửa">
                                                                <IconButton
                                                                    size="small"
                                                                    color="secondary"
                                                                    onClick={() => handleEditChild(child)}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Thêm thao tác">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => handleMenuClick(e, child)}
                                                                >
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                {paginationInfo.totalPages > 1 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Pagination
                                            count={paginationInfo.totalPages}
                                            page={query.page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            size="large"
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Menu for additional actions */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => { handleCreateOrder(menuChild); handleMenuClose(); }}>
                        <HospitalIcon sx={{ mr: 2 }} />
                        Tạo đơn thuốc
                    </MenuItem>
                    <MenuItem onClick={() => { navigate(`/parent/health-profiles/${menuChild?._id}`); handleMenuClose(); }}>
                        <HealthIcon sx={{ mr: 2 }} />
                        Xem hồ sơ sức khỏe
                    </MenuItem>
                </Menu>

                {/* Floating Action Button for mobile */}
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        display: { xs: 'flex', md: 'none' }
                    }}
                    onClick={() => navigate('/parent/children/add')}
                >
                    <AddIcon />
                </Fab>
            </Container>
        </ParentLayout>
    );
};

export default ChildrenPage;
