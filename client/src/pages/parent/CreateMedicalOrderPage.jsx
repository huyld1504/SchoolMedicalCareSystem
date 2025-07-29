import React, { useState, useEffect } from 'react';
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
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Fab,
    Stack,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import {
    ArrowBack,
    Save,
    Add as AddIcon,
    Delete as DeleteIcon,
    CloudUpload,
    Image as ImageIcon,
    Delete as DeleteImageIcon,
    ZoomIn,
    Close
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';

import { toast } from 'react-toastify';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import medicalOrderApi from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

// Validation schema
const validationSchema = Yup.object({
    medicalOrder: Yup.object({
        ChildId: Yup.string().required('Vui lòng chọn con em'),
        startDate: Yup.date().required('Vui lòng chọn ngày bắt đầu'),
        endDate: Yup.date()
            .required('Vui lòng chọn ngày kết thúc')
            .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
        note: Yup.string(),
        imageURL: Yup.string()
    }),
    medicalOrderDetails: Yup.array().of(
        Yup.object({
            medicineName: Yup.string(),
            dosage: Yup.string(),
            type: Yup.string().required('Vui lòng chọn dạng thuốc'),
            time: Yup.string(),
            quantity: Yup.number().min(1, 'Số lượng phải lớn hơn 0').required('Vui lòng điền số lượng'),
            note: Yup.string()
        })
    ).test('at-least-one-complete-medicine', 'Vui lòng điền đầy đủ thông tin thuốc', function () {
        // Custom validation sẽ được xử lý trong onSubmit
        return true;
    })
});

const CreateMedicalOrderPage = () => {
    const navigate = useNavigate();
    const { childId } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [children, setChildren] = useState([]);

    // Input mode options
    const [inputMode] = useState('both');
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [uploadedImagePublicId, setUploadedImagePublicId] = useState(null);
    const [imageViewOpen, setImageViewOpen] = useState(false);

    // Cloudinary upload hook
    const { uploading, uploadProgress, error: uploadError, uploadSingleImage, deleteImage } = useCloudinaryUpload();

    // Formik setup
    const formik = useFormik({
        initialValues: {
            medicalOrder: {
                ChildId: childId || '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                note: '',
                imageURL: ''
            },
            medicalOrderDetails: [
                {
                    medicineName: '',
                    dosage: '',
                    type: 'viên',
                    time: '',
                    note: '',
                    quantity: 1
                }
            ]
        },
        validationSchema,
        validate: (values) => {
            const errors = {};

            // Validate medicine details for incomplete entries
            if (values.medicalOrderDetails && values.medicalOrderDetails.length > 0) {
                const detailErrors = [];

                values.medicalOrderDetails.forEach((detail, index) => {
                    const detailError = {};
                    const hasAnyField = detail.medicineName?.trim() || detail.dosage?.trim() || detail.time?.trim();
                    const hasAllRequiredFields = detail.medicineName?.trim() && detail.dosage?.trim() && detail.time?.trim();

                    // If user filled any field, they must fill all required fields
                    if (hasAnyField && !hasAllRequiredFields) {
                        if (!detail.medicineName?.trim()) {
                            detailError.medicineName = 'Vui lòng điền tên thuốc';
                        }
                        if (!detail.dosage?.trim()) {
                            detailError.dosage = 'Vui lòng điền liều lượng';
                        }
                        if (!detail.time?.trim()) {
                            detailError.time = 'Vui lòng chọn thời gian dùng';
                        }
                    }

                    if (Object.keys(detailError).length > 0) {
                        detailErrors[index] = detailError;
                    }
                });

                if (Object.keys(detailErrors).length > 0) {
                    errors.medicalOrderDetails = detailErrors;
                }
            }

            return errors;
        },
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);
            console.log('Submitting form data:', values);

            try {
                // Custom validation logic
                const hasImageData = !!uploadedImageUrl;

                // Check for valid manual data - must have at least one complete entry
                const validManualEntries = values.medicalOrderDetails.filter(detail =>
                    detail.medicineName?.trim() &&
                    detail.dosage?.trim() &&
                    detail.time?.trim()
                );
                const hasManualData = validManualEntries.length > 0;

                // Check if user provided any information at all
                if (!hasImageData && !hasManualData) {
                    const errorMessage = 'Vui lòng cung cấp thông tin thuốc bằng ít nhất một trong hai cách sau:\n' +
                        '• Tải lên ảnh đơn thuốc từ bác sĩ\n' +
                        '• Nhập thông tin thuốc thủ công (ít nhất một loại thuốc với đầy đủ thông tin)\n\n' +
                        'Thông tin này cần thiết để nhân viên y tế có thể kiểm duyệt đơn thuốc của bạn.';

                    setError(errorMessage);
                    setLoading(false);
                    toast.error('❌ Thiếu thông tin thuốc! Vui lòng cung cấp ảnh đơn thuốc hoặc nhập thông tin thủ công.');
                    return;
                }

                // Validate manual entry details if provided - check for incomplete entries
                if (values.medicalOrderDetails.length > 0) {
                    let hasIncompleteEntries = false;
                    let incompleteRowIndex = -1;

                    for (let i = 0; i < values.medicalOrderDetails.length; i++) {
                        const detail = values.medicalOrderDetails[i];
                        const hasAnyField = detail.medicineName?.trim() || detail.dosage?.trim() || detail.time?.trim();
                        const hasAllFields = detail.medicineName?.trim() && detail.dosage?.trim() && detail.time?.trim();

                        if (hasAnyField && !hasAllFields) {
                            hasIncompleteEntries = true;
                            incompleteRowIndex = i;
                            break;
                        }
                    }

                    if (hasIncompleteEntries) {
                        setError(`Vui lòng điền đầy đủ thông tin thuốc ở dòng ${incompleteRowIndex + 1} (Tên thuốc, Liều lượng và Thời gian dùng) hoặc xóa dòng này nếu không cần thiết.`);
                        setLoading(false);
                        toast.error(`❌ Thông tin thuốc chưa đầy đủ ở dòng ${incompleteRowIndex + 1}`);
                        return;
                    }
                }

                // Update form data with image URL if exists and handle default notes
                // Only include medicine details that have complete information
                const completeMedicineDetails = values.medicalOrderDetails.filter(detail =>
                    detail.medicineName?.trim() &&
                    detail.dosage?.trim() &&
                    detail.time?.trim()
                ).map(detail => ({
                    ...detail,
                    note: detail.note?.trim() || 'Không có ghi chú'
                }));

                const submitData = {
                    ...values,
                    medicalOrder: {
                        ...values.medicalOrder,
                        imageURL: uploadedImageUrl || '',
                        note: values.medicalOrder.note?.trim() || 'Không có ghi chú'
                    },
                    medicalOrderDetails: completeMedicineDetails
                };

                await medicalOrderApi.createOrder(submitData);

                // Success message based on what user provided
                let successMessage = '✅ Đã tạo đơn thuốc thành công!';
                if (hasImageData && hasManualData) {
                    successMessage += ' Cả ảnh đơn thuốc và thông tin chi tiết đã được gửi đến nhân viên y tế để kiểm duyệt.';
                } else if (hasImageData) {
                    successMessage += ' Ảnh đơn thuốc đã được gửi đến nhân viên y tế để kiểm duyệt.';
                } else if (hasManualData) {
                    successMessage += ' Thông tin thuốc chi tiết đã được gửi đến nhân viên y tế để kiểm duyệt.';
                }

                toast.success(successMessage);
                navigate('/parent/medical-orders');
            } catch (err) {
                console.error('Error creating medical order:', err);
                setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo đơn thuốc');
                toast.error('❌ Không thể tạo đơn thuốc');
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Always load children list for dropdown
                const childrenResponse = await childApi.getAllChildren();
                if (childrenResponse && childrenResponse.data && childrenResponse.data.records) {
                    setChildren(childrenResponse.data.records);
                }

                // If childId is provided, load specific child data
                if (childId) {
                    const childData = await childApi.getChildById(childId);
                    setChild(childData.data || childData);

                    // Update formik values with childId
                    formik.setFieldValue('medicalOrder.ChildId', childId);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                toast.error('Không thể tải dữ liệu');
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [childId]);

    const handleChildChange = async (e) => {
        const selectedChildId = e.target.value;
        formik.setFieldValue('medicalOrder.ChildId', selectedChildId);

        // Load specific child data when selected
        if (selectedChildId) {
            try {
                const childData = await childApi.getChildById(selectedChildId);
                setChild(childData.data || childData);
            } catch (err) {
                console.error('Error loading child data:', err);
                toast.error('Không thể tải thông tin con em');
            }
        } else {
            setChild(null);
        }
    };

    // Handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log('Starting image upload:', file.name, file.size, file.type);

        try {
            const result = await uploadSingleImage(file, 'school-medical-care/medical-orders');
            console.log('Upload result:', result);

            if (result && result.success) {
                setUploadedImageUrl(result.data.imageUrl);
                setUploadedImagePublicId(result.data.publicId);
                console.log('Image uploaded successfully:', result);

                // Update formik values with image URL
                formik.setFieldValue('medicalOrder.imageURL', result.data.imageUrl);

                toast.success('✅ Đã tải ảnh đơn thuốc thành công!');
            } else {
                console.error('Upload failed:', result);
                toast.error(`❌ Lỗi tải ảnh: ${result?.error || 'Không xác định'}`);
            }
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('❌ Có lỗi xảy ra khi tải ảnh');
        }

        // Clear the input value to allow re-uploading the same file
        event.target.value = '';
    };

    // Handle delete uploaded image
    const handleDeleteImage = async () => {
        if (!uploadedImagePublicId) return;

        try {
            const res = await deleteImage(uploadedImagePublicId);
            console.log(res);
            if (res.success) {
                toast.success(res.message);
                setUploadedImageUrl(null);
                setUploadedImagePublicId(null);
                // Update formik values
                formik.setFieldValue('medicalOrder.imageURL', '');
            } else {
                toast.error(res.message || 'Xóa ảnh thất bại');
            }
        } catch (err) {
            console.error('Delete image error:', err);
            toast.error('❌ Có lỗi xảy ra khi xóa ảnh');
        }
    };

    // Show loading spinner only when:
    // 1. childId is provided but child data is not loaded yet
    // 2. children list is not loaded yet (for dropdown)
    if ((childId && !child) || children.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton
                        onClick={() => navigate(`/parent/children`)}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Tạo đơn thuốc mới
                    </Typography>
                </Box>

                {/* Child Selection - Only show if no childId from URL */}
                {!childId && (
                    <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Chọn con em
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                label="Chọn con em"
                                name="ChildId"
                                value={formik.values.medicalOrder.ChildId}
                                onChange={handleChildChange}
                                error={!!formik.errors.medicalOrder?.ChildId}
                                helperText={formik.errors.medicalOrder?.ChildId}
                                required
                                sx={{ bgcolor: 'white' }}
                            >
                                <MenuItem value="">-- Chọn con em --</MenuItem>
                                {children.map((childOption) => (
                                    <MenuItem key={childOption._id} value={childOption._id}>
                                        {childOption.name} - {childOption.studentCode}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </CardContent>
                    </Card>
                )}

                {/* Child Info - Only show if child is selected */}
                {child && (
                    <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Thông tin con em
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Họ tên:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.name || 'Không có'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Ngày sinh:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.birthdate ? new Date(child.birthdate).toLocaleDateString('vi-VN') : 'Không có'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Mã học sinh:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.studentCode || 'Không có'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Giới tính:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.gender === 'male' ? 'Nam' :
                                            child?.gender === 'female' ? 'Nữ' : 'Không có'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {uploadError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {uploadError}
                    </Alert>
                )}

                {/* Information Alert */}
                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                        '& .MuiAlert-message': {
                            width: '100%'
                        }
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        📋 Hướng dẫn cung cấp thông tin thuốc:
                    </Typography>
                    <Typography variant="body2" component="div">
                        Để nhân viên y tế có thể kiểm duyệt đơn thuốc, bạn cần cung cấp <strong>ít nhất một</strong> trong hai cách sau:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                        <li>
                            <Typography variant="body2">
                                <strong>📷 Tải ảnh đơn thuốc:</strong> Chụp/tải lên ảnh đơn thuốc từ bác sĩ
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>✏️ Nhập thông tin thủ công:</strong> Điền chi tiết tên thuốc, liều lượng và thời gian dùng
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                <strong>📝 Cả hai cách:</strong> Để cung cấp thông tin đầy đủ nhất (khuyến nghị)
                            </Typography>
                        </li>
                    </Box>
                </Alert>

                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit}>
                        {/* Medical Order Basic Info */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Thông tin đơn thuốc
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Ngày bắt đầu"
                                            name="medicalOrder.startDate"
                                            value={formik.values.medicalOrder.startDate}
                                            onChange={formik.handleChange}
                                            error={!!formik.errors.medicalOrder?.startDate}
                                            helperText={formik.errors.medicalOrder?.startDate}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Ngày kết thúc"
                                            name="medicalOrder.endDate"
                                            value={formik.values.medicalOrder.endDate}
                                            onChange={formik.handleChange}
                                            error={!!formik.errors.medicalOrder?.endDate}
                                            helperText={formik.errors.medicalOrder?.endDate}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Ghi chú chung"
                                            name="medicalOrder.note"
                                            value={formik.values.medicalOrder.note}
                                            onChange={formik.handleChange}
                                            error={!!formik.errors.medicalOrder?.note}
                                            helperText={formik.errors.medicalOrder?.note}
                                            multiline
                                            rows={3}
                                            placeholder="Ghi chú về đơn thuốc..."
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Mode Selection */}
                        {/* <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Cách thức nhập thông tin thuốc
                            </Typography>
                            
                            <TextField
                                select
                                fullWidth
                                label="Chọn cách nhập thông tin"
                                value={inputMode}
                                onChange={handleModeChange}
                                sx={{ 
                                    mb: 2,
                                    bgcolor: 'white',
                                    maxWidth: 500
                                }}
                            >
                                <MenuItem value="manual">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>📝 Nhập thông tin thủ công</Typography>
                                    </Stack>
                                </MenuItem>
                                <MenuItem value="upload">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>📷 Upload ảnh đơn thuốc</Typography>
                                    </Stack>
                                </MenuItem>
                                <MenuItem value="both">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>📝📷 Cả hai cách (Thủ công + Ảnh)</Typography>
                                    </Stack>
                                </MenuItem>
                            </TextField>

                            <Typography variant="body2" color="text.secondary">
                                {inputMode === 'manual' && 'Điền thông tin chi tiết về từng loại thuốc (tên, liều lượng, cách dùng, ...).'}
                                {inputMode === 'upload' && 'Tải lên ảnh chụp đơn thuốc từ bác sĩ. Hệ thống sẽ lưu trữ ảnh để y tá tham khảo.'}
                                {inputMode === 'both' && 'Vừa nhập thông tin chi tiết về thuốc, vừa tải ảnh đơn thuốc để y tá có thể tham khảo đầy đủ nhất. Ít nhất một trong hai cách phải được cung cấp.'}
                            </Typography>
                        </CardContent>
                    </Card> */}

                        {/* Prescription Image Upload */}
                        {(inputMode === 'upload' || inputMode === 'both') && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Tải lên ảnh đơn thuốc
                                    </Typography>

                                    {!uploadedImageUrl ? (
                                        <Box>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="prescription-image-upload"
                                                type="file"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                            <label htmlFor="prescription-image-upload">
                                                <Button
                                                    variant="outlined"
                                                    component="span"
                                                    disabled={uploading}
                                                    sx={{
                                                        height: 120,
                                                        width: '100%',
                                                        border: '2px dashed #1976d2',
                                                        borderRadius: 2,
                                                        bgcolor: '#f8f9fa',
                                                        '&:hover': {
                                                            bgcolor: '#e3f2fd',
                                                            border: '2px dashed #1565c0'
                                                        }
                                                    }}
                                                >
                                                    <Stack alignItems="center" spacing={1}>
                                                        <CloudUpload sx={{ fontSize: 32, color: '#1976d2' }} />
                                                        <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 'medium' }}>
                                                            {uploading ? 'Đang tải lên...' : 'Chọn ảnh đơn thuốc'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 5MB)
                                                        </Typography>
                                                    </Stack>
                                                </Button>
                                            </label>

                                            {uploading && (
                                                <Box sx={{ mt: 2 }}>
                                                    <LinearProgress variant="determinate" value={uploadProgress} />
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Đang tải lên: {uploadProgress}%
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                                <ImageIcon color="primary" />
                                                <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                                                    ✅ Ảnh đơn thuốc đã được tải lên thành công
                                                </Typography>
                                            </Stack>

                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <Box
                                                    component="img"
                                                    src={uploadedImageUrl}
                                                    alt="Prescription"
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 300,
                                                        height: 200,
                                                        objectFit: 'cover',
                                                        borderRadius: 2,
                                                        border: '1px solid #e0e0e0',
                                                        boxShadow: 1,
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': {
                                                            transform: 'scale(1.02)',
                                                            boxShadow: 2
                                                        }
                                                    }}
                                                    onClick={() => setImageViewOpen(true)}
                                                />

                                                {/* Overlay with zoom icon */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                                        borderRadius: '50%',
                                                        p: 0.5,
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => setImageViewOpen(true)}
                                                >
                                                    <ZoomIn sx={{ color: 'white', fontSize: 20 }} />
                                                </Box>
                                            </Box>

                                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<ZoomIn />}
                                                    onClick={() => setImageViewOpen(true)}
                                                >
                                                    Xem ảnh
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    startIcon={<DeleteImageIcon />}
                                                    onClick={handleDeleteImage}
                                                >
                                                    Xóa ảnh
                                                </Button>
                                            </Stack>
                                        </Box>
                                    )}

                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Lưu ý:</strong> Ảnh nên rõ nét, đầy đủ thông tin về tên thuốc, liều lượng, cách dùng.
                                            Y tá sẽ dựa vào ảnh này để hướng dẫn cho trẻ uống thuốc đúng cách.
                                        </Typography>
                                    </Alert>
                                </CardContent>
                            </Card>
                        )}

                        {/* Medical Order Details - Show in manual and both modes */}
                        {(inputMode === 'manual' || inputMode === 'both') && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <FieldArray name="medicalOrderDetails">
                                        {({ push, remove }) => (
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                            Chi tiết thuốc
                                                        </Typography>
                                                        {inputMode === 'both' && (
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                Tùy chọn: Có thể bỏ trống nếu đã tải ảnh đơn thuốc
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<AddIcon />}
                                                        onClick={() => push({
                                                            medicineName: '',
                                                            dosage: '',
                                                            type: 'viên',
                                                            time: '',
                                                            note: '',
                                                            quantity: 1
                                                        })}
                                                        size="small"
                                                    >
                                                        Thêm thuốc
                                                    </Button>
                                                </Box>
                                                {formik.values.medicalOrderDetails.map((detail, index) => (
                                                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                                        <CardContent>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                    Thuốc #{index + 1}
                                                                </Typography>
                                                                {formik.values.medicalOrderDetails.length > 1 && (
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => remove(index)}
                                                                        size="small"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                )}
                                                            </Box>

                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Tên thuốc"
                                                                        name={`medicalOrderDetails.${index}.medicineName`}
                                                                        value={detail.medicineName}
                                                                        onChange={formik.handleChange}
                                                                        error={!!formik.errors.medicalOrderDetails?.[index]?.medicineName}
                                                                        helperText={formik.errors.medicalOrderDetails?.[index]?.medicineName}
                                                                        placeholder="Ví dụ: Paracetamol"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Liều lượng"
                                                                        name={`medicalOrderDetails.${index}.dosage`}
                                                                        value={detail.dosage}
                                                                        onChange={formik.handleChange}
                                                                        error={!!formik.errors.medicalOrderDetails?.[index]?.dosage}
                                                                        helperText={formik.errors.medicalOrderDetails?.[index]?.dosage}
                                                                        placeholder="Ví dụ: 500mg"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={4}>
                                                                    <TextField
                                                                        fullWidth
                                                                        select
                                                                        label="Dạng thuốc"
                                                                        name={`medicalOrderDetails.${index}.type`}
                                                                        value={detail.type}
                                                                        onChange={formik.handleChange}
                                                                        error={!!formik.errors.medicalOrderDetails?.[index]?.type}
                                                                        helperText={formik.errors.medicalOrderDetails?.[index]?.type}
                                                                        sx={{
                                                                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                                                            '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                                                                            '& .MuiSelect-select': { minWidth: '100px' }
                                                                        }}
                                                                    >
                                                                        <MenuItem value="viên">Viên</MenuItem>
                                                                        <MenuItem value="gói">Gói</MenuItem>
                                                                        <MenuItem value="chai">Chai</MenuItem>
                                                                        <MenuItem value="ống">Ống</MenuItem>
                                                                        <MenuItem value="hộp">Hộp</MenuItem>
                                                                        <MenuItem value="lọ">Lọ</MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4}>
                                                                    <TextField
                                                                        fullWidth
                                                                        type="number"
                                                                        label="Số lượng"
                                                                        name={`medicalOrderDetails.${index}.quantity`}
                                                                        value={detail.quantity}
                                                                        onChange={formik.handleChange}
                                                                        error={!!formik.errors.medicalOrderDetails?.[index]?.quantity}
                                                                        helperText={formik.errors.medicalOrderDetails?.[index]?.quantity}
                                                                        inputProps={{ min: 1 }}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} md={4}>
                                                                    <TextField
                                                                        fullWidth
                                                                        select
                                                                        label="Thời gian uống"
                                                                        name={`medicalOrderDetails.${index}.time`}
                                                                        value={detail.time}
                                                                        onChange={formik.handleChange}
                                                                        error={!!formik.errors.medicalOrderDetails?.[index]?.time}
                                                                        helperText={formik.errors.medicalOrderDetails?.[index]?.time}
                                                                        sx={{
                                                                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                                                            '& .MuiInputLabel-root': { whiteSpace: 'nowrap' },
                                                                            '& .MuiSelect-select': { minWidth: '100px' }
                                                                        }}
                                                                        SelectProps={{
                                                                            MenuProps: {
                                                                                PaperProps: {
                                                                                    style: {
                                                                                        maxHeight: 300,
                                                                                        width: 280,
                                                                                    },
                                                                                },
                                                                            },
                                                                        }}
                                                                    >
                                                                        <MenuItem value="Sáng">Sáng (1 lần/ngày)</MenuItem>
                                                                        <MenuItem value="Trưa">Trưa (1 lần/ngày)</MenuItem>
                                                                        <MenuItem value="Chiều">Chiều (1 lần/ngày)</MenuItem>
                                                                        <MenuItem value="Sáng-Trưa">Sáng - Trưa (2 lần/ngày)</MenuItem>
                                                                        <MenuItem value="Sáng-Chiều">Sáng - Chiều (2 lần/ngày)</MenuItem>
                                                                        <MenuItem value="Trưa-Chiều">Trưa - Chiều (2 lần/ngày)</MenuItem>
                                                                        <MenuItem value="Sáng-Trưa-Chiều">Sáng - Trưa - Chiều (3 lần/ngày)</MenuItem>
                                                                    </TextField>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Ghi chú"
                                                                        name={`medicalOrderDetails.${index}.note`}
                                                                        value={detail.note}
                                                                        onChange={formik.handleChange}
                                                                        multiline
                                                                        rows={2}
                                                                        placeholder="Ghi chú cho thuốc này (uống trước/sau ăn, chú ý...)"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                </CardContent>
                            </Card>
                        )}

                        {/* Validation Info Box */}
                        <Box
                            sx={{
                                p: 2,
                                mb: 3,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'grey.300'
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                                ⚠️ Trước khi gửi đơn thuốc:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Đảm bảo bạn đã cung cấp <strong>ít nhất một</strong> trong hai loại thông tin: ảnh đơn thuốc hoặc chi tiết thuốc thủ công
                                <br />
                                • Nhân viên y tế sẽ kiểm duyệt đơn thuốc dựa trên thông tin bạn cung cấp
                                <br />
                                • Bạn có thể theo dõi trạng thái đơn thuốc trong mục "Đơn thuốc của tôi"
                            </Typography>
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(childId ? `/parent/children` : '/parent/medical-orders')}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={loading || uploading}
                                sx={{
                                    bgcolor: '#4caf50',
                                    '&:hover': { bgcolor: '#45a049' }
                                }}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo đơn thuốc'}
                            </Button>
                        </Box>
                    </form>
                </FormikProvider>

                {/* Image Preview Modal */}
                <Dialog
                    open={imageViewOpen}
                    onClose={() => setImageViewOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Ảnh đơn thuốc</Typography>
                            <IconButton
                                onClick={() => setImageViewOpen(false)}
                                size="small"
                            >
                                <Close />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent>
                        {uploadedImageUrl && (
                            <Box
                                component="img"
                                src={uploadedImageUrl}
                                alt="Ảnh đơn thuốc chi tiết"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 1,
                                    maxHeight: '70vh',
                                    objectFit: 'contain'
                                }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setImageViewOpen(false)}>
                            Đóng
                        </Button>
                        <Button
                            color="error"
                            startIcon={<DeleteImageIcon />}
                            onClick={() => {
                                handleDeleteImage();
                                setImageViewOpen(false);
                            }}
                        >
                            Xóa ảnh
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default CreateMedicalOrderPage;