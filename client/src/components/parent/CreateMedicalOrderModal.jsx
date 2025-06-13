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
    Typography,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Divider,
    Avatar,
    Stack,
    Chip
} from '@mui/material';
import {
    MedicalServices,
    Add,
    Delete,
    CalendarToday,
    Person,
    LocalPharmacy,
    CheckCircle,
    Warning
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { medicalOrderApi } from '../../api/medicalOrderApi';

const validationSchema = yup.object({
    startDate: yup
        .date('Nhập ngày bắt đầu hợp lệ')
        .required('Ngày bắt đầu là bắt buộc')
        .min(new Date(), 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại'),
    endDate: yup
        .date('Nhập ngày kết thúc hợp lệ')
        .required('Ngày kết thúc là bắt buộc')
        .min(yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
    note: yup
        .string('Nhập ghi chú'),
});

const CreateMedicalOrderModalNew = ({ open, onClose, childId, childName, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [medicineList, setMedicineList] = useState([]); const [currentMedicine, setCurrentMedicine] = useState({
        medicineName: '',
        quantity: 1,
        dosage: '',
        type: 'viên',
        time: 'sáng',
        note: ''
    });

    const types = ['viên', 'gói', 'chai', 'tuýp', 'lọ', 'ống', 'ml', 'mg'];
    const times = ['sáng', 'trưa', 'chiều', 'tối', 'sáng-trưa', 'sáng-tối', 'trưa-tối', 'sáng-trưa-tối'];
    const commonMedicines = [
        'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Vitamin C',
        'Cảm cúm', 'Thuốc ho', 'Thuốc đau bụng', 'Thuốc dị ứng'
    ];

    const formik = useFormik({
        initialValues: {
            startDate: '',
            endDate: '',
            note: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (medicineList.length === 0) {
                toast.error('Vui lòng thêm ít nhất một loại thuốc');
                return;
            }

            try {
                setLoading(true); const orderData = {
                    medicalOrder: {
                        ChildId: childId,
                        startDate: values.startDate,
                        endDate: values.endDate,
                        note: values.note
                    },
                    medicalOrderDetails: medicineList.map(medicine => ({
                        medicineName: medicine.medicineName,
                        quantity: medicine.quantity,
                        dosage: medicine.dosage,
                        type: medicine.type,
                        time: medicine.time,
                        note: medicine.note
                    }))
                };

                await medicalOrderApi.createMedicalOrder(orderData);
                toast.success('Tạo yêu cầu đơn thuốc thành công!');
                onSuccess();
                handleClose();
            } catch (error) {
                console.error('Error creating medical order:', error);
                toast.error(error.message || 'Có lỗi xảy ra khi tạo yêu cầu đơn thuốc');
            } finally {
                setLoading(false);
            }
        },
    }); const handleClose = () => {
        formik.resetForm();
        setMedicineList([]);
        setCurrentMedicine({
            medicineName: '',
            quantity: 1,
            dosage: '',
            type: 'viên',
            time: 'sáng',
            note: ''
        });
        setActiveStep(0);
        onClose();
    }; const handleAddMedicine = () => {
        if (!currentMedicine.medicineName.trim()) {
            toast.error('Vui lòng nhập tên thuốc');
            return;
        }

        if (!currentMedicine.dosage.trim()) {
            toast.error('Vui lòng nhập liều lượng');
            return;
        }

        // Kiểm tra thuốc đã tồn tại
        const exists = medicineList.some(med =>
            med.medicineName.toLowerCase() === currentMedicine.medicineName.toLowerCase()
        );

        if (exists) {
            toast.error('Thuốc này đã có trong danh sách');
            return;
        }

        setMedicineList([...medicineList, {
            ...currentMedicine,
            id: Date.now()
        }]); setCurrentMedicine({
            medicineName: '',
            quantity: 1,
            dosage: '',
            type: 'viên',
            time: 'sáng',
            note: ''
        });
        toast.success('Đã thêm thuốc vào danh sách');
    };

    const handleRemoveMedicine = (id) => {
        setMedicineList(medicineList.filter(med => med.id !== id));
        toast.info('Đã xóa thuốc khỏi danh sách');
    };

    const handleNext = () => {
        if (activeStep === 1 && medicineList.length === 0) {
            toast.error('Vui lòng thêm ít nhất một loại thuốc');
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCommonMedicineClick = (medicineName) => {
        setCurrentMedicine({
            ...currentMedicine,
            medicineName: medicineName
        });
    };

    const steps = [
        {
            label: 'Thông tin thời gian',
            icon: <CalendarToday />,
            description: 'Chọn thời gian cần uống thuốc'
        },
        {
            label: 'Danh sách thuốc',
            icon: <LocalPharmacy />,
            description: 'Thêm các loại thuốc cần thiết'
        },
        {
            label: 'Xác nhận và gửi',
            icon: <CheckCircle />,
            description: 'Kiểm tra và gửi yêu cầu'
        }
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '600px'
                }
            }}
        >
            <DialogTitle sx={{
                textAlign: 'center',
                pb: 2,
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <MedicalServices sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                        Yêu cầu đơn thuốc
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Cho con em: <strong>{childName}</strong>
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Alert severity="info" sx={{ mb: 3, fontSize: '1rem' }}>
                    <Typography variant="body1">
                        💡 <strong>Lưu ý:</strong> Y tá trường sẽ xem xét và phê duyệt đơn thuốc này.
                        Vui lòng điền thông tin chính xác và chi tiết.
                    </Typography>
                </Alert>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                icon={step.icon}
                                sx={{
                                    '& .MuiStepLabel-iconContainer': {
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '1.8rem',
                                            color: index <= activeStep ? '#ff9800' : '#ccc'
                                        }
                                    }
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    {step.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {step.description}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={formik.handleSubmit}>
                    {/* Step 1: Thời gian */}
                    {activeStep === 0 && (
                        <Card sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <CalendarToday sx={{ mr: 1, color: '#ff9800' }} />
                                Chọn thời gian cần uống thuốc
                            </Typography>

                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ngày bắt đầu"
                                        type="date"
                                        name="startDate"
                                        value={formik.values.startDate}
                                        onChange={formik.handleChange}
                                        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                        helperText={formik.touched.startDate && formik.errors.startDate}
                                        InputLabelProps={{ shrink: true }}
                                        size="large"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '1.1rem',
                                                '& fieldset': { borderWidth: 2 }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ngày kết thúc"
                                        type="date"
                                        name="endDate"
                                        value={formik.values.endDate}
                                        onChange={formik.handleChange}
                                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                        helperText={formik.touched.endDate && formik.errors.endDate}
                                        InputLabelProps={{ shrink: true }}
                                        size="large"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '1.1rem',
                                                '& fieldset': { borderWidth: 2 }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ghi chú (tùy chọn)"
                                        name="note"
                                        value={formik.values.note}
                                        onChange={formik.handleChange}
                                        multiline
                                        rows={3}
                                        placeholder="Ví dụ: Con bị cảm, sốt nhẹ..."
                                        size="large"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '1.1rem',
                                                '& fieldset': { borderWidth: 2 }
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                    )}

                    {/* Step 2: Thuốc */}
                    {activeStep === 1 && (
                        <Box>
                            <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocalPharmacy sx={{ mr: 1, color: '#ff9800' }} />
                                    Thêm thuốc cần thiết
                                </Typography>

                                {/* Thuốc phổ biến */}
                                <Typography variant="body1" fontWeight="bold" sx={{ mb: 2 }}>
                                    Các loại thuốc phổ biến:
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                                    {commonMedicines.map((medicine) => (
                                        <Chip
                                            key={medicine}
                                            label={medicine}
                                            onClick={() => handleCommonMedicineClick(medicine)}
                                            sx={{
                                                fontSize: '1rem',
                                                py: 2,
                                                px: 1,
                                                '&:hover': {
                                                    backgroundColor: '#ff9800',
                                                    color: 'white'
                                                }
                                            }}
                                        />
                                    ))}
                                </Stack>

                                <Divider sx={{ my: 3 }} />                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Tên thuốc"
                                            value={currentMedicine.medicineName}
                                            onChange={(e) => setCurrentMedicine({
                                                ...currentMedicine,
                                                medicineName: e.target.value
                                            })}
                                            size="large"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontSize: '1.1rem',
                                                    '& fieldset': { borderWidth: 2 }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Liều lượng"
                                            value={currentMedicine.dosage}
                                            onChange={(e) => setCurrentMedicine({
                                                ...currentMedicine,
                                                dosage: e.target.value
                                            })}
                                            placeholder="VD: 500mg"
                                            size="large"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontSize: '1.1rem',
                                                    '& fieldset': { borderWidth: 2 }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            fullWidth
                                            label="Số lượng"
                                            type="number"
                                            value={currentMedicine.quantity}
                                            onChange={(e) => setCurrentMedicine({
                                                ...currentMedicine,
                                                quantity: parseInt(e.target.value) || 1
                                            })}
                                            inputProps={{ min: 1 }}
                                            size="large"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontSize: '1.1rem',
                                                    '& fieldset': { borderWidth: 2 }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <FormControl fullWidth size="large">
                                            <InputLabel>Loại</InputLabel>
                                            <Select
                                                value={currentMedicine.type}
                                                label="Loại"
                                                onChange={(e) => setCurrentMedicine({
                                                    ...currentMedicine,
                                                    type: e.target.value
                                                })}
                                                sx={{
                                                    fontSize: '1.1rem',
                                                    '& fieldset': { borderWidth: 2 }
                                                }}
                                            >
                                                {types.map((type) => (
                                                    <MenuItem key={type} value={type}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <FormControl fullWidth size="large">
                                            <InputLabel>Thời gian uống</InputLabel>
                                            <Select
                                                value={currentMedicine.time}
                                                label="Thời gian uống"
                                                onChange={(e) => setCurrentMedicine({
                                                    ...currentMedicine,
                                                    time: e.target.value
                                                })}
                                                sx={{
                                                    fontSize: '1.1rem',
                                                    '& fieldset': { borderWidth: 2 }
                                                }}
                                            >
                                                {times.map((time) => (
                                                    <MenuItem key={time} value={time}>
                                                        {time}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Ghi chú"
                                            value={currentMedicine.note}
                                            onChange={(e) => setCurrentMedicine({
                                                ...currentMedicine,
                                                note: e.target.value
                                            })}
                                            placeholder="VD: Uống sau ăn"
                                            size="large"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontSize: '1.1rem',
                                                    '& fieldset': { borderWidth: 2 }
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={handleAddMedicine}
                                            startIcon={<Add />}
                                            size="large"
                                            sx={{
                                                height: '56px',
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Thêm
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>

                            {/* Danh sách thuốc đã thêm */}
                            <Card sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Danh sách thuốc ({medicineList.length})
                                </Typography>

                                {medicineList.length === 0 ? (
                                    <Alert severity="warning">
                                        <Typography variant="body1">
                                            Chưa có thuốc nào trong danh sách. Vui lòng thêm ít nhất một loại thuốc.
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <List>
                                        {medicineList.map((medicine, index) => (<ListItem key={medicine.id} sx={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 2,
                                            mb: 1
                                        }}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {medicine.medicineName}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body1">
                                                            Liều lượng: <strong>{medicine.dosage}</strong> •
                                                            Số lượng: <strong>{medicine.quantity} {medicine.type}</strong> •
                                                            Thời gian: <strong>{medicine.time}</strong>
                                                        </Typography>
                                                        {medicine.note && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Ghi chú: {medicine.note}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => handleRemoveMedicine(medicine.id)}
                                                    color="error"
                                                    size="large"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Card>
                        </Box>
                    )}

                    {/* Step 3: Xác nhận */}
                    {activeStep === 2 && (
                        <Card sx={{ p: 4, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                                Xác nhận thông tin đơn thuốc
                            </Typography>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    👶 Con em: {childName}
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>📅 Thời gian:</strong> {formik.values.startDate} đến {formik.values.endDate}
                                </Typography>

                                {formik.values.note && (
                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        <strong>📝 Ghi chú:</strong> {formik.values.note}
                                    </Typography>
                                )}

                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    💊 Danh sách thuốc ({medicineList.length} loại):
                                </Typography>

                                <List>
                                    {medicineList.map((medicine, index) => (
                                        <ListItem key={index} sx={{
                                            backgroundColor: '#e8f5e8',
                                            borderRadius: 2,
                                            mb: 1
                                        }}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {medicine.medicineName}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body1">
                                                        Số lượng: <strong>{medicine.quantity} {medicine.unit}</strong>
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                <Alert severity="info" sx={{ mt: 3 }}>
                                    <Typography variant="body1">
                                        <strong>🏥 Sau khi gửi:</strong> Y tá trường sẽ xem xét đơn thuốc này và thông báo kết quả.
                                        Bạn có thể theo dõi trạng thái trong phần thông báo.
                                    </Typography>
                                </Alert>
                            </Box>
                        </Card>
                    )}
                </form>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    size="large"
                    sx={{ fontSize: '1.1rem' }}
                >
                    Quay lại
                </Button>

                <Typography variant="body1" color="text.secondary">
                    Bước {activeStep + 1} / {steps.length}
                </Typography>

                {activeStep === steps.length - 1 ? (
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={formik.handleSubmit}
                        disabled={loading}
                        size="large"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#45a049' }
                        }}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        size="large"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5
                        }}
                    >
                        Tiếp theo
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CreateMedicalOrderModalNew;
