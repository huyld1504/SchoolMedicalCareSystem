import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Container, Typography, Card, CardContent, TextField, Button,
    Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress,
    Alert, IconButton, Tooltip, Avatar, Divider, Chip,
} from '@mui/material';
import {
    Save as SaveIcon, ArrowBack as BackIcon, Refresh as RefreshIcon, Add as AddIcon,
    Delete as DeleteIcon, Warning as WarningIcon, LocalHospital as LocalHospitalIcon,
    AccessibleForward as AccessibleForwardIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import healthProfileAPI from '../../api/healthProfileApi';

// --- Constants & Helper Functions ---

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const validationSchema = yup.object({
    height: yup.number('Chiều cao phải là số').positive('Chiều cao phải lớn hơn 0').required('Chiều cao là bắt buộc'),
    weight: yup.number('Cân nặng phải là số').positive('Cân nặng phải lớn hơn 0').required('Cân nặng là bắt buộc'),
    bloodType: yup.string('Nhóm máu phải là chuỗi').oneOf(bloodTypes, 'Nhóm máu không hợp lệ').required('Nhóm máu là bắt buộc'),
    vision: yup.string('Thị lực phải là chuỗi').max(100, 'Thông tin thị lực quá dài').required('Thông tin thị lực là bắt buộc'),
    allergies: yup.array().of(yup.string()),
    chronicDiseases: yup.array().of(yup.string()),
    devicesSupport: yup.array().of(yup.string()),
});

// --- Child Components ---

const DynamicChipInput = ({ formik, fieldName, label, placeholder, icon, color }) => {
    const [inputValue, setInputValue] = useState('');
    const items = formik.values[fieldName] || [];

    const handleAddItem = () => {
        if (inputValue.trim() !== '') {
            formik.setFieldValue(fieldName, [...items, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        formik.setFieldValue(fieldName, items.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                {React.cloneElement(icon, { color, sx: { mr: 1 } })}
                {label}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                    fullWidth
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
                />
                <Button
                    variant="contained"
                    onClick={handleAddItem}
                    sx={{ minWidth: 'auto', px: 2, bgcolor: `${color}.main`, '&:hover': { bgcolor: `${color}.dark` } }}
                >
                    <AddIcon />
                </Button>   
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40, alignItems: 'center' }}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <Chip key={index} label={item} onDelete={() => handleRemoveItem(index)} color={color} variant="outlined" />
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', pl: 1 }}>
                        Chưa có thông tin {label.toLowerCase()}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

const StudentInfoSidebar = ({ student }) => {
    if (!student) return null;
    const genderText = student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'N/A';

    return (
        <Card variant="outlined" sx={{ position: 'sticky', top: 24, width: '220px', height: '100%' }}>
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
                    <Grid item xs={12}><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Ngày sinh</Typography><Typography variant="body1" sx={{ mt: 0.5 }}>{formatDate(student.birthdate)}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Giới tính</Typography><Typography variant="body1" sx={{ mt: 0.5 }}>{genderText}</Typography></Grid>
                    <Grid item xs={12}><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Mã bảo hiểm y tế</Typography><Typography variant="body1" sx={{ mt: 0.5 }}>{student.medicalConverageId}</Typography></Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const SectionHeader = ({ icon, title }) => (
    <>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2, gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {icon} {title}
            </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
    </>
);

const HealthProfileForm = ({ formik, saving, onCancel }) => (
    <form onSubmit={formik.handleSubmit}>
        <Card variant="outlined" >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                    Thông tin Hồ sơ Y tế
                </Typography>

                <SectionHeader icon="📏" title="Thông số cơ thể" />
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}><TextField fullWidth id="height" name="height" label="Chiều cao (cm)" type="number" {...formik.getFieldProps('height')} error={formik.touched.height && Boolean(formik.errors.height)} helperText={formik.touched.height && formik.errors.height} /></Grid>
                    <Grid item xs={12} sm={6} md={3}><TextField fullWidth id="weight" name="weight" label="Cân nặng (kg)" type="number" {...formik.getFieldProps('weight')} error={formik.touched.weight && Boolean(formik.errors.weight)} helperText={formik.touched.weight && formik.errors.weight} /></Grid>
                    <Grid item xs={12} sm={6} md={3}><FormControl fullWidth error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}><InputLabel>Nhóm máu</InputLabel><Select label="Nhóm máu" name="bloodType" {...formik.getFieldProps('bloodType')}><MenuItem value=""><em>Chọn</em></MenuItem>{bloodTypes.map((type) => (<MenuItem key={type} value={type}>{type}</MenuItem>))}</Select></FormControl></Grid>
                    <Grid item xs={12} sm={6} md={3}><TextField fullWidth id="vision" name="vision" label="Tình trạng thị lực" {...formik.getFieldProps('vision')} error={formik.touched.vision && Boolean(formik.errors.vision)} helperText={formik.touched.vision && formik.errors.vision} placeholder="VD: 9/10" /></Grid>
                </Grid>

                <SectionHeader icon="⚕️" title="Tiền sử bệnh & Dị ứng" />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}><DynamicChipInput formik={formik} fieldName="allergies" label="Dị ứng" placeholder="Nhập dị ứng..." icon={<WarningIcon />} color="warning" /></Grid>
                    <Grid item xs={12} md={4}><DynamicChipInput formik={formik} fieldName="chronicDiseases" label="Bệnh mãn tính" placeholder="Nhập bệnh mãn tính..." icon={<LocalHospitalIcon />} color="error" /></Grid>
                    <Grid item xs={12} md={4}><DynamicChipInput formik={formik} fieldName="devicesSupport" label="Thiết bị hỗ trợ" placeholder="Nhập thiết bị hỗ trợ..." icon={<AccessibleForwardIcon />} color="info" /></Grid>
                </Grid>
            </CardContent>

            <Divider />
            
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="text" onClick={onCancel} disabled={saving}>Hủy bỏ</Button>
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

// --- Main Page Component ---

const AddHealthProfilePage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const formik = useFormik({
        initialValues: { height: '', weight: '', bloodType: '', vision: '', allergies: [], chronicDiseases: [], devicesSupport: [] },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setSaving(true);
                const profileData = {
                    ...values,
                    studentId: studentId,
                    allergies: JSON.stringify(values.allergies),
                    chronicDiseases: JSON.stringify(values.chronicDiseases),
                    devicesSupport: JSON.stringify(values.devicesSupport),
                };
                const response = await healthProfileAPI.create(profileData);
                if (response.isSuccess) {
                    toast.success('Tạo hồ sơ y tế mới thành công');
                    navigate(`/nurse/health-profiles/${studentId}`);
                } else {
                    toast.error(response.message || 'Có lỗi xảy ra khi tạo hồ sơ mới');
                }
            } catch (error) {
                const errorMessage = error?.response?.data?.message || 'Lỗi khi tạo hồ sơ y tế mới';
                toast.error(errorMessage);
                console.error('Error creating health profile:', error);
            } finally {
                setSaving(false);
            }
        },
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            if (studentId) {
                const response = await healthProfileAPI.getByChildId(studentId, {});
                if (response.isSuccess && response.data.records && response.data.records.length > 0) {
                    const latestProfile = response.data.records[0];
                    if (latestProfile.studentId) {
                        setStudentInfo(latestProfile.studentId);
                    }
                    const parseJsonString = (str) => {
                        if (!str) return [];
                        try {
                            const parsed = JSON.parse(str);
                            return Array.isArray(parsed) ? parsed : [];
                        } catch (e) {
                            return str && typeof str === 'string' ? [str] : [];
                        }
                    };
                    formik.setValues({
                        height: latestProfile.height || '',
                        weight: latestProfile.weight || '',
                        bloodType: latestProfile.bloodType || '',
                        vision: latestProfile.vision || '',
                        allergies: parseJsonString(latestProfile.allergies),
                        chronicDiseases: parseJsonString(latestProfile.chronicDiseases),
                        devicesSupport: parseJsonString(latestProfile.devicesSupport),
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

    const handleBack = () => navigate(`/nurse/health-profiles/${studentId}`);
    const handleRefresh = () => {
        loadData();
        toast.success('Đã làm mới dữ liệu');
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, bgcolor: 'grey.50' }}>
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

            {!studentInfo ? (
                <Alert severity="error" sx={{ m: 2 }}>
                    Không thể tải dữ liệu học sinh. Vui lòng quay lại và thử lại.
                </Alert>
            ) : (
                <Grid container spacing={{ xs: 2, md: 4 }}>
                    <Grid item xs={12} md="auto">
                        <StudentInfoSidebar student={studentInfo} />
                    </Grid>
                    <Grid item xs={12} md>
                        <HealthProfileForm formik={formik} saving={saving} onCancel={handleBack} />
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default AddHealthProfilePage;