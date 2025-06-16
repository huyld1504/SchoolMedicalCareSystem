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
    CalendarToday as CalendarIcon,
    Wc as WcIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import healthProfileAPI from '../../api/healthProfileApi'; // Giả sử đường dẫn này đúng
// import studentsApi from '../../api/studentsApi'; // Import này không được sử dụng, có thể bỏ đi

// --- Constants and Helper Functions (Best practice: keep them outside the component) ---

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const validationSchema = yup.object({
    height: yup.number('Chiều cao phải là số').positive('Chiều cao phải lớn hơn 0').min(50, 'Chiều cao tối thiểu 50cm').max(300, 'Chiều cao không hợp lệ').nullable(),
    weight: yup.number('Cân nặng phải là số').positive('Cân nặng phải lớn hơn 0').min(5, 'Cân nặng tối thiểu 5kg').max(300, 'Cân nặng không hợp lệ').nullable(),
    bloodType: yup.string().oneOf(bloodTypes, 'Nhóm máu không hợp lệ').nullable(),
    vision: yup.string().max(100, 'Thông tin thị lực quá dài').nullable(),
    allergies: yup.string().max(1000, 'Thông tin dị ứng quá dài').nullable(),
    chronicDiseases: yup.string().max(1000, 'Thông tin bệnh mãn tính quá dài').nullable(),
    devicesSupport: yup.string().max(500, 'Thông tin thiết bị hỗ trợ quá dài').nullable(),
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// --- Inline UI Components (Defined once, used only in this file) ---

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
            <Card variant="outlined" >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                        Thông tin Hồ sơ Y tế
                    </Typography>

                    <SectionHeader icon="📏" title="Thông số cơ thể" />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="height" name="height" label="Chiều cao (cm)" type="number" {...formik.getFieldProps('height')} error={formik.touched.height && Boolean(formik.errors.height)} helperText={formik.touched.height && formik.errors.height} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth id="weight" name="weight" label="Cân nặng (kg)" type="number" {...formik.getFieldProps('weight')} error={formik.touched.weight && Boolean(formik.errors.weight)} helperText={formik.touched.weight && formik.errors.weight} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={formik.touched.bloodType && Boolean(formik.errors.bloodType)} >
                                <InputLabel>Nhóm máu</InputLabel>
                                <Select label="Nhóm máu" name="bloodType" {...formik.getFieldProps('bloodType')} sx={{ width: '100px' }}>
                                    <MenuItem value=""><em>Không rõ</em></MenuItem>
                                    {bloodTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="vision"
                                name="vision"
                                label="Tình trạng thị lực" {...formik.getFieldProps('vision')}
                                error={formik.touched.vision && Boolean(formik.errors.vision)}
                                helperText={formik.touched.vision && formik.errors.vision}
                                placeholder="VD: Mắt phải 10/10, Mắt trái cận 1.5 độ"
                                sx={{ width: '150px' }}
                            />
                        </Grid>
                    </Grid>

                    <SectionHeader icon="🏥" title="Tiền sử bệnh & Dị ứng" />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth id="chronicDiseases" name="chronicDiseases" label="Bệnh mãn tính hoặc lưu ý đặc biệt" multiline rows={4} {...formik.getFieldProps('chronicDiseases')} error={formik.touched.chronicDiseases && Boolean(formik.errors.chronicDiseases)} helperText={formik.touched.chronicDiseases && formik.errors.chronicDiseases} placeholder="Ghi rõ các bệnh như: hen suyễn, tim mạch, động kinh... Nếu không có, ghi 'Không'." />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth id="allergies" name="allergies" label="Dị ứng (thuốc, thực phẩm, ...)" multiline rows={4} {...formik.getFieldProps('allergies')} error={formik.touched.allergies && Boolean(formik.errors.allergies)} helperText={formik.touched.allergies && formik.errors.allergies} placeholder="Ghi rõ loại dị ứng và biểu hiện. VD: Dị ứng Penicillin (gây mẩn ngứa), dị ứng hải sản (gây khó thở)... Nếu không có, ghi 'Không'." />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth multiline rows={4} id="devicesSupport" name="devicesSupport" label="Thiết bị hỗ trợ (nếu có)" {...formik.getFieldProps('devicesSupport')} error={formik.touched.devicesSupport && Boolean(formik.errors.devicesSupport)} helperText={formik.touched.devicesSupport && formik.errors.devicesSupport} placeholder="VD: Kính cận, máy trợ thính..." />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="text" onClick={onCancel} disabled={saving}>Hủy bỏ</Button>
                        <Button type="submit" variant="contained" startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} disabled={saving || !formik.dirty || !formik.isValid}>
                            {saving ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};


// --- Main Page Component ---

const EditHealthProfilePage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    // Data-fetching and state logic (from the old custom hook)
    const [healthProfile, setHealthProfile] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadData = useCallback(async () => {
        if (!studentId) return;

        try {
            setLoading(true);
            const response = await healthProfileAPI.getByChildId(studentId, {});

            if (response.isSuccess && response.data.records?.length > 0) {
                const latestProfile = response.data.records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                setHealthProfile(latestProfile);
                setStudentInfo(latestProfile.studentId);
            } else {
                setHealthProfile(null);
                toast.warn('Học sinh này chưa có hồ sơ y tế. Không thể chỉnh sửa.');
            }
        } catch (error) {
            console.error('Error loading health profile data:', error);
            toast.error('Lỗi khi tải thông tin hồ sơ y tế.');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleBack = () => navigate(`/nurse/health-profiles/${studentId}`);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            height: healthProfile?.height || '',
            weight: healthProfile?.weight || '',
            bloodType: healthProfile?.bloodType || '',
            vision: healthProfile?.vision || '',
            allergies: healthProfile?.allergies || '',
            chronicDiseases: healthProfile?.chronicDiseases || '',
            devicesSupport: healthProfile?.devicesSupport || '',
        },
        validationSchema: validationSchema,
        enableReinitialize: true, // Crucial to update form when data loads
        onSubmit: async (values) => {
            if (!healthProfile?._id) {
                toast.error("Không tìm thấy ID hồ sơ để cập nhật.");
                return;
            }
            try {
                setSaving(true);
                const payload = Object.entries(values).reduce((acc, [key, value]) => {
                    acc[key] = value === '' ? null : value;
                    return acc;
                }, {});

                const response = await healthProfileAPI.updateHealthProfile(healthProfile._id, payload);

                if (response.isSuccess) {
                    toast.success('Cập nhật hồ sơ y tế thành công!');
                    loadData(); // Reload data to show fresh info
                    formik.resetForm({ values: response.data.data }); // Reset dirty state
                } else {
                    toast.error(response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
                }
            } catch (error) {
                console.error('Error updating health profile:', error);
                toast.error('Lỗi hệ thống khi cập nhật hồ sơ y tế.');
            } finally {
                setSaving(false);
            }
        },
    });

    // --- Render Logic ---

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={handleBack} aria-label="Quay lại">
                        <BackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Chỉnh sửa Hồ sơ Y tế
                    </Typography>
                </Box>
                <Tooltip title="Làm mới dữ liệu">
                    <span>
                        <IconButton onClick={loadData} color="primary" disabled={loading || saving}>
                            <RefreshIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            {!healthProfile || !studentInfo ? (
                <Alert severity="error" sx={{ m: 2 }}>
                    Không thể tải dữ liệu hồ sơ y tế cho học sinh này. Vui lòng quay lại trang danh sách và thử lại.
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

export default EditHealthProfilePage;