import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fab,
    Tooltip
} from '@mui/material';
import {
    Help,
    PersonAdd,
    RequestPage,
    LocalHospital,
    Assessment,
    CheckCircle,
    NavigateNext,
    NavigateBefore,
    Close
} from '@mui/icons-material';

const UserGuideDialog = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            label: 'Chào mừng đến với hệ thống',
            icon: <Help />,
            content: (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        🎉 Chào mừng bạn đến với Hệ thống Chăm sóc Sức khỏe Học đường!
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Đây là hướng dẫn nhanh giúp bạn sử dụng hệ thống một cách dễ dàng và hiệu quả.
                    </Typography>

                </Box>
            )
        },
        {
            label: 'Thêm thông tin con em',
            icon: <PersonAdd />,
            content: (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        👶 Bước 1: Thêm thông tin con em
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Nhấn nút 'Thêm Con Em Mới'"
                                secondary="Nút màu xanh dương lớn ở đầu trang"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Điền thông tin cơ bản"
                                secondary="Họ tên, ngày sinh, giới tính, mã học sinh"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Điền thông tin y tế"
                                secondary="Chiều cao, cân nặng, nhóm máu, dị ứng (nếu có)"
                            />
                        </ListItem>
                    </List>
                </Box>
            )
        },
        {
            label: 'Xem thông tin sức khỏe',
            icon: <LocalHospital />,
            content: (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        🏥 Bước 2: Theo dõi sức khỏe con em
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Nhấn 'Xem Sức Khỏe'"
                                secondary="Nút màu xanh lá cây trên thẻ con em"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Xem hồ sơ y tế"
                                secondary="Chiều cao, cân nặng, nhóm máu, thị lực"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Kiểm tra cảnh báo"
                                secondary="Dị ứng, bệnh mãn tính, thiết bị hỗ trợ"
                            />
                        </ListItem>
                    </List>
                </Box>
            )
        },
        {
            label: 'Yêu cầu đơn thuốc',
            icon: <RequestPage />,
            content: (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        💊 Bước 3: Yêu cầu đơn thuốc cho con
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Nhấn 'Yêu Cầu Đơn Thuốc'"
                                secondary="Nút màu cam trên thẻ con em"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Chọn ngày bắt đầu và kết thúc"
                                secondary="Thời gian cần uống thuốc"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Thêm danh sách thuốc"
                                secondary="Tên thuốc, số lượng, đơn vị, ghi chú"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Chờ y tá duyệt"
                                secondary="Sẽ có thông báo khi đơn được duyệt"
                            />
                        </ListItem>
                    </List>
                </Box>
            )
        },
        {
            label: 'Mẹo sử dụng hiệu quả',
            icon: <Assessment />,
            content: (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        💡 Mẹo sử dụng hệ thống hiệu quả
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Kiểm tra thông báo thường xuyên"
                                secondary="Ở đầu trang chính có các thông báo quan trọng"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Cập nhật thông tin kịp thời"
                                secondary="Thông báo cho trường khi có thay đổi sức khỏe"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Liên hệ hỗ trợ khi cần"
                                secondary="Gọi điện hoặc đến trường khi có thắc mắc"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Sử dụng nút làm mới"
                                secondary="Nhấn nút tròn ở góc phải để cập nhật dữ liệu"
                            />
                        </ListItem>
                    </List>
                </Box>
            )
        }
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClose = () => {
        setActiveStep(0);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '600px'
                }
            }}
        >
            <DialogTitle sx={{
                textAlign: 'center',
                pb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Help sx={{ mr: 2, fontSize: 32 }} />
                    <Typography variant="h4" fontWeight="bold">
                        Hướng dẫn sử dụng
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Học cách sử dụng hệ thống một cách dễ dàng
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                icon={step.icon}
                                sx={{
                                    '& .MuiStepLabel-iconContainer': {
                                        '& .MuiSvgIcon-root': {
                                            fontSize: '2rem',
                                            color: index <= activeStep ? '#4caf50' : '#ccc'
                                        }
                                    }
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    {step.label}
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                    {step.content}
                                </Paper>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', p: 3 }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<NavigateBefore />}
                    size="large"
                    sx={{ fontSize: '1.1rem' }}
                >
                    Quay lại
                </Button>

                <Typography variant="body1" color="text.secondary">
                    {activeStep + 1} / {steps.length}
                </Typography>

                {activeStep === steps.length - 1 ? (
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        startIcon={<CheckCircle />}
                        size="large"
                        sx={{
                            fontSize: '1.1rem',
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#45a049' }
                        }}
                    >
                        Hoàn thành
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        variant="contained"
                        endIcon={<NavigateNext />}
                        size="large"
                        sx={{ fontSize: '1.1rem' }}
                    >
                        Tiếp theo
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

// Component nút trợ giúp nổi
export const HelpButton = () => {
    const [guideOpen, setGuideOpen] = useState(false);

    return (
        <>
            <Tooltip title="Hướng dẫn sử dụng" placement="left">
                <Fab
                    color="secondary"
                    onClick={() => setGuideOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)',
                        }
                    }}
                >
                    <Help sx={{ fontSize: 28 }} />
                </Fab>
            </Tooltip>

            <UserGuideDialog
                open={guideOpen}
                onClose={() => setGuideOpen(false)}
            />
        </>
    );
};

export default UserGuideDialog;
