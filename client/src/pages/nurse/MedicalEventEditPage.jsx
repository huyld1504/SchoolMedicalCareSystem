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
    Dialog,
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
    Delete as DeleteIcon,
    Add as AddIcon,
    CloudUpload as UploadIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import studentsApi from '../../api/studentsApi';
import cloudinaryApi from '../../api/cloudinaryApi';

const MedicalEventEditPage = () => {
    const { studentId, eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [medicalEvent, setMedicalEvent] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // State để quản lý học sinh tham gia
    const [studentsJoin, setStudentsJoin] = useState([]);
    const [searchStudentCode, setSearchStudentCode] = useState('');
    const [searchStudentName, setSearchStudentName] = useState('');
    const [foundStudent, setFoundStudent] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [imagePublicId, setImagePublicId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        dateHappened: new Date(),
        type: '',
        level: '',
        description: '',
        solution: '',
        note: '',
        status: 'Đã xử lí',
        imageURL: ''
    });

    // Image upload state
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    // New state for image modal
    const [openImageModal, setOpenImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

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
    }, [eventId, studentId, location.state]);

    const populateFormData = (eventData) => {
        console.log('Populating form data with:', eventData);
        console.log('Event type:', eventData.type);
        console.log('Event level:', eventData.level);
        console.log('Event status:', eventData.status);

        setFormData({
            dateHappened: eventData.dateHappened ?
                new Date(eventData.dateHappened) :
                new Date(eventData.createdAt),
            type: eventData.type || '',
            level: eventData.level?.toString() || '',
            description: eventData.description || '',
            solution: eventData.solution || '',
            note: eventData.note || '',
            status: eventData.status || 'Đã xử lí',
            imageURL: eventData.imageURL || eventData.imageUrl || ''
        });

        // Set existing image URL if available
        if (eventData.imageURL || eventData.imageUrl) {
            setExistingImageUrl(eventData.imageURL || eventData.imageUrl);
        }

        // Load danh sách học sinh tham gia
        if (eventData.studentJoin && Array.isArray(eventData.studentJoin)) {
            const students = eventData.studentJoin.map(student => {
                const studentData = student.studentId || student;
                return {
                    id: studentData._id || studentData.id || Math.random().toString(36).substr(2, 9),
                    name: studentData.name || '',
                    studentCode: studentData.studentCode || studentData.code || '',
                    gender: studentData.gender || ''
                };
            });
            setStudentsJoin(students);
        } else {
            setStudentsJoin([]);
        }
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

    // Image upload functions
    const handleImageSelect = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    toast.error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)');
                    return;
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    toast.error('Kích thước file không được vượt quá 5MB');
                    return;
                }

                setUploadingImage(true);

                // Nếu có ảnh hiện tại, tự động xóa nó trước khi tải ảnh mới
                if (existingImageUrl) {
                    setExistingImageUrl(null);
                    console.log('Đã xóa ảnh hiện tại để thay thế bằng ảnh mới');
                }

                const response = await cloudinaryApi.uploadImage(file);
                console.log(response);
                if (response.success) {
                    setSelectedImage(file);
                    setImagePreview(response.data.imageUrl);
                    setImagePublicId(response.data.publicId);
                    setFormData(prev => ({
                        ...prev,
                        imageURL: response.data.imageUrl
                    }));
                    toast.success(response.message || 'Tải ảnh lên thành công');
                } else {
                    toast.error(response.message || 'Lỗi khi tải ảnh lên');
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Lỗi khi tải ảnh lên');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveExistingImage = () => {
        setExistingImageUrl(null);
        setFormData(prev => ({
            ...prev,
            imageURL: ''
        }));
        toast.success('Đã xóa ảnh hiện tại');
    };

    const handleRemoveImage = async () => {
        try {
            if (imagePublicId) {
                const response = await cloudinaryApi.deleteImage(imagePublicId);
                console.log(response);
                if (response.success) {
                    toast.success(response.message || 'Xóa ảnh thành công');
                }
            }

            setSelectedImage('');
            setImagePreview('');
            setFormData(prev => ({
                ...prev,
                imageURL: ''
            }));

            // Reset input file
            const fileInput = document.getElementById('image-upload-input-edit');
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi xóa ảnh');
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            // Validate required fields (tất cả trừ ghi chú)
            const requiredFields = [
                { field: 'dateHappened', message: 'ngày sự kiện' },
                { field: 'type', message: 'loại sự kiện' },
                { field: 'level', message: 'mức độ' },
                { field: 'description', message: 'mô tả chi tiết' },
                { field: 'solution', message: 'giải pháp/điều trị' },
                { field: 'status', message: 'trạng thái' }
            ];

            // Kiểm tra các trường bắt buộc
            for (const { field, message } of requiredFields) {
                if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                    toast.error(`Vui lòng điền ${message}`);
                    return;
                }
            }

            // Kiểm tra ít nhất một học sinh tham gia
            if (studentsJoin.length === 0) {
                toast.error('Vui lòng thêm ít nhất một học sinh tham gia');
                return;
            }

            // Validate date is valid
            if (!(formData.dateHappened instanceof Date) || isNaN(formData.dateHappened.getTime())) {
                toast.error('Vui lòng chọn ngày và giờ hợp lệ');
                return;
            }

            // Prepare data for API
            const updateData = {
                dateHappened: formData.dateHappened.toISOString(),
                type: formData.type,
                level: parseInt(formData.level),
                description: formData.description,
                solution: formData.solution,
                note: formData.note,
                status: formData.status,
                studentJoin: studentsJoin.map(student => ({
                    studentId: student.id
                })),
                imageURL: formData.imageURL
            };

            console.log('Updating medical event with data:', updateData);
            const response = await medicalEventAPI.update(eventId, updateData);
            console.log('Update response:', response);

            if (response.isSuccess) {
                toast.success('Cập nhật sự kiện y tế thành công');

                if (studentId) {
                    navigate(`/nurse/medical-events/${studentId}`);
                } else {
                    navigate('/nurse/medical-events');
                }
            } else {
                toast.error(response.message || 'Lỗi khi cập nhật sự kiện y tế');
            }
        } catch (error) {
            console.error('Error updating medical event:', error);
            toast.error('Lỗi khi cập nhật sự kiện y tế');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            navigate('/nurse/medical-events');
        }
    };

    const handleBackWithData = (updatedEventData) => {
        if (studentId) {
            // Nếu có studentId, chuyển đến trang chi tiết với dữ liệu cập nhật
            navigate(`/nurse/medical-events/${studentId}/detail/${eventId}`, {
                state: {
                    eventData: updatedEventData,
                    updated: true
                }
            });
        } else {
            // Chuyển đến trang chi tiết (không phụ thuộc vào previous path)
            navigate(`/nurse/medical-events/detail/${eventId}`, {
                state: {
                    eventData: updatedEventData,
                    updated: true
                }
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Không có thông tin';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'Không có thông tin';
        if (value === '') return 'Không có';
        return value;
    };

    const hasValue = (value) => {
        return value !== null && value !== undefined && value !== '' && String(value).trim() !== '';
    };

    const getEventTypeLabel = (type) => {
        // API trả về trực tiếp tiếng Việt, chỉ cần return luôn
        // Chỉ có 3 loại: cấp cứu, chấn thương, bệnh
        return type || 'Không xác định';
    };

    const getLevelLabel = (level) => {
        switch (parseInt(level)) {
            case 3:
                return 'Khẩn cấp';
            case 2:
                return 'Trung bình';
            case 1:
                return 'Nhẹ';
            default:
                return 'Không xác định';
        }
    };

    // Functions để quản lý học sinh tham gia
    const handleSearchStudent = async (searchTerm, searchType = 'general') => {
        if (!searchTerm.trim()) {
            setFoundStudent([]);
            setSearchStatus('');
            return;
        }

        try {
            setSearchStatus('searching');

            console.log(`Searching for student with ${searchType}:`, searchTerm.trim());
            const response = await studentsApi.getAllStudents({
                keyword: searchTerm.trim(),
                page: 1,
                populate: 'userId'
            });

            console.log('API response:', response);

            const studentsData = response.data?.records || response.data || [];

            if (response.isSuccess && studentsData.length > 0) {
                console.log('Students found:', studentsData);
                setFoundStudent(studentsData);
                setSearchStatus('found');
            } else {
                console.log('No students found or API error:', response);
                setFoundStudent([]);
                setSearchStatus('not-found');
            }
        } catch (error) {
            console.error('Error finding student:', error);
            setFoundStudent([]);
            setSearchStatus('not-found');
        }
    };

    const handleAddSpecificStudent = (student) => {
        if (!student) {
            toast.error('Thông tin học sinh không hợp lệ');
            return;
        }

        const existingStudent = studentsJoin.find(s => s.id === (student._id || student.id));
        if (existingStudent) {
            toast.error('Học sinh này đã có trong danh sách');
            return;
        }

        // Create a complete student object with parent information
        const studentToAdd = {
            id: student._id || student.id,
            name: student.name || '',
            studentCode: student.studentCode || '',
            gender: student.gender || '',
            userId: student.userId,
            medicalConverageId: student.medicalConverageId,
            parentName: student.userId?.name || 'Không có thông tin',
            parentEmail: student.userId?.email || 'Không có thông tin',
            parentName: student.userId?.phone || 'Không có thông tin',
        };

        setStudentsJoin(prev => [...prev, studentToAdd]);
        toast.success(`Đã thêm học sinh ${student.name} thành công`);
    };

    const handleAddStudent = async () => {
        const searchCodeTerm = searchStudentCode.trim();
        const searchNameTerm = searchStudentName.trim();

        if (!searchCodeTerm && !searchNameTerm) {
            toast.error('Vui lòng nhập mã học sinh hoặc tên học sinh');
            return;
        }

        if (!foundStudent || foundStudent.length === 0) {
            toast.error('Vui lòng tìm kiếm học sinh trước khi thêm');
            return;
        }

        // If only one student found, add that student
        if (foundStudent.length === 1) {
            handleAddSpecificStudent(foundStudent[0]);
        } else {
            toast.info('Có nhiều học sinh được tìm thấy. Vui lòng chọn học sinh cụ thể từ danh sách bên dưới');
        }
    };

    const handleRemoveStudent = (studentId) => {
        setStudentsJoin(prev => prev.filter(s => s.id !== studentId));
        toast.success('Đã xóa học sinh khỏi danh sách');
    };

    const handleResetSearch = () => {
        setSearchStudentCode('');
        setSearchStudentName('');
        setFoundStudent([]);
        setSearchStatus('');
    };

    if (loading) {
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
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                            <BackIcon />
                        </IconButton>
                        <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                Chỉnh sửa sự kiện y tế
                            </Typography>
                            {/* Chỉ hiển thị thông tin học sinh nếu có dữ liệu thực tế */}
                            {studentInfo && (
                                <Typography variant="h6" color="text.secondary">
                                    Học sinh: {studentInfo.name} (Mã HS: {studentInfo.studentCode})
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
                            <TableBody>
                                <TableRow>
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
                                {/* Quản lý học sinh tham gia */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Thông tin học sinh: *</TableCell>
                                    <TableCell>
                                        {/* Danh sách học sinh hiện tại */}
                                        {studentsJoin.length > 0 && (
                                            <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', mb: 2 }}>
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Tên</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Mã học sinh</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Phụ huynh</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Số điện thoại phụ huynh</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Thao tác</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {studentsJoin.map((student) => (
                                                        <TableRow key={student.id} sx={{ '&:last-child td': { border: 0 } }}>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 1 }}>{student.name || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 1 }}>{student.studentCode || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.75rem', py: 1 }}>
                                                                <div>{student.parentName || (student.userId && typeof student.userId === 'object' ? student.userId.name : 'Không có thông tin')}</div>
                                                            </TableCell>
                                                            <TableCell align="center" sx={{ fontSize: '0.85rem', py: 1 }}>
                                                                <div>{student.parentPhone || (student.userId && typeof student.userId === 'object' ? student.userId.phone : 'Không có thông tin')}</div>
                                                            </TableCell>
                                                            <TableCell align="center" sx={{ py: 1 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleRemoveStudent(student.id)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}

                                        {/* Form thêm học sinh mới */}
                                        <Box>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
                                                <TextField
                                                    size="small"
                                                    label="Mã học sinh"
                                                    value={searchStudentCode}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        setSearchStudentCode(newValue);

                                                        if (searchTimeout) {
                                                            clearTimeout(searchTimeout);
                                                        }

                                                        if (newValue.trim()) {
                                                            const timeout = setTimeout(() => {
                                                                handleSearchStudent(newValue, 'studentCode');
                                                            }, 500);
                                                            setSearchTimeout(timeout);
                                                        } else if (!searchStudentName.trim()) {
                                                            setFoundStudent([]);
                                                            setSearchStatus('');
                                                        }
                                                    }}
                                                    sx={{ minWidth: 200 }}
                                                    placeholder="Nhập mã học sinh..."
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddStudent();
                                                        }
                                                    }}
                                                />

                                                <TextField
                                                    size="small"
                                                    label="Tên học sinh"
                                                    value={searchStudentName}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        setSearchStudentName(newValue);

                                                        if (searchTimeout) {
                                                            clearTimeout(searchTimeout);
                                                        }

                                                        if (newValue.trim()) {
                                                            const timeout = setTimeout(() => {
                                                                handleSearchStudent(newValue, 'studentName');
                                                            }, 500);
                                                            setSearchTimeout(timeout);
                                                        } else if (!searchStudentCode.trim()) {
                                                            setFoundStudent([]);
                                                            setSearchStatus('');
                                                        }
                                                    }}
                                                    sx={{ minWidth: 200 }}
                                                    placeholder="Nhập tên học sinh..."
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddStudent();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant='contained'
                                                    onClick={handleResetSearch}
                                                >
                                                    Xóa bộ lọc
                                                </Button>
                                            </Box>

                                            {/* Hiển thị thông tin tìm kiếm hiện tại */}
                                            {(searchStudentCode.trim() || searchStudentName.trim()) && (
                                                <Box sx={{ mt: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                                                    <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                                        Đang tìm kiếm:
                                                        {searchStudentCode.trim() && ` Mã HS: "${searchStudentCode.trim()}"`}
                                                        {searchStudentCode.trim() && searchStudentName.trim() && ' hoặc '}
                                                        {searchStudentName.trim() && ` Tên: "${searchStudentName.trim()}"`}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {/* Hiển thị trạng thái tìm kiếm */}
                                            {searchStatus === 'searching' && (
                                                <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CircularProgress size={16} />
                                                        Đang tìm kiếm học sinh...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Hiển thị danh sách học sinh tìm được */}
                                            {searchStatus === 'found' && foundStudent && foundStudent.length > 0 && (
                                                <Box sx={{ mt: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: 'grey.50', borderBottom: '1px solid #e0e0e0' }}>
                                                        Tìm thấy {foundStudent.length} học sinh:
                                                    </Typography>

                                                    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                        {foundStudent.map((student, index) => (
                                                            <Box
                                                                key={student._id || student.id || index}
                                                                sx={{
                                                                    p: 2,
                                                                    borderBottom: index < foundStudent.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                                    '&:hover': { bgcolor: 'grey.50' }
                                                                }}
                                                            >
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                                                                            <Typography variant="body2">
                                                                                <strong>Tên:</strong> {student.name || 'Không có thông tin'}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                <strong>Mã HS:</strong> {student.studentCode || 'Không có thông tin'}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                <strong>Giới tính:</strong> {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Không có thông tin'}
                                                                            </Typography>
                                                                        </Box>

                                                                        {/* Thông tin phụ huynh */}
                                                                        <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                                                Thông tin phụ huynh:
                                                                            </Typography>
                                                                            <Box sx={{ display: 'flex', gap: 3 }}>
                                                                                <Typography variant="caption">
                                                                                    <strong>Tên:</strong> {student.userId?.name || 'Không có thông tin'}
                                                                                </Typography>
                                                                                <Typography variant="caption">
                                                                                    <strong>Email:</strong> {student.userId?.email || 'Không có thông tin'}
                                                                                </Typography>
                                                                                <Typography variant="caption">
                                                                                    <strong>Số điện thoại:</strong> {student.userId?.phone || 'Không có thông tin'}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>

                                                                    <Button
                                                                        variant="contained"
                                                                        size="small"
                                                                        startIcon={<AddIcon />}
                                                                        onClick={() => handleAddSpecificStudent(student)}
                                                                        disabled={studentsJoin.some(s => s.id === (student._id || student.id))}
                                                                        sx={{ ml: 2, minWidth: '80px' }}
                                                                    >
                                                                        {studentsJoin.some(s => s.id === (student._id || student.id)) ? 'Đã thêm' : 'Thêm'}
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Hiển thị khi không tìm thấy */}
                                            {searchStatus === 'not-found' && (searchStudentCode.trim() || searchStudentName.trim()) && (
                                                <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography variant="body2">
                                                        Không tìm thấy học sinh với từ khóa tìm kiếm
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                        Vui lòng kiểm tra lại mã học sinh hoặc tên học sinh
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow><TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Loại sự kiện: *
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }} error={!formData.type}>
                                            <InputLabel>Loại sự kiện</InputLabel>
                                            <Select
                                                value={formData.type}
                                                label="Loại sự kiện"
                                                onChange={(e) => handleInputChange('type', e.target.value)}
                                            >
                                                <MenuItem value="cấp cứu">Cấp cứu</MenuItem>
                                                <MenuItem value="chấn thương">Chấn thương</MenuItem>
                                                <MenuItem value="bệnh">Bệnh</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Mức độ: *
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }} error={!formData.level}>
                                            <InputLabel>Mức độ</InputLabel>
                                            <Select
                                                value={formData.level}
                                                label="Mức độ"
                                                onChange={(e) => handleInputChange('level', e.target.value)}
                                            >
                                                <MenuItem value="3">Khẩn cấp</MenuItem>
                                                <MenuItem value="2">Trung bình</MenuItem>
                                                <MenuItem value="1">Nhẹ</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                                {medicalEvent && medicalEvent.userId && medicalEvent.userId.name && (
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                            Nhân viên xử lý: *
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem' }}>
                                            {medicalEvent.userId.name}
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
                                </TableRow>

                                {/* Giải pháp/Điều trị - bắt buộc */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Giải pháp/Điều trị: *
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: '500px' }}>
                                        <TextField
                                            multiline
                                            rows={3}
                                            value={formData.solution}
                                            onChange={(e) => handleInputChange('solution', e.target.value)}
                                            fullWidth
                                            placeholder="Nhập giải pháp điều trị..."
                                            error={!formData.solution || !formData.solution.trim()}
                                        />
                                    </TableCell>
                                </TableRow>
                                {/* Trường ghi chú*/}
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

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Hình ảnh:
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            {/* Hiển thị ảnh hiện tại (chỉ khi có ảnh hiện tại và chưa chọn ảnh mới) */}
                                            {existingImageUrl && !selectedImage && (
                                                <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'grey.50' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                        Ảnh hiện tại:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <img
                                                            src={existingImageUrl}
                                                            alt="Existing"
                                                            style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain', borderRadius: 4, border: '1px solid #ddd', display: 'block', cursor: 'zoom-in' }}
                                                            onClick={() => { setModalImageUrl(existingImageUrl); setOpenImageModal(true); }}
                                                        />
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            color="error"
                                                            onClick={handleRemoveExistingImage}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                px: 2,
                                                                '&:hover': {
                                                                    backgroundColor: 'error.light',
                                                                    color: 'white'
                                                                }
                                                            }}
                                                        >
                                                            Xóa ảnh
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Hiển thị ảnh mới đã chọn */}
                                            {imagePreview && selectedImage && (
                                                <Box sx={{
                                                    mt: 2,
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1,
                                                    bgcolor: 'grey.50'
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            Ảnh mới đã chọn:
                                                        </Typography>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            color="error"
                                                            onClick={handleRemoveImage}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                px: 2,
                                                                '&:hover': {
                                                                    backgroundColor: 'error.light',
                                                                    color: 'white'
                                                                }
                                                            }}
                                                        >
                                                            Xóa ảnh
                                                        </Button>
                                                    </Box>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        '& img': {
                                                            maxWidth: '300px',
                                                            maxHeight: '200px',
                                                            objectFit: 'contain',
                                                            borderRadius: 4,
                                                            border: '1px solid #ddd',
                                                            display: 'block',
                                                            cursor: 'zoom-in'
                                                        }
                                                    }}>
                                                        <img
                                                            src={imagePreview}
                                                            alt="New Preview"
                                                            onClick={() => { setModalImageUrl(imagePreview); setOpenImageModal(true); }}
                                                        />
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Upload new image */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 3 }}>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    startIcon={<UploadIcon />}
                                                    disabled={uploadingImage}
                                                    sx={{ minWidth: 160 }}
                                                >
                                                    {uploadingImage ? 'Đang tải...' : 'Chọn ảnh mới'}
                                                    <input
                                                        id="image-upload-input-edit"
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                    />
                                                </Button>
                                            </Box>

                                            {/* Upload guidelines */}
                                            <Typography variant="caption" sx={{
                                                display: 'block',
                                                mt: 1,
                                                color: 'text.secondary',
                                                fontStyle: 'italic'
                                            }}>
                                                Chấp nhận file: JPEG, PNG, GIF. Kích thước tối đa: 5MB
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Trạng thái: *
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }}>
                                            <InputLabel>Trạng thái</InputLabel>
                                            <Select
                                                value={formData.status}
                                                label="Trạng thái"
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                            >
                                                <MenuItem value="Đã xử lí">Đã xử lí</MenuItem>
                                                <MenuItem value="Đang xử lí">Đang xử lí</MenuItem>
                                                <MenuItem value="Chờ xử lí">Chờ xử lí</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Note about required fields */}
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
                                disabled={saving || uploadingImage}
                                size="large"
                            >
                                {uploadingImage ? 'Đang tải ảnh...' : saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Image Modal */}
                <Dialog
                    open={openImageModal}
                    onClose={() => setOpenImageModal(false)}
                    maxWidth={false}
                    sx={{
                        '& .MuiDialog-paper': {
                            margin: 0,
                            maxHeight: '100vh',
                            maxWidth: '100vw',
                            overflow: 'hidden'
                        }
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '50vh',
                            maxHeight: '100vh',
                            width: 'auto',
                            overflow: 'hidden',
                            p: 2
                        }}
                    >
                        <img
                            src={modalImageUrl}
                            alt="Zoom"
                            style={{
                                maxWidth: 'min(95vw, 1200px)',
                                maxHeight: 'min(90vh, 800px)',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                        />
                        <Button
                            onClick={() => setOpenImageModal(false)}
                            variant="contained"
                            sx={{
                                mt: 2,
                                position: 'sticky',
                                bottom: 0
                            }}
                        >
                            Đóng
                        </Button>
                    </Box>
                </Dialog>
            </Container>
        </LocalizationProvider>
    );
};

export default MedicalEventEditPage;
