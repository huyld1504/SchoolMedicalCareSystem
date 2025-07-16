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
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import studentsApi from '../../api/studentsApi';
import cloudinaryApi from '../../api/cloudinaryApi';

const MedicalEventAddPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);    // State để quản lý học sinh tham gia
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

    // Error state for form validation
    const [errors, setErrors] = useState({
        dateHappened: '',
        type: '',
        level: '',
        description: '',
        solution: '',
        status: '',
        studentsJoin: '',
        imageURL: ''
    });

    // Image upload state
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Image modal state
    const [openImageModal, setOpenImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    useEffect(() => {
        const loadData = async () => {
            if (studentId) {
                await loadStudentInfo();
                await addStudentToList();
            }
            setLoading(false);
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId]);

    const loadStudentInfo = async () => {
        try {
            if (studentId) {
                const response = await studentsApi.getAllStudents({
                    keyword: '',
                    page: 1,
                    populate: 'userId' // Thêm populate để lấy thông tin user
                });

                if (response.isSuccess && response.data) {
                    const studentsData = response.data?.records || response.data || [];
                    const student = studentsData.find(s => s._id === studentId || s.id === studentId);

                    if (student) {
                        // Set student info without redundant logging
                        setStudentInfo(student);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading student info:', error);
        }
    };

    const addStudentToList = async () => {
        try {
            if (studentId) {
                const response = await studentsApi.getAllStudents({
                    keyword: '',
                    page: 1,
                    populate: 'userId'
                });

                if (response.isSuccess && response.data) {
                    const studentsData = response.data?.records || response.data || [];
                    const student = studentsData.find(s => s._id === studentId || s.id === studentId);

                    if (student) {
                        // Create student data without redundant logging
                        const studentData = {
                            id: student._id || student.id,
                            name: student.name || '',
                            studentCode: student.studentCode || '',
                            gender: student.gender || '',
                            userId: student.userId,
                            medicalConverageId: student.medicalConverageId,
                            parentName: student.userId?.name || 'N/A',
                            parentEmail: student.userId?.email || 'N/A'
                        };

                        console.log('StudentData userId details:', student.userId);
                        setStudentsJoin([studentData]);
                    }
                }
            }
        } catch (error) {
            console.error('Error adding student to list:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            navigate('/nurse/medical-events');
        }
    };

    // Image upload functions
    const handleImageSelect = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                // Set loading state
                setUploadingImage(true);
                toast.info('Đang tải ảnh lên...');

                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    setErrors(prev => ({
                        ...prev,
                        imageURL: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)'
                    }));
                    setUploadingImage(false);
                    return;
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    setErrors(prev => ({
                        ...prev,
                        imageURL: 'Kích thước file không được vượt quá 5MB'
                    }));
                    setUploadingImage(false);
                    return;
                }

                // Clear any existing image error
                if (errors.imageURL) {
                    setErrors(prev => ({
                        ...prev,
                        imageURL: ''
                    }));
                }

                const response = await cloudinaryApi.uploadImage(file);
                console.log(response);
                if (response.success) {
                    setSelectedImage(file);
                    setImagePreview(response.data.imageUrl);
                    setImagePublicId(response.data.publicId);
                    setFormData(prev => ({
                        ...prev,
                        imageURL: response.data.imageUrl // Set the image URL in formData
                    }));
                    toast.success(response.message || 'Tải ảnh lên thành công');
                } else {
                    setErrors(prev => ({
                        ...prev,
                        imageURL: response.message || 'Lỗi khi tải ảnh lên'
                    }));
                }
                setUploadingImage(false);
            }
        } catch (error) {
            console.log(error);
            setErrors(prev => ({
                ...prev,
                imageURL: error.message || 'Lỗi khi tải ảnh lên'
            }));
            setUploadingImage(false);
        } finally {
            // Reset input file
            const fileInput = document.getElementById('image-upload-input');
            if (fileInput) {
                fileInput.value = '';
            }
        }
    };
    const handleRemoveImage = async () => {
        try {
            const response = await cloudinaryApi.deleteImage(imagePublicId);
            console.log(response);
            if (response.success) {
                toast.success(response.message || 'Xóa ảnh thành công');
            }
            setSelectedImage(null);
            setImagePreview(null);
            setFormData(prev => ({
                ...prev,
                imageURL: '' // Clear the image URL from formData
            }));
            // Reset input file
            const fileInput = document.getElementById('image-upload-input');
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi xóa ảnh');
        }
    };

    // Image modal handlers
    const handleImageClick = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setOpenImageModal(true);
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
        setModalImageUrl('');
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);

            // Clear previous errors
            setErrors({
                dateHappened: '',
                type: '',
                level: '',
                description: '',
                solution: '',
                status: '',
                studentsJoin: '',
                imageURL: ''
            });

            // Validate required fields
            const newErrors = {};
            let hasError = false;

            if (!formData.dateHappened || !(formData.dateHappened instanceof Date) || isNaN(formData.dateHappened.getTime())) {
                newErrors.dateHappened = 'Vui lòng chọn ngày và giờ hợp lệ';
                hasError = true;
            }

            if (!formData.type || !formData.type.trim()) {
                newErrors.type = 'Vui lòng chọn loại sự kiện';
                hasError = true;
            }

            if (!formData.level || !formData.level.toString().trim()) {
                newErrors.level = 'Vui lòng chọn mức độ';
                hasError = true;
            }

            if (!formData.description || !formData.description.trim()) {
                newErrors.description = 'Vui lòng nhập mô tả chi tiết';
                hasError = true;
            }

            if (!formData.solution || !formData.solution.trim()) {
                newErrors.solution = 'Vui lòng nhập giải pháp/điều trị';
                hasError = true;
            }

            if (!formData.status || !formData.status.trim()) {
                newErrors.status = 'Vui lòng chọn trạng thái';
                hasError = true;
            }

            if (studentsJoin.length === 0 && !studentId) {
                newErrors.studentsJoin = 'Vui lòng thêm ít nhất một học sinh tham gia';
                hasError = true;
            }

            if (studentId && studentsJoin.length === 0) {
                newErrors.studentsJoin = 'Đang tải thông tin học sinh, vui lòng thử lại sau giây lát...';
                hasError = true;
            }

            if (!formData.imageURL || !formData.imageURL.trim()) {
                newErrors.imageURL = 'Vui lòng chọn hình ảnh cho sự kiện';
                hasError = true;
            }

            if (hasError) {
                setErrors(newErrors);
                return;
            }

            // Prepare data for API
            const createData = {
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

            console.log('Creating medical event with data:', createData);
            const response = await medicalEventAPI.create(createData);
            console.log('Create response:', response);

            if (response.isSuccess) {
                toast.success('Tạo sự kiện y tế thành công');

                if (studentId) {
                    navigate(`/nurse/medical-events/${studentId}`);
                } else {
                    navigate('/nurse/medical-events');
                }
            } else {
                toast.error(response.message || 'Lỗi khi tạo sự kiện y tế');
            }
        } catch (error) {
            console.error('Error creating medical event:', error);
            toast.error('Lỗi khi tạo sự kiện y tế');
        } finally {
            setSaving(false);
        }
    };    // Functions để quản lý học sinh tham gia
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
                page: 1
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
            parentPhone: student.userId?.phone || 'Không có thông tin'
        };

        setStudentsJoin(prev => [...prev, studentToAdd]);
        
        // Clear studentsJoin error when student is added
        if (errors.studentsJoin) {
            setErrors(prev => ({
                ...prev,
                studentsJoin: ''
            }));
        }
        
        toast.success(`Đã thêm học sinh ${student.name} thành công`);
    }; const handleAddStudent = async () => {
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

    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (value === '') return 'Không có';
        return value;
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
                                Tạo sự kiện y tế mới
                            </Typography>
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
                                            ampm={false}
                                            format="dd/MM/yyyy HH:mm"
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    error: !!errors.dateHappened,
                                                    helperText: errors.dateHappened
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>

                                {/* Thông tin học sinh */}
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Thông tin học sinh: *</TableCell>
                                    <TableCell>
                                        {studentsJoin.length > 0 && (
                                            <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', mb: 2 }}>
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                        <TableCell align="start" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Tên</TableCell>
                                                        <TableCell align="start" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Mã học sinh</TableCell>
                                                        <TableCell align="start" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Giới tính</TableCell>
                                                        <TableCell align="start" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Phụ huynh</TableCell>
                                                        <TableCell align="start" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Số điện thoại</TableCell>
                                                        <TableCell align="start" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Thao tác</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {studentsJoin.map((student) => (
                                                        <TableRow key={student.id} sx={{ '&:last-child td': { border: 0 } }}>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>{student.name || 'N/A'}</TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>{student.studentCode || 'N/A'}</TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>
                                                                {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'N/A'}
                                                            </TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.75rem', py: 1 }}>
                                                                <Box>
                                                                    <div>{student.parentName || (student.userId && typeof student.userId === 'object' ? student.userId.name : 'Không có thông tin')}</div>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>
                                                                <div style={{ color: '#666', fontSize: '1rem' }}>{student.parentPhone || (student.userId && typeof student.userId === 'object' ? student.userId.phone : 'Không có thông tin')}</div>
                                                            </TableCell>
                                                            <TableCell align="start" sx={{ py: 1 }}>
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
                                                    sx={{ 
                                                        minWidth: 200,
                                                        '& .MuiOutlinedInput-root': {
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: errors.studentsJoin ? 'error.main' : 'primary.main'
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Nhập mã học sinh..."
                                                    error={!!errors.studentsJoin}
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
                                                    sx={{ 
                                                        minWidth: 200,
                                                        '& .MuiOutlinedInput-root': {
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: errors.studentsJoin ? 'error.main' : 'primary.main'
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Nhập tên học sinh..."
                                                    error={!!errors.studentsJoin}
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
                                                        {searchStudentName.trim() && ` Tên HS: "${searchStudentName.trim()}"`}
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
                                                                                <strong>Tên HS:</strong> {student.name || 'N/A'}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                <strong>Mã HS:</strong> {student.studentCode || 'N/A'}
                                                                            </Typography>
                                                                            <Typography variant="body2">
                                                                                <strong>Giới tính:</strong> {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'N/A'}
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
                                        {errors.studentsJoin && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="error">
                                                    {errors.studentsJoin}
                                                </Typography>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Loại sự kiện: *
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }} error={!!errors.type}>
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
                                            {errors.type && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                    {errors.type}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Mức độ: *
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }} error={!!errors.level}>
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
                                            {errors.level && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                    {errors.level}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </TableCell>
                                </TableRow>

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
                                            error={!!errors.description}
                                            helperText={errors.description}
                                        />
                                    </TableCell>
                                </TableRow>

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
                                            error={!!errors.solution}
                                            helperText={errors.solution}
                                        />
                                    </TableCell>
                                </TableRow>

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
                                        Hình ảnh sự kiện: *
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            {/* Image preview */}
                                            {imagePreview && (
                                                <Box sx={{
                                                    mt: 2,
                                                    p: 2,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1,
                                                    bgcolor: 'grey.50'
                                                }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            Xem trước ảnh:
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
                                                            borderRadius: 1,
                                                            border: '1px solid #ddd',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                opacity: 0.8
                                                            }
                                                        }
                                                    }}>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            onClick={() => handleImageClick(imagePreview)}
                                                        />
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Error message for image upload */}
                                            {errors.imageURL && (
                                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                                    {errors.imageURL}
                                                </Typography>
                                            )}

                                            {/* Upload guidelines */}
                                            <Typography variant="caption" sx={{
                                                display: 'block',
                                                mt: 1,
                                                color: 'text.secondary',
                                                fontStyle: 'italic'
                                            }}>
                                                Chấp nhận file: JPEG, PNG, GIF. Kích thước tối đa: 5MB
                                            </Typography>

                                            {/* Upload button */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    startIcon={<UploadIcon />}
                                                    disabled={uploadingImage}
                                                    sx={{ minWidth: 160 }}
                                                    onClick={() => {
                                                        // Clear image error when user clicks to upload
                                                        if (errors.imageURL) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                imageURL: ''
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    {uploadingImage ? 'Đang tải...' : 'Chọn ảnh'}
                                                    <input
                                                        id="image-upload-input"
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleImageSelect}
                                                    />
                                                </Button>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                        Trạng thái: *
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }} error={!!errors.status}>
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
                                            {errors.status && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                                    {errors.status}
                                                </Typography>
                                            )}
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
                                {uploadingImage ? 'Đang tải ảnh...' : saving ? 'Đang tạo...' : 'Tạo sự kiện'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {/* Image Modal */}
            <Dialog
                open={openImageModal}
                onClose={handleCloseImageModal}
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
                    {modalImageUrl && (
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
                    )}
                    <Button
                        onClick={handleCloseImageModal}
                        variant="contained"
                        sx={{
                            mt: 2,
                            position: 'sticky'
                        }}
                    >
                        Đóng
                    </Button>
                </Box>
            </Dialog>
        </LocalizationProvider>
    );
};

export default MedicalEventAddPage;
