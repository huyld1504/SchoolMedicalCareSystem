import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    IconButton,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent
} from '@mui/material';
import { ArrowBack, Save, Person, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';
import healthProfileAPI from '../../api/healthProfileApi';

const AddChildPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        // Thông tin con em
        name: '',
        birthdate: '',
        gender: '',
        studentCode: '',
        medicalConverageId: '',
        
        // Thông tin hồ sơ sức khỏe
        height: '',
        weight: '',
        bloodType: '',
        vision: '',
        allergies: '',
        chronicDiseases: '',
        devicesSupport: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Tách dữ liệu con em và hồ sơ sức khỏe
            const childData = {
                name: formData.name,
                birthdate: formData.birthdate,
                studentCode: formData.studentCode,
                gender: formData.gender,
                medicalConverageId: formData.medicalConverageId,
                isActive: true
            };

            const healthProfileData = {
                height: parseFloat(formData.height) || 0,
                weight: parseFloat(formData.weight) || 0,
                bloodType: formData.bloodType,
                vision: formData.vision,
                allergies: formData.allergies || '',
                chronicDiseases: formData.chronicDiseases || '',
                devicesSupport: formData.devicesSupport || ''
            };

            // Tạo con em trước
            const createdChild = await childApi.addChild(childData);
            
            // Nếu tạo con em thành công, tạo hồ sơ sức khỏe
            if (createdChild && (createdChild._id || createdChild.data?._id)) {
                const childId = createdChild._id || createdChild.data._id;
                healthProfileData.studentId = childId;
                await healthProfileAPI.create(healthProfileData);
            }

            toast.success('✅ Đã thêm con em và hồ sơ sức khỏe thành công!');
            navigate('/parent');
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Có lỗi xảy ra khi thêm con em');
            toast.error('❌ Không thể thêm con em');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton 
                            onClick={() => navigate('/parent')}
                            sx={{ mr: 2, color: 'white' }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Thêm con em & Hồ sơ sức khỏe
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Vui lòng điền đầy đủ thông tin con em và hồ sơ sức khỏe ban đầu
                    </Typography>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Thông tin cơ bản con em */}
                        <Grid item xs={12} lg={6}>
                            <Card elevation={3} sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Person sx={{ fontSize: 32, color: '#1976d2', mr: 2 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                            Thông tin cơ bản
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Họ và tên"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Ngày sinh"
                                                name="birthdate"
                                                type="date"
                                                value={formData.birthdate}
                                                onChange={handleChange}
                                                required
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Giới tính"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            >
                                                <MenuItem value="male">Nam</MenuItem>
                                                <MenuItem value="female">Nữ</MenuItem>
                                                <MenuItem value="other">Khác</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Mã học sinh"
                                                name="studentCode"
                                                value={formData.studentCode}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nhập mã học sinh"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Mã bảo hiểm y tế"
                                                name="medicalConverageId"
                                                value={formData.medicalConverageId}
                                                onChange={handleChange}
                                                required
                                                placeholder="Nhập mã bảo hiểm y tế"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Thông tin hồ sơ sức khỏe */}
                        <Grid item xs={12} lg={6}>
                            <Card elevation={3} sx={{ height: '100%' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <LocalHospital sx={{ fontSize: 32, color: '#f44336', mr: 2 }} />
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                                            Thông tin sức khỏe
                                        </Typography>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Chiều cao (cm)"
                                                name="height"
                                                type="number"
                                                value={formData.height}
                                                onChange={handleChange}
                                                required
                                                placeholder="VD: 120"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Cân nặng (kg)"
                                                name="weight"
                                                type="number"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                required
                                                placeholder="VD: 25"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Nhóm máu"
                                                name="bloodType"
                                                value={formData.bloodType}
                                                onChange={handleChange}
                                                required
                                                variant="outlined"
                                            >
                                                <MenuItem value="A+">A+</MenuItem>
                                                <MenuItem value="A-">A-</MenuItem>
                                                <MenuItem value="B+">B+</MenuItem>
                                                <MenuItem value="B-">B-</MenuItem>
                                                <MenuItem value="AB+">AB+</MenuItem>
                                                <MenuItem value="AB-">AB-</MenuItem>
                                                <MenuItem value="O+">O+</MenuItem>
                                                <MenuItem value="O-">O-</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Thị lực"
                                                name="vision"
                                                value={formData.vision}
                                                onChange={handleChange}
                                                placeholder="VD: 10/10"
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Thông tin bổ sung */}
                        <Grid item xs={12}>
                            <Card elevation={3}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 3 }}>
                                        ⚠️ Thông tin y tế bổ sung
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Dị ứng"
                                                name="allergies"
                                                value={formData.allergies}
                                                onChange={handleChange}
                                                multiline
                                                rows={4}
                                                placeholder="Mô tả các dị ứng (nếu có)"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Bệnh mãn tính"
                                                name="chronicDiseases"
                                                value={formData.chronicDiseases}
                                                onChange={handleChange}
                                                multiline
                                                rows={4}
                                                placeholder="Mô tả các bệnh mãn tính (nếu có)"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Thiết bị hỗ trợ"
                                                name="devicesSupport"
                                                value={formData.devicesSupport}
                                                onChange={handleChange}
                                                multiline
                                                rows={4}
                                                placeholder="Kính, khẩu trang, v.v."
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Submit Buttons */}
                        <Grid item xs={12}>
                            <Card elevation={3}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/parent')}
                                            disabled={loading}
                                            size="large"
                                            sx={{ minWidth: 120 }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<Save />}
                                            disabled={loading}
                                            size="large"
                                            sx={{ 
                                                minWidth: 180,
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                                }
                                            }}
                                        >
                                            {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    );
};

export default AddChildPage;
