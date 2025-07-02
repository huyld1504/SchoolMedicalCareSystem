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
import { callAPIFormData } from '../../api/axiosClient';

const MedicalEventAddPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State để quản lý học sinh tham gia
    const [studentsJoin, setStudentsJoin] = useState([]);
    const [searchStudentCode, setSearchStudentCode] = useState('');
    const [foundStudent, setFoundStudent] = useState(null);
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        dateHappened: new Date(),
        type: '',
        level: '',
        description: '',
        solution: '',
        note: '',
        status: 'Đã xử lí'
    });

    // Image upload state
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (studentId) {
            loadStudentInfo();
            addStudentToList();
        }
        setLoading(false);
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
    };
    
    const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            navigate('/nurse/medical-events');
        }
    };

    // Image upload functions
    const handleImageSelect = (event) => {
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

            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        // Reset input file
        const fileInput = document.getElementById('image-upload-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            // Validate required fields
            const requiredFields = [
                { field: 'dateHappened', message: 'ngày sự kiện' },
                { field: 'type', message: 'loại sự kiện' },
                { field: 'level', message: 'mức độ' },
                { field: 'description', message: 'mô tả chi tiết' },
                { field: 'solution', message: 'giải pháp/điều trị' },
                { field: 'status', message: 'trạng thái' }
            ];

            for (const { field, message } of requiredFields) {
                if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
                    toast.error(`Vui lòng điền ${message}`);
                    return;
                }
            }

            if (studentsJoin.length === 0 && !studentId) {
                toast.error('Vui lòng thêm ít nhất một học sinh tham gia');
                return;
            }

            if (studentId && studentsJoin.length === 0) {
                toast.warning('Đang tải thông tin học sinh, vui lòng thử lại sau giây lát...');
                return;
            }

            if (!(formData.dateHappened instanceof Date) || isNaN(formData.dateHappened.getTime())) {
                toast.error('Vui lòng chọn ngày và giờ hợp lệ');
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
                }))
            };

            // Handle image upload if selected
            if (selectedImage) {
                try {
                    setUploadingImage(true);
                    toast.info('Đang upload ảnh...');
                    
                    const formDataImage = new FormData();
                    formDataImage.append('image', selectedImage);
                    
                    console.log('Uploading image:', selectedImage.name, 'Size:', selectedImage.size);
                    
                    // Upload image using callAPIFormData
                    const imageResponse = await callAPIFormData('POST', '/images/upload', formDataImage);
                    
                    console.log('Image upload response:', imageResponse);
                    
                    if (imageResponse && imageResponse.success && imageResponse.data?.imageUrl) {
                        createData.imageURL = imageResponse.data.imageUrl;
                        console.log('Image uploaded successfully:', createData.imageURL);
                        toast.success('Upload ảnh thành công');
                    } else {
                        console.warn('Image upload failed - Invalid response format:', imageResponse);
                        toast.warning('Không thể upload ảnh - Phản hồi không hợp lệ. Sẽ tiếp tục tạo sự kiện không có ảnh.');
                    }
                } catch (imageError) {
                    console.error('Error uploading image:', imageError);
                    toast.warning('Lỗi khi upload ảnh, nhưng sẽ tiếp tục tạo sự kiện');
                } finally {
                    setUploadingImage(false);
                }
            }

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
    };

    // Functions để quản lý học sinh tham gia
    const handleSearchStudent = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setFoundStudent(null);
            setSearchStatus('');
            return;
        }

        try {
            setSearchStatus('searching');
            
            console.log('Searching for student with term:', searchTerm.trim());
            const response = await studentsApi.getAllStudents({ 
                keyword: searchTerm.trim(), 
                page: 1,
                populate: 'userId' // Thêm populate để lấy thông tin user
            });
            
            console.log('API response:', response);
            
            const studentsData = response.data?.records || response.data || [];
            
            if (response.isSuccess && studentsData.length > 0) {
                console.log('Students found:', studentsData);
                
                const student = studentsData.find(s => {
                    const possibleCodes = [
                        s.studentCode,
                        s.code, 
                        s.studentId,
                        s.id,
                        s.mã_học_sinh,
                        s.student_code
                    ].filter(Boolean);
                    
                    const possibleNames = [
                        s.name,
                        s.fullName,
                        s.studentName,
                        s.ten_hoc_sinh
                    ].filter(Boolean);
                    
                    const searchTermLower = searchTerm.trim().toLowerCase();
                    
                    const codeMatch = possibleCodes.some(code => 
                        String(code).toLowerCase() === searchTermLower
                    );
                    
                    const nameMatch = possibleNames.some(name => 
                        String(name).toLowerCase().includes(searchTermLower)
                    );
                    
                    return codeMatch || nameMatch;
                });
                
                console.log('Found student:', student);
                
                if (student) {
                    // Log the userId information to understand its structure
                    console.log('Student userId details:', student.userId);
                    
                    const foundStudentData = {
                        id: student._id || student.id || Math.random().toString(36).substr(2, 9),
                        name: student.name || student.fullName || student.studentName || 'Không có tên',
                        studentCode: student.studentCode || student.code || student.studentId || 'Không có mã',
                        gender: student.gender || student.sex || 'N/A',
                        userId: student.userId,
                        medicalConverageId: student.medicalConverageId,
                        // Explicitly extract parent information
                        parentName: student.userId?.name || 'N/A',
                        parentEmail: student.userId?.email || 'N/A'
                    };
                    
                    setFoundStudent(foundStudentData);
                    setSearchStatus('found');
                } else {
                    console.log('No exact match found. All students:', studentsData);
                    setFoundStudent(null);
                    setSearchStatus('not-found');
                }
            } else {
                console.log('No students found or API error:', response);
                setFoundStudent(null);
                setSearchStatus('not-found');
            }
        } catch (error) {
            console.error('Error finding student:', error);
            setFoundStudent(null);
            setSearchStatus('not-found');
        }
    };

    const handleAddStudent = async () => {
        if (!searchStudentCode.trim()) {
            toast.error('Vui lòng nhập mã học sinh hoặc tên học sinh');
            return;
        }

        if (!foundStudent) {
            toast.error('Vui lòng tìm kiếm học sinh trước khi thêm');
            return;
        }

        const existingStudent = studentsJoin.find(s => s.studentCode === foundStudent.studentCode);
        if (existingStudent) {
            toast.error('Học sinh này đã có trong danh sách');
            return;
        }

        // Create a complete student object with parent information
        const studentToAdd = {
            ...foundStudent,
            // Make sure userId structure is maintained for compatibility
            userId: foundStudent.userId ? {
                ...foundStudent.userId,
                name: foundStudent.parentName || foundStudent.userId.name || 'N/A',
                email: foundStudent.parentEmail || foundStudent.userId.email || 'N/A'
            } : null
        };

        setStudentsJoin(prev => [...prev, studentToAdd]);
        handleClearSearch();
        toast.success(`Đã thêm học sinh ${foundStudent.name} thành công`);
    };

    const handleRemoveStudent = (studentId) => {
        setStudentsJoin(prev => prev.filter(s => s.id !== studentId));
        toast.success('Đã xóa học sinh khỏi danh sách');
    };

    const handleClearSearch = () => {
        setSearchStudentCode('');
        setFoundStudent(null);
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
                                                error: !formData.dateHappened,
                                                helperText: !formData.dateHappened ? 'Vui lòng chọn ngày và giờ' : ''
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
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Tên</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Mã học sinh</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Giới tính</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Phụ huynh</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Thao tác</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {studentsJoin.map((student, index) => (
                                                    <TableRow key={student.id} sx={{ '&:last-child td': { border: 0 } }}>
                                                        <TableCell align="center" sx={{ fontSize: '0.85rem', py: 1 }}>{student.name || 'N/A'}</TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '0.85rem', py: 1 }}>{student.studentCode || 'N/A'}</TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '0.85rem', py: 1 }}>
                                                            {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'N/A'}
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '0.75rem', py: 1 }}>
                                                            <Box>
                                                                <div>{student.parentName || (student.userId && typeof student.userId === 'object' ? student.userId.name : 'N/A')}</div>
                                                                <div style={{ color: '#666', fontSize: '0.7rem' }}>{student.parentEmail || (student.userId && typeof student.userId === 'object' ? student.userId.email : 'N/A')}</div>
                                                            </Box>
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
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                                            <TextField
                                                size="small"
                                                label="Mã học sinh hoặc tên học sinh"
                                                value={searchStudentCode}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    setSearchStudentCode(newValue);
                                                    
                                                    if (searchTimeout) {
                                                        clearTimeout(searchTimeout);
                                                    }
                                                    
                                                    if (newValue.trim()) {
                                                        const timeout = setTimeout(() => {
                                                            handleSearchStudent(newValue);
                                                        }, 500);
                                                        setSearchTimeout(timeout);
                                                    } else {
                                                        setFoundStudent(null);
                                                        setSearchStatus('');
                                                    }
                                                }}
                                                sx={{ minWidth: 300 }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddStudent();
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={handleAddStudent}
                                                disabled={!foundStudent || searchStatus !== 'found'}
                                            >
                                                THÊM HỌC SINH
                                            </Button>
                                        </Box>
                                        
                                        {/* Hiển thị trạng thái tìm kiếm */}
                                        {searchStatus === 'searching' && (
                                            <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CircularProgress size={16} />
                                                    Đang tìm kiếm học sinh...
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {/* Hiển thị thông tin học sinh tìm được */}
                                        {searchStatus === 'found' && foundStudent && (
                                            <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                    Tìm thấy học sinh:
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>Tên:</strong> {foundStudent.name}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Mã HS:</strong> {foundStudent.studentCode}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Giới tính:</strong> {foundStudent.gender === 'male' ? 'Nam' : foundStudent.gender === 'female' ? 'Nữ' : 'N/A'}
                                                    </Typography>
                                                </Box>

                                                {/* Hiển thị thông tin phụ huynh */}
                                                <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        Thông tin phụ huynh:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                                        <Typography variant="body2">
                                                            <strong>Tên:</strong> {foundStudent.parentName || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Email:</strong> {foundStudent.parentEmail || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                
                                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                    Nhấn "THÊM HỌC SINH" để thêm vào danh sách
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Hiển thị khi không tìm thấy */}
                                        {searchStatus === 'not-found' && searchStudentCode.trim() && (
                                            <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                <Typography variant="body2">
                                                    Không tìm thấy học sinh với từ khóa "{searchStudentCode.trim()}"
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                    Vui lòng kiểm tra lại mã học sinh hoặc tên học sinh
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>

                            {/* Hiển thị thông tin phụ huynh */}
                            {studentsJoin.length > 0 && (
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Thông tin phụ huynh:</TableCell>
                                <TableCell sx={{ fontSize: '1rem' }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                            <strong>Tên:</strong> {getDisplayValue(studentsJoin[0].parentName || (studentsJoin[0].userId && typeof studentsJoin[0].userId === 'object' ? studentsJoin[0].userId.name : null))}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontSize: '1rem', mt: 0.5 }}>
                                            <strong>Email:</strong> {getDisplayValue(studentsJoin[0].parentEmail || (studentsJoin[0].userId && typeof studentsJoin[0].userId === 'object' ? studentsJoin[0].userId.email : null))}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                            )}

                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>
                                    Loại sự kiện: *
                                </TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }}>
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
                                    <FormControl size="small" sx={{ minWidth: 150, maxWidth: 250 }}>
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
                                    Hình ảnh sự kiện:
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        {/* Upload button */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                startIcon={<UploadIcon />}
                                                disabled={uploadingImage}
                                                sx={{ minWidth: 160 }}
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
                                            
                                            {selectedImage && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <ImageIcon sx={{ color: 'success.main' }} />
                                                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                                                        {selectedImage.name}
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={handleRemoveImage}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Image preview */}
                                        {imagePreview && (
                                            <Box sx={{ 
                                                mt: 2, 
                                                p: 2, 
                                                border: '1px solid #e0e0e0', 
                                                borderRadius: 1,
                                                bgcolor: 'grey.50'
                                            }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                                    Xem trước ảnh:
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'center',
                                                    '& img': {
                                                        maxWidth: '300px',
                                                        maxHeight: '200px',
                                                        objectFit: 'contain',
                                                        borderRadius: 1,
                                                        border: '1px solid #ddd'
                                                    }
                                                }}>
                                                    <img 
                                                        src={imagePreview} 
                                                        alt="Preview" 
                                                    />
                                                </Box>
                                            </Box>
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
                            {uploadingImage ? 'Đang tải ảnh...' : saving ? 'Đang tạo...' : 'Tạo sự kiện'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            </Container>
        </LocalizationProvider>
    );
};

export default MedicalEventAddPage;
