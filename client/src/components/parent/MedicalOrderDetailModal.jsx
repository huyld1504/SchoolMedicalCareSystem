import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    MedicalServices,
    Schedule,
    CheckCircle,
    Cancel,
    Pending,
    Description,
    LocalHospital,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { medicalOrderApi } from '../../api/medicalOrderApi';

const MedicalOrderDetailModal = ({ open, onClose, orderId }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && orderId) {
            loadOrderDetails();
        }
    }, [open, orderId]);

    const loadOrderDetails = async () => {
        try {
            setLoading(true);
            // Load order details
            const orderResponse = await medicalOrderApi.getMedicalOrderById(orderId);
            setOrderDetails(orderResponse);

            // Load medical records
            const recordsResponse = await medicalOrderApi.getMedicalOrderRecords(orderId);
            setRecords(recordsResponse.records || []);

        } catch (error) {
            console.error('Error loading order details:', error);
            toast.error('Có lỗi xảy ra khi tải chi tiết đơn thuốc');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'info';
            case 'completed': return 'success';
            case 'canceled': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'approved': return 'Đã duyệt';
            case 'completed': return 'Hoàn thành';
            case 'canceled': return 'Đã hủy';
            default: return status;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Pending sx={{ color: '#ed6c02' }} />;
            case 'approved': return <Schedule sx={{ color: '#0288d1' }} />;
            case 'completed': return <CheckCircle sx={{ color: '#2e7d32' }} />;
            case 'canceled': return <Cancel sx={{ color: '#d32f2f' }} />;
            default: return <Pending />;
        }
    };

    if (loading) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Đang tải chi tiết đơn thuốc...
                    </Typography>
                </DialogContent>
            </Dialog>
        );
    }

    if (!orderDetails) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { minHeight: '70vh' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
                <MedicalServices sx={{ mr: 2, color: 'primary.main' }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                        Chi tiết đơn thuốc #{orderDetails._id?.slice(-6)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {orderDetails.ChildId?.name || 'Tên học sinh'}
                    </Typography>
                </Box>
                <Chip
                    label={getStatusText(orderDetails.status)}
                    color={getStatusColor(orderDetails.status)}
                    icon={getStatusIcon(orderDetails.status)}
                />
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3}>
                    {/* Thông tin cơ bản */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 'fit-content' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Description sx={{ mr: 1 }} />
                                    Thông tin đơn thuốc
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemText
                                            primary="Ngày bắt đầu"
                                            secondary={new Date(orderDetails.startDate).toLocaleDateString('vi-VN')}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Ngày kết thúc"
                                            secondary={new Date(orderDetails.endDate).toLocaleDateString('vi-VN')}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="Trạng thái tồn kho"
                                            secondary={
                                                <Chip
                                                    label={orderDetails.isStock ? "Còn thuốc" : "Hết thuốc"}
                                                    color={orderDetails.isStock ? "success" : "error"}
                                                    size="small"
                                                />
                                            }
                                        />
                                    </ListItem>
                                    {orderDetails.note && (
                                        <ListItem>
                                            <ListItemText
                                                primary="Ghi chú"
                                                secondary={orderDetails.note}
                                            />
                                        </ListItem>
                                    )}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Timeline trạng thái */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 'fit-content' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TimelineIcon sx={{ mr: 1 }} />
                                    Lịch sử trạng thái
                                </Typography>
                                <Timeline position="right">
                                    <TimelineItem>
                                        <TimelineSeparator>
                                            <TimelineDot color="primary">
                                                <Pending />
                                            </TimelineDot>
                                            {orderDetails.status !== 'pending' && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography variant="body2" fontWeight="bold">
                                                Đơn thuốc được tạo
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(orderDetails.createdAt).toLocaleString('vi-VN')}
                                            </Typography>
                                        </TimelineContent>
                                    </TimelineItem>

                                    {orderDetails.status !== 'pending' && (
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot color={orderDetails.status === 'canceled' ? 'error' : 'info'}>
                                                    {orderDetails.status === 'canceled' ? <Cancel /> : <Schedule />}
                                                </TimelineDot>
                                                {['approved', 'completed'].includes(orderDetails.status) && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {orderDetails.status === 'canceled' ? 'Đơn thuốc bị hủy' : 'Đơn thuốc được duyệt'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(orderDetails.updatedAt).toLocaleString('vi-VN')}
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    )}

                                    {orderDetails.status === 'completed' && (
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot color="success">
                                                    <CheckCircle />
                                                </TimelineDot>
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Typography variant="body2" fontWeight="bold">
                                                    Hoàn thành điều trị
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(orderDetails.updatedAt).toLocaleString('vi-VN')}
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    )}
                                </Timeline>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Chi tiết thuốc/chỉ định */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocalHospital sx={{ mr: 1 }} />
                                    Chi tiết thuốc/chỉ định y tế
                                </Typography>

                                {orderDetails.medicalOrderDetails && orderDetails.medicalOrderDetails.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Tên thuốc/Chỉ định</TableCell>
                                                    <TableCell align="center">Số lượng ban đầu</TableCell>
                                                    <TableCell align="center">Số lượng còn lại</TableCell>
                                                    <TableCell align="center">Đơn vị</TableCell>
                                                    <TableCell>Ghi chú</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderDetails.medicalOrderDetails.map((detail, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{detail.medicineName}</TableCell>
                                                        <TableCell align="center">{detail.originalQuantity || detail.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={detail.quantity}
                                                                color={detail.quantity > 0 ? "success" : "default"}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">{detail.unit}</TableCell>
                                                        <TableCell>{detail.note || '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Alert severity="info">
                                        Chưa có thông tin chi tiết về thuốc/chỉ định y tế
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Lịch sử sử dụng thuốc */}
                    {records.length > 0 && (
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Lịch sử sử dụng thuốc
                                    </Typography>
                                    {records.map((record, index) => (
                                        <Card key={record._id} variant="outlined" sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Lần sử dụng #{index + 1} - {new Date(record.createdAt).toLocaleString('vi-VN')}
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {record.items?.map((item, itemIndex) => (
                                                        <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                                                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Số lượng: {item.quantity}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} variant="outlined">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MedicalOrderDetailModal;
