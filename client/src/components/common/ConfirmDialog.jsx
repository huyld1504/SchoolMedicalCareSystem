import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Avatar,
    Chip
} from '@mui/material';
import {
    Warning,
    CheckCircle,
    Info,
    Cancel,
    MedicalServices
} from '@mui/icons-material';

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    type = "info", // "warning", "error", "success", "info"
    confirmText = "Xác nhận",
    cancelText = "Hủy bỏ",
    child = null // Thông tin con em nếu có
}) => {
    const getIcon = () => {
        switch (type) {
            case 'warning': return <Warning sx={{ fontSize: 60, color: '#ff9800' }} />;
            case 'error': return <Cancel sx={{ fontSize: 60, color: '#f44336' }} />;
            case 'success': return <CheckCircle sx={{ fontSize: 60, color: '#4caf50' }} />;
            default: return <Info sx={{ fontSize: 60, color: '#2196f3' }} />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'warning': return '#ff9800';
            case 'error': return '#f44336';
            case 'success': return '#4caf50';
            default: return '#2196f3';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
                <Box sx={{ mb: 2 }}>
                    {getIcon()}
                </Box>
                <Typography variant="h4" fontWeight="bold" color={getColor()}>
                    {title}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center', py: 2 }}>
                {child && (
                    <Box sx={{
                        mb: 3,
                        p: 3,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 3,
                        border: `2px solid ${getColor()}30`
                    }}>
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: child.gender === 'male' ? '#1976d2' : '#e91e63',
                                mx: 'auto',
                                mb: 2
                            }}
                        >
                            <MedicalServices />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                            {child.name}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                            <Chip label={`${child.age} tuổi`} size="small" />
                            <Chip label={child.gender === 'male' ? 'Nam' : 'Nữ'} size="small" />
                        </Stack>
                    </Box>
                )}

                <Typography variant="h6" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    size="large"
                    sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    size="large"
                    sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: getColor(),
                        '&:hover': {
                            backgroundColor: getColor(),
                            filter: 'brightness(0.9)'
                        }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
