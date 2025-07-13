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
    Switch,
    FormControlLabel,
    Stack,
    LinearProgress,
    Chip,
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
import { useNavigate, useSearchParams, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import medicalOrderApi from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

const CreateMedicalOrderPage = () => {
    const navigate = useNavigate();
    const { childId } = useParams(); // Get childId from URL params
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [children, setChildren] = useState([]); // Add children list for dropdown

    // Upload mode toggle
    const [uploadMode, setUploadMode] = useState(false); // false: manual entry, true: image upload
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [uploadedImagePublicId, setUploadedImagePublicId] = useState(null);
    const [imageViewOpen, setImageViewOpen] = useState(false); // For image preview modal

    // Cloudinary upload hook

    const { uploading, uploadProgress, error: uploadError, uploadSingleImage, deleteImage, reset: resetUpload } = useCloudinaryUpload();

    const [formData, setFormData] = useState({
        medicalOrder: {
            ChildId: childId || '', // Set to childId if available, otherwise empty
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            note: '',
            imageURL: "" // Add field for prescription image
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

                    // Update formData with childId
                    setFormData(prev => ({
                        ...prev,
                        medicalOrder: {
                            ...prev.medicalOrder,
                            ChildId: childId
                        }
                    }));
                }
            } catch (err) {
                console.error('Error loading data:', err);
                toast.error('Không thể tải dữ liệu');
            }
        }; loadData();
    }, [childId]);

    const handleMedicalOrderChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            medicalOrder: {
                ...prev.medicalOrder,
                [name]: value
            }
        }));
    };

    const handleChildChange = async (e) => {
        const selectedChildId = e.target.value;
        setFormData(prev => ({
            ...prev,
            medicalOrder: {
                ...prev.medicalOrder,
                ChildId: selectedChildId
            }
        }));

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

    // Handle mode toggle
    const handleModeToggle = (e) => {
        const newUploadMode = e.target.checked;
        setUploadMode(newUploadMode);

        // Reset relevant data when switching modes
        if (newUploadMode) {
            // Switching to upload mode - clear manual entry details
            setFormData(prev => ({
                ...prev,
                medicalOrderDetails: []
            }));
        } else {
            // Switching to manual mode - clear uploaded image and reset details
            if (uploadedImageUrl && uploadedImagePublicId) {
                handleDeleteImage();
            }
            setFormData(prev => ({
                ...prev,
                medicalOrder: {
                    ...prev.medicalOrder,
                    imageURL: null
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
            }));
        }

        // Clear any errors
        setError(null);
        resetUpload();
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

                // Update form data with image URL
                setFormData(prev => ({
                    ...prev,
                    medicalOrder: {
                        ...prev.medicalOrder,
                        imageURL: result.data.imageUrl
                    }
                }));

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
                // Update form data
                setFormData(prev => ({
                    ...prev,
                    medicalOrder: {
                        ...prev.medicalOrder,
                        prescriptionImageUrl: null
                    }
                }));
            } else {
                toast.error(res.message || 'Xóa ảnh thất bại');
            }
        } catch (err) {
            console.error('Delete image error:', err);
            toast.error('❌ Có lỗi xảy ra khi xóa ảnh');
        }
    };

    const handleMedicalOrderDetailChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newDetails = [...prev.medicalOrderDetails];
            newDetails[index] = {
                ...newDetails[index],
                [name]: value
            };
            return {
                ...prev,
                medicalOrderDetails: newDetails
            };
        });
    };

    const addMedicalOrderDetail = () => {
        setFormData(prev => ({
            ...prev,
            medicalOrderDetails: [
                ...prev.medicalOrderDetails,
                {
                    medicineName: '',
                    dosage: '',
                    type: 'viên',
                    time: '',
                    note: '',
                    quantity: 1
                }
            ]
        }));
    };

    const removeMedicalOrderDetail = (index) => {
        if (formData.medicalOrderDetails.length > 1) {
            setFormData(prev => ({
                ...prev,
                medicalOrderDetails: prev.medicalOrderDetails.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log('Submitting form data:', formData);

        // Validate child selection
        if (!formData.medicalOrder.ChildId) {
            setError('Vui lòng chọn con em');
            setLoading(false);
            return;
        }

        // Validate required fields
        if (!formData.medicalOrder.endDate) {
            setError('Vui lòng chọn ngày kết thúc');
            setLoading(false);
            return;
        }

        // Validate based on mode
        if (uploadMode) {
            // Upload mode validation
            if (!uploadedImageUrl) {
                setError('Vui lòng tải lên ảnh đơn thuốc');
                setLoading(false);
                toast.error('❌ Vui lòng tải lên ảnh đơn thuốc');
                return;
            }
        } else {
            // Manual entry mode validation
            if (formData.medicalOrderDetails.length === 0) {
                setError('Vui lòng thêm ít nhất một loại thuốc');
                setLoading(false);
                return;
            }

            for (let i = 0; i < formData.medicalOrderDetails.length; i++) {
                const detail = formData.medicalOrderDetails[i];
                if (!detail.medicineName || !detail.dosage || !detail.time) {
                    setError(`Vui lòng điền đầy đủ thông tin thuốc ở dòng ${i + 1}`);
                    setLoading(false);
                    return;
                }
            }
        }

        try {
            await medicalOrderApi.createOrder(formData);
            toast.success('✅ Đã tạo đơn thuốc thành công!');
            // Navigate to medical orders page to see the created order
            navigate('/parent/medical-orders');
        } catch (err) {
            console.error('Error creating medical order:', err);
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo đơn thuốc');
            toast.error('❌ Không thể tạo đơn thuốc');
        } finally {
            setLoading(false);
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
                                value={formData.medicalOrder.ChildId}
                                onChange={handleChildChange}
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
                        </CardContent>                    </Card>
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
                                        {child?.name || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Ngày sinh:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.birthdate ? new Date(child.birthdate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Mã học sinh:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.studentCode || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">Giới tính:</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {child?.gender === 'male' ? 'Nam' :
                                            child?.gender === 'female' ? 'Nữ' : 'N/A'}
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
                )}                <form onSubmit={handleSubmit}>
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
                                        name="startDate"
                                        value={formData.medicalOrder.startDate}
                                        onChange={handleMedicalOrderChange}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Ngày kết thúc"
                                        name="endDate"
                                        value={formData.medicalOrder.endDate}
                                        onChange={handleMedicalOrderChange}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ghi chú chung"
                                        name="note"
                                        value={formData.medicalOrder.note}
                                        onChange={handleMedicalOrderChange}
                                        multiline
                                        rows={3}
                                        placeholder="Ghi chú về đơn thuốc..."
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Mode Selection */}
                    <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Cách thức nhập thông tin thuốc
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={uploadMode}
                                        onChange={handleModeToggle}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="body1">
                                            {uploadMode ? 'Upload ảnh đơn thuốc' : 'Nhập thông tin thủ công'}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={uploadMode ? 'Ảnh' : 'Thủ công'}
                                            color={uploadMode ? 'primary' : 'secondary'}
                                        />
                                    </Stack>
                                }
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {uploadMode
                                    ? 'Tải lên ảnh chụp đơn thuốc từ bác sĩ. Hệ thống sẽ lưu trữ ảnh để y tá tham khảo.'
                                    : 'Điền thông tin chi tiết về từng loại thuốc (tên, liều lượng, cách dùng, ...).'
                                }
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Prescription Image Upload */}
                    {uploadMode && (
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
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                Ảnh đơn thuốc đã được tải lên
                                            </Typography>
                                            <Chip label="Thành công" color="success" size="small" />
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

                    {/* Medical Order Details - Only show in manual mode */}
                    {!uploadMode && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Chi tiết thuốc
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={addMedicalOrderDetail}
                                        size="small"
                                    >
                                        Thêm thuốc
                                    </Button>
                                </Box>

                                {formData.medicalOrderDetails.map((detail, index) => (
                                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    Thuốc #{index + 1}
                                                </Typography>
                                                {formData.medicalOrderDetails.length > 1 && (
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => removeMedicalOrderDetail(index)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                )}
                                            </Box>                                        <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Tên thuốc"
                                                        name="medicineName"
                                                        value={detail.medicineName}
                                                        onChange={(e) => handleMedicalOrderDetailChange(index, e)}
                                                        required
                                                        placeholder="Ví dụ: Paracetamol"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Liều lượng"
                                                        name="dosage"
                                                        value={detail.dosage}
                                                        onChange={(e) => handleMedicalOrderDetailChange(index, e)}
                                                        required
                                                        placeholder="Ví dụ: 500mg"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        label="Dạng thuốc"
                                                        name="type"
                                                        value={detail.type}
                                                        onChange={(e) => handleMedicalOrderDetailChange(index, e)}
                                                        required
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
                                                        name="quantity"
                                                        value={detail.quantity}
                                                        onChange={(e) => handleMedicalOrderDetailChange(index, e)}
                                                        required
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        label="Thời gian uống"
                                                        name="time"
                                                        value={detail.time}
                                                        onChange={(e) => handleMedicalOrderDetailChange(index, e)}
                                                        required
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
                                                        name="note"
                                                        value={detail.note}
                                                        onChange={(e) => handleMedicalOrderDetailChange(index, e)}
                                                        multiline
                                                        rows={2}
                                                        placeholder="Ghi chú cho thuốc này (uống trước/sau ăn, chú ý...)"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    )}

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