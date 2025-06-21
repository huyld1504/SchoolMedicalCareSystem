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
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import studentsApi from '../../api/studentsApi';

const MedicalEventEditPage = () => {
    const { studentId, eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();    const [medicalEvent, setMedicalEvent] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);    // State để quản lý học sinh tham gia
    const [studentsJoin, setStudentsJoin] = useState([]);
    const [searchStudentCode, setSearchStudentCode] = useState('');
    const [foundStudent, setFoundStudent] = useState(null); // Để hiển thị preview học sinh tìm được
    const [searchStatus, setSearchStatus] = useState(''); // 'searching', 'found', 'not-found', ''
    const [searchTimeout, setSearchTimeout] = useState(null); // Để debounce search// Form state
    const [formData, setFormData] = useState({        dateHappened: null, // Thay đổi từ string thành Date object
        type: '',
        level: '',
        description: '',
        solution: '',
        note: '',
        status: 'Đã xử lí'
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
        console.log('Populating form data with:', eventData);
        console.log('Event type:', eventData.type);
        console.log('Event level:', eventData.level);
        console.log('Event status:', eventData.status);
        
        setFormData({
            dateHappened: eventData.dateHappened ? 
                new Date(eventData.dateHappened) : 
                new Date(eventData.createdAt),
            type: eventData.type || '',            level: eventData.level?.toString() || '',
            description: eventData.description || '',
            solution: eventData.solution || '',
            note: eventData.note || '',
            status: eventData.status || 'Đã xử lí'
        });

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
    };    const handleSubmit = async () => {
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
            }            // Prepare data for API
            const updateData = {
                dateHappened: formData.dateHappened.toISOString(),
                type: formData.type,
                level: parseInt(formData.level),
                description: formData.description,
                solution: formData.solution,
                note: formData.note,
                status: formData.status,
                // Server expect object với studentId bên trong
                studentJoin: studentsJoin.map(student => ({
                    studentId: student.id
                }))
            };

            console.log('Updating medical event with data:', updateData);
            const response = await medicalEventAPI.update(eventId, updateData);
            console.log('Update response:', response);            if (response.isSuccess) {
                toast.success('Cập nhật sự kiện y tế thành công');
                
                // Tạo dữ liệu đã cập nhật để truyền về trang chi tiết
                const updatedEventData = {
                    ...medicalEvent,
                    dateHappened: formData.dateHappened.toISOString(),
                    type: formData.type,
                    level: parseInt(formData.level),
                    description: formData.description,
                    solution: formData.solution,
                    note: formData.note,
                    status: formData.status,
                    studentJoin: studentsJoin.map(student => ({
                        studentId: {
                            _id: student.id,
                            name: student.name,
                            studentCode: student.studentCode,
                            gender: student.gender
                        }
                    }))
                };
                
                handleBackWithData(updatedEventData);
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
        const previousPath = location.state?.from;
        
        if (studentId) {
            // Nếu có studentId, kiểm tra từ đâu đến
            if (previousPath && previousPath.includes('/detail/')) {
                // Từ trang chi tiết, quay về chi tiết
                navigate(previousPath);
            } else {
                // Từ trang danh sách hoặc không rõ, quay về danh sách
                navigate(`/nurse/medical-events/${studentId}`);
            }
        } else {
            // Không có studentId, kiểm tra từ đâu đến
            if (previousPath && previousPath.includes('/detail/')) {
                // Từ trang chi tiết, quay về chi tiết
                navigate(previousPath);
            } else {
                // Từ trang danh sách hoặc không rõ, quay về danh sách
                navigate('/nurse/medical-events');
            }
        }
    };const handleBackWithData = (updatedEventData) => {
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
    };    // Functions để quản lý học sinh tham gia
    const handleSearchStudent = async (code) => {
        if (!code.trim()) {
            setFoundStudent(null);
            setSearchStatus('');
            return;
        }

        try {
            setSearchStatus('searching');
            
            // Tìm kiếm thông tin học sinh từ API bằng keyword
            console.log('Searching for student with code:', code.trim());
            const response = await studentsApi.getAllStudents({ 
                keyword: code.trim(), 
                page: 1 
            });
            
            console.log('API response:', response);
            
            // Sửa lại: dữ liệu học sinh nằm trong response.data.records
            const studentsData = response.data?.records || response.data || [];
            
            if (response.isSuccess && studentsData.length > 0) {
                console.log('Students found:', studentsData);
                
                // Tìm học sinh có mã chính xác khớp với input (thử tất cả các field có thể)
                const student = studentsData.find(s => {
                    // Thử tất cả các field có thể chứa mã học sinh
                    const possibleCodes = [
                        s.studentCode,
                        s.code, 
                        s.studentId,
                        s.id,
                        s.mã_học_sinh,
                        s.student_code
                    ].filter(Boolean); // Loại bỏ null/undefined
                    
                    const searchCode = code.trim().toLowerCase();
                    
                    return possibleCodes.some(code => 
                        String(code).toLowerCase() === searchCode
                    );
                });
                
                console.log('Found student:', student);
                
                if (student) {
                    const foundStudentData = {
                        id: student._id || student.id || Math.random().toString(36).substr(2, 9),
                        name: student.name || student.fullName || student.studentName || 'Không có tên',
                        studentCode: student.studentCode || student.code || student.studentId || code.trim(),
                        gender: student.gender || student.sex || 'N/A'
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

    const handleAddStudent = async () => {        if (!searchStudentCode.trim()) {
            toast.error('Vui lòng nhập mã học sinh');
            return;
        }

        // Kiểm tra xem đã tìm kiếm và có kết quả chưa
        if (!foundStudent) {
            toast.error('Vui lòng tìm kiếm học sinh trước khi thêm');
            return;
        }

        // Kiểm tra xem học sinh đã có trong danh sách chưa
        const existingStudent = studentsJoin.find(s => s.studentCode === foundStudent.studentCode);
        if (existingStudent) {
            toast.error('Học sinh này đã có trong danh sách');
            return;
        }        // Thêm học sinh vào danh sách
        setStudentsJoin(prev => [...prev, foundStudent]);
        handleClearSearch();
        toast.success(`Đã thêm học sinh ${foundStudent.name} thành công`);
    };const handleRemoveStudent = (studentId) => {
        setStudentsJoin(prev => prev.filter(s => s.id !== studentId));
        toast.success('Đã xóa học sinh khỏi danh sách');
    };

    const handleClearSearch = () => {
        setSearchStudentCode('');
        setFoundStudent(null);
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
    }return (
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
                            {/* Quản lý học sinh tham gia */}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50', fontSize: '1.1rem' }}>Học sinh tham gia: *</TableCell>
                                <TableCell>
                                    {/* Danh sách học sinh hiện tại */}
                                    {studentsJoin.length > 0 && (
                                        <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '4px', mb: 2 }}>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Tên</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Mã học sinh</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.85rem', py: 1 }}>Giới tính</TableCell>
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
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>                                        
                                        <TextField
                                            size="small"
                                            label="Mã học sinh"
                                            value={searchStudentCode}                                            
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setSearchStudentCode(newValue);
                                                
                                                // Clear timeout trước đó
                                                if (searchTimeout) {
                                                    clearTimeout(searchTimeout);
                                                }
                                                
                                                if (newValue.trim()) {
                                                    // Debounce search sau 500ms
                                                    const timeout = setTimeout(() => {
                                                        handleSearchStudent(newValue);
                                                    }, 500);
                                                    setSearchTimeout(timeout);
                                                } else {
                                                    setFoundStudent(null);
                                                    setSearchStatus('');
                                                }
                                            }}
                                            placeholder="Nhập mã học sinh để tìm kiếm..."
                                            sx={{ minWidth: 200 }}
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
                                            Thêm học sinh
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
                                            <Box sx={{ display: 'flex', gap: 3 }}>
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
                                            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                                                Nhấn "Thêm học sinh" để thêm vào danh sách
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {/* Hiển thị khi không tìm thấy */}
                                    {searchStatus === 'not-found' && searchStudentCode.trim() && (
                                        <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                            <Typography variant="body2">
                                                ✗ Không tìm thấy học sinh với mã "{searchStudentCode.trim()}"
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                Vui lòng kiểm tra lại mã học sinh
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {studentsJoin.length === 0 && (
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
                                            Chưa có học sinh tham gia. Sử dụng form bên dưới để thêm học sinh.
                                        </Typography>
                                    )}
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
                                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 1 }}>                                        
                                        <Button
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
                    </Table>{/* Note about required fields */}
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
                    </Box>                
                </CardContent>
            </Card>
        </Container>
        </LocalizationProvider>
    );
};

export default MedicalEventEditPage;
