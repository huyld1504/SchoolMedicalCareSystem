import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function VaccinationReports() {
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
        complianceRate: 0,
        vaccinatedStudents: 0,
        pendingConsent: 0
    });

    useEffect(() => {
        // In a real app, this would call an API to get vaccination reports
        const fetchVaccinationReports = async () => {
            try {                // Create sample vaccination reports
                const vacReports = [
                    {
                        id: 'VR-2025-05-01',
                        title: 'Kết quả chiến dịch tiêm chủng xuân 2025',
                        date: '2025-05-01',
                        type: 'Chiến dịch',
                        author: 'Sở Y tế',
                        summary: 'Kết quả từ chiến dịch tiêm chủng xuân 2025',
                        compliance: '94%',
                        grade: 'Tất cả',
                        tags: ['Chiến dịch', 'Theo mùa'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-04-15',
                        title: 'Báo cáo tuân thủ tiêm chủng bắt buộc',
                        date: '2025-04-15',
                        type: 'Tuân thủ',
                        author: 'Bác sĩ Emily Carter',
                        summary: 'Báo cáo tình trạng tuân thủ tiêm chủng bắt buộc trên tất cả các lớp',
                        compliance: '98%',
                        grade: 'Tất cả',
                        tags: ['Bắt buộc', 'Tuân thủ'],
                        downloadUrl: '#'
                    }, {
                        id: 'VR-2025-04-01',
                        title: 'Phạm vi tiêm chủng cúm',
                        date: '2025-04-01',
                        type: 'Tiêm chủng cụ thể',
                        author: 'Y tá Sarah Wilson',
                        summary: 'Phân tích phạm vi tiêm chủng cúm cho mùa 2024-2025',
                        compliance: '89%',
                        grade: 'Tất cả',
                        tags: ['Cúm', 'Theo mùa'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-03-20',
                        title: 'Phân tích miễn trừ tiêm chủng',
                        date: '2025-03-20',
                        type: 'Miễn trừ',
                        author: 'Ban quản lý trường',
                        summary: 'Xem xét các trường hợp miễn trừ tiêm chủng và chiến lược giảm thiểu',
                        compliance: 'Không áp dụng',
                        grade: 'Tất cả',
                        tags: ['Miễn trừ', 'Phân tích'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-03-01',
                        title: 'Báo cáo tình trạng tiêm chủng mẫu giáo',
                        date: '2025-03-01',
                        type: 'Theo lớp',
                        author: 'Nhóm y tế tiểu học',
                        summary: 'Báo cáo chi tiết về tình trạng tiêm chủng của học sinh mẫu giáo',
                        compliance: '96%',
                        grade: 'Mẫu giáo',
                        tags: ['Theo lớp', 'Yêu cầu nhập học'],
                        downloadUrl: '#'
                    }
                ];

                setReports(vacReports);

                // Set sample stats
                setStats({
                    totalReports: 18,
                    complianceRate: 94,
                    vaccinatedStudents: 1248,
                    pendingConsent: 52
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching vaccination reports:", error);
                setLoading(false);
            }
        };

        fetchVaccinationReports();
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
    }); const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div></div>;
    }

    return (
        <div className="p-6">            <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Báo cáo tiêm chủng</h1>
            <p className="text-gray-600">Truy cập và quản lý tất cả hồ sơ tiêm chủng và báo cáo tuân thủ</p>
        </div>            {/* Vaccination Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Tổng số báo cáo</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.totalReports}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Tuân thủ tổng thể</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.complianceRate}%</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Học sinh đã tiêm</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.vaccinatedStudents}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Đơn đồng ý chờ xử lý</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.pendingConsent}</p>
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
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="campaign">Chiến dịch</option>
                            <option value="compliance">Tuân thủ</option>
                            <option value="specific">Tiêm chủng cụ thể</option>
                            <option value="exemption">Miễn trừ</option>
                            <option value="grade">Theo lớp</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                        <select
                            name="timePeriod"
                            value={filters.timePeriod}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả thời gian</option>
                            <option value="month">Tháng này</option>
                            <option value="quarter">Quý này</option>
                            <option value="year">Năm này</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cấp lớp</label>
                        <select
                            name="grade"
                            value={filters.grade}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả lớp</option>
                            <option value="kindergarten">Mẫu giáo</option>
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
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        />
                    </div>
                </div>
            </div>            {/* Report Generation Button */}
            <div className="mb-6 flex justify-end">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tạo báo cáo tiêm chủng mới
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuân thủ</th>
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
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
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
                                        {report.compliance}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <a href={report.downloadUrl} className="text-purple-600 hover:text-purple-900">
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
                                            <button className="text-purple-600 hover:text-purple-900">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (<tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                Không tìm thấy báo cáo nào phù hợp với tiêu chí của bạn.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Vaccination Coverage Chart Section (Placeholder) */}
            {/* <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Vaccination Coverage Analysis</h2>
                <p className="text-gray-500 mb-4">Interactive charts and visualizations for vaccination coverage will appear here.</p>

                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                        <svg className="w-12 h-12 text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Vaccination coverage visualization</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default VaccinationReports;
