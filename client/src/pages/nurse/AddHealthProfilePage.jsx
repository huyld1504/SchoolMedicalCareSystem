import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import studentsApi from '../../api/studentsApi';
import healthProfileAPI from '../../api/healthProfileApi';

// --- Constants and Helper Functions ---
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// Validation schema
const validationSchema = yup.object({
    height: yup
        .number('Chiều cao phải là số')
        .positive('Chiều cao phải lớn hơn 0')
        .min(50, 'Chiều cao tối thiểu 50cm')
        .max(300, 'Chiều cao không hợp lệ')
        .nullable()
        .required('Chiều cao là bắt buộc'),
    weight: yup
        .number('Cân nặng phải là số')
        .positive('Cân nặng phải lớn hơn 0')
        .min(10, 'Cân nặng tối thiểu 10kg')
        .max(500, 'Cân nặng không hợp lệ')
        .nullable()
        .required('Cân nặng là bắt buộc'),
        
    bloodType: yup
        .string('Nhóm máu phải là chuỗi')
        .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Nhóm máu không hợp lệ')
        .nullable()
        .required('Nhóm máu là bắt buộc'),
    vision: yup
        .string('Thị lực phải là chuỗi')
        .max(100, 'Thông tin thị lực quá dài')
        .nullable()
        .required('Thông tin thị lực là bắt buộc'),
    allergies: yup
        .string('Dị ứng phải là chuỗi')
        .max(1000, 'Thông tin dị ứng quá dài')
        .nullable(),
    chronicDiseases: yup
        .string('Bệnh mãn tính phải là chuỗi')
        .max(1000, 'Thông tin bệnh mãn tính quá dài')
        .nullable(),
    devicesSupport: yup
        .string('Thiết bị hỗ trợ phải là chuỗi')
        .max(500, 'Thông tin thiết bị hỗ trợ quá dài')
        .nullable(),
});

// --- Inline UI Components ---
const StudentInfoSidebar = ({ student }) => {
    if (!student) return null;

    const genderText = student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'N/A';

    return (
        <Card variant="outlined" sx={{ position: 'sticky', top: 24, width: '300px', height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: '2.5rem' }}>
                        {student.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {student.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Mã HS: {student.studentCode}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Ngày sinh
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {formatDate(student.birthdate)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Giới tính
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {genderText}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Mã bảo hiểm y tế
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {student.medicalConverageId}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const SectionHeader = ({ icon, title }) => (
    <>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {icon} {title}
            </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
    </>
);

const HealthProfileForm = ({ formik, saving, onCancel }) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <Card variant="outlined">
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                        Thông tin Hồ sơ Y tế
                    </Typography>

                    <SectionHeader icon="📏" title="Thông số cơ thể" />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="height"
                                name="height"
                                label="Chiều cao (cm)"
                                type="number"
                                {...formik.getFieldProps('height')}
                                error={formik.touched.height && Boolean(formik.errors.height)}
                                helperText={formik.touched.height && formik.errors.height}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="weight"
                                name="weight"
                                label="Cân nặng (kg)"
                                type="number"
                                {...formik.getFieldProps('weight')}
                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                helperText={formik.touched.weight && formik.errors.weight}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}>
                                <InputLabel>Nhóm máu</InputLabel>
                                <Select
                                    label="Nhóm máu"
                                    name="bloodType"
                                    {...formik.getFieldProps('bloodType')}
                                >
                                    <MenuItem value=""><em>Không rõ</em></MenuItem>
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
                                label="Tình trạng thị lực"
                                {...formik.getFieldProps('vision')}
                                error={formik.touched.vision && Boolean(formik.errors.vision)}
                                helperText={formik.touched.vision && formik.errors.vision}
                                placeholder="VD: Mắt phải 10/10, Mắt trái cận 1.5 độ"
                            />
                        </Grid>
                    </Grid>

                    <SectionHeader icon="🏥" title="Tiền sử bệnh & Dị ứng" />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="chronicDiseases"
                                name="chronicDiseases"
                                label="Bệnh mãn tính hoặc lưu ý đặc biệt"
                                multiline
                                rows={4}
                                {...formik.getFieldProps('chronicDiseases')}
                                error={formik.touched.chronicDiseases && Boolean(formik.errors.chronicDiseases)}
                                helperText={formik.touched.chronicDiseases && formik.errors.chronicDiseases}
                                placeholder="Ghi rõ các bệnh như: hen suyễn, tim mạch, động kinh... Nếu không có, ghi 'Không'."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="allergies"
                                name="allergies"
                                label="Dị ứng (thuốc, thực phẩm, ...)"
                                multiline
                                rows={4}
                                {...formik.getFieldProps('allergies')}
                                error={formik.touched.allergies && Boolean(formik.errors.allergies)}
                                helperText={formik.touched.allergies && formik.errors.allergies}
                                placeholder="Ghi rõ loại dị ứng và biểu hiện. VD: Dị ứng Penicillin (gây mẩn ngứa), dị ứng hải sản (gây khó thở)... Nếu không có, ghi 'Không'."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="devicesSupport"
                                name="devicesSupport"
                                multiline
                                rows={4}
                                label="Thiết bị hỗ trợ (nếu có)"
                                {...formik.getFieldProps('devicesSupport')}
                                error={formik.touched.devicesSupport && Boolean(formik.errors.devicesSupport)}
                                helperText={formik.touched.devicesSupport && formik.errors.devicesSupport}
                                placeholder="VD: Kính cận, máy trợ thính..."
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="text" onClick={onCancel} disabled={saving}>
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            disabled={saving || !formik.isValid}
                        >
                            {saving ? 'Đang tạo...' : 'Tạo hồ sơ mới'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

// --- Main Page Component ---
const AddHealthProfilePage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [healthProfile, setHealthProfile] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);

            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId, {});
                console.log('Health profile response:', response);

                if (response.isSuccess && response.data.records && response.data.records.length > 0) {
                    const latestProfile = response.data.records.sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    )[0];

                    setHealthProfile(latestProfile);

                    if (latestProfile.studentId) {
                        setStudentInfo(latestProfile.studentId);
                    }

                    console.log('Latest health profile:', latestProfile);

                    formik.setValues({
                        height: latestProfile.height || '',
                        weight: latestProfile.weight || '',
                        bloodType: latestProfile.bloodType || '',
                        vision: latestProfile.vision || '',
                        allergies: latestProfile.allergies || '',
                        chronicDiseases: latestProfile.chronicDiseases || '',
                        devicesSupport: latestProfile.devicesSupport || '',
                    });
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Lỗi khi tải thông tin');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
                setSaving(true);

                const profileData = {
                    ...values,
                    studentId: studentId
                };

                const response = await healthProfileAPI.create(profileData);

                if (response.isSuccess) {
                    toast.success('Tạo hồ sơ y tế mới thành công');
                    navigate(`/nurse/health-profiles/${studentId}`);
                } else {
                    toast.error(response.message || 'Có lỗi xảy ra khi tạo hồ sơ mới');
                }
            } catch (error) {
                console.error('Error creating health profile:', error);
                toast.error('Lỗi khi tạo hồ sơ y tế mới');
            } finally {
                setSaving(false);
            }
        },
    });

    const handleBack = () => {
        navigate(`/nurse/health-profiles/${studentId}`);
    };

    const handleRefresh = () => {
        loadData();
        toast.success('Đã làm mới dữ liệu');
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={handleBack} aria-label="Quay lại">
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Tạo hồ sơ Y tế mới
                    </Typography>
                </Box>
                <Tooltip title="Làm mới dữ liệu">
                    <span>
                        <IconButton onClick={handleRefresh} color="primary" disabled={loading || saving}>
                            <RefreshIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            {/* Main Content */}
            {!studentInfo ? (
                <Alert severity="error" sx={{ m: 2 }}>
                    Không thể tải dữ liệu học sinh. Vui lòng quay lại trang danh sách và thử lại.
                </Alert>
            ) : (
                <Grid container spacing={{ xs: 2, md: 4 }}>
                    <Grid item xs={12} md={4}>
                        <StudentInfoSidebar student={studentInfo} />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <HealthProfileForm formik={formik} saving={saving} onCancel={handleBack} />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default AddHealthProfilePage;
