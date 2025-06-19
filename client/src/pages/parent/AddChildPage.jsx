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
    CardContent,
    Avatar,
    Divider,
    LinearProgress,
    Chip,
    InputAdornment,
    Tooltip,
    Fade,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    ArrowBack,
    Save,
    Person,
    LocalHospital,
    PersonAdd,
    School,
    Cake,
    Height,
    FitnessCenter,
    Bloodtype,
    RemoveRedEye,
    Warning,
    AccessibleForward,
    CheckCircleOutline,
    InfoOutlined
} from '@mui/icons-material';
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
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { label: 'Thông tin cơ bản', icon: <Person /> },
        { label: 'Sức khỏe', icon: <LocalHospital /> },
        { label: 'Xác nhận', icon: <CheckCircleOutline /> }
    ];

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

    const [formErrors, setFormErrors] = useState({}); const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep = (step) => {
        const errors = {};

        if (step === 0) {
            if (!formData.name.trim()) errors.name = 'Vui lòng nhập tên con em';
            if (!formData.birthdate) errors.birthdate = 'Vui lòng chọn ngày sinh';
            if (!formData.gender) errors.gender = 'Vui lòng chọn giới tính';
            if (!formData.studentCode.trim()) errors.studentCode = 'Vui lòng nhập mã học sinh';
        } else if (step === 1) {
            if (!formData.height) errors.height = 'Vui lòng nhập chiều cao';
            if (!formData.weight) errors.weight = 'Vui lòng nhập cân nặng';
            if (!formData.bloodType) errors.bloodType = 'Vui lòng chọn nhóm máu';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        // Chỉ submit khi ở bước cuối cùng (step 2 - Xác nhận)
        if (activeStep !== 2) {
            return;
        }

        // Validate tất cả các steps trước khi submit
        if (!validateStep(0) || !validateStep(1)) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc');
            setActiveStep(0);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Validate form data
            if (!formData.name.trim()) {
                throw new Error('Vui lòng nhập tên con em');
            }

            // Tách dữ liệu con em và hồ sơ sức khỏe
            const childData = {
                name: formData.name.trim(),
                birthdate: formData.birthdate,
                studentCode: formData.studentCode.trim(),
                gender: formData.gender,
                medicalConverageId: formData.medicalConverageId.trim(),
                height: parseFloat(formData.height) || 0,
                weight: parseFloat(formData.weight) || 0,
                bloodType: formData.bloodType,
                vision: formData.vision || '',
                allergies: formData.allergies || '',
                chronicDiseases: formData.chronicDiseases || '',
                devicesSupport: formData.devicesSupport || ''
            };

            console.log('Creating child with data:', childData);

            // Tạo con em
            const createdChild = await childApi.addChild(childData);
            console.log('Child created:', createdChild);

            toast.success('✅ Đã thêm con em và hồ sơ sức khỏe thành công!');
            navigate('/parent/children');
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Có lỗi xảy ra khi thêm con em');
            toast.error('❌ ' + (err.message || 'Không thể thêm con em'));
        } finally {
            setLoading(false);
        }
    };const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
                                    <Person />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        Thông tin cơ bản
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Vui lòng điền thông tin cơ bản của con em
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={!!formErrors.name}
                                        helperText={formErrors.name}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        error={!!formErrors.birthdate}
                                        helperText={formErrors.birthdate}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Cake color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        error={!!formErrors.gender}
                                        helperText={formErrors.gender}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="male">👦 Nam</MenuItem>
                                        <MenuItem value="female">👧 Nữ</MenuItem>
                                        <MenuItem value="other">🧒 Khác</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mã học sinh"
                                        name="studentCode"
                                        value={formData.studentCode}
                                        onChange={handleChange}
                                        error={!!formErrors.studentCode}
                                        helperText={formErrors.studentCode}
                                        placeholder="Ví dụ: HS2025001"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <School color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mã bảo hiểm y tế"
                                        name="medicalConverageId"
                                        value={formData.medicalConverageId}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: DN1234567890123"
                                        helperText="Không bắt buộc - có thể bổ sung sau"
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );

            case 1:
                return (
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{ bgcolor: 'error.main', mr: 2, width: 48, height: 48 }}>
                                    <LocalHospital />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                                        Thông tin sức khỏe
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Thông tin y tế cơ bản của con em
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Chiều cao (cm)"
                                        name="height"
                                        type="number"
                                        value={formData.height}
                                        onChange={handleChange}
                                        error={!!formErrors.height}
                                        helperText={formErrors.height}
                                        placeholder="Ví dụ: 120"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Height color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Cân nặng (kg)"
                                        name="weight"
                                        type="number"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        error={!!formErrors.weight}
                                        helperText={formErrors.weight}
                                        placeholder="Ví dụ: 25"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FitnessCenter color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Nhóm máu"
                                        name="bloodType"
                                        value={formData.bloodType}
                                        onChange={handleChange}
                                        error={!!formErrors.bloodType}
                                        helperText={formErrors.bloodType}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Bloodtype color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    >
                                        <MenuItem value="A+">🩸 A+</MenuItem>
                                        <MenuItem value="A-">🩸 A-</MenuItem>
                                        <MenuItem value="B+">🩸 B+</MenuItem>
                                        <MenuItem value="B-">🩸 B-</MenuItem>
                                        <MenuItem value="AB+">🩸 AB+</MenuItem>
                                        <MenuItem value="AB-">🩸 AB-</MenuItem>
                                        <MenuItem value="O+">🩸 O+</MenuItem>
                                        <MenuItem value="O-">🩸 O-</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Thị lực"
                                        name="vision"
                                        value={formData.vision}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: 10/10, 8/10"
                                        helperText="Không bắt buộc"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <RemoveRedEye color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }}>
                                        <Chip
                                            label="Thông tin bổ sung (không bắt buộc)"
                                            icon={<InfoOutlined />}
                                            variant="outlined"
                                        />
                                    </Divider>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Dị ứng"
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        multiline
                                        rows={3}
                                        placeholder="Dị ứng thực phẩm, thuốc..."
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    <Warning color="warning" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        rows={3}
                                        placeholder="Tim mạch, tiểu đường..."
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                        rows={3}
                                        placeholder="Kính cận, xe lăn..."
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                    <AccessibleForward color="info" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );

            case 2:
                return (
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
                                    <CheckCircleOutline />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        Xác nhận thông tin
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Vui lòng kiểm tra lại thông tin trước khi lưu
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                {/* Thông tin cơ bản */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.50' }}>
                                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                                            👤 Thông tin cơ bản
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Tên:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.name || '---'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Ngày sinh:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('vi-VN') : '---'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Giới tính:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : formData.gender === 'other' ? 'Khác' : '---'}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Mã học sinh:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.studentCode || '---'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Mã BHYT:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.medicalConverageId || 'Chưa có'}</Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>

                                {/* Thông tin sức khỏe */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, bgcolor: 'error.50' }}>
                                        <Typography variant="h6" sx={{ mb: 2, color: 'error.main', fontWeight: 600 }}>
                                            🏥 Thông tin sức khỏe
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Chiều cao:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.height ? `${formData.height} cm` : '---'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Cân nặng:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.weight ? `${formData.weight} kg` : '---'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Nhóm máu:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.bloodType || '---'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Thị lực:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>{formData.vision || 'Chưa có'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Dị ứng:</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.allergies || 'Không có'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Bệnh mãn tính:</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.chronicDiseases || 'Không có'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Thiết bị hỗ trợ:</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{formData.devicesSupport || 'Không có'}</Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'grey.50',
            backgroundImage: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
        }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Modern Header */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '200px',
                            height: '200px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            transform: 'translate(50%, -50%)'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
                        <Tooltip title="Quay lại">
                            <IconButton
                                onClick={() => navigate('/parent/children')}
                                sx={{
                                    mr: 2,
                                    color: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                        </Tooltip>
                        <Avatar sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            mr: 3,
                            width: 64,
                            height: 64,
                            border: '2px solid rgba(255,255,255,0.3)'
                        }}>
                            <PersonAdd sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                Thêm con em mới
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                                Tạo hồ sơ học sinh và thông tin sức khỏe ban đầu
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Progress Stepper */}
                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    StepIconComponent={({ active, completed }) => (
                                        <Avatar sx={{
                                            bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                                            color: 'white',
                                            width: 40,
                                            height: 40,
                                            fontSize: '1.2rem'
                                        }}>
                                            {completed ? <CheckCircleOutline /> : step.icon}
                                        </Avatar>
                                    )}
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            fontWeight: activeStep === index ? 600 : 400,
                                            color: activeStep === index ? 'primary.main' : 'text.secondary'
                                        }
                                    }}
                                >
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Progress Bar */}
                    <Box sx={{ mt: 3, mb: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={(activeStep / (steps.length - 1)) * 100}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                                }
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Bước {activeStep + 1} trong {steps.length}
                    </Typography>
                </Paper>

                {/* Error Alert */}
                <Fade in={!!error}>
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            '& .MuiAlert-icon': {
                                fontSize: '1.5rem'
                            }
                        }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                </Fade>                {/* Form Content */}
                <Box>
                    <Fade in={true} key={activeStep}>
                        <Box>
                            {renderStepContent(activeStep)}
                        </Box>
                    </Fade>

                    {/* Navigation Buttons */}
                    <Paper elevation={0} sx={{
                        mt: 4,
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'grey.50'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Button
                                variant="outlined"
                                onClick={activeStep === 0 ? () => navigate('/parent/children') : handleBack}
                                startIcon={<ArrowBack />}
                                disabled={loading}
                                sx={{
                                    minWidth: 120,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                {activeStep === 0 ? 'Hủy' : 'Quay lại'}
                            </Button>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {activeStep < steps.length - 1 ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={loading}
                                        sx={{
                                            minWidth: 140,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                            }
                                        }}
                                    >
                                        Tiếp theo
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        disabled={loading}
                                        sx={{
                                            minWidth: 180,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #45a049 30%, #7CB342 90%)',
                                            },
                                            '&:disabled': {
                                                background: 'grey.300'
                                            }
                                        }}
                                    >
                                        {loading ? 'Đang lưu...' : 'Hoàn thành'}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default AddChildPage;
