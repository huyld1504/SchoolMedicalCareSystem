import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    MenuItem,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Paper,
    Alert
} from '@mui/material';
import {
    ChildCare,
    Person,
    LocalHospital,
    CheckCircle
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';

const validationSchema = yup.object({
    name: yup
        .string('Nhập họ tên')
        .required('Họ tên là bắt buộc'),
    birthdate: yup
        .date('Nhập ngày sinh hợp lệ')
        .required('Ngày sinh là bắt buộc')
        .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại'),
    studentCode: yup
        .string('Nhập mã học sinh')
        .required('Mã học sinh là bắt buộc'),
    gender: yup
        .string('Chọn giới tính')
        .required('Giới tính là bắt buộc'),
    medicalConverageId: yup
        .string('Nhập mã bảo hiểm y tế')
        .required('Mã bảo hiểm y tế là bắt buộc'),
    height: yup
        .number('Nhập chiều cao')
        .min(30, 'Chiều cao tối thiểu 30cm')
        .max(250, 'Chiều cao tối đa 250cm')
        .required('Chiều cao là bắt buộc'),
    weight: yup
        .number('Nhập cân nặng')
        .min(1, 'Cân nặng tối thiểu 1kg')
        .max(300, 'Cân nặng tối đa 300kg')
        .required('Cân nặng là bắt buộc'),
    bloodType: yup
        .string('Chọn nhóm máu')
        .required('Nhóm máu là bắt buộc'),
    vision: yup
        .string('Nhập thị lực')
        .required('Thị lực là bắt buộc'),
    allergies: yup
        .string('Nhập thông tin dị ứng'),
    chronicDiseases: yup
        .string('Nhập thông tin bệnh mãn tính'),
    devicesSupport: yup
        .string('Nhập thông tin thiết bị hỗ trợ'),
});

const steps = [
    {
        label: 'Thông tin cá nhân',
        icon: <Person />,
        description: 'Nhập thông tin cơ bản của con em'
    },
    {
        label: 'Thông tin y tế',
        icon: <LocalHospital />,
        description: 'Nhập thông tin sức khỏe chi tiết'
    },
    {
        label: 'Xác nhận',
        icon: <CheckCircle />,
        description: 'Kiểm tra và xác nhận thông tin'
    }
];

const AddChildModal = ({ open, onClose, onSuccess }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            birthdate: '',
            studentCode: '',
            gender: '',
            medicalConverageId: '',
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
                setLoading(true);
                await childApi.addChild(values);
                toast.success('Thêm con em thành công!');
                onSuccess();
                handleClose();
            } catch (error) {
                console.error('Error adding child:', error);
                toast.error(error.message || 'Có lỗi xảy ra khi thêm con em');
            } finally {
                setLoading(false);
            }
        },
    });

    const handleClose = () => {
        setActiveStep(0);
        formik.resetForm();
        onClose();
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            // Validate step 1 fields
            const step1Fields = ['name', 'birthdate', 'studentCode', 'gender', 'medicalConverageId'];
            const errors = {};
            for (const field of step1Fields) {
                try {
                    await validationSchema.validateAt(field, formik.values);
                } catch (error) {
                    errors[field] = error.message;
                }
            }

            if (Object.keys(errors).length > 0) {
                formik.setErrors(errors);
                return;
            }
        } else if (activeStep === 1) {
            // Validate step 2 fields
            const step2Fields = ['height', 'weight', 'bloodType', 'vision'];
            const errors = {};
            for (const field of step2Fields) {
                try {
                    await validationSchema.validateAt(field, formik.values);
                } catch (error) {
                    errors[field] = error.message;
                }
            }

            if (Object.keys(errors).length > 0) {
                formik.setErrors(errors);
                return;
            }
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Họ và tên *"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="birthdate"
                                name="birthdate"
                                label="Ngày sinh *"
                                type="date"
                                value={formik.values.birthdate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
                                helperText={formik.touched.birthdate && formik.errors.birthdate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="gender"
                                name="gender"
                                select
                                label="Giới tính *"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.gender && Boolean(formik.errors.gender)}
                                helperText={formik.touched.gender && formik.errors.gender}
                            >
                                <MenuItem value="male">Nam</MenuItem>
                                <MenuItem value="female">Nữ</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="studentCode"
                                name="studentCode"
                                label="Mã học sinh *"
                                value={formik.values.studentCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.studentCode && Boolean(formik.errors.studentCode)}
                                helperText={formik.touched.studentCode && formik.errors.studentCode}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="medicalConverageId"
                                name="medicalConverageId"
                                label="Mã bảo hiểm y tế *"
                                value={formik.values.medicalConverageId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.medicalConverageId && Boolean(formik.errors.medicalConverageId)}
                                helperText={formik.touched.medicalConverageId && formik.errors.medicalConverageId}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="height"
                                name="height"
                                label="Chiều cao (cm) *"
                                type="number"
                                value={formik.values.height}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.height && Boolean(formik.errors.height)}
                                helperText={formik.touched.height && formik.errors.height}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="weight"
                                name="weight"
                                label="Cân nặng (kg) *"
                                type="number"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.weight && Boolean(formik.errors.weight)}
                                helperText={formik.touched.weight && formik.errors.weight}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="bloodType"
                                name="bloodType"
                                select
                                label="Nhóm máu *"
                                value={formik.values.bloodType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.bloodType && Boolean(formik.errors.bloodType)}
                                helperText={formik.touched.bloodType && formik.errors.bloodType}
                            >
                                {['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="vision"
                                name="vision"
                                label="Thị lực *"
                                value={formik.values.vision}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.vision && Boolean(formik.errors.vision)}
                                helperText={formik.touched.vision && formik.errors.vision}
                                placeholder="VD: 10/10, 8/10..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="allergies"
                                name="allergies"
                                label="Dị ứng (nếu có)"
                                multiline
                                rows={2}
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
                                label="Bệnh mãn tính (nếu có)"
                                multiline
                                rows={2}
                                value={formik.values.chronicDiseases}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.chronicDiseases && Boolean(formik.errors.chronicDiseases)}
                                helperText={formik.touched.chronicDiseases && formik.errors.chronicDiseases}
                                placeholder="Mô tả các bệnh mãn tính nếu có..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="devicesSupport"
                                name="devicesSupport"
                                label="Thiết bị hỗ trợ (nếu có)"
                                multiline
                                rows={2}
                                value={formik.values.devicesSupport}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.devicesSupport && Boolean(formik.errors.devicesSupport)}
                                helperText={formik.touched.devicesSupport && formik.errors.devicesSupport}
                                placeholder="Mô tả các thiết bị hỗ trợ nếu có..."
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Box>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Vui lòng kiểm tra lại thông tin trước khi xác nhận
                        </Alert>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin cá nhân
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Họ tên:</Typography>
                                    <Typography variant="body1">{formik.values.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Ngày sinh:</Typography>
                                    <Typography variant="body1">{formik.values.birthdate}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Giới tính:</Typography>
                                    <Typography variant="body1">{formik.values.gender === 'male' ? 'Nam' : 'Nữ'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Mã học sinh:</Typography>
                                    <Typography variant="body1">{formik.values.studentCode}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary">Mã bảo hiểm y tế:</Typography>
                                    <Typography variant="body1">{formik.values.medicalConverageId}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin sức khỏe
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Chiều cao:</Typography>
                                    <Typography variant="body1">{formik.values.height} cm</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Cân nặng:</Typography>
                                    <Typography variant="body1">{formik.values.weight} kg</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Nhóm máu:</Typography>
                                    <Typography variant="body1">{formik.values.bloodType}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Thị lực:</Typography>
                                    <Typography variant="body1">{formik.values.vision}</Typography>
                                </Grid>
                                {formik.values.allergies && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Dị ứng:</Typography>
                                        <Typography variant="body1">{formik.values.allergies}</Typography>
                                    </Grid>
                                )}
                                {formik.values.chronicDiseases && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Bệnh mãn tính:</Typography>
                                        <Typography variant="body1">{formik.values.chronicDiseases}</Typography>
                                    </Grid>
                                )}
                                {formik.values.devicesSupport && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Thiết bị hỗ trợ:</Typography>
                                        <Typography variant="body1">{formik.values.devicesSupport}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { minHeight: '600px' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                <ChildCare sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">
                    Thêm con em mới
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    icon={step.icon}
                                    optional={
                                        <Typography variant="caption">{step.description}</Typography>
                                    }
                                >
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box component="form" onSubmit={formik.handleSubmit}>
                    {renderStepContent(activeStep)}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={handleClose} disabled={loading}>
                    Hủy
                </Button>
                {activeStep > 0 && (
                    <Button onClick={handleBack} disabled={loading}>
                        Quay lại
                    </Button>
                )}
                {activeStep < steps.length - 1 ? (
                    <Button onClick={handleNext} variant="contained" disabled={loading}>
                        Tiếp tục
                    </Button>
                ) : (
                    <Button
                        onClick={formik.handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận thêm'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddChildModal;
