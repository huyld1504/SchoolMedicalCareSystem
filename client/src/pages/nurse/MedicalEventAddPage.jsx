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

// Component chính để thêm sự kiện y tế
const MedicalEventAddPage = () => {
    // Lấy studentId từ URL nếu có, ktra xem trang hiện tại có phải là trang thêm sự kiện y tế cho học sinh cụ thể không
    const { studentId } = useParams();
    const navigate = useNavigate();

    // State chính
    const [studentInfo, setStudentInfo] = useState(null);       // Thông tin học sinh (nếu có studentId)
    const [loading, setLoading] = useState(true);               // Trạng thái đang tải
    const [saving, setSaving] = useState(false);                // Trạng thái đang lưu

    // Quản lý học sinh tham gia sự kiện
    const [studentsJoin, setStudentsJoin] = useState([]);
    const [searchStudentCode, setSearchStudentCode] = useState('');
    const [searchStudentName, setSearchStudentName] = useState('');
    const [foundStudent, setFoundStudent] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Quản lý ảnh
    const [imagePublicId, setImagePublicId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Quản lý modal hiển thị ảnh
    const [openImageModal, setOpenImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    // Dữ liệu form sự kiện
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

    // Quản lý lỗi các trường nhập
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

    // Load thông tin nếu có studentId
    useEffect(() => {
        const loadData = async () => {
            if (studentId) {
                await addStudentToList();
            }
            setLoading(false);
        };
        loadData();
    }, [studentId]);

    // Thêm học sinh vào danh sách tham gia
    const addStudentToList = async () => {
        try {
            const response = await studentsApi.getAllStudents({
                keyword: '',
                page: 1,
                populate: 'userId'
            });

            if (response.isSuccess) {
                const studentsData = response.data?.records || response.data || [];
                const student = studentsData.find(s => s._id === studentId || s.id === studentId);

                if (student) {
                    const studentData = {
                        id: student._id || student.id,
                        name: student.name || '',
                        studentCode: student.studentCode || '',
                        gender: student.gender || '',
                        userId: student.userId,
                        medicalConverageId: student.medicalConverageId,
                        parentName: student.userId?.name || 'Không có thông tin',
                        parentEmail: student.userId?.email || 'Không có thông tin',
                    };
                    setStudentsJoin([studentData]);
                }
            }
        } catch (error) {
            console.error('Error adding student to list:', error);
        }
    };

    // Xử lý thay đổi dữ liệu form
    const handleInputChange = (field, value) => {
        //cập nhật giá trị mới cho một trường cụ thể trong form
        // đồng thời giữ nguyên các giá trị khác trong form
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            // Kiểm tra nếu trường đó đang có lỗi 
            setErrors(prev => ({ ...prev, [field]: '' })); //Xóa lỗi của trường đó (gán chuỗi rỗng), khi người dùng nhập lại
        }
    };

    // Quay lại trang trước
    const handleBack = () => {
        navigate(studentId ? `/nurse/medical-events/${studentId}` : '/nurse/medical-events');
    };

    // Upload ảnh từ người dùng
    const handleImageSelect = async (event) => {
        // Lấy file ảnh đầu tiên được chọn
        const file = event.target.files[0];
        if (!file) return; // Nếu không có file nào thì thoát luôn

        // Hiển thị trạng thái đang tải ảnh
        setUploadingImage(true);
        toast.info('Đang tải ảnh lên...');

        // Kiểm tra định dạng ảnh có hợp lệ không
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            // Nếu không đúng định dạng thì hiển thị lỗi và dừng lại
            setErrors(prev => ({ ...prev, imageURL: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)' }));
            setUploadingImage(false);
            return;
        }

        // Kiểm tra kích thước ảnh (tối đa 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            // Nếu file quá lớn thì hiển thị lỗi và dừng lại
            setErrors(prev => ({ ...prev, imageURL: 'Kích thước file không được vượt quá 5MB' }));
            setUploadingImage(false);
            return;
        }

        // Gọi API (ví dụ Cloudinary) để upload ảnh
        const response = await cloudinaryApi.uploadImage(file);

        if (response.success) {
            // Nếu upload thành công:
            // - Lưu file đã chọn
            // - Hiển thị ảnh preview
            // - Lưu publicId để sau này có thể xoá
            // - Cập nhật formData với URL ảnh
            setSelectedImage(file);
            setImagePreview(response.data.imageUrl);
            setImagePublicId(response.data.publicId);
            setFormData(prev => ({ ...prev, imageURL: response.data.imageUrl }));
            toast.success('Tải ảnh thành công');
        } else {
            // Nếu upload thất bại thì hiển thị lỗi
            setErrors(prev => ({ ...prev, imageURL: response.message || 'Lỗi khi tải ảnh' }));
        }

        // Kết thúc trạng thái tải ảnh
        setUploadingImage(false);

        // Reset lại input file để cho phép chọn lại cùng một ảnh nếu cần
        document.getElementById('image-upload-input').value = '';
    };


    // Xóa ảnh đã chọn và upload
    const handleRemoveImage = async () => {
        // Gọi API để xóa ảnh khỏi Cloudinary thông qua publicId
        const response = await cloudinaryApi.deleteImage(imagePublicId);

        // Nếu xóa thành công thì thông báo thành công
        if (response.success) toast.success('Xóa ảnh thành công');

        // Reset lại các state liên quan đến ảnh
        setSelectedImage(null);           // Xóa file đã chọn
        setImagePreview(null);            // Xóa ảnh hiển thị preview
        setFormData(prev => ({
            ...prev,
            imageURL: ''                  // Xóa URL ảnh trong formData
        }));

        // Reset input file để có thể chọn lại ảnh khác
        document.getElementById('image-upload-input').value = '';
    };


    // Khi người dùng click vào ảnh, hiển thị ảnh trong modal
    const handleImageClick = (imageUrl) => {
        setModalImageUrl(imageUrl);      // Lưu URL ảnh vào state để hiển thị trong modal
        setOpenImageModal(true);         // Mở modal hiển thị ảnh
    };

    // Đóng modal hiển thị ảnh
    const handleCloseImageModal = () => {
        setOpenImageModal(false);        // Tắt modal
        setModalImageUrl('');            // Xóa URL ảnh khỏi state
    };

    // Gửi dữ liệu form lên server
    const handleSubmit = async () => {
        setSaving(true);
        setErrors({ ...errors }); // Reset errors

        const newErrors = {};
        let hasError = false;

        // Validate từng trường
        if (!formData.dateHappened || isNaN(new Date(formData.dateHappened))) {
            newErrors.dateHappened = 'Chọn ngày và giờ hợp lệ';
            hasError = true;
        }

        if (!formData.type.trim()) {
            newErrors.type = 'Chọn loại sự kiện';
            hasError = true;
        }

        if (!formData.level.toString().trim()) {
            newErrors.level = 'Chọn mức độ';
            hasError = true;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Nhập mô tả chi tiết';
            hasError = true;
        }

        if (!formData.solution.trim()) {
            newErrors.solution = 'Nhập giải pháp';
            hasError = true;
        }

        if (!formData.status.trim()) {
            newErrors.status = 'Chọn trạng thái';
            hasError = true;
        }

        if (studentsJoin.length === 0 && !studentId) {
            newErrors.studentsJoin = 'Thêm ít nhất một học sinh';
            hasError = true;
        }

        if (!formData.imageURL.trim()) {
            newErrors.imageURL = 'Chọn hình ảnh';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setSaving(false);
            return;
        }

        // Tạo object gửi lên API
        const createData = {
            dateHappened: formData.dateHappened.toISOString(),
            type: formData.type,
            level: parseInt(formData.level),
            description: formData.description,
            solution: formData.solution,
            note: formData.note,
            status: formData.status,
            studentJoin: studentsJoin.map(student => ({ studentId: student.id })),
            imageURL: formData.imageURL
        };

        const response = await medicalEventAPI.create(createData);
        if (response.isSuccess) {
            toast.success('Tạo sự kiện y tế thành công');
            navigate(studentId ? `/nurse/medical-events/${studentId}` : '/nurse/medical-events');
        } else {
            toast.error(response.message || 'Tạo thất bại');
        }
        setSaving(false);
    };

    // Tìm học sinh từ mã hoặc tên
    const handleSearchStudent = async (searchTerm, searchType = 'general') => {
        if (!searchTerm.trim()) {
            setFoundStudent([]);
            setSearchStatus('');
            return;
        }

        setSearchStatus('searching');

        //Gửi request lấy danh sách student theo từ khoá tìm kiếm (nếu có), và luôn bắt đầu từ trang 1.
        const response = await studentsApi.getAllStudents({ keyword: searchTerm.trim(), page: 1 });
        //Lấy ra danh sách sinh viên từ response
        const studentsData = response.data?.records || response.data || [];

        if (response.isSuccess && studentsData.length > 0) {
            //Nếu như gọi request thành công và tìm thấy học sinh
            setFoundStudent(studentsData);
            setSearchStatus('found');
        } else {
            setFoundStudent([]);
            setSearchStatus('not-found');
        }
    };

    // Thêm học sinh cụ thể vào danh sách tham gia
    const handleAddSpecificStudent = (student) => {
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
        if (errors.studentsJoin) {
            setErrors(prev => ({ ...prev, studentsJoin: '' }));
        }

        toast.success(`Đã thêm học sinh ${student.name}`);
    };

    // Xóa học sinh khỏi danh sách tham gia
    const handleRemoveStudent = (studentId) => {
        // Cập nhật danh sách học sinh, loại bỏ học sinh có id trùng với studentId
        setStudentsJoin(prev => prev.filter(s => s.id !== studentId));

        toast.success('Đã xóa học sinh');
    };

    // Reset tìm kiếm học sinh
    const handleResetSearch = () => {
        setSearchStudentCode('');
        setSearchStudentName('');
        setFoundStudent([]);
        setSearchStatus('');
    };

    // Hiển thị giá trị thay thế nếu không có dữ liệu
    const getDisplayValue = (value) => {
        if (value === null || value === undefined) return 'Không có';
        if (value === '') return 'Không có';
        return value;
    };

    // Giao diện loading
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
                        {/* Icon back lại trang trước */}
                        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                            <BackIcon />
                        </IconButton>
                        {/* Icon y tế */}
                        <MedicalIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                        <Typography variant="h4" component="h1">
                            Tạo sự kiện y tế mới
                        </Typography>
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

                        {/* Ngày sự kiện */}
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
                                    {/* Bảng thông tin học sinh */}
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
                                                    {/* Duyệt qua danh sách học sinh đã tham gia */}
                                                    {studentsJoin.map((student) => (
                                                        <TableRow key={student.id} sx={{ '&:last-child td': { border: 0 } }}>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>{student.name || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>{student.studentCode || 'Không có thông tin'}</TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>
                                                                {student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Không có thông tin'}
                                                            </TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.75rem', py: 1 }}>
                                                                {student.parentName || (student.userId && typeof student.userId === 'object' ? student.userId.name : 'Không có thông tin')}
                                                            </TableCell>
                                                            <TableCell align="start" sx={{ fontSize: '0.85rem', py: 1 }}>
                                                                {student.parentPhone || (student.userId && typeof student.userId === 'object' ? student.userId.phone : 'Không có thông tin')}
                                                            </TableCell>
                                                            {/* Button delete học sinh */}
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
                                            {/* Nhập liệu tìm kiếm học sinh */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: 2,
                                                    alignItems: 'center',
                                                    mt: 1,
                                                    flexWrap: 'wrap', // Cho phép các ô nhập xuống dòng khi màn hình hẹp
                                                }}
                                            >
                                                {/* Ô nhập mã học sinh */}
                                                <TextField
                                                    size="small"
                                                    label="Mã học sinh"
                                                    value={searchStudentCode}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value; //Lấy giá trị mới từ ô nhập
                                                        setSearchStudentCode(newValue); // Cập nhật giá trị

                                                        // Xoá timeout cũ nếu còn
                                                        if (searchTimeout) {
                                                            clearTimeout(searchTimeout);
                                                        }

                                                        // Nếu có nhập dữ liệu thì thực hiện tìm kiếm sau 500ms
                                                        if (newValue.trim()) {
                                                            const timeout = setTimeout(() => {
                                                                handleSearchStudent(newValue, 'studentCode');
                                                            }, 500);
                                                            setSearchTimeout(timeout); //Lưu lại timeout này vào biến searchTimeout để có thể hủy timeout cũ nếu người dùng tiếp tục gõ.
                                                        } else if (!searchStudentName.trim()) {
                                                            // Nếu cả mã và tên đều trống thì reset danh sách kết quả
                                                            setFoundStudent([]);
                                                            setSearchStatus('');
                                                        }
                                                    }}
                                                    sx={{
                                                        minWidth: 200,
                                                        '& .MuiOutlinedInput-root': {
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: errors.studentsJoin ? 'error.main' : 'primary.main',
                                                            },
                                                        },
                                                    }}
                                                    placeholder="Nhập mã học sinh..."
                                                    error={!!errors.studentsJoin}
                                                />

                                                {/* Ô nhập tên học sinh */}
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
                                                                borderColor: errors.studentsJoin ? 'error.main' : 'primary.main',
                                                            },
                                                        },
                                                    }}
                                                    placeholder="Nhập tên học sinh..."
                                                    error={!!errors.studentsJoin}
                                                />

                                                {/* Nút reset bộ lọc */}
                                                <Button variant="contained" onClick={handleResetSearch}>
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

                                            {/* Hiển thị trạng thái "đang tìm kiếm" sẽ hiện khi đnag gửi request chưa có kết quả*/}
                                            {searchStatus === 'searching' && (
                                                <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                                    >
                                                        <CircularProgress size={16} />
                                                        Đang tìm kiếm học sinh...
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Hiển thị kết quả khi tìm được học sinh */}
                                            {searchStatus === 'found' &&
                                                foundStudent &&
                                                foundStudent.length > 0 && (
                                                    <Box sx={{ mt: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                p: 2,
                                                                bgcolor: 'grey.50',
                                                                borderBottom: '1px solid #e0e0e0',
                                                            }}
                                                        >
                                                            Tìm thấy {foundStudent.length} học sinh:
                                                        </Typography>

                                                        {/* Danh sách học sinh hiển thị dưới dạng thẻ */}
                                                        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                            {foundStudent.map((student, index) => (
                                                                <Box
                                                                    key={student._id || student.id || index}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderBottom:
                                                                            index < foundStudent.length - 1
                                                                                ? '1px solid #f0f0f0'
                                                                                : 'none',
                                                                        '&:hover': { bgcolor: 'grey.50' },
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'flex-start',
                                                                        }}
                                                                    >
                                                                        {/* Thông tin học sinh */}
                                                                        <Box sx={{ flex: 1 }}>
                                                                            <Box sx={{ display: 'flex', gap: 3, mb: 1 }}>
                                                                                <Typography variant="body2">
                                                                                    <strong>Tên HS:</strong> {student.name || 'Không có thông tin'}
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    <strong>Mã HS:</strong> {student.studentCode || 'Không có thông tin'}
                                                                                </Typography>
                                                                                <Typography variant="body2">
                                                                                    <strong>Giới tính:</strong>{' '}
                                                                                    {student.gender === 'male'
                                                                                        ? 'Nam'
                                                                                        : student.gender === 'female'
                                                                                            ? 'Nữ'
                                                                                            : 'Không có thông tin'}
                                                                                </Typography>
                                                                            </Box>

                                                                            {/* Thông tin phụ huynh */}
                                                                            <Box
                                                                                sx={{
                                                                                    mt: 1,
                                                                                    p: 1,
                                                                                    bgcolor: 'grey.50',
                                                                                    borderRadius: 1,
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                                                                                >
                                                                                    Thông tin phụ huynh:
                                                                                </Typography>
                                                                                <Box sx={{ display: 'flex', gap: 3 }}>
                                                                                    <Typography variant="caption">
                                                                                        <strong>Tên:</strong>{' '}
                                                                                        {student.userId?.name || 'Không có thông tin'}
                                                                                    </Typography>
                                                                                    <Typography variant="caption">
                                                                                        <strong>Email:</strong>{' '}
                                                                                        {student.userId?.email || 'Không có thông tin'}
                                                                                    </Typography>
                                                                                    <Typography variant="caption">
                                                                                        <strong>SĐT:</strong>{' '}
                                                                                        {student.userId?.phone || 'Không có thông tin'}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>

                                                                        {/* Nút thêm học sinh */}
                                                                        <Button
                                                                            variant="contained"
                                                                            size="small"
                                                                            startIcon={<AddIcon />}
                                                                            onClick={() => handleAddSpecificStudent(student)}
                                                                            disabled={studentsJoin.some(
                                                                                (s) => s.id === (student._id || student.id)
                                                                            )} // ktra học sinh đã có trong danh sách studentsJoin chưa
                                                                            sx={{ ml: 2, minWidth: '80px' }}
                                                                        >
                                                                            {studentsJoin.some(
                                                                                (s) => s.id === (student._id || student.id)
                                                                            )
                                                                                ? 'Đã thêm'
                                                                                : 'Thêm'}
                                                                        </Button>
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                )
                                            }

                                            {/* Trường hợp không tìm thấy học sinh */}
                                            {searchStatus === 'not-found' && (searchStudentCode.trim() || searchStudentName.trim()) && (
                                                <Box sx={{ mt: 1, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                                    <Typography variant="body2">
                                                        Không tìm thấy học sinh với từ khóa tìm kiếm
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                        Kiểm tra lại mã học sinh hoặc tên học sinh
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Hiển thị thông báo lỗi nếu có*/}
                                        {errors.studentsJoin && (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="error">
                                                    {errors.studentsJoin}
                                                </Typography>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>

                                {/* Loại sự kiện */}
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

                                {/* Uploadình ảnh */}
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
                                                        // Xóa lỗi hình ảnh khi người dùng nhấp để tải lên                                                        
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

                        {/* Lưu ý về các trường bắt buộc */}
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
