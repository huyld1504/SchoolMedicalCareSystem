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
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Divider
} from '@mui/material';
import { ArrowBack, Save, Person, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { childApi } from '../../api/childApi';

const EditChildPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingChild, setLoadingChild] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    gender: '',
    studentCode: '',
    medicalConverageId: '',
    isActive: true
  });

  // Load child data when component mounts
  useEffect(() => {
    const loadChildData = async () => {
      try {
        setLoadingChild(true);
        setError(null);

        const response = await childApi.getChildById(id);
        console.log('Child data response:', response);

        const childData = response.data || response;
        if (childData) {
          setFormData({
            name: childData.name || '',
            birthdate: childData.birthdate ? childData.birthdate.split('T')[0] : '',
            gender: childData.gender || '',
            studentCode: childData.studentCode || '',
            medicalConverageId: childData.medicalConverageId || '',
            isActive: childData.isActive !== undefined ? childData.isActive : true
          });
        } else {
          throw new Error('Không tìm thấy thông tin con em');
        }
      } catch (err) {
        console.error('Error loading child data:', err);
        setError('Không thể tải thông tin con em: ' + (err.message || 'Unknown error'));
        toast.error('❌ Không thể tải thông tin con em');
      } finally {
        setLoadingChild(false);
      }
    };

    if (id) {
      loadChildData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Vui lòng nhập tên con em');
      }
      if (!formData.birthdate) {
        throw new Error('Vui lòng chọn ngày sinh');
      }
      if (!formData.gender) {
        throw new Error('Vui lòng chọn giới tính');
      }

      const updateData = {
        name: formData.name.trim(),
        birthdate: formData.birthdate,
        gender: formData.gender,
        studentCode: formData.studentCode.trim(),
        medicalConverageId: formData.medicalConverageId.trim(),
        isActive: formData.isActive
      };

      console.log('Updating child with data:', updateData);
      const response = await childApi.updateChild(id, updateData);
      console.log('Update response:', response);

      toast.success('✅ Đã cập nhật thông tin con em thành công!');
      navigate(`/parent/children/${id}`);
    } catch (err) {
      console.error('Error updating child:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin con em');
      toast.error('❌ ' + (err.message || 'Không thể cập nhật thông tin con em'));
    } finally {
      setLoading(false);
    }
  };

  if (loadingChild) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Paper elevation={0} sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton
              onClick={() => navigate(`/parent/children/${id}`)}
              sx={{ mr: 2, color: 'white' }}
            >
              <ArrowBack />
            </IconButton>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
              <Edit />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Chỉnh sửa thông tin con em
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Cập nhật thông tin cơ bản của con em
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Thông tin cơ bản
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Tên con em */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên con em"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                  />
                </Grid>

                {/* Mã học sinh */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã học sinh"
                    name="studentCode"
                    value={formData.studentCode}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Mã học sinh do trường cung cấp"
                  />
                </Grid>

                {/* Ngày sinh */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                {/* Giới tính */}
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

                {/* Mã bảo hiểm y tế */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mã bảo hiểm y tế"
                    name="medicalConverageId"
                    value={formData.medicalConverageId}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Mã thẻ bảo hiểm y tế (nếu có)"
                  />
                </Grid>

                {/* Trạng thái */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Trạng thái"
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Trạng thái học tập hiện tại"
                  >
                    <MenuItem value={true}>Đang học</MenuItem>
                    <MenuItem value={false}>Không hoạt động</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/parent/children/${id}`)}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EditChildPage;
