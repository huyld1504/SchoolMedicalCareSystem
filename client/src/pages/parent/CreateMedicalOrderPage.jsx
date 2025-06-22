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
    Fab
} from '@mui/material';
import {
    ArrowBack,
    Save,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { medicalOrderApi } from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';

const CreateMedicalOrderPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const childId = searchParams.get('childId');
    const dispatch = useDispatch(); const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [formData, setFormData] = useState({
        medicalOrder: {
            ChildId: childId,
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            note: ''
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
    }); useEffect(() => {
        const loadChildData = async () => {
            if (!childId) {
                navigate('/parent/children');
                return;
            }

            try {
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
            } catch (err) {
                toast.error('Không thể tải thông tin con em');
                navigate('/parent/children');
            }
        };

        loadChildData();
    }, [childId, navigate]); const handleMedicalOrderChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            medicalOrder: {
                ...prev.medicalOrder,
                [name]: value
            }
        }));
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
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate required fields
        if (!formData.medicalOrder.endDate) {
            setError('Vui lòng chọn ngày kết thúc');
            setLoading(false);
            return;
        }

        // Validate medical order details
        for (let i = 0; i < formData.medicalOrderDetails.length; i++) {
            const detail = formData.medicalOrderDetails[i];
            if (!detail.medicineName || !detail.dosage || !detail.time) {
                setError(`Vui lòng điền đầy đủ thông tin thuốc ở dòng ${i + 1}`);
                setLoading(false);
                return;
            }
        }

        try {
            await medicalOrderApi.createMedicalOrder(formData);
            toast.success('✅ Đã tạo đơn thuốc thành công!');
            navigate(`/parent/children`);
        } catch (err) {
            console.error('Error creating medical order:', err);
            setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo đơn thuốc');
            toast.error('❌ Không thể tạo đơn thuốc');
        } finally {
            setLoading(false);
        }
    };

    if (!child) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    } return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header */}                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton
                        onClick={() => navigate(`/parent/children`)}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Tạo đơn thuốc mới
                    </Typography>
                </Box>                {/* Child Info */}
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

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
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
                                        required
                                        multiline
                                        rows={3}
                                        placeholder="Ghi chú về đơn thuốc (nếu có)..."
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Medical Order Details */}
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
                                                    <MenuItem value="6 tiếng 1 lần">Cách 6 tiếng (4 lần/ngày)</MenuItem>
                                                    <MenuItem value="8 tiếng 1 lần">Cách 8 tiếng (3 lần/ngày)</MenuItem>
                                                    <MenuItem value="12 tiếng 1 lần">Cách 12 tiếng (2 lần/ngày)</MenuItem>
                                                    <MenuItem value="Trước ăn 30 phút">Trước ăn 30 phút</MenuItem>
                                                    <MenuItem value="Sau ăn 30 phút">Sau ăn 30 phút</MenuItem>
                                                    <MenuItem value="Cùng bữa ăn">Cùng bữa ăn</MenuItem>
                                                    <MenuItem value="Khi đói">Khi đói</MenuItem>
                                                    <MenuItem value="Trước khi ngủ">Trước khi ngủ</MenuItem>
                                                    <MenuItem value="Khi cần thiết">Khi cần thiết</MenuItem>
                                                    <MenuItem value="Theo chỉ định bác sĩ">Theo chỉ định bác sĩ</MenuItem>
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

                    {/* Submit Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/parent/children/${childId}`)}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                            disabled={loading}
                            sx={{
                                bgcolor: '#4caf50',
                                '&:hover': { bgcolor: '#45a049' }
                            }}
                        >
                            {loading ? 'Đang tạo...' : 'Tạo đơn thuốc'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateMedicalOrderPage; 