import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HealthReports() {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [filters, setFilters] = useState({
        reportType: 'all',
        timePeriod: 'all',
        grade: 'all',
        searchQuery: ''
    });
    const [stats, setStats] = useState({
        totalReports: 0,
        chronicConditions: 0,
        allergies: 0,
        medicalIncidents: 0
    });

    useEffect(() => {
        // In a real app, this would call an API to get health reports
        const fetchHealthReports = async () => {
            try {                // Transform student health records into report format phù hợp tiểu học
                const healthReports = [
                    {
                        id: 'HR-2025-05-29',
                        title: 'Báo cáo sức khỏe học sinh tiểu học tháng 5',
                        date: '2025-05-29',
                        type: 'Báo cáo tình trạng',
                        author: 'Cô Nguyễn Thị Lan - Y tá trường',
                        summary: 'Báo cáo tổng quan sức khỏe học sinh từ lớp 1 đến lớp 5',
                        coverage: '100% học sinh (600 em)',
                        grade: 'Lớp 1-5',
                        tags: ['Hàng tháng', 'Tổng quan'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'HR-2025-05-25',
                        title: 'Theo dõi hen suyễn và khó thở ở trẻ',
                        date: '2025-05-25',
                        type: 'Bệnh mạn tính',
                        author: 'BS. Trần Thị Mai',
                        summary: 'Báo cáo theo dõi học sinh mắc hen suyễn và các vấn đề hô hấp',
                        coverage: '18 học sinh (3%)',
                        grade: 'Chủ yếu lớp 3-5',
                        tags: ['Mạn tính', 'Hô hấp'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'HR-2025-05-20',
                        title: 'Dị ứng thức ăn và môi trường ở trẻ em',
                        date: '2025-05-20',
                        type: 'Dị ứng',
                        author: 'Cô Lê Thị Hương - Y tá',
                        summary: 'Báo cáo về tình trạng dị ứng thức ăn và phấn hoa ở học sinh',
                        coverage: '45 học sinh (7.5%)',
                        grade: 'Tất cả các lớp',
                        tags: ['Dị ứng', 'Thức ăn'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'HR-2025-05-15',
                        title: 'Khám sức khỏe đầu năm học sinh lớp 1',
                        date: '2025-05-15',
                        type: 'Khám sức khỏe',
                        author: 'Đội khám sức khỏe học đường',
                        summary: 'Kết quả khám sức khỏe định kỳ cho học sinh lớp 1 mới nhập học',
                        coverage: '120 học sinh lớp 1 (100%)',
                        grade: 'Lớp 1',
                        tags: ['Khám định kỳ', 'Lớp 1'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'HR-2025-05-10',
                        title: 'Tình trạng dinh dưỡng và phát triển',
                        date: '2025-05-10',
                        type: 'Dinh dưỡng',
                        author: 'BS. Phạm Văn Minh',
                        summary: 'Đánh giá tình trạng dinh dưỡng, chiều cao cân nặng học sinh',
                        coverage: '600 học sinh (100%)',
                        grade: 'Tất cả các lớp',
                        tags: ['Dinh dưỡng', 'Phát triển'],
                        downloadUrl: '#'
                    }
                ];

                setReports(healthReports);                // Set sample stats phù hợp với trường tiểu học
                setStats({
                    totalReports: 25,
                    chronicConditions: 18,
                    allergies: 45,
                    medicalIncidents: 5
                });

                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải báo cáo sức khỏe:", error);
                setLoading(false);
            }
        };

        fetchHealthReports();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const filteredReports = reports.filter(report => {
        // Apply filters
        if (filters.reportType !== 'all' && !report.type.toLowerCase().includes(filters.reportType.toLowerCase())) {
            return false;
        }

        if (filters.searchQuery && !report.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
            !report.summary.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
            return false;
        }

        // More filters could be applied here based on grade, date, etc.

        return true;
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div></div>;
    }

    return (
        <div className="p-6">            <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Báo cáo sức khỏe</h1>
            <p className="text-gray-600">Truy cập và quản lý tất cả báo cáo và phân tích liên quan đến sức khỏe</p>
        </div>            {/* Health Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Tổng số báo cáo</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalReports}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Báo cáo bệnh mạn tính</p>
                        <p className="text-3xl font-bold text-indigo-600">{stats.chronicConditions}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Báo cáo dị ứng</p>
                        <p className="text-3xl font-bold text-teal-600">{stats.allergies}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Báo cáo sự cố y tế</p>
                        <p className="text-3xl font-bold text-pink-600">{stats.medicalIncidents}</p>
                    </div>
                </div>
            </div>            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-5 border-b">
                    <h2 className="text-lg font-medium">Bộ lọc báo cáo</h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
                        <select
                            name="reportType"
                            value={filters.reportType}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="status">Báo cáo tình trạng</option>
                            <option value="chronic">Bệnh mạn tính</option>
                            <option value="allergy">Báo cáo dị ứng</option>
                            <option value="incident">Báo cáo sự cố</option>
                            <option value="check">Khám sức khỏe</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian</label>
                        <select
                            name="timePeriod"
                            value={filters.timePeriod}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả thời gian</option>
                            <option value="month">Tháng này</option>
                            <option value="quarter">Quý này</option>
                            <option value="year">Năm này</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp</label>
                        <select
                            name="grade"
                            value={filters.grade}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả khối</option>
                            <option value="elementary">Tiểu học</option>
                            <option value="middle">Trung học cơ sở</option>
                            <option value="high">Trung học phổ thông</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm báo cáo</label>
                        <input
                            type="text"
                            name="searchQuery"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                            placeholder="Tìm theo tiêu đề hoặc nội dung..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                </div>
            </div>            {/* Report Generation Button */}
            <div className="mb-6 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tạo báo cáo sức khỏe mới
                </button>
            </div>            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Báo cáo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phạm vi</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{report.title}</div>
                                            <div className="text-sm text-gray-500">{report.summary}</div>
                                            <div className="mt-1 flex items-center space-x-2">
                                                {report.tags.map((tag, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(report.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.coverage}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <a href={report.downloadUrl} className="text-indigo-600 hover:text-indigo-900">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </a>
                                            <button className="text-gray-600 hover:text-gray-900">
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
                                        </div>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    Không tìm thấy báo cáo nào phù hợp với tiêu chí của bạn.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HealthReports;
