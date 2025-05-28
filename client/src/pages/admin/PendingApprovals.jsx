import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaCheck, 
    FaTimes, 
    FaInfoCircle, 
    FaPills, 
    FaSyringe, 
    FaUserPlus, 
    FaStethoscope,
    FaFilter,
    FaSort,
    FaClock,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';

function PendingApprovals() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [showModal, setShowModal] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [actionType, setActionType] = useState('');
    const [message, setMessage] = useState('');    // Sample pending approvals data phù hợp với trường tiểu học
    const [approvals, setApprovals] = useState([
        {
            id: 1,
            type: 'medication',
            title: 'Yêu cầu thuốc - Paracetamol trẻ em',
            student: 'Nguyễn Minh An',
            class: '1A',
            requestedBy: 'Chị Nguyễn Thị Hoa (Mẹ)',
            date: '2025-05-29',
            urgency: 'high',
            details: {
                medication: 'Paracetamol trẻ em 120mg',
                dosage: '1/2 viên khi sốt, tối đa 3 lần/ngày',
                duration: '3-5 ngày',
                condition: 'Sốt nhẹ, viêm họng',
                prescribedBy: 'BS. Trần Thị Mai',
                allergies: 'Không có dị ứng đã biết',
                parentNote: 'Con hay bị sốt khi thời tiết thay đổi'
            }
        },
        {
            id: 2,
            type: 'vaccination',
            title: 'Đồng ý tiêm chủng - Sởi Rubella',
            student: 'Lê Thị Hoa',
            class: '2B',
            requestedBy: 'Anh Lê Văn Nam (Bố)',
            date: '2025-05-28',
            urgency: 'medium',
            details: {
                vaccine: 'Sởi - Rubella (MR)',
                campaign: 'Chương trình tiêm chủng mở rộng',
                scheduledDate: '2025-06-05',
                location: 'Phòng y tế trường',
                notes: 'Mũi tiêm nhắc lại theo lịch',
                ageAppropriate: '7-8 tuổi'
            }
        },
        {
            id: 3,
            type: 'healthcheck',
            title: 'Đồng ý khám sức khỏe - Khám đầu năm học',
            student: 'Trần Văn Nam',
            class: '3A',
            requestedBy: 'Chị Trần Thị Lan (Mẹ)',
            date: '2025-05-27',
            urgency: 'low',
            details: {
                checkType: 'Khám sức khỏe đầu năm học',
                scheduledDate: '2025-06-10',
                examiner: 'Cô Nguyễn Thị Thu - Y tá trường',
                includesVision: true,
                includesHearing: true,
                includesWeightHeight: true,
                includesDental: true,
                specialNote: 'Kiểm tra thị lực vì em hay nheo mắt'
            }
        },
        {
            id: 4,
            type: 'user',
            title: 'Đăng ký tài khoản phụ huynh mới',
            student: 'Phạm Thị Mai',
            class: '4B',
            requestedBy: 'Phạm Văn Đức',
            date: '2025-05-26',
            urgency: 'medium',
            details: {
                accountType: 'Phụ huynh',
                email: 'pham.duc@email.com',
                relationship: 'Bố',
                emergencyContact: true,
                documentsSubmitted: ['Bản sao CCCD', 'Giấy khai sinh con'],
                backgroundCheckStatus: 'Đã hoàn thành',
                reason: 'Chuyển trường từ tỉnh khác'
            }
        },
        {
            id: 5,
            type: 'medication',
            title: 'Yêu cầu thuốc - Ventolin xịt',
            student: 'Hoàng Văn Đức',
            class: '5A',
            requestedBy: 'Chị Hoàng Thị Linh (Mẹ)',
            date: '2025-05-25',
            urgency: 'high',
            details: {
                medication: 'Ventolin HFA 100mcg/liều',
                dosage: '1-2 liều khi khó thở',
                duration: 'Sử dụng dài hạn',
                condition: 'Hen suyễn nhẹ',
                prescribedBy: 'BS. Lê Văn Minh - Bệnh viện Nhi',
                allergies: 'Không có',
                emergencyUse: true,
                parentNote: 'Con cần có thuốc sẵn tại trường để phòng ngừa cơn hen'
            }        }
    ]);

    // Filter approvals based on selected filter
    const filteredApprovals = approvals.filter(approval => {
        if (filter === 'all') return true;
        return approval.type === filter;
    });

    // Sort approvals
    const sortedApprovals = [...filteredApprovals].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'urgency':
                const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
            case 'type':
                return a.type.localeCompare(b.type);
            default:
                return 0;
        }
    });

    // Get summary counts
    const summary = {
        total: approvals.length,
        high: approvals.filter(a => a.urgency === 'high').length,
        medication: approvals.filter(a => a.type === 'medication').length,
        newAccounts: approvals.filter(a => a.type === 'user').length
    };

    const styles = {
        container: {
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        },
        header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        subtitle: {
            fontSize: '16px',
            opacity: 0.9
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
        },
        statCard: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        statIcon: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontSize: '20px'
        },
        statNumber: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#6b7280'
        },
        card: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.8)'
        },
        controlsContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        filtersContainer: {
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
        },
        select: {
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '150px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none'
        },
        approvalItem: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        approvalHeader: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px'
        },
        approvalInfo: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            flex: 1
        },
        typeIcon: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px'
        },
        approvalTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
        },
        urgencyBadge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            marginLeft: '12px'
        },
        urgencyHigh: {
            background: '#fee2e2',
            color: '#991b1b'
        },
        urgencyMedium: {
            background: '#fef3c7',
            color: '#92400e'
        },
        urgencyLow: {
            background: '#dcfce7',
            color: '#166534'
        },
        infoGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#6b7280'
        },
        infoItem: {
            display: 'flex',
            flexDirection: 'column'
        },
        infoLabel: {
            fontWeight: '600',
            color: '#374151',
            marginBottom: '2px'
        },
        detailsContainer: {
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
        },
        detailsTitle: {
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px',
            fontSize: '14px'
        },
        detailsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px',
            fontSize: '13px'
        },
        detailItem: {
            color: '#6b7280'
        },
        detailLabel: {
            fontWeight: '600',
            color: '#374151'
        },
        actionsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginLeft: '16px'
        },
        actionButton: {
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            minWidth: '120px'
        },
        approveButton: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        },
        denyButton: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        },
        infoButton: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        },
        emptyState: {
            textAlign: 'center',
            padding: '48px 24px',
            color: '#6b7280'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '16px',
            color: '#d1d5db'
        },
        emptyTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
        },
        modal: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        },
        modalContent: {
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        },
        modalTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px'
        },
        modalText: {
            color: '#6b7280',
            marginBottom: '16px',
            lineHeight: '1.5'
        },
        modalHighlight: {
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            border: '1px solid #e5e7eb'
        },
        modalHighlightTitle: {
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px'
        },
        modalHighlightText: {
            fontSize: '14px',
            color: '#6b7280'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical',
            minHeight: '80px',
            outline: 'none'
        },
        modalActions: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px'
        },
        buttonCancel: {
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'medication':
                return <FaPills />;
            case 'vaccination':
                return <FaSyringe />;
            case 'healthcheck':
                return <FaStethoscope />;
            case 'user':
                return <FaUserPlus />;
            default:
                return <FaInfoCircle />;
        }
    };

    const getTypeIconColor = (type) => {
        switch (type) {
            case 'medication':
                return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            case 'vaccination':
                return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            case 'healthcheck':
                return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
            case 'user':
                return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            default:
                return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        }
    };

    const getUrgencyStyle = (urgency) => {
        switch (urgency) {
            case 'high':
                return { ...styles.urgencyBadge, ...styles.urgencyHigh };
            case 'medium':
                return { ...styles.urgencyBadge, ...styles.urgencyMedium };
            case 'low':
                return { ...styles.urgencyBadge, ...styles.urgencyLow };
            default:
                return styles.urgencyBadge;
        }
    };

    const getUrgencyText = (urgency) => {
        switch (urgency) {
            case 'high':
                return 'Ưu tiên cao';
            case 'medium':
                return 'Ưu tiên trung bình';
            case 'low':
                return 'Ưu tiên thấp';
            default:
                return urgency;
        }
    };

    const handleAction = (approval, action) => {
        setSelectedApproval(approval);
        setActionType(action);
        setShowModal(true);
        setMessage('');
    };

    const confirmAction = () => {
        // In a real app, this would make an API call
        console.log(`${actionType} approval for:`, selectedApproval);

        // Remove from pending list (simulate approval/denial)
        if (actionType === 'approve' || actionType === 'deny') {
            setApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));
        }

        setShowModal(false);
        setSelectedApproval(null);
        setActionType('');
        setMessage('');
    };

    const formatDetailKey = (key) => {
        const keyMap = {
            medication: 'Thuốc',
            dosage: 'Liều dùng',
            duration: 'Thời gian',
            condition: 'Tình trạng',
            prescribedBy: 'Được kê bởi',
            allergies: 'Dị ứng',
            vaccine: 'Vắc xin',
            campaign: 'Chiến dịch',
            scheduledDate: 'Ngày đã lên lịch',
            location: 'Địa điểm',
            notes: 'Ghi chú',
            checkType: 'Loại khám',
            examiner: 'Người khám',
            includesVision: 'Khám mắt',
            includesHearing: 'Khám tai',
            includesWeightHeight: 'Đo chiều cao cân nặng',
            accountType: 'Loại tài khoản',
            email: 'Email',
            relationship: 'Mối quan hệ',
            emergencyContact: 'Liên hệ khẩn cấp',
            documentsSubmitted: 'Tài liệu đã nộp',
            backgroundCheckStatus: 'Trạng thái kiểm tra lý lịch',
            emergencyOnly: 'Chỉ khi khẩn cấp',
            trainingRequired: 'Yêu cầu đào tạo',
            expiryDate: 'Ngày hết hạn',
            storageInstructions: 'Hướng dẫn bảo quản'
        };
        return keyMap[key] || key;
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Duyệt yêu cầu</h1>
                <p style={styles.subtitle}>Xử lý các yêu cầu chờ phê duyệt trong hệ thống chăm sóc y tế học đường</p>
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                        <FaClock />
                    </div>
                    <div style={styles.statNumber}>{summary.total}</div>
                    <div style={styles.statLabel}>Tổng yêu cầu chờ</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
                        <FaExclamationTriangle />
                    </div>
                    <div style={styles.statNumber}>{summary.high}</div>
                    <div style={styles.statLabel}>Ưu tiên cao</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
                        <FaPills />
                    </div>
                    <div style={styles.statNumber}>{summary.medication}</div>
                    <div style={styles.statLabel}>Yêu cầu thuốc</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                        <FaUserPlus />
                    </div>
                    <div style={styles.statNumber}>{summary.newAccounts}</div>
                    <div style={styles.statLabel}>Tài khoản mới</div>
                </div>
            </div>

            {/* Controls */}
            <div style={styles.card}>
                <div style={styles.controlsContainer}>
                    <div style={styles.filtersContainer}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaFilter style={{ color: '#6b7280' }} />
                            <select
                                style={styles.select}
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="all">Tất cả loại</option>
                                <option value="medication">Yêu cầu thuốc</option>
                                <option value="vaccination">Tiêm chủng</option>
                                <option value="healthcheck">Khám sức khỏe</option>
                                <option value="user">Tài khoản người dùng</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaSort style={{ color: '#6b7280' }} />
                            <select
                                style={styles.select}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="date">Ngày mới nhất</option>
                                <option value="urgency">Độ ưu tiên (Cao đến thấp)</option>
                                <option value="type">Loại (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approvals List */}
            <div style={styles.card}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
                    Danh sách yêu cầu ({sortedApprovals.length})
                </h2>

                {sortedApprovals.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            <FaInfoCircle />
                        </div>
                        <h3 style={styles.emptyTitle}>Không có yêu cầu chờ duyệt</h3>
                        <p>Không có yêu cầu nào phù hợp với bộ lọc hiện tại.</p>
                    </div>
                ) : (
                    sortedApprovals.map(approval => (
                        <div key={approval.id} 
                             style={styles.approvalItem}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'translateY(-2px)';
                                 e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'translateY(0)';
                                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                             }}>
                            <div style={styles.approvalHeader}>
                                <div style={styles.approvalInfo}>
                                    <div style={{
                                        ...styles.typeIcon,
                                        background: getTypeIconColor(approval.type)
                                    }}>
                                        {getTypeIcon(approval.type)}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                            <h3 style={styles.approvalTitle}>{approval.title}</h3>
                                            <span style={getUrgencyStyle(approval.urgency)}>
                                                {getUrgencyText(approval.urgency)}
                                            </span>
                                        </div>

                                        <div style={styles.infoGrid}>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>Học sinh:</span>
                                                <span>{approval.student} {approval.class && `(${approval.class})`}</span>
                                            </div>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>Người yêu cầu:</span>
                                                <span>{approval.requestedBy}</span>
                                            </div>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>Ngày:</span>
                                                <span>{new Date(approval.date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>

                                        <div style={styles.detailsContainer}>
                                            <h4 style={styles.detailsTitle}>Chi tiết:</h4>
                                            <div style={styles.detailsGrid}>
                                                {Object.entries(approval.details).map(([key, value]) => (
                                                    <div key={key} style={styles.detailItem}>
                                                        <span style={styles.detailLabel}>{formatDetailKey(key)}:</span>{' '}
                                                        {typeof value === 'boolean' ? (value ? 'Có' : 'Không') :
                                                         Array.isArray(value) ? value.join(', ') : value}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.actionsContainer}>
                                    <button
                                        style={{...styles.actionButton, ...styles.approveButton}}
                                        onClick={() => handleAction(approval, 'approve')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                                        }}
                                    >
                                        <FaCheckCircle />
                                        Phê duyệt
                                    </button>
                                    <button
                                        style={{...styles.actionButton, ...styles.denyButton}}
                                        onClick={() => handleAction(approval, 'deny')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                        }}
                                    >
                                        <FaTimesCircle />
                                        Từ chối
                                    </button>
                                    <button
                                        style={{...styles.actionButton, ...styles.infoButton}}
                                        onClick={() => handleAction(approval, 'moreInfo')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                        }}
                                    >
                                        <FaInfoCircle />
                                        Yêu cầu thông tin
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Action Modal */}
            {showModal && selectedApproval && (
                <div style={styles.modal} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>
                            {actionType === 'approve' && 'Xác nhận phê duyệt'}
                            {actionType === 'deny' && 'Xác nhận từ chối'}
                            {actionType === 'moreInfo' && 'Yêu cầu thông tin bổ sung'}
                        </h3>

                        <p style={styles.modalText}>
                            {actionType === 'moreInfo' 
                                ? 'Bạn có chắc chắn muốn yêu cầu thông tin bổ sung cho yêu cầu này?'
                                : `Bạn có chắc chắn muốn ${actionType === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu này?`}
                        </p>

                        <div style={styles.modalHighlight}>
                            <p style={styles.modalHighlightTitle}>{selectedApproval.title}</p>
                            <p style={styles.modalHighlightText}>Học sinh: {selectedApproval.student}</p>
                        </div>

                        {actionType === 'moreInfo' && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={styles.label}>
                                    Tin nhắn (tùy chọn):
                                </label>
                                <textarea
                                    style={styles.textarea}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Chỉ rõ thông tin bổ sung cần thiết..."
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                        )}

                        <div style={styles.modalActions}>
                            <button
                                style={styles.buttonCancel}
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                style={{
                                    ...styles.actionButton,
                                    ...(actionType === 'approve' ? styles.approveButton :
                                        actionType === 'deny' ? styles.denyButton : styles.infoButton)
                                }}
                                onClick={confirmAction}
                            >
                                {actionType === 'moreInfo' ? 'Gửi yêu cầu' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingApprovals;
