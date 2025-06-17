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
    Alert
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';

const AddChildPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        gender: '',
        bloodType: '',
        allergies: '',
        medicalConditions: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await childApi.createChild(formData);
            toast.success('✅ Đã thêm con em thành công!');
            navigate('/parent');
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi thêm con em');
            toast.error('❌ Không thể thêm con em');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper className="parent-card" sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton 
                        onClick={() => navigate('/parent')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" className="parent-title">
                        Thêm con em mới
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Basic Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Thông tin cơ bản
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Họ và tên"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ngày sinh"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
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
                            >
                                <MenuItem value="male">Nam</MenuItem>
                                <MenuItem value="female">Nữ</MenuItem>
                                <MenuItem value="other">Khác</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Nhóm máu"
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
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

                        {/* Health Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                                Thông tin sức khỏe
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dị ứng"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                placeholder="Nhập các dị ứng (nếu có)"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tình trạng sức khỏe"
                                name="medicalConditions"
                                value={formData.medicalConditions}
                                onChange={handleChange}
                                multiline
                                rows={2}
                                placeholder="Nhập các tình trạng sức khỏe đặc biệt (nếu có)"
                            />
                        </Grid>

                        {/* Emergency Contact */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                                Thông tin liên hệ khẩn cấp
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Họ và tên người liên hệ"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mối quan hệ"
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                name="emergencyContact.phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/parent')}
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
                                    {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AddChildPage; 