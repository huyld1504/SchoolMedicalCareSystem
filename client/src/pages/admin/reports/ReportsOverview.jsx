import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ReportsOverview() {
    const [loading, setLoading] = useState(true);
    const [recentReports, setRecentReports] = useState([]);
    const [reportStats, setReportStats] = useState({
        totalReports: 0,
        healthReports: 0,
        medicationReports: 0,
        vaccinationReports: 0,
        incidentReports: 0
    });

    // Sample data - would be replaced with actual API calls
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {            setRecentReports([
                {
                    id: 1,
                    title: 'Báo cáo sức khỏe học sinh tiểu học tháng 5/2025',
                    type: 'Sức khỏe',
                    date: '2025-05-29',
                    author: 'Cô Nguyễn Thị Lan - Y tá trường',
                    status: 'Hoàn thành',
                    path: '/admin/reports/health/monthly-may-2025'
                },
                {
                    id: 2,
                    title: 'Báo cáo thuốc trẻ em và sơ cứu',
                    type: 'Thuốc',
                    date: '2025-05-28',
                    author: 'BS. Trần Thị Mai',
                    status: 'Hoàn thành',
                    path: '/admin/reports/medication/quarterly-q2-2025'
                },
                {
                    id: 3,
                    title: 'Tiêm chủng trẻ em 6-11 tuổi năm học 2024-2025',
                    type: 'Tiêm chủng',
                    date: '2025-05-27',
                    author: 'Trạm Y tế Phường',
                    status: 'Hoàn thành',
                    path: '/admin/reports/vaccination/annual-2025'
                },
                {
                    id: 4,
                    title: 'Báo cáo tai nạn và sự cố trong trường',
                    type: 'Sự cố',
                    date: '2025-05-26',
                    author: 'Phòng An toàn trường học',
                    status: 'Hoàn thành',
                    path: '/admin/reports/incidents/weekly-may-26-2025'
                },
                {
                    id: 5,
                    title: 'Khám sức khỏe đầu năm học sinh lớp 1',
                    type: 'Sức khỏe',
                    date: '2025-05-25',
                    author: 'Đội khám sức khỏe học đường',
                    status: 'Hoàn thành',
                    path: '/admin/reports/health/first-grade-checkup-2025'
                }
            ]);

            setReportStats({
                totalReports: 87,
                healthReports: 32,
                medicationReports: 24,
                vaccinationReports: 18,
                incidentReports: 13
            });

            setLoading(false);
        }, 600);
    }, []); const getTypeColor = (type) => {
        const colors = {
            'Sức khỏe': 'bg-blue-100 text-blue-800',
            'Thuốc': 'bg-green-100 text-green-800',
            'Tiêm chủng': 'bg-purple-100 text-purple-800',
            'Sự cố': 'bg-orange-100 text-orange-800',
            // Fallback for English types
            'Health': 'bg-blue-100 text-blue-800',
            'Medication': 'bg-green-100 text-green-800',
            'Vaccination': 'bg-purple-100 text-purple-800',
            'Incident': 'bg-orange-100 text-orange-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (<div className="p-6">
        <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Bảng điều khiển báo cáo</h1>
            <p className="text-gray-600">Truy cập và tạo tất cả báo cáo hệ thống từ bảng điều khiển này</p>
        </div>            {/* Report Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Tổng báo cáo</p>
                    <p className="text-3xl font-bold">{reportStats.totalReports}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Báo cáo sức khỏe</p>
                    <p className="text-3xl font-bold text-blue-600">{reportStats.healthReports}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Báo cáo thuốc</p>
                    <p className="text-3xl font-bold text-green-600">{reportStats.medicationReports}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Báo cáo tiêm chủng</p>
                    <p className="text-3xl font-bold text-purple-600">{reportStats.vaccinationReports}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Báo cáo sự cố</p>
                    <p className="text-3xl font-bold text-orange-600">{reportStats.incidentReports}</p>
                </div>
            </div>
        </div>            {/* Report Categories */}
        <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Danh mục báo cáo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/reports/health" className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-blue-500"></div>
                    <div className="p-5">
                        <div className="flex items-center mb-3">
                            <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium">Báo cáo sức khỏe</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Tình trạng sức khỏe toàn diện, khám sàng lọc và chỉ số chăm sóc sức khỏe</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-blue-600 font-medium">{reportStats.healthReports} báo cáo</span>
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/reports/medication" className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-green-500"></div>
                    <div className="p-5">
                        <div className="flex items-center mb-3">
                            <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <h3 className="text-lg font-medium">Báo cáo thuốc</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Quản lý thuốc, hàng tồn kho và theo dõi tuân thủ</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-green-600 font-medium">{reportStats.medicationReports} báo cáo</span>
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Link>                    <Link to="/admin/reports/vaccination" className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-purple-500"></div>
                    <div className="p-5">
                        <div className="flex items-center mb-3">
                            <svg className="w-8 h-8 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium">Báo cáo tiêm chủng</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Hồ sơ tiêm chủng, kết quả chiến dịch và theo dõi tuân thủ</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-purple-600 font-medium">{reportStats.vaccinationReports} báo cáo</span>
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/reports/incidents" className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-orange-500"></div>
                    <div className="p-5">
                        <div className="flex items-center mb-3">
                            <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-medium">Báo cáo sự cố</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Sự cố y tế, phản ứng khẩn cấp và hồ sơ tai nạn</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-orange-600 font-medium">{reportStats.incidentReports} báo cáo</span>
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>
        </div>

        {/* Recent Reports */}      <div className="mb-8">                <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Báo cáo gần đây</h2>
            <div className="flex space-x-4">
                <Link to="/admin/reports/health" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                    Báo cáo sức khỏe
                </Link>
                <Link to="/admin/reports/medication" className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium">
                    Báo cáo thuốc
                </Link>
                <Link to="/admin/reports/vaccination" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium">
                    Báo cáo tiêm chủng
                </Link>
                <Link to="/admin/reports/incidents" className="text-orange-600 hover:text-orange-800 flex items-center text-sm font-medium">
                    Báo cáo sự cố
                </Link>
            </div>
        </div>

            {loading ? (
                <div className="text-center py-10">
                    <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500">Đang tải báo cáo...</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">                            <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Báo cáo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentReports.map(report => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{report.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(report.type)}`}>
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{formatDate(report.date)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{report.author}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                            {report.status}
                                        </span>
                                    </td>                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                        <Link to={report.path} className="text-blue-600 hover:text-blue-900 mr-4">Xem</Link>
                                        <button className="text-gray-600 hover:text-gray-900 mr-4">Tải xuống</button>
                                        <button className="text-gray-600 hover:text-gray-900">Chia sẻ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>            {/* Generate Report Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Tạo báo cáo mới</h2>
            </div>
            <div className="p-6">
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
                            <select
                                id="reportType"
                                name="reportType"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                                <option value="">Chọn loại báo cáo</option>
                                <option value="health">Báo cáo sức khỏe</option>
                                <option value="medication">Báo cáo thuốc</option>
                                <option value="vaccination">Báo cáo tiêm chủng</option>
                                <option value="incident">Báo cáo sự cố</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="timeFrame" className="block text-sm font-medium text-gray-700 mb-1">Khung thời gian</label>
                            <select
                                id="timeFrame"
                                name="timeFrame"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                                <option value="daily">Hàng ngày</option>
                                <option value="weekly">Hàng tuần</option>
                                <option value="monthly">Hàng tháng</option>
                                <option value="quarterly">Hàng quý</option>
                                <option value="annually">Hàng năm</option>
                                <option value="custom">Tùy chỉnh</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">Định dạng</label>
                            <select
                                id="format"
                                name="format"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                                <option value="pdf">PDF</option>
                                <option value="excel">Excel</option>
                                <option value="csv">CSV</option>
                                <option value="html">HTML</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={(e) => {
                                e.preventDefault();
                                const reportType = document.getElementById('reportType').value;
                                if (reportType === 'health') {
                                    window.location.href = '/admin/reports/health';
                                } else if (reportType === 'medication') {
                                    window.location.href = '/admin/reports/medication';
                                } else if (reportType === 'vaccination') {
                                    window.location.href = '/admin/reports/vaccination';
                                } else if (reportType === 'incident') {
                                    window.location.href = '/admin/reports/incidents';
                                } else {
                                    alert('Loại báo cáo này sẽ sớm ra mắt.');
                                }
                            }}
                        >
                            Tạo báo cáo
                        </button>
                    </div>
                </form>
            </div>
        </div>            {/* Help Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg mb-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Trợ giúp tạo báo cáo</h3>
                    <div className="mt-2 text-sm text-blue-700">
                        <p>Cần trợ giúp về báo cáo? Xem <a href="#" className="font-medium underline">Hướng dẫn báo cáo</a> hoặc liên hệ đội hỗ trợ kỹ thuật để được hỗ trợ về báo cáo tùy chỉnh.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ReportsOverview;
