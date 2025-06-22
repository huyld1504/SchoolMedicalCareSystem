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
    CircularProgress
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import  medicalOrderApi  from '../../api/medicalOrderApi';
import { childApi } from '../../api/childApi';

const CreateMedicalOrderPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const childId = searchParams.get('childId');
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [child, setChild] = useState(null);
    const [formData, setFormData] = useState({
        childId: childId,
        type: '',
        description: '',
        priority: 'normal',
        notes: ''
    });

    useEffect(() => {
        const loadChildData = async () => {
            if (!childId) {
                navigate('/parent/dashboard');
                return;
            }

            try {
                const childData = await childApi.getChildById(childId);
                setChild(childData);
            } catch (err) {
                toast.error('Không thể tải thông tin con em');
                navigate('/parent/dashboard');
            }
        };

        loadChildData();
    }, [childId, navigate]);

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
            await medicalOrderApi.createOrder(formData);
            toast.success('✅ Đã tạo yêu cầu đơn thuốc thành công!');
            navigate('/parent/dashboard');
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi tạo yêu cầu');
            toast.error('❌ Không thể tạo yêu cầu đơn thuốc');
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
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper className="parent-card" sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton 
                        onClick={() => navigate('/parent/dashboard')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" className="parent-title">
                        Tạo yêu cầu đơn thuốc mới
                    </Typography>
                </Box>

                {/* Child Info */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Thông tin con em:
                    </Typography>
                    <Typography>
                        {child.name} - {new Date(child.dateOfBirth).toLocaleDateString()}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Loại yêu cầu"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="medicine">Đơn thuốc</MenuItem>
                                <MenuItem value="checkup">Khám sức khỏe</MenuItem>
                                <MenuItem value="vaccination">Tiêm chủng</MenuItem>
                                <MenuItem value="other">Khác</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả chi tiết"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required
                                placeholder="Mô tả chi tiết về yêu cầu của bạn..."
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Mức độ ưu tiên"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="low">Thấp</MenuItem>
                                <MenuItem value="normal">Bình thường</MenuItem>
                                <MenuItem value="high">Cao</MenuItem>
                                <MenuItem value="urgent">Khẩn cấp</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú thêm"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                placeholder="Thêm ghi chú nếu cần..."
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/parent/dashboard')}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="parent-button"
                                    startIcon={<Save />}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateMedicalOrderPage; 