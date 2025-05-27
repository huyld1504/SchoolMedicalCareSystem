import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateComplianceReport } from '../../../services/medicationReportService';

function MedicationReports() {
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
        administeredCount: 0,
        skippedCount: 0
    });

    useEffect(() => {
        // In a real app, this would call an API to get medication reports
        const fetchMedicationReports = async () => {
            try {
                // Use the medication service to get compliance data                // Use the medication service to get compliance data
                const complianceData = await generateComplianceReport();

                // Create sample medication reports
                const medReports = [
                    {
                        id: 'MR-2025-05-15',
                        title: 'Báo cáo cấp phát thuốc hàng tháng',
                        date: '2025-05-15',
                        type: 'Cấp phát',
                        author: 'Hệ thống',
                        summary: 'Báo cáo hàng tháng về việc cấp phát thuốc trong toàn trường',
                        compliance: '96%',
                        grade: 'Tất cả',
                        tags: ['Hàng tháng', 'Tự động'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'MR-2025-05-01',
                        title: 'Báo cáo tình trạng kho thuốc',
                        date: '2025-05-01',
                        type: 'Kho',
                        author: 'Y tá Sarah Wilson',
                        summary: 'Tình trạng kho hiện tại và nhu cầu bổ sung thuốc',
                        compliance: 'N/A',
                        grade: 'Tất cả',
                        tags: ['Kho', 'Hàng tháng'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'MR-2025-04-20',
                        title: 'Báo cáo tuân thủ thuốc mạn tính',
                        date: '2025-04-20',
                        type: 'Tuân thủ',
                        author: 'BS Emily Carter',
                        summary: 'Báo cáo theo dõi học sinh cần uống thuốc hàng ngày',
                        compliance: '92%',
                        grade: 'Nhiều khối',
                        tags: ['Tuân thủ', 'Mạn tính'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'MR-2025-04-10',
                        title: 'Phân tích lỗi cấp phát thuốc',
                        date: '2025-04-10',
                        type: 'Phân tích lỗi',
                        author: 'Nhóm đảm bảo chất lượng',
                        summary: 'Phân tích các lỗi cấp phát thuốc và biện pháp khắc phục',
                        compliance: 'N/A',
                        grade: 'Tất cả',
                        tags: ['Lỗi', 'Phân tích'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'MR-2025-03-31',
                        title: 'Báo cáo xu hướng thuốc Q1 2025',
                        date: '2025-03-31',
                        type: 'Phân tích xu hướng',
                        author: 'Phòng Y tế',
                        summary: 'Phân tích quý về xu hướng cấp phát thuốc',
                        compliance: '95%',
                        grade: 'Tất cả',
                        tags: ['Theo quý', 'Xu hướng'],
                        downloadUrl: '#'
                    }
                ];

                setReports(medReports);

                // Calculate some stats from the compliance data
                const totalAdministered = complianceData ?
                    Object.values(complianceData).reduce((sum, grade) => sum + (grade.administered || 0), 0) : 0;

                const totalSkipped = complianceData ?
                    Object.values(complianceData).reduce((sum, grade) => sum + (grade.skipped || 0), 0) : 0;

                const totalCount = totalAdministered + totalSkipped;
                const complianceRate = totalCount > 0 ? Math.round((totalAdministered / totalCount) * 100) : 0;

                setStats({
                    totalReports: 24,
                    complianceRate: complianceRate,
                    administeredCount: totalAdministered,
                    skippedCount: totalSkipped
                });

                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tải báo cáo thuốc:", error);
                setLoading(false);
            }
        };

        fetchMedicationReports();
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
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div></div>;
    }

    return (
        <div className="p-6">            <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Báo cáo thuốc</h1>
            <p className="text-gray-600">Truy cập và quản lý tất cả báo cáo cấp phát thuốc và phân tích</p>
        </div>            {/* Medication Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Tổng số báo cáo</p>
                        <p className="text-3xl font-bold text-green-600">{stats.totalReports}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Tỷ lệ tuân thủ chung</p>
                        <p className="text-3xl font-bold text-green-600">{stats.complianceRate}%</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Đã cấp phát thuốc</p>
                        <p className="text-3xl font-bold text-green-600">{stats.administeredCount}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Bỏ qua thuốc</p>
                        <p className="text-3xl font-bold text-red-600">{stats.skippedCount}</p>
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
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="administration">Cấp phát</option>
                            <option value="inventory">Kho</option>
                            <option value="compliance">Tuân thủ</option>
                            <option value="error">Phân tích lỗi</option>
                            <option value="trend">Phân tích xu hướng</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian</label>
                        <select
                            name="timePeriod"
                            value={filters.timePeriod}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
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
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
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
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
                        />
                    </div>
                </div>
            </div>            {/* Report Generation Button */}
            <div className="mb-6 flex justify-end">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tạo báo cáo thuốc mới
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
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
                                            <a href={report.downloadUrl} className="text-green-600 hover:text-green-900">
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
                                            <button className="text-green-600 hover:text-green-900">
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

export default MedicationReports;
