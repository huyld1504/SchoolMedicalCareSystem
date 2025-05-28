import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function IncidentReports() {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({
        reportType: 'all',
        timePeriod: 'all',
        severity: 'all',
        searchQuery: ''
    });
    const [stats, setStats] = useState({
        totalIncidents: 0,
        minor: 0,
        moderate: 0,
        severe: 0,
        resolved: 0,
        pending: 0
    });

    useEffect(() => {
        // In a real app, this would call an API to get incident reports
        const fetchIncidentReports = async () => {
            try {                const incidentReports = [
                    {
                        id: 'BC-2025-05-29',
                        title: 'Báo cáo chấn thương sân chơi',
                        date: '2025-05-29',
                        type: 'Chấn thương thể chất',
                        location: 'Sân chơi',
                        student: 'Nguyễn Minh An',
                        grade: '2A',
                        severity: 'Vừa',
                        status: 'Đã giải quyết',
                        description: 'Bị té khi chơi cầu trượt. Trầy xước ở đầu gối và khuỷu tay.',
                        reporter: 'Cô Trần Thị Lan - Giáo viên trực',
                        actionTaken: 'Sơ cứu, vệ sinh vết thương, thông báo phụ huynh',
                        tags: ['Sân chơi', 'Sơ cứu'],
                        followUp: 'Cần theo dõi'
                    },
                    {
                        id: 'BC-2025-05-28',
                        title: 'Phản ứng dị ứng với sữa',
                        date: '2025-05-28',
                        type: 'Phản ứng dị ứng',
                        location: 'Phòng ăn',
                        student: 'Lê Thị Hoa',
                        grade: '1B',
                        severity: 'Nặng',
                        status: 'Đã giải quyết',
                        description: 'Phản ứng dị ứng với sữa tươi. Nổi mẩn đỏ và khó thở nhẹ.',
                        reporter: 'Cô Phạm Thị Mai - Nhân viên bếp ăn',
                        actionTaken: 'Thực hiện quy trình khẩn cấp, liên hệ phụ huynh ngay',
                        tags: ['Dị ứng', 'Khẩn cấp'],
                        followUp: 'Đã hoàn thành'
                    },
                    {
                        id: 'BC-2025-05-27',
                        title: 'Sự cố té ngã trong lớp học',
                        date: '2025-05-27',
                        type: 'Chấn thương thể chất',
                        location: 'Lớp học 3A',
                        student: 'Trần Văn Nam',
                        grade: '3A',
                        severity: 'Nhẹ',
                        status: 'Đã giải quyết',
                        description: 'Bị vấp ghế và té trong lớp học. Trầy xước nhẹ ở bàn tay.',
                        reporter: 'Cô Nguyễn Thị Thu - Giáo viên chủ nhiệm',
                        actionTaken: 'Vệ sinh vết thương và dán băng cá nhân',
                        tags: ['Lớp học', 'Sơ cứu'],
                        followUp: 'Không cần thiết'
                    },
                    {
                        id: 'BC-2025-05-26',
                        title: 'Đau bụng trong giờ học',
                        date: '2025-05-26',
                        type: 'Vấn đề sức khỏe',
                        location: 'Lớp học 4B',                        student: 'Phạm Thị Mai',
                        grade: '4B',
                        severity: 'Vừa',
                        status: 'Đã giải quyết',
                        description: 'Đau bụng đột ngột trong giờ học. Có thể do ăn sáng không phù hợp.',
                        reporter: 'Cô Lê Thị Hương - Giáo viên',
                        actionTaken: 'Đưa về phòng y tế, liên hệ phụ huynh đón về',
                        tags: ['Sức khỏe', 'Đau bụng'],
                        followUp: 'Đã hoàn thành'
                    },
                    {
                        id: 'BC-2025-05-25',
                        title: 'Hỏng thiết bị sân chơi',
                        date: '2025-05-25',
                        type: 'Hỏng thiết bị',
                        location: 'Sân chơi',
                        student: 'Hoàng Văn Đức',
                        grade: '5A',
                        severity: 'Nhẹ',
                        status: 'Đang chờ',
                        description: 'Cầu trượt bị lỏng ốc vít. Không có thương tích nhưng cần sửa chữa ngay.',
                        reporter: 'Thầy Nguyễn Văn Minh - Giám sát sân chơi',
                        actionTaken: 'Rào chắn khu vực, thông báo bảo trì',
                        tags: ['Thiết bị', 'Bảo trì'],
                        followUp: 'Cần theo dõi'
                    }
                ];

                setReports(incidentReports);                // Set sample stats phù hợp với trường tiểu học
                setStats({
                    totalIncidents: 5,
                    minor: 2,
                    moderate: 2,
                    severe: 1,
                    resolved: 4,
                    pending: 1
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching incident reports:", error);
                setLoading(false);
            }
        };

        fetchIncidentReports();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const filteredReports = reports.filter(report => {
        // Apply report type filter
        if (filters.reportType !== 'all' && !report.type.toLowerCase().includes(filters.reportType.toLowerCase())) {
            return false;
        }

        // Apply severity filter
        if (filters.severity !== 'all' && report.severity.toLowerCase() !== filters.severity.toLowerCase()) {
            return false;
        }

        // Apply search filter
        if (filters.searchQuery &&
            !report.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !report.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !report.student.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !report.location.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }; const getSeverityColor = (severity) => {
        const colors = {
            'Minor': 'bg-yellow-100 text-yellow-800',
            'Moderate': 'bg-orange-100 text-orange-800',
            'Severe': 'bg-red-100 text-red-800',
            'Nhẹ': 'bg-yellow-100 text-yellow-800',
            'Vừa': 'bg-orange-100 text-orange-800',
            'Nặng': 'bg-red-100 text-red-800'
        };
        return colors[severity] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        if (status === 'Resolved' || status === 'Đã giải quyết') {
            return 'bg-green-100 text-green-800';
        }
        return 'bg-amber-100 text-amber-800';
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-700"></div></div>;
    }

    return (
        <div className="p-6">            <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Báo cáo sự cố</h1>
            <p className="text-gray-600">Theo dõi và quản lý tất cả các sự cố y tế và phản ứng khẩn cấp</p>
        </div>            {/* Incident Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Tổng sự cố</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalIncidents}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Nhẹ</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.minor}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Vừa</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.moderate}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Nặng</p>
                        <p className="text-3xl font-bold text-red-600">{stats.severe}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Đã giải quyết</p>
                        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Đang chờ</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                </div>
            </div>            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-5 border-b">
                    <h2 className="text-lg font-medium">Bộ lọc sự cố</h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại sự cố</label>
                        <select
                            name="reportType"
                            value={filters.reportType}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="physical">Chấn thương thể chất</option>
                            <option value="allergic">Phản ứng dị ứng</option>
                            <option value="chemical">Tiếp xúc hóa chất</option>
                            <option value="equipment">Hỏng thiết bị</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ nghiêm trọng</label>
                        <select
                            name="severity"
                            value={filters.severity}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả mức độ</option>
                            <option value="minor">Nhẹ</option>
                            <option value="moderate">Vừa</option>
                            <option value="severe">Nặng</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian</label>
                        <select
                            name="timePeriod"
                            value={filters.timePeriod}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả thời gian</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <input
                            type="text"
                            name="searchQuery"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                            placeholder="Tìm theo tiêu đề, học sinh, địa điểm..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        />
                    </div>
                </div>
            </div>            {/* Report Actions */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <span className="text-gray-500">{filteredReports.length} sự cố được tìm thấy</span>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Báo cáo sự cố mới
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Xuất báo cáo
                    </button>
                </div>
            </div>            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sự cố</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức độ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">{report.id}</div>
                                            <div className="mt-1 flex items-center space-x-2">
                                                {report.tags.map((tag, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(report.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.location}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{report.student}</div>
                                        <div className="text-xs text-gray-500">{report.grade}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(report.severity)}`}>
                                            {report.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button className="text-indigo-600 hover:text-indigo-900">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="text-orange-600 hover:text-orange-900">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    Không tìm thấy sự cố nào phù hợp với tiêu chí của bạn.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Incident Analysis Section
            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Incident Analysis</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3">Incident Location Distribution</h3>
                            <div className="h-60 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="mt-2">Location distribution chart will display here</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3">Incident Type Breakdown</h3>
                            <div className="h-60 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                    </svg>
                                    <p className="mt-2">Incident type pie chart will display here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}            {/* Emergency Protocol Reminder */}
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-5 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Nhắc nhở quy trình khẩn cấp</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>Đối với các sự cố nghiêm trọng, luôn tuân theo quy trình ứng phó khẩn cấp của trường và thông báo cho các cơ quan thẩm quyền. Tất cả nhân viên nên quen thuộc với <a href="#" className="underline font-medium">Sổ tay ứng phó khẩn cấp</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IncidentReports;
