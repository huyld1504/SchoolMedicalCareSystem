import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextareaAutosize,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import {
    ArrowBack as BackIcon,
    MedicalServices as MedicalIcon,
    Save as SaveIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import studentsApi from '../../api/studentsApi';

const MedicalEventEditPage = () => {
    const { studentId, eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [medicalEvent, setMedicalEvent] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);    // Form state
    const [formData, setFormData] = useState({
        dateHappened: null, // Thay đổi từ string thành Date object
        type: '',
        level: '',
        description: '',
        solution: '',
        note: '',
        symptoms: '',
        treatment: '',
        status: 'Đã xử lý'
    });

    useEffect(() => {
        // Kiểm tra xem có dữ liệu được truyền qua state không
        const eventDataFromState = location.state?.eventData;
        if (eventDataFromState) {
            console.log('Using event data from navigation state:', eventDataFromState);
            setMedicalEvent(eventDataFromState);
            populateFormData(eventDataFromState);
            setLoading(false);

            // Load thông tin student nếu có studentId
            if (studentId) {
                loadStudentInfo();
            }
        } else {
            console.log('No event data in state, loading from API');
            loadMedicalEventDetail();
            if (studentId) {
                loadStudentInfo();
            }
        }
    }, [eventId, studentId, location.state]);    const populateFormData = (eventData) => {
        setFormData({
            dateHappened: eventData.dateHappened ? 
                new Date(eventData.dateHappened) : 
                new Date(eventData.createdAt),
            type: eventData.type || '',
            level: eventData.level?.toString() || '',
            description: eventData.description || '',
            solution: eventData.solution || '',
            note: eventData.note || '',
            symptoms: eventData.symptoms || '',
            treatment: eventData.treatment || '',
            status: eventData.status || 'Đã xử lý'
        });
    };

    const loadMedicalEventDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Loading medical event detail for editing, eventId:', eventId);
            const response = await medicalEventAPI.getEventById(eventId);
            console.log('Medical event detail response:', response);

            if (response.isSuccess && response.data) {
                setMedicalEvent(response.data);
                populateFormData(response.data);
            } else {
                setError('Không tìm thấy sự kiện y tế');
            }
        } catch (error) {
            console.error('Error loading medical event detail:', error);
            setError('Lỗi khi tải thông tin sự kiện y tế');
        } finally {
            setLoading(false);
        }
    };

    const loadStudentInfo = async () => {
        try {
            if (studentId) {
                const response = await studentsApi.getStudentById(studentId);
                if (response.isSuccess && response.data) {
                    setStudentInfo(response.data);
                }
            }
        } catch (error) {
            console.error('Error loading student info:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);            // Validate required fields
            if (!formData.dateHappened || !formData.type || !formData.level || !formData.description) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }

            // Validate date is valid
            if (!(formData.dateHappened instanceof Date) || isNaN(formData.dateHappened.getTime())) {
                toast.error('Vui lòng chọn ngày và giờ hợp lệ');
                return;
            }// Prepare data for API
            const updateData = {
                dateHappened: formData.dateHappened.toISOString(),
                type: formData.type,
                level: parseInt(formData.level),
                description: formData.description,
                solution: formData.solution,
                note: formData.note,
                symptoms: formData.symptoms,
                treatment: formData.treatment,
                status: formData.status
            };

            console.log('Updating medical event with data:', updateData);
            const response = await medicalEventAPI.update(eventId, updateData);
            console.log('Update response:', response);

            if (response.isSuccess) {
                toast.success('Cập nhật sự kiện y tế thành công');
                handleBack();
            } else {
                toast.error(response.message || 'Lỗi khi cập nhật sự kiện y tế');
            }
        } catch (error) {
            console.error('Error updating medical event:', error);
            toast.error('Lỗi khi cập nhật sự kiện y tế');
        } finally {
            setSaving(false);
        }
    };    const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            // Quay về trang detail hoặc trang danh sách tổng quát
            const previousPath = location.state?.from;
            if (previousPath) {
                navigate(previousPath);
            } else {
                navigate('/nurse/medical-events');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
    };    const hasValue = (value) => {
        return value !== null && value !== undefined && value !== '' && String(value).trim() !== '';
    };    if (loading) {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <Container maxWidth="lg" sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                </Container>
            </LocalizationProvider>
        );
    }

    if (error || !medicalEvent) {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <Container maxWidth="lg" sx={{ py: 3 }}>
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                            <BackIcon />
                        </IconButton>
                        <Typography variant="h4" component="h1">
                            Chỉnh sửa sự kiện y tế
                        </Typography>
                    </Box>
                    <Alert severity="error">
                        {error || 'Không tìm thấy sự kiện y tế'}
                    </Alert>
                </Container>
            </LocalizationProvider>
        );
    }return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                            <BackIcon />
                        </IconButton>
                        <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Chỉnh sửa sự kiện y tế
                        </Typography>
                        {/* Chỉ hiển thị thông tin học sinh nếu có dữ liệu thực tế */}
                        {studentInfo ? (
                            <Typography variant="h6" color="text.secondary">
                                Học sinh: {studentInfo.name} (Mã HS: {studentInfo.studentCode})
                            </Typography>
                        ) : studentId ? (
                            <Typography variant="h6" color="text.secondary">
                                Đang tải thông tin học sinh...
                            </Typography>
                        ) : medicalEvent && medicalEvent.studentJoin && medicalEvent.studentJoin.length > 0 ? (
                            <Typography variant="h6" color="text.secondary">
                                Sự kiện có học sinh tham gia
                            </Typography>
                        ) : (
                            <Typography variant="h6" color="text.secondary">
                                Sự kiện y tế tổng quát
                            </Typography>
                        )}
                    </Box>                
                </Box>
            </Box>

            {/* Content */}
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Thông tin sự kiện y tế
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                      <Table sx={{ '& .MuiTableCell-root': { fontSize: '1rem', py: 2.5 } }}>
                        <TableBody>                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: '25%', bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Ngày sự kiện: *
                                </TableCell>
                                <TableCell sx={{ fontSize: '1rem' }}>
                                    <DateTimePicker
                                        value={formData.dateHappened}
                                        onChange={(newValue) => handleInputChange('dateHappened', newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                size="small"
                                                fullWidth
                                                error={!formData.dateHappened}
                                                helperText={!formData.dateHappened ? 'Vui lòng chọn ngày và giờ' : ''}
                                            />
                                        )}
                                        ampm={false}
                                        format="dd/MM/yyyy HH:mm"
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                fullWidth: true,
                                                error: !formData.dateHappened,
                                                helperText: !formData.dateHappened ? 'Vui lòng chọn ngày và giờ' : ''
                                            }
                                        }}
                                    />
                                </TableCell>
                            </TableRow>

                            {/* Hiển thị thông tin học sinh chỉ khi có dữ liệu */}
                            {medicalEvent && medicalEvent.studentJoin && medicalEvent.studentJoin.length > 0 && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Thông tin học sinh tham gia:</TableCell>
                                    <TableCell>
                                        <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Tên</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Mã học sinh</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 0.2 }}>Giới tính</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {medicalEvent.studentJoin.map((student, index) => {
                                                    const studentData = student.studentId || student;
                                                    return (
                                                        <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px', fontStyle: 'italic', color: 'text.secondary' }}>{studentData.name || 'N/A'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px', fontStyle: 'italic', color: 'text.secondary' }}>{studentData.studentCode || studentData.code || 'N/A'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 0.2, height: '32px', fontStyle: 'italic', color: 'text.secondary' }}>{studentData.gender === 'male' ? 'Nam' : studentData.gender === 'female' ? 'Nữ' : 'N/A'}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic', color: 'text.secondary' }}>
                                            (Thông tin học sinh không thể chỉnh sửa)
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Loại sự kiện: *
                                </TableCell>
                                <TableCell>                                    <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }}>
                                        <Select
                                            value={formData.type}
                                            onChange={(e) => handleInputChange('type', e.target.value)}
                                        >
                                            <MenuItem value="Cấp cứu">Cấp cứu</MenuItem>
                                            <MenuItem value="Chấn thương">Chấn thương</MenuItem>
                                            <MenuItem value="Bệnh">Bệnh</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Mức độ: *
                                </TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }}>
                                        <Select
                                            value={formData.level}
                                            onChange={(e) => handleInputChange('level', e.target.value)}
                                        >
                                            <MenuItem value="3">Cao</MenuItem>
                                            <MenuItem value="2">Trung bình</MenuItem>
                                            <MenuItem value="1">Thấp</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>

                            {medicalEvent && medicalEvent.userId && medicalEvent.userId.name && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Nhân viên xử lý:
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontStyle: 'italic', color: 'text.secondary' }}>
                                        {medicalEvent.userId.name} (Không thể chỉnh sửa)
                                    </TableCell>
                                </TableRow>
                            )}

                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Mô tả chi tiết: *
                                </TableCell>
                                <TableCell sx={{ maxWidth: '500px' }}>
                                    <TextField
                                        multiline
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        fullWidth
                                        placeholder="Nhập mô tả chi tiết về sự kiện y tế..."
                                    />
                                </TableCell>
                            </TableRow>                            {/* Chỉ hiển thị trường solution nếu có dữ liệu hoặc đang được nhập */}
                            {(hasValue(medicalEvent.solution) || hasValue(formData.solution)) && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Giải pháp/Điều trị:
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: '500px' }}>
                                        <TextField
                                            multiline
                                            rows={3}
                                            value={formData.solution}
                                            onChange={(e) => handleInputChange('solution', e.target.value)}
                                            fullWidth
                                            placeholder="Nhập giải pháp điều trị..."
                                        />
                                    </TableCell>
                                </TableRow>
                            )}                                

                            {/* Chỉ hiển thị trường note nếu có dữ liệu hoặc đang được nhập */}
                            {(hasValue(medicalEvent.note) || hasValue(formData.note)) && (
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Ghi chú:
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: '500px' }}>
                                        <TextField
                                            multiline
                                            rows={2}
                                            value={formData.note}
                                            onChange={(e) => handleInputChange('note', e.target.value)}
                                            fullWidth
                                            placeholder="Nhập ghi chú bổ sung..."
                                        />
                                    </TableCell>
                                </TableRow>
                            )}

                            {/* Nút thêm trường ghi chú nếu chưa có */}
                            {!hasValue(medicalEvent.note) && !hasValue(formData.note) && (
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 1 }}>                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                handleInputChange('note', '');
                                            }}
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            + Thêm ghi chú
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}                            
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Trạng thái:
                                </TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }}>
                                        <Select
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                        >
                                            <MenuItem value="Đã xử lý">Đã xử lý</MenuItem>
                                            <MenuItem value="Đang xử lý">Đang xử lý</MenuItem>
                                            <MenuItem value="Chờ xử lý">Chờ xử lý</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>

                            {/* Hiển thị ngày tạo */}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Ngày tạo:
                                </TableCell>
                                <TableCell sx={{ fontSize: '1rem', fontStyle: 'italic', color: 'text.secondary' }}>
                                    {formatDate(medicalEvent.createdAt)} (Không thể chỉnh sửa)
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>                    {/* Note about required fields */}
                    <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            * Các trường bắt buộc phải điền đầy đủ
                        </Typography>
                    </Box>

                    {/* Action buttons */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            size="large"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={saving}
                            size="large"
                        >
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </Box>                </CardContent>
            </Card>
        </Container>
        </LocalizationProvider>
    );
};

export default MedicalEventEditPage;
