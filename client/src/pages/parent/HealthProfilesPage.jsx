import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    ExpandMore,
    HealthAndSafety,
    Person,
    Height,
    MonitorWeight,
    Thermostat,
    Bloodtype,
    Visibility,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    Timeline as TimelineIcon,
    TrendingUp,
    CalendarToday,
    Assignment
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import healthProfileAPI from '../../api/healthProfileApi';
import ParentLayout from '../../components/layouts/ParentLayout';

const HealthProfilesPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Data state
    const [children, setChildren] = useState([]);
    const [healthProfiles, setHealthProfiles] = useState({});
    const [selectedChild, setSelectedChild] = useState(searchParams.get('childId') || 'all');
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [expandedProfile, setExpandedProfile] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (children.length > 0) {
            loadHealthProfiles();
        }
    }, [selectedChild, children]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            // Load children
            const childrenData = await childApi.getAllChildren();
            const childrenArray = Array.isArray(childrenData) ? childrenData : childrenData?.data?.records || [];
            setChildren(childrenArray);

            // If specific child is selected from URL, validate it exists
            const childIdFromUrl = searchParams.get('childId');
            if (childIdFromUrl && !childrenArray.find(c => c._id === childIdFromUrl)) {
                setSelectedChild('all');
            }
        } catch (error) {
            console.error('Error loading children:', error);
            toast.error('Không thể tải danh sách con em');
        } finally {
            setLoading(false);
        }
    };

    const loadHealthProfiles = async () => {
        try {
            const profilesData = {};

            if (selectedChild === 'all') {
                // Load profiles for all children
                for (const child of children) {
                    try {
                        const profiles = await healthProfileAPI.getByChildId(child._id);
                        profilesData[child._id] = Array.isArray(profiles) ? profiles : profiles?.data || [];
                    } catch (err) {
                        console.warn(`Error loading profiles for child ${child._id}:`, err);
                        profilesData[child._id] = [];
                    }
                }
            } else {
                // Load profiles for selected child only
                try {
                    const profiles = await healthProfileAPI.getByChildId(selectedChild);
                    profilesData[selectedChild] = Array.isArray(profiles) ? profiles : profiles?.data || [];
                } catch (err) {
                    console.warn(`Error loading profiles for child ${selectedChild}:`, err);
                    profilesData[selectedChild] = [];
                }
            }

            setHealthProfiles(profilesData);
        } catch (error) {
            console.error('Error loading health profiles:', error);
            toast.error('Không thể tải hồ sơ sức khỏe');
        }
    };

    const handleChildChange = (event) => {
        const value = event.target.value;
        setSelectedChild(value);

        // Update URL
        const newParams = new URLSearchParams(searchParams);
        if (value !== 'all') {
            newParams.set('childId', value);
        } else {
            newParams.delete('childId');
        }
        setSearchParams(newParams);
    };

    const handleRefresh = () => {
        loadHealthProfiles();
        toast.success('Đã làm mới dữ liệu');
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedProfile(isExpanded ? panel : false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getChildName = (childId) => {
        const child = children.find(c => c._id === childId);
        return child ? child.name : 'N/A';
    };

    const getTotalProfiles = () => {
        return Object.values(healthProfiles).reduce((total, profiles) => total + profiles.length, 0);
    };

    const getLatestProfiles = () => {
        const latest = [];
        Object.entries(healthProfiles).forEach(([childId, profiles]) => {
            if (profiles.length > 0) {
                const latestProfile = profiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                latest.push({ ...latestProfile, childId });
            }
        });
        return latest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const renderProfileCard = (profile, childId, isLatest = false) => (
        <Card
            key={profile._id}
            sx={{
                mb: 2,
                border: isLatest ? '2px solid #1976d2' : '1px solid #e0e0e0',
                position: 'relative'
            }}
        >
            {isLatest && (
                <Chip
                    label="Mới nhất"
                    color="primary"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1
                    }}
                />
            )}
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                        <HealthAndSafety />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {getChildName(childId)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Khám ngày: {formatDate(profile.createdAt)}
                        </Typography>
                        {profile.doctorName && (
                            <Typography variant="body2" color="text.secondary">
                                Bác sĩ: {profile.doctorName}
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Height sx={{ mr: 1, color: '#1976d2' }} />
                            <Typography variant="body2" color="text.secondary">
                                Chiều cao
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {profile.height ? `${profile.height} cm` : 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MonitorWeight sx={{ mr: 1, color: '#2e7d32' }} />
                            <Typography variant="body2" color="text.secondary">
                                Cân nặng
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {profile.weight ? `${profile.weight} kg` : 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Bloodtype sx={{ mr: 1, color: '#d32f2f' }} />
                            <Typography variant="body2" color="text.secondary">
                                Huyết áp
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {profile.bloodPressure || 'N/A'}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Thermostat sx={{ mr: 1, color: '#ed6c02' }} />
                            <Typography variant="body2" color="text.secondary">
                                Nhiệt độ
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {profile.temperature ? `${profile.temperature}°C` : 'N/A'}
                        </Typography>
                    </Grid>
                </Grid>

                {profile.notes && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Ghi chú của bác sĩ:
                        </Typography>
                        <Typography variant="body2">
                            {profile.notes}
                        </Typography>
                    </Box>
                )}

                {profile.recommendations && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="body2" color="primary.main" sx={{ mb: 1, fontWeight: 600 }}>
                            Khuyến nghị:
                        </Typography>
                        <Typography variant="body2">
                            {profile.recommendations}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

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

    if (loading) {
        return (
            <ParentLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            </ParentLayout>
        );
    }

    const latestProfiles = getLatestProfiles();
    const filteredChildren = selectedChild === 'all' ? children : children.filter(c => c._id === selectedChild);

    return (
        <ParentLayout>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Hồ sơ sức khỏe
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Theo dõi tình hình sức khỏe của con em
                        </Typography>
                    </Box>

                    <Tooltip title="Làm mới">
                        <IconButton onClick={handleRefresh} color="primary" size="large">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Tổng hồ sơ"
                            value={getTotalProfiles()}
                            icon={<Assignment />}
                            color="#1976d2"
                            subtitle="Tất cả con em"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Con em"
                            value={children.length}
                            icon={<Person />}
                            color="#2e7d32"
                            subtitle="Đang theo dõi"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Khám gần đây"
                            value={latestProfiles.length}
                            icon={<CalendarToday />}
                            color="#ed6c02"
                            subtitle="Trong tháng này"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Cần theo dõi"
                            value={2}
                            icon={<TrendingUp />}
                            color="#d32f2f"
                            subtitle="Cảnh báo sức khỏe"
                        />
                    </Grid>
                </Grid>

                {/* Filters */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Chọn con em</InputLabel>
                                    <Select
                                        value={selectedChild}
                                        label="Chọn con em"
                                        onChange={handleChildChange}
                                    >
                                        <MenuItem value="all">Tất cả con em</MenuItem>
                                        {children.map((child) => (
                                            <MenuItem key={child._id} value={child._id}>
                                                {child.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    placeholder="Tìm kiếm..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Content */}
                {children.length === 0 ? (
                    <Alert severity="info">
                        Chưa có thông tin con em. Hãy thêm thông tin con em trước!
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {/* Latest Profiles Overview */}
                        {selectedChild === 'all' && latestProfiles.length > 0 && (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                        Hồ sơ mới nhất
                                    </Typography>
                                    {latestProfiles.slice(0, 3).map((profile) =>
                                        renderProfileCard(profile, profile.childId, true)
                                    )}

                                    {latestProfiles.length > 3 && (
                                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                                            <Button onClick={() => setSelectedChild('all')}>
                                                Xem tất cả ({latestProfiles.length})
                                            </Button>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        )}

                        {/* Detailed View by Child */}
                        <Grid item xs={12}>
                            {filteredChildren.map((child) => {
                                const childProfiles = healthProfiles[child._id] || [];
                                const sortedProfiles = childProfiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                                return (
                                    <Accordion
                                        key={child._id}
                                        expanded={expandedProfile === child._id}
                                        onChange={handleAccordionChange(child._id)}
                                        sx={{ mb: 2 }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            sx={{ bgcolor: '#f5f5f5' }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                                                    <Person />
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {child.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {childProfiles.length} hồ sơ sức khỏe
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={`${childProfiles.length} hồ sơ`}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {childProfiles.length === 0 ? (
                                                <Alert severity="info">
                                                    Chưa có hồ sơ sức khỏe nào cho {child.name}
                                                </Alert>
                                            ) : (
                                                <Box>
                                                    {sortedProfiles.map((profile, index) =>
                                                        renderProfileCard(profile, child._id, index === 0)
                                                    )}
                                                </Box>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Grid>
                    </Grid>
                )}
            </Container>
        </ParentLayout>
    );
};

export default HealthProfilesPage;
