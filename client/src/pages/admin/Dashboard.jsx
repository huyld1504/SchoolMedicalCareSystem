import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function AdminDashboard() {
    const { currentUser } = useAuth();    // Dữ liệu thống kê mẫu
    const [stats, setStats] = useState({
        totalUsers: 376,
        activeUsers: 340,
        pendingApprovals: 12,
        securityAlerts: 3
    });

    // Hoạt động gần đây của người dùng
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: "medication_request",
            user: "Sarah Johnson",
            userRole: "Y tá",
            action: "Cập nhật kho thuốc",
            description: "Thêm 50 viên Ibuprofen vào kho",
            time: "10 phút trước",
            timestamp: "2025-05-25 14:30:00",
            ipAddress: "192.168.1.101",
            severity: "info"
        },
        {
            id: 2,
            type: "health_report",
            user: "Robert Lee",
            userRole: "Quản lý",
            action: "Tạo báo cáo sức khỏe hàng tháng",
            description: "Tạo báo cáo sức khỏe tổng hợp tháng 5/2025",
            time: "1 giờ trước",
            timestamp: "2025-05-25 13:15:00",
            ipAddress: "192.168.1.102",
            severity: "info"
        },
        {
            id: 3,
            type: "user_registration",
            user: "Mary Williams",
            userRole: "Quản trị viên",
            action: "Thêm tài khoản người dùng mới",
            description: "Tạo tài khoản phụ huynh cho Jennifer Davis",
            time: "3 giờ trước",
            timestamp: "2025-05-25 11:20:00",
            ipAddress: "192.168.1.100",
            severity: "success"
        },
        {
            id: 4,
            type: "medication_request",
            user: "James Brown",
            userRole: "Phụ huynh",
            action: "Gửi yêu cầu thuốc",
            description: "Yêu cầu cung cấp Albuterol hàng ngày cho con",
            time: "Hôm qua",
            timestamp: "2025-05-24 16:45:00",
            ipAddress: "10.0.0.15",
            severity: "warning"
        },
        {
            id: 5,
            type: "system_backup",
            user: "Hệ thống",
            userRole: "Hệ thống",
            action: "Hoàn tất sao lưu cơ sở dữ liệu",
            description: "Sao lưu tự động hàng ngày hoàn tất thành công",
            time: "Hôm qua",
            timestamp: "2025-05-24 02:00:00",
            ipAddress: "127.0.0.1",
            severity: "success"
        }
    ]);

    // Helper function to get activity icon
    const getActivityIcon = (type) => {
        const icons = {
            'user_login': '🔐',
            'user_logout': '🚪',
            'user_registration': '👤',
            'medication_request': '💊',
            'medication_approval': '✅',
            'health_record_update': '📋',
            'vaccination_record': '💉',
            'system_backup': '💾',
            'health_report': '📊'
        };
        return icons[type] || '📝';
    };

    return (
        <div style={{
            background: '#f8fafc',
            minHeight: '100vh',
            padding: '20px'
        }}>
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                color: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    margin: 0
                }}>
                    Bảng điều khiển Quản trị viên
                </h1>
                <p style={{
                    fontSize: '16px',
                    opacity: '0.9',
                    margin: 0
                }}>
                    Chào mừng trở lại, {currentUser?.name || "Quản trị viên"}. Đây là tổng quan hệ thống y tế trường học.
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Tổng người dùng</p>
                            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{stats.totalUsers}</p>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            👥
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Người dùng hoạt động</p>
                            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{stats.activeUsers}</p>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            ✅
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Chờ phê duyệt</p>
                            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{stats.pendingApprovals}</p>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            ⏳
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 4px 0' }}>Cảnh báo bảo mật</p>
                            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{stats.securityAlerts}</p>
                        </div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px'
                        }}>
                            🚨
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '20px'
                }}>
                    Truy cập nhanh
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                }}>
                    <Link to="/admin/users" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f1f5f9',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontSize: '16px'
                        }}>
                            👥
                        </div>
                        <span style={{ color: '#1e293b', fontWeight: '500' }}>Quản lý người dùng</span>
                    </Link>

                    <Link to="/admin/pending-approvals" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#fef3c7',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        border: '1px solid #f59e0b'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontSize: '16px'
                        }}>
                            ✅
                        </div>
                        <span style={{ color: '#92400e', fontWeight: '500' }}>Phê duyệt yêu cầu</span>
                    </Link>

                    <Link to="/admin/vaccination-scheduler" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#dcfce7',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        border: '1px solid #10b981'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontSize: '16px'
                        }}>
                            💉
                        </div>
                        <span style={{ color: '#166534', fontWeight: '500' }}>Lịch tiêm chủng</span>
                    </Link>

                    <Link to="/admin/reports" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f3e8ff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        border: '1px solid #a855f7'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontSize: '16px'
                        }}>
                            📊
                        </div>
                        <span style={{ color: '#7c3aed', fontWeight: '500' }}>Xem báo cáo</span>
                    </Link>
                </div>
            </div>            {/* Recent Activities Section */}
            <div style={{ marginBottom: '32px' }}>
                {/* Recent Activities */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '20px'
                    }}>
                        Hoạt động gần đây
                    </h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {recentActivities.slice(0, 5).map(activity => (
                            <div key={activity.id} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                padding: '12px 0',
                                borderBottom: '1px solid #f1f5f9'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    marginRight: '12px',
                                    flexShrink: 0
                                }}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontWeight: '500',
                                                color: '#1e293b',
                                                fontSize: '14px'
                                            }}>
                                                {activity.user}
                                            </span>
                                            <span style={{
                                                fontSize: '12px',
                                                color: '#64748b'
                                            }}>
                                                ({activity.userRole})
                                            </span>
                                        </div>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#94a3b8'
                                        }}>
                                            {activity.time}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '13px',
                                        color: '#64748b',
                                        margin: '0 0 4px 0',
                                        lineHeight: '1.4'
                                    }}>
                                        {activity.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span style={{
                                            fontSize: '11px',
                                            color: '#94a3b8'
                                        }}>
                                            IP: {activity.ipAddress}
                                        </span>
                                        <span style={{
                                            fontSize: '10px',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: activity.severity === 'success' ? '#dcfce7' :
                                                activity.severity === 'warning' ? '#fef3c7' :
                                                    activity.severity === 'error' ? '#fee2e2' : '#e0e7ff',
                                            color: activity.severity === 'success' ? '#166534' :
                                                activity.severity === 'warning' ? '#92400e' :
                                                    activity.severity === 'error' ? '#991b1b' : '#3730a3'
                                        }}>
                                            {activity.severity}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <Link to="/admin/activities" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Xem tất cả hoạt động
                            <span style={{ marginLeft: '4px' }}>→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Reports Dashboard */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '20px'
                }}>
                    Bảng điều khiển Báo cáo
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px'
                }}>
                    {/* Report Statistics */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            📊 Thống kê báo cáo
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Báo cáo tình trạng sức khỏe</span>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>24</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Báo cáo thuốc</span>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>42</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Báo cáo tiêm chủng</span>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>18</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Báo cáo sự cố</span>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>7</span>
                            </div>
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                                <Link to="/admin/reports" style={{
                                    color: '#3b82f6',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    Xem tất cả báo cáo
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            📋 Báo cáo gần đây
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{
                                padding: '8px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Link to="/admin/reports/health-status/latest" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}>
                                    <span style={{ color: '#1e293b', fontSize: '14px' }}>Tổng quan sức khỏe hàng tháng</span>
                                    <span style={{ color: '#64748b', fontSize: '12px' }}>20/05/2025</span>
                                </Link>
                            </div>
                            <div style={{
                                padding: '8px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Link to="/admin/reports/medication/latest" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}>
                                    <span style={{ color: '#1e293b', fontSize: '14px' }}>Báo cáo sử dụng thuốc</span>
                                    <span style={{ color: '#64748b', fontSize: '12px' }}>15/05/2025</span>
                                </Link>
                            </div>
                            <div style={{
                                padding: '8px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Link to="/admin/reports/vaccination/latest" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}>
                                    <span style={{ color: '#1e293b', fontSize: '14px' }}>Tuân thủ tiêm chủng</span>
                                    <span style={{ color: '#64748b', fontSize: '12px' }}>10/05/2025</span>
                                </Link>
                            </div>
                            <div style={{
                                padding: '8px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <Link to="/admin/reports/incidents" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}>
                                    <span style={{ color: '#1e293b', fontSize: '14px' }}>Báo cáo sự cố</span>
                                    <span style={{ color: '#64748b', fontSize: '12px' }}>18/05/2025</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Generation */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '20px'
                }}>
                    Tạo báo cáo
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px'
                }}>
                    {/* New Report Generation */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '16px'
                        }}>
                            Tạo báo cáo mới
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '4px'
                                }}>
                                    Loại báo cáo
                                </label>
                                <select style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    background: 'white'
                                }}>
                                    <option value="">Chọn loại báo cáo</option>
                                    <option value="health-status">Báo cáo tình trạng sức khỏe</option>
                                    <option value="medication">Báo cáo thuốc</option>
                                    <option value="vaccination">Báo cáo tiêm chủng</option>
                                    <option value="incident">Báo cáo sự cố</option>
                                    <option value="activity">Báo cáo hoạt động</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '4px'
                                    }}>
                                        Ngày bắt đầu
                                    </label>
                                    <input type="date" style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }} />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '4px'
                                    }}>
                                        Ngày kết thúc
                                    </label>
                                    <input type="date" style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '14px'
                                    }} />
                                </div>
                            </div>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '4px'
                                }}>
                                    Định dạng
                                </label>
                                <select style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    background: 'white'
                                }}>
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                            <button style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onClick={() => alert("Chức năng tạo báo cáo sẽ được triển khai")}
                            >
                                Tạo báo cáo
                            </button>
                        </div>
                    </div>

                    {/* Scheduled Reports */}
                    <div style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '16px'
                        }}>
                            Báo cáo được lên lịch
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div>
                                    <h5 style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        margin: '0 0 4px 0'
                                    }}>
                                        Tổng quan sức khỏe hàng tháng
                                    </h5>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#64748b',
                                        margin: 0
                                    }}>
                                        Tạo vào ngày 1 hàng tháng
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '6px',
                                        background: '#dbeafe',
                                        color: '#1d4ed8',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}>
                                        ✏️
                                    </button>
                                    <button style={{
                                        padding: '6px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px',
                                background: 'white',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div>
                                    <h5 style={{
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        margin: '0 0 4px 0'
                                    }}>
                                        Tuân thủ tiêm chủng
                                    </h5>
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#64748b',
                                        margin: 0
                                    }}>
                                        Tạo hàng tuần vào thứ Sáu
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '6px',
                                        background: '#dbeafe',
                                        color: '#1d4ed8',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}>
                                        ✏️
                                    </button>
                                    <button style={{
                                        padding: '6px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}>
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                                <Link to="/admin/reports/schedule" style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}>
                                    Quản lý báo cáo đã lên lịch
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderLeft: '4px solid #3b82f6',
                padding: '20px',
                borderRadius: '12px'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                        flexShrink: 0,
                        marginRight: '12px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            color: '#3b82f6',
                            fontSize: '16px'
                        }}>
                            ❓
                        </div>
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e3a8a',
                            margin: '0 0 8px 0'
                        }}>
                            Trung tâm trợ giúp Quản trị
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: '#1e40af',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>
                            Cần trợ giúp với các chức năng quản trị? Xem{' '}
                            <a href="#" style={{
                                color: '#1d4ed8',
                                textDecoration: 'underline',
                                fontWeight: '500'
                            }}>
                                Hướng dẫn Quản trị
                            </a>
                            {' '}hoặc liên hệ hỗ trợ kỹ thuật tại support@schoolmedical.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
