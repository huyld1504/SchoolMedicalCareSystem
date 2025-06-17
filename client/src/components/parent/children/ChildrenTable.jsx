import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Avatar,
    Typography,
    Chip,
    IconButton,
    Box,
    Button,
    Stack,
    Tooltip
} from '@mui/material';
import {
    Visibility,
    MedicalServices,
    Person,
    ChildCare
} from '@mui/icons-material';

const ChildrenTable = ({
    children = [],
    onViewHealth,
    onCreateOrder,
    loading = false
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Ensure children is always an array
    const childrenArray = Array.isArray(children) ? children : [];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getGenderChip = (gender) => {
        return (
            <Chip
                label={gender === 'male' ? 'Nam' : 'Nữ'}
                size="small"
                sx={{
                    bgcolor: gender === 'male' ? '#e3f2fd' : '#fce4ec',
                    color: gender === 'male' ? '#1976d2' : '#c2185b',
                    fontWeight: 'bold'
                }}
            />
        );
    };

    if (loading) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                    Đang tải dữ liệu...
                </Typography>
            </Paper>
        );
    }

    if (childrenArray.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <ChildCare sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                    Chưa có thông tin con em
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Hiện tại chưa có thông tin về con em của bạn trong hệ thống
                </Typography>
            </Paper>
        );
    }

    const paginatedChildren = childrenArray.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    ); return (
        <Paper sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(25, 118, 210, 0.12)',
            border: '1px solid #e3f2fd',
            margin: 0
        }}>
            <TableContainer sx={{
                maxHeight: 'calc(100vh - 300px)',
                width: '100%',
                margin: 0,
                padding: 0
            }}>
                <Table sx={{ minWidth: 650, width: '100%' }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#1976d2',
                                borderBottom: 'none'
                            }}>
                                Thông tin con em
                            </TableCell>
                            <TableCell sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#1976d2',
                                borderBottom: 'none'
                            }} align="center">
                                Tuổi
                            </TableCell>
                            <TableCell sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#1976d2',
                                borderBottom: 'none'
                            }} align="center">
                                Giới tính
                            </TableCell>
                            <TableCell sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#1976d2',
                                borderBottom: 'none'
                            }} align="center">
                                Ngày sinh
                            </TableCell>
                            <TableCell sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#1976d2',
                                borderBottom: 'none'
                            }} align="center">
                                Mã học sinh
                            </TableCell>
                            <TableCell sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#1976d2',
                                borderBottom: 'none'
                            }} align="center">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedChildren.map((child, index) => (
                            <TableRow
                                key={child._id || index}
                                hover
                                sx={{
                                    '&:hover': {
                                        bgcolor: '#f8fafc',
                                        transform: 'scale(1.01)',
                                        transition: 'all 0.2s ease-in-out'
                                    },
                                    '&:nth-of-type(even)': {
                                        bgcolor: '#fafafa'
                                    }
                                }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: '#1976d2',
                                                width: 50,
                                                height: 50,
                                                mr: 2,
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {child.name ? child.name.charAt(0).toUpperCase() : <Person />}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontWeight: 'bold', color: '#1976d2' }}
                                            >
                                                {child.name || 'Chưa có tên'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Lớp: {child.class || 'Chưa xác định'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={`${calculateAge(child.birthdate)} tuổi`}
                                        size="small"
                                        sx={{
                                            bgcolor: '#e8f5e9',
                                            color: '#2e7d32',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {getGenderChip(child.gender)}
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body2">
                                        {formatDate(child.birthdate)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: 'monospace',
                                            bgcolor: '#f5f5f5',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {child.studentCode || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Xem hồ sơ sức khỏe">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => onViewHealth?.(child)}
                                                sx={{
                                                    borderColor: '#1976d2',
                                                    color: '#1976d2',
                                                    '&:hover': {
                                                        borderColor: '#1565c0',
                                                        bgcolor: '#e3f2fd'
                                                    }
                                                }}
                                            >
                                                Sức khỏe
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Tạo đơn thuốc">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<MedicalServices />}
                                                onClick={() => onCreateOrder?.(child)}
                                                sx={{
                                                    borderColor: '#4caf50',
                                                    color: '#4caf50',
                                                    '&:hover': {
                                                        borderColor: '#388e3c',
                                                        bgcolor: '#e8f5e9'
                                                    }
                                                }}
                                            >
                                                Đơn thuốc
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>            {childrenArray.length > 0 && (
                <TablePagination
                    component="div"
                    count={childrenArray.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} trong tổng số ${count}`
                    }
                    sx={{
                        borderTop: '1px solid #e0e0e0',
                        bgcolor: '#f8fafc',
                        '& .MuiTablePagination-toolbar': {
                            px: 3,
                            py: 2
                        }
                    }}
                />
            )}
        </Paper>
    );
};

export default ChildrenTable;
