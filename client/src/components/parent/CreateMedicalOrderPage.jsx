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
    FormControl,
    InputLabel,
    Select,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { medicalOrderApi } from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';

const CreateMedicalOrderPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const childId = searchParams.get('childId');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        priority: 'normal',
        notes: ''
    });

    useEffect(() => {
        const loadChild = async () => {
            if (!childId) {
                setError('Không tìm thấy thông tin con em');
                return;
            }

            try {
                const childData = await childApi.getChildById(childId);
                setChild(childData);
            } catch (err) {
                setError('Không thể tải thông tin con em');
                toast.error('❌ Có lỗi xảy ra khi tải dữ liệu');
            }
        };

        loadChild();
    }, [childId]);

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
            await medicalOrderApi.createOrder({
                ...formData,
                childId
            });

            toast.success('✅ Tạo yêu cầu y tế thành công');
            navigate(`/parent/children/${childId}`);
        } catch (err) {
            setError('Không thể tạo yêu cầu y tế');
            toast.error('❌ Có lỗi xảy ra khi tạo yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    if (error && !child) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/parent')}
                >
                    Quay lại trang chủ
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton 
                    onClick={() => navigate(`/parent/children/${childId}`)}
                    sx={{ mr: 2 }}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h5" className="parent-title">
                    Tạo yêu cầu y tế mới
                </Typography>
            </Box>

            <Paper className="parent-card" sx={{ p: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Child Information */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Thông tin con em
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {child?.name} - {new Date(child?.dateOfBirth).toLocaleDateString()}
                            </Typography>
                        </Grid>

                        {/* Type */}
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Loại yêu cầu</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    label="Loại yêu cầu"
                                >
                                    <MenuItem value="medicine">Đơn thuốc</MenuItem>
                                    <MenuItem value="checkup">Khám sức khỏe</MenuItem>
                                    <MenuItem value="vaccination">Tiêm chủng</MenuItem>
                                    <MenuItem value="other">Khác</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                name="description"
                                label="Mô tả chi tiết"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết về yêu cầu y tế của bạn..."
                            />
                        </Grid>

                        {/* Priority */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Mức độ ưu tiên</InputLabel>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    label="Mức độ ưu tiên"
                                >
                                    <MenuItem value="low">Thấp</MenuItem>
                                    <MenuItem value="normal">Bình thường</MenuItem>
                                    <MenuItem value="high">Cao</MenuItem>
                                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Notes */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                name="notes"
                                label="Ghi chú thêm"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Thêm thông tin bổ sung nếu cần..."
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                className="parent-button"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Tạo yêu cầu'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateMedicalOrderPage; 