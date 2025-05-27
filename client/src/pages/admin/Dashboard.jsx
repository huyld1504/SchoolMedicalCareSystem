import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function AdminDashboard() {
    const { currentUser } = useAuth();

    // Sample statistics data
    const [stats, setStats] = useState({
        totalUsers: 376,
        activeUsers: 340,
        pendingApprovals: 12,
        securityAlerts: 3
    });

    // Sample system health data
    const [systemHealth, setSystemHealth] = useState({
        status: "Healthy",
        uptime: "99.98%",
        lastBackup: "2023-06-01 02:00 AM",
        diskSpace: "78%",
        cpuUsage: "42%",
        memoryUsage: "53%"
    });    // Sample recent user activities - enhanced to match Activities page
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: "medication_request",
            user: "Sarah Johnson",
            userRole: "Nurse",
            action: "Updated medication inventory",
            description: "Added 50 units of Ibuprofen to inventory",
            time: "10 minutes ago",
            timestamp: "2025-05-25 14:30:00",
            ipAddress: "192.168.1.101",
            severity: "info"
        },
        {
            id: 2,
            type: "health_report",
            user: "Robert Lee",
            userRole: "Manager",
            action: "Generated monthly health report",
            description: "Generated comprehensive health report for May 2025",
            time: "1 hour ago",
            timestamp: "2025-05-25 13:15:00",
            ipAddress: "192.168.1.102",
            severity: "info"
        },
        {
            id: 3,
            type: "user_registration",
            user: "Mary Williams",
            userRole: "Admin",
            action: "Added new user account",
            description: "Created parent account for Jennifer Davis",
            time: "3 hours ago",
            timestamp: "2025-05-25 11:20:00",
            ipAddress: "192.168.1.100",
            severity: "success"
        },
        {
            id: 4,
            type: "medication_request",
            user: "James Brown",
            userRole: "Parent",
            action: "Submitted medication request",
            description: "Requested daily Albuterol administration for child",
            time: "Yesterday",
            timestamp: "2025-05-24 16:45:00",
            ipAddress: "10.0.0.15",
            severity: "warning"
        },
        {
            id: 5,
            type: "system_backup",
            user: "System",
            userRole: "System",
            action: "Database backup completed",
            description: "Automated daily backup completed successfully",
            time: "Yesterday",
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

    // Helper function to get severity badge style
    const getSeverityBadge = (severity) => {
        const styles = {
            'info': 'bg-blue-100 text-blue-800',
            'success': 'bg-green-100 text-green-800',
            'warning': 'bg-yellow-100 text-yellow-800',
            'error': 'bg-red-100 text-red-800'
        };
        return styles[severity] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="container mx-auto px-4 py-8">            <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Quản trị</h1>
            <p className="text-gray-600">
                Chào mừng trở lại, {currentUser?.name || "Quản trị viên"}. Đây là những gì đang diễn ra trong hệ thống của bạn.
            </p>
        </div>{/* Quick Access Top Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <div className="flex flex-wrap justify-between items-center">
                    <Link to="/admin/users" className="flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-150">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Người dùng</span>
                    </Link>

                    <Link to="/admin/vaccination-scheduler" className="flex items-center px-4 py-2 bg-teal-50 hover:bg-teal-100 rounded-lg transition duration-150">
                        <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Lịch tiêm chủng</span>
                    </Link>

                    <Link to="/admin/settings" className="flex items-center px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition duration-150">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Cài đặt</span>
                    </Link>

                    <Link to="/admin/reports" className="flex items-center px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-150">
                        <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Báo cáo</span>
                    </Link>

                    <Link to="/admin/activities" className="flex items-center px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition duration-150">
                        <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Hoạt động</span>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Tổng số người dùng</h3>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>                    <p className="text-sm text-gray-500 mt-2">Trên tất cả loại người dùng</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Người dùng đang hoạt động</h3>
                        <div className="p-2 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{stats.activeUsers}</p>                    <p className="text-sm text-gray-500 mt-2">Tài khoản đang hoạt động hiện tại</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Phê duyệt đang chờ</h3>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>                    <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                    <div className="mt-2 flex">
                        <Link to="/admin/pending-approvals" className="text-sm text-blue-600 hover:text-blue-800">Xem ngay</Link>
                    </div>
                </div>                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Trạng thái hệ thống</h3>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">Tốt</p>
                    <div className="mt-2 flex">
                        <Link to="/admin/settings/system" className="text-sm text-blue-600 hover:text-blue-800">Chi tiết hệ thống</Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* System Health */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Tình trạng hệ thống</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Trạng thái</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {systemHealth.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Thời gian hoạt động</span>
                                <span className="text-gray-800 font-medium">{systemHealth.uptime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Sao lưu gần nhất</span>
                                <span className="text-gray-800 font-medium">{systemHealth.lastBackup}</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Dung lượng đĩa</span>
                                    <span className="text-gray-800 font-medium">{systemHealth.diskSpace}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: systemHealth.diskSpace }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Sử dụng CPU</span>
                                    <span className="text-gray-800 font-medium">{systemHealth.cpuUsage}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: systemHealth.cpuUsage }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Sử dụng bộ nhớ</span>
                                    <span className="text-gray-800 font-medium">{systemHealth.memoryUsage}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: systemHealth.memoryUsage }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link to="/admin/settings/backup" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                Sao lưu hệ thống
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Hoạt động gần đây</h2>
                    </div>                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivities.map(activity => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.user}
                                                </p>
                                                <span className="text-xs text-gray-500">({activity.userRole})</span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityBadge(activity.severity)}`}>
                                                    {activity.severity}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">{activity.time}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500">IP: {activity.ipAddress}</p>
                                            <p className="text-xs text-gray-400">{activity.timestamp}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div><div className="mt-4">
                            <Link to="/admin/activities" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                Xem tất cả hoạt động
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>            {/* Reports Features */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Bảng điều khiển Báo cáo</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                            <h3 className="font-medium mb-4 flex items-center text-gray-900">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                Thống kê báo cáo
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Báo cáo tình trạng sức khỏe</span>
                                    <span className="font-medium">24</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Báo cáo thuốc</span>
                                    <span className="font-medium">42</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Báo cáo tiêm chủng</span>
                                    <span className="font-medium">18</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Báo cáo sự cố</span>
                                    <span className="font-medium">7</span>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    <Link to="/admin/reports" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                        Xem tất cả báo cáo
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                            <h3 className="font-medium mb-4 flex items-center text-gray-900">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                                </svg>
                                Báo cáo gần đây
                            </h3>
                            <ul className="space-y-2">
                                <li className="p-2 hover:bg-gray-50 rounded-lg">
                                    <Link to="/admin/reports/health-status/latest" className="flex justify-between">
                                        <span className="text-gray-800">Tổng quan sức khỏe hàng tháng</span>
                                        <span className="text-gray-500 text-sm">May 20, 2025</span>
                                    </Link>
                                </li>
                                <li className="p-2 hover:bg-gray-50 rounded-lg">
                                    <Link to="/admin/reports/medication/latest" className="flex justify-between">
                                        <span className="text-gray-800">Báo cáo sử dụng thuốc</span>
                                        <span className="text-gray-500 text-sm">May 15, 2025</span>
                                    </Link>
                                </li>                                <li className="p-2 hover:bg-gray-50 rounded-lg">
                                    <Link to="/admin/reports/vaccination/latest" className="flex justify-between">
                                        <span className="text-gray-800">Tuân thủ tiêm chủng</span>
                                        <span className="text-gray-500 text-sm">May 10, 2025</span>
                                    </Link>
                                </li>
                                <li className="p-2 hover:bg-gray-50 rounded-lg">
                                    <Link to="/admin/reports/incidents" className="flex justify-between">
                                        <span className="text-gray-800">Báo cáo sự cố</span>
                                        <span className="text-gray-500 text-sm">May 18, 2025</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Report Generation Features */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Tạo báo cáo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-5">
                        <h3 className="font-medium mb-4">Tạo báo cáo mới</h3>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
                                <select id="report-type" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">                                    <option value="">Chọn loại báo cáo</option>
                                    <option value="health-status">Báo cáo tình trạng sức khỏe</option>
                                    <option value="medication">Báo cáo thuốc</option>
                                    <option value="vaccination">Báo cáo tiêm chủng</option>
                                    <option value="incident">Báo cáo sự cố</option>
                                    <option value="activity">Báo cáo hoạt động</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                                    <input type="date" id="start-date" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                                    <input type="date" id="end-date" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="report-format" className="block text-sm font-medium text-gray-700 mb-1">Định dạng</label>
                                <select id="report-format" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>

                            <div className="pt-2">
                                <button
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                                    onClick={() => alert("This would generate a new report based on selected parameters")}
                                >
                                    Tạo báo cáo
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-5">
                        <h3 className="font-medium mb-4">Báo cáo được lên lịch</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>                                    <h4 className="font-medium text-gray-800">Tổng quan sức khỏe hàng tháng</h4>
                                    <p className="text-sm text-gray-500">Tạo vào ngày 1 hàng tháng</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                    </button>
                                    <button className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Delete">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div>                                    <h4 className="font-medium text-gray-800">Tuân thủ tiêm chủng</h4>
                                    <p className="text-sm text-gray-500">Tạo hàng tuần vào thứ Sáu</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                    </button>
                                    <button className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Delete">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link to="/admin/reports/schedule" className="block w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md text-center">
                                    Quản lý báo cáo đã lên lịch
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">                        <h3 className="text-sm font-medium text-blue-800">Trung tâm trợ giúp Quản trị</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Cần trợ giúp với các chức năng quản trị? Xem <a href="#" className="font-medium underline">Hướng dẫn Quản trị</a> hoặc liên hệ hỗ trợ kỹ thuật tại support@schoolmedical.com.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
