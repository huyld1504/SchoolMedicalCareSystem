import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Avatar,
    Divider,
} from '@mui/material';
import {
    Save as SaveIcon,
    ArrowBack as BackIcon,
    Refresh as RefreshIcon,
    Person as PersonIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import healthProfileAPI from '../../api/healthProfileApi';

// Validation schema
const validationSchema = yup.object({
    height: yup
        .number('Chiều cao phải là số')
        .positive('Chiều cao phải lớn hơn 0')
        .max(300, 'Chiều cao không hợp lệ'),
    weight: yup
        .number('Cân nặng phải là số')
        .positive('Cân nặng phải lớn hơn 0')
        .max(500, 'Cân nặng không hợp lệ'),
    bloodType: yup
        .string('Nhóm máu phải là chuỗi')
        .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Nhóm máu không hợp lệ'),
    vision: yup
        .string('Thị lực phải là chuỗi')
        .max(100, 'Thị lực quá dài'),
    allergies: yup
        .string('Dị ứng phải là chuỗi')
        .max(500, 'Thông tin dị ứng quá dài'),
    chronicDiseases: yup
        .string('Bệnh mãn tính phải là chuỗi')
        .max(500, 'Thông tin bệnh mãn tính quá dài'),
    devicesSupport: yup
        .string('Thiết bị hỗ trợ phải là chuỗi')
        .max(200, 'Thông tin thiết bị hỗ trợ quá dài'),
   
});

const EditHealthProfilePage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [latestHealthProfile, setLatestHealthProfile] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadLatestHealthProfile();
    }, [studentId]);

    const loadLatestHealthProfile = async () => {
        try {
            setLoading(true);

            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId);
                console.log('Health profile response:', response);
                
                if (response.isSuccess && response.data.records && response.data.records.length > 0) {
                    // Lấy hồ sơ mới nhất (sắp xếp theo ngày tạo)
                    const sortedProfiles = response.data.records.sort((a, b) => 
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    const latestProfile = sortedProfiles[0];
                    
                    setLatestHealthProfile(latestProfile);
                    
                    // Lấy thông tin student từ healthProfile
                    if (latestProfile.studentId) {
                        setStudentInfo(latestProfile.studentId);
                    }
                    
                    console.log('Latest health profile:', latestProfile);
                    
                    // Set initial values cho form với data mới nhất
                    formik.setValues({
                        height: latestProfile.height || '',
                        weight: latestProfile.weight || '',
                        bloodType: latestProfile.bloodType || '',
                        vision: latestProfile.vision || '',
                        allergies: latestProfile.allergies || '',
                        chronicDiseases: latestProfile.chronicDiseases || '',
                        devicesSupport: latestProfile.devicesSupport || '',
                      
                    });
                } else {
                    toast.error('Không tìm thấy hồ sơ y tế nào');
                }
            }
        } catch (error) {
            console.error('Error loading health profile:', error);
            toast.error('Lỗi khi tải hồ sơ y tế');
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            height: '',
            weight: '',
            bloodType: '',
            vision: '',
            allergies: '',
            chronicDiseases: '',
            devicesSupport: '',
          
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setUpdating(true);

                // Cập nhật hồ sơ y tế mới nhất
                const response = await healthProfileAPI.updateHealthProfile(latestHealthProfile._id, values);

                if (response.isSuccess) {
                    toast.success('Cập nhật hồ sơ y tế thành công');
                    navigate(`/nurse/health-profiles/${studentId}`);
                } else {
                    toast.error(response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
                }
            } catch (error) {
                console.error('Error updating health profile:', error);
                toast.error('Lỗi khi cập nhật hồ sơ y tế');
            } finally {
                setUpdating(false);
            }
        },
    });

    const handleBack = () => {
        navigate(`/nurse/health-profiles/${studentId}`);
    };

    const handleRefresh = () => {
        loadLatestHealthProfile();
        toast.success('Đã làm mới dữ liệu');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                        <BackIcon />
                    </IconButton>
                    <EditIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Chỉnh sửa hồ sơ y tế
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                            Cập nhật thông tin hồ sơ y tế mới nhất
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {studentInfo ?
                                `${studentInfo.name} (Mã HS: ${studentInfo.studentCode})` :
                                'Đang tải thông tin...'
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

            {/* Content */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : !latestHealthProfile ? (
                <Alert severity="warning">
                    Không tìm thấy hồ sơ y tế để chỉnh sửa.
                </Alert>
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Thông tin học sinh */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                        Thông tin học sinh
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
                                            {studentInfo?.name?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {studentInfo?.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Mã HS: {studentInfo?.studentCode} | Ngày sinh: {formatDate(studentInfo?.birthdate)} |
                                                Giới tính: {studentInfo?.gender === 'male' ? 'Nam' : 'Nữ'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Hồ sơ hiện tại (được tạo: {formatDate(latestHealthProfile?.createdAt)})
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Bạn đang chỉnh sửa hồ sơ y tế mới nhất của học sinh này.
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Thông số cơ thể */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                        Thông số cơ thể
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="height"
                                                name="height"
                                                label="Chiều cao (cm)"
                                                type="number"
                                                value={formik.values.height}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.height && Boolean(formik.errors.height)}
                                                helperText={formik.touched.height && formik.errors.height}
                                                InputProps={{
                                                    inputProps: { min: 0, max: 300 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="weight"
                                                name="weight"
                                                label="Cân nặng (kg)"
                                                type="number"
                                                value={formik.values.weight}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                                helperText={formik.touched.weight && formik.errors.weight}
                                                InputProps={{
                                                    inputProps: { min: 0, max: 500 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Nhóm máu</InputLabel>
                                                <Select
                                                    id="bloodType"
                                                    name="bloodType"
                                                    value={formik.values.bloodType}
                                                    label="Nhóm máu"
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}
                                                >
                                                    <MenuItem value="">Chọn nhóm máu</MenuItem>
                                                    {bloodTypes.map((type) => (
                                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="vision"
                                                name="vision"
                                                label="Thị lực"
                                                value={formik.values.vision}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.vision && Boolean(formik.errors.vision)}
                                                helperText={formik.touched.vision && formik.errors.vision}
                                                placeholder="VD: 10/10, cận thị, viễn thị..."
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="devicesSupport"
                                                name="devicesSupport"
                                                label="Thiết bị hỗ trợ"
                                                value={formik.values.devicesSupport}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.devicesSupport && Boolean(formik.errors.devicesSupport)}
                                                helperText={formik.touched.devicesSupport && formik.errors.devicesSupport}
                                                placeholder="VD: kính cận, máy trợ thính..."
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Tình trạng sức khỏe */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                        Tình trạng sức khỏe
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="allergies"
                                                name="allergies"
                                                label="Dị ứng"
                                                multiline
                                                rows={3}
                                                value={formik.values.allergies}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                                                helperText={formik.touched.allergies && formik.errors.allergies}
                                                placeholder="Mô tả các loại dị ứng nếu có..."
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="chronicDiseases"
                                                name="chronicDiseases"
                                                label="Bệnh mãn tính"
                                                multiline
                                                rows={3}
                                                value={formik.values.chronicDiseases}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.chronicDiseases && Boolean(formik.errors.chronicDiseases)}
                                                helperText={formik.touched.chronicDiseases && formik.errors.chronicDiseases}
                                                placeholder="Mô tả các bệnh mãn tính nếu có..."
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Ghi chú */}
                      

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={updating}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={updating || !formik.isValid}
                                >
                                    {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            )}
        </Container>
    );
};

export default EditHealthProfilePage;
