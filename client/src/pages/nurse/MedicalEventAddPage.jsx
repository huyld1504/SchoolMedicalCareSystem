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
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import medicalEventAPI from '../../api/medicalEventApi';
import studentsApi from '../../api/studentsApi';

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

    useEffect(() => {
        if (studentId) {
            loadStudentInfo();
            // Nếu có studentId, tự động thêm học sinh đó vào danh sách
            addStudentToList();
        }
        setLoading(false);
    }, [studentId]);

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

    const addStudentToList = async () => {
        try {
            if (studentId) {
                const response = await studentsApi.getStudentById(studentId);
                if (response.isSuccess && response.data) {
                    const student = response.data;
                    const studentData = {
                        id: student._id || student.id,
                        name: student.name || '',
                        studentCode: student.studentCode || '',
                        gender: student.gender || ''
                    };
                    setStudentsJoin([studentData]);
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
            }            // Kiểm tra ít nhất một học sinh tham gia (trừ khi có studentId và đang loading)
            if (studentsJoin.length === 0 && !studentId) {
                toast.error('Vui lòng thêm ít nhất một học sinh tham gia');
                return;
            }

            // Nếu có studentId nhưng chưa có trong studentsJoin, thử load lại
            if (studentId && studentsJoin.length === 0) {
                toast.warning('Đang tải thông tin học sinh, vui lòng thử lại sau giây lát...');
                return;
            }

            // Validate date is valid
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

            console.log('Creating medical event with data:', createData);
            const response = await medicalEventAPI.create(createData);
            console.log('Create response:', response);

            if (response.isSuccess) {
                toast.success('Tạo sự kiện y tế thành công');
                
                // Sau khi tạo thành công, luôn trở về trang danh sách sự kiện y tế
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

    const handleBack = () => {
        if (studentId) {
            navigate(`/nurse/medical-events/${studentId}`);
        } else {
            navigate('/nurse/medical-events');
        }
    };

    const hasValue = (value) => {
        return value !== null && value !== undefined && value !== '' && String(value).trim() !== '';
    };

    // Functions để quản lý học sinh tham gia
    const handleSearchStudent = async (code) => {
        if (!code.trim()) {
            setFoundStudent(null);
            setSearchStatus('');
            return;
        }

        try {
            setSearchStatus('searching');
            
            console.log('Searching for student with code:', code.trim());
            const response = await studentsApi.getAllStudents({ 
                keyword: code.trim(), 
                page: 1 
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

    const handleAddStudent = async () => {
        if (!searchStudentCode.trim()) {
            toast.error('Vui lòng nhập mã học sinh');
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

        setStudentsJoin(prev => [...prev, foundStudent]);
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
                            </Typography>                            {studentInfo && (
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
                                                            </TableCell>                                                            <TableCell align="center" sx={{ py: 1 }}>
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
                                          {/* Form thêm học sinh mới - luôn hiển thị */}
                                        <Box>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
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
                                                        Nhấn "THÊM HỌC SINH" để thêm vào danh sách
                                                    </Typography>
                                                </Box>
                                            )}
                                              {/* Hiển thị khi không tìm thấy */}
                                            {searchStatus === 'not-found' && searchStudentCode.trim() && (
                                                <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography variant="body2">
                                                        Không tìm thấy học sinh với mã "{searchStudentCode.trim()}"
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                        Vui lòng kiểm tra lại mã học sinh
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>

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
                                {/* Ghi chú - không bắt buộc */}
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
                                disabled={saving}
                                size="large"
                            >
                                {saving ? 'Đang tạo...' : 'Tạo sự kiện'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </LocalizationProvider>
    );
};

export default MedicalEventAddPage;
