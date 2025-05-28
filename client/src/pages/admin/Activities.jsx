import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUser,
    FaSignInAlt,
    FaSignOutAlt,
    FaPills,
    FaCheck,
    FaClipboard,
    FaSyringe,
    FaExclamationTriangle,
    FaFileExport,
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaEye,
    FaTrash,
    FaDownload,
    FaClock,
    FaUserShield,
    FaDesktop,
    FaMobile
} from 'react-icons/fa';

function AdminActivities() {
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState('today');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const activitiesPerPage = 10;

    // Sample activities data with Vietnamese content
    const [activities] = useState([
        {
            id: 1,
            type: 'user_login',
            user: 'Nguyễn Thị Lan',
            userRole: 'Y tá',
            description: 'Người dùng đăng nhập vào hệ thống',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            ipAddress: '192.168.1.101',
            severity: 'info',
            details: { browser: 'Chrome 120.0', device: 'Desktop' }
        },
        {
            id: 2,
            type: 'medication_request',
            user: 'Trần Văn Minh',
            userRole: 'Phụ huynh',
            description: 'Gửi yêu cầu cấp thuốc cho học sinh Trần Minh Tuấn',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            ipAddress: '192.168.1.102',
            severity: 'medium',
            details: { medication: 'Thuốc xịt hen suyễn', student: 'Trần Minh Tuấn', class: '8B' }
        },
        {
            id: 3,
            type: 'security_alert',
            user: 'Hệ thống',
            userRole: 'System',
            description: 'Phát hiện nhiều lần đăng nhập thất bại',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            ipAddress: '192.168.1.203',
            severity: 'high',
            details: { attempts: 5, account: 'admin@truong.edu.vn', blocked: true }
        },
        {
            id: 4,
            type: 'health_record_update',
            user: 'BS. Lê Văn Cường',
            userRole: 'Bác sĩ',
            description: 'Cập nhật hồ sơ sức khỏe của học sinh',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            ipAddress: '192.168.1.104',
            severity: 'info',
            details: { student: 'Phạm Thị Hương', record_type: 'Khám định kỳ', status: 'Hoàn thành' }
        },
        {
            id: 5,
            type: 'vaccination_scheduled',
            user: 'Nguyễn Văn Đức',
            userRole: 'Quản lý',
            description: 'Lên lịch tiêm chủng cho học sinh lớp 8',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            ipAddress: '192.168.1.105',
            severity: 'medium',
            details: { vaccine: 'HPV', target_class: 'Lớp 8', scheduled_date: '2024-01-25', students_count: 45 }
        },
        {
            id: 6,
            type: 'data_export',
            user: 'Phạm Thị Mai',
            userRole: 'Quản trị viên',
            description: 'Xuất báo cáo dữ liệu hệ thống',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            ipAddress: '192.168.1.106',
            severity: 'info',
            details: { report_type: 'Báo cáo sức khỏe tháng', format: 'Excel', records_count: 1250 }
        },
        {
            id: 7,
            type: 'user_logout',
            user: 'Hoàng Văn An',
            userRole: 'Y tá',
            description: 'Người dùng đăng xuất khỏi hệ thống',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            ipAddress: '192.168.1.107',
            severity: 'info',
            details: { session_duration: '2h 15m', auto_logout: false }
        },
        {
            id: 8,
            type: 'medication_approval',
            user: 'BS. Nguyễn Thị Bình',
            userRole: 'Bác sĩ',
            description: 'Phê duyệt yêu cầu cấp thuốc',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            ipAddress: '192.168.1.108',
            severity: 'medium',
            details: { medication: 'Kháng sinh Amoxicillin', student: 'Lê Minh An', approved: true }
        }
    ]);

    // Filter activities based on criteria
    const filteredActivities = activities.filter(activity => {
        const matchesFilter = filter === 'all' || activity.type === filter;
        const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDateRange = true; // Simplified for this example
        return matchesFilter && matchesSearch && matchesDateRange;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activitiesPerPage);

    // Get summary counts
    const summary = {
        total: activities.length,
        high: activities.filter(a => a.severity === 'high').length,
        medium: activities.filter(a => a.severity === 'medium').length,
        today: activities.filter(a => {
            const today = new Date();
            const activityDate = new Date(a.timestamp);
            return activityDate.toDateString() === today.toDateString();
        }).length
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
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        searchInput: {
            padding: '12px 16px 12px 40px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            width: '300px',
            transition: 'border-color 0.2s',
            outline: 'none'
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
        activityItem: {
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        activityHeader: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px'
        },
        activityInfo: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            flex: 1
        },
        typeIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px'
        },
        activityContent: {
            flex: 1
        },
        activityTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px'
        },
        activityDescription: {
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '12px'
        },
        activityMeta: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: '#9ca3af'
        },
        severityBadge: {
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
        },
        severityHigh: {
            background: '#fee2e2',
            color: '#991b1b'
        },
        severityMedium: {
            background: '#fef3c7',
            color: '#92400e'
        },
        severityInfo: {
            background: '#dbeafe',
            color: '#1e40af'
        },
        detailsContainer: {
            marginTop: '12px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '8px',
            fontSize: '12px'
        },
        detailsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px'
        },
        detailItem: {
            color: '#6b7280'
        },
        detailLabel: {
            fontWeight: '600',
            color: '#374151'
        },
        actionButtons: {
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
        },
        actionButton: {
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            background: '#f3f4f6',
            color: '#6b7280',
            cursor: 'pointer',
            transition: 'background-color 0.2s, color 0.2s'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '24px'
        },
        pageButton: {
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            background: 'white',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px'
        },
        pageButtonActive: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: '1px solid #667eea'
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
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'user_login':
                return <FaSignInAlt />;
            case 'user_logout':
                return <FaSignOutAlt />;
            case 'medication_request':
                return <FaPills />;
            case 'medication_approval':
                return <FaCheck />;
            case 'health_record_update':
                return <FaClipboard />;
            case 'vaccination_scheduled':
                return <FaSyringe />;
            case 'security_alert':
                return <FaExclamationTriangle />;
            case 'data_export':
                return <FaFileExport />;
            default:
                return <FaUser />;
        }
    };

    const getTypeIconColor = (type) => {
        switch (type) {
            case 'user_login':
            case 'user_logout':
                return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            case 'medication_request':
            case 'medication_approval':
                return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
            case 'health_record_update':
                return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
            case 'vaccination_scheduled':
                return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
            case 'security_alert':
                return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            case 'data_export':
                return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            default:
                return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
        }
    };

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'high':
                return { ...styles.severityBadge, ...styles.severityHigh };
            case 'medium':
                return { ...styles.severityBadge, ...styles.severityMedium };
            case 'info':
                return { ...styles.severityBadge, ...styles.severityInfo };
            default:
                return styles.severityBadge;
        }
    };

    const getSeverityText = (severity) => {
        switch (severity) {
            case 'high':
                return 'Cao';
            case 'medium':
                return 'Trung bình';
            case 'info':
                return 'Thông tin';
            default:
                return severity;
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);

        if (diff < 60 * 1000) return 'Vừa xong';
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} phút trước`;
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} giờ trước`;
        return new Date(timestamp).toLocaleDateString('vi-VN');
    };

    const handleSelectActivity = (activityId) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    const formatDetailKey = (key) => {
        const keyMap = {
            browser: 'Trình duyệt',
            device: 'Thiết bị',
            medication: 'Thuốc',
            student: 'Học sinh',
            class: 'Lớp',
            attempts: 'Số lần thử',
            account: 'Tài khoản',
            blocked: 'Đã chặn',
            record_type: 'Loại hồ sơ',
            status: 'Trạng thái',
            vaccine: 'Vắc xin',
            target_class: 'Lớp đích',
            scheduled_date: 'Ngày lên lịch',
            students_count: 'Số học sinh',
            report_type: 'Loại báo cáo',
            format: 'Định dạng',
            records_count: 'Số bản ghi',
            session_duration: 'Thời gian phiên',
            auto_logout: 'Tự động đăng xuất',
            approved: 'Đã phê duyệt'
        };
        return keyMap[key] || key;
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Nhật ký Hoạt động</h1>
                <p style={styles.subtitle}>Theo dõi và giám sát tất cả các hoạt động trong hệ thống chăm sóc y tế học đường</p>
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <FaClipboard />
                    </div>
                    <div style={styles.statNumber}>{summary.total}</div>
                    <div style={styles.statLabel}>Tổng hoạt động</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                        <FaExclamationTriangle />
                    </div>
                    <div style={styles.statNumber}>{summary.high}</div>
                    <div style={styles.statLabel}>Mức độ cao</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <FaClock />
                    </div>
                    <div style={styles.statNumber}>{summary.today}</div>
                    <div style={styles.statLabel}>Hôm nay</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <FaUserShield />
                    </div>
                    <div style={styles.statNumber}>{summary.medium}</div>
                    <div style={styles.statLabel}>Mức độ trung bình</div>
                </div>
            </div>

            {/* Controls */}
            <div style={styles.card}>
                <div style={styles.controlsContainer}>
                    <div style={styles.filtersContainer}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                fontSize: '14px'
                            }} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo người dùng hoặc mô tả..."
                                style={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        {/* Type Filter */}
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
                                <option value="user_login">Đăng nhập</option>
                                <option value="user_logout">Đăng xuất</option>
                                <option value="medication_request">Yêu cầu thuốc</option>
                                <option value="medication_approval">Phê duyệt thuốc</option>
                                <option value="health_record_update">Cập nhật hồ sơ</option>
                                <option value="vaccination_scheduled">Lên lịch tiêm</option>
                                <option value="security_alert">Cảnh báo bảo mật</option>
                                <option value="data_export">Xuất dữ liệu</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendarAlt style={{ color: '#6b7280' }} />
                            <select
                                style={styles.select}
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            >
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                                <option value="all">Tất cả</option>
                            </select>
                        </div>
                    </div>

                    {selectedActivities.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                Đã chọn {selectedActivities.length} hoạt động
                            </span>
                            <button style={styles.actionButton}>
                                <FaDownload />
                            </button>
                            <button style={styles.actionButton}>
                                <FaTrash />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Activities List */}
            <div style={styles.card}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
                    Hoạt động gần đây ({filteredActivities.length})
                </h2>

                {paginatedActivities.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            <FaClipboard />
                        </div>
                        <h3 style={styles.emptyTitle}>Không có hoạt động nào</h3>
                        <p>Không có hoạt động nào phù hợp với bộ lọc hiện tại.</p>
                    </div>
                ) : (
                    <>
                        {paginatedActivities.map(activity => (
                            <div key={activity.id}
                                style={styles.activityItem}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                }}>
                                <div style={styles.activityHeader}>
                                    <div style={styles.activityInfo}>
                                        <div style={{
                                            ...styles.typeIcon,
                                            background: getTypeIconColor(activity.type)
                                        }}>
                                            {getTypeIcon(activity.type)}
                                        </div>

                                        <div style={styles.activityContent}>
                                            <div style={styles.activityTitle}>
                                                {activity.user} - {activity.userRole}
                                            </div>
                                            <div style={styles.activityDescription}>
                                                {activity.description}
                                            </div>
                                            <div style={styles.activityMeta}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaClock />
                                                    {formatTimestamp(activity.timestamp)}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaUserShield />
                                                    {activity.ipAddress}
                                                </span>
                                                <span style={getSeverityStyle(activity.severity)}>
                                                    {getSeverityText(activity.severity)}
                                                </span>
                                            </div>

                                            {activity.details && (
                                                <div style={styles.detailsContainer}>
                                                    <div style={styles.detailsGrid}>
                                                        {Object.entries(activity.details).map(([key, value]) => (
                                                            <div key={key} style={styles.detailItem}>
                                                                <span style={styles.detailLabel}>{formatDetailKey(key)}:</span>{' '}
                                                                {typeof value === 'boolean' ? (value ? 'Có' : 'Không') : value}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={styles.actionButtons}>
                                        <button
                                            style={styles.actionButton}
                                            onClick={() => handleSelectActivity(activity.id)}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = selectedActivities.includes(activity.id) ? '#dbeafe' : '#f3f4f6';
                                                e.target.style.color = '#374151';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = selectedActivities.includes(activity.id) ? '#dbeafe' : '#f3f4f6';
                                                e.target.style.color = '#6b7280';
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedActivities.includes(activity.id)}
                                                onChange={() => { }}
                                                style={{ pointerEvents: 'none' }}
                                            />
                                        </button>
                                        <button
                                            style={styles.actionButton}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#dbeafe';
                                                e.target.style.color = '#2563eb';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                                e.target.style.color = '#6b7280';
                                            }}
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={styles.pagination}>
                                <button
                                    style={styles.pageButton}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Trước
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        style={currentPage === page ?
                                            { ...styles.pageButton, ...styles.pageButtonActive } :
                                            styles.pageButton}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    style={styles.pageButton}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminActivities;
