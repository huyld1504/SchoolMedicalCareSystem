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
            try {
                // Create sample vaccination reports
                const vacReports = [
                    {
                        id: 'VR-2025-05-01',
                        title: 'Spring 2025 Vaccination Campaign Results',
                        date: '2025-05-01',
                        type: 'Campaign',
                        author: 'Health Department',
                        summary: 'Results from the Spring 2025 vaccination drive',
                        compliance: '94%',
                        grade: 'All',
                        tags: ['Campaign', 'Seasonal'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-04-15',
                        title: 'Required Vaccinations Compliance Report',
                        date: '2025-04-15',
                        type: 'Compliance',
                        author: 'Dr. Emily Carter',
                        summary: 'Status report on required vaccination compliance across all grades',
                        compliance: '98%',
                        grade: 'All',
                        tags: ['Required', 'Compliance'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-04-01',
                        title: 'Influenza Vaccination Coverage',
                        date: '2025-04-01',
                        type: 'Specific Vaccination',
                        author: 'Nurse Sarah Wilson',
                        summary: 'Analysis of influenza vaccination coverage for the 2024-2025 season',
                        compliance: '89%',
                        grade: 'All',
                        tags: ['Influenza', 'Seasonal'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-03-20',
                        title: 'Vaccination Exemption Analysis',
                        date: '2025-03-20',
                        type: 'Exemption',
                        author: 'School Administration',
                        summary: 'Review of vaccination exemptions and mitigation strategies',
                        compliance: 'N/A',
                        grade: 'All',
                        tags: ['Exemption', 'Analysis'],
                        downloadUrl: '#'
                    },
                    {
                        id: 'VR-2025-03-01',
                        title: 'Kindergarten Vaccination Status Report',
                        date: '2025-03-01',
                        type: 'Grade-Specific',
                        author: 'Elementary Health Team',
                        summary: 'Detailed report on vaccination status of kindergarten students',
                        compliance: '96%',
                        grade: 'Kindergarten',
                        tags: ['Grade-Specific', 'Entry Requirements'],
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
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div></div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Vaccination Reports</h1>
                <p className="text-gray-600">Access and manage all vaccination records and compliance reports</p>
            </div>

            {/* Vaccination Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Total Reports</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.totalReports}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Overall Compliance</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.complianceRate}%</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Vaccinated Students</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.vaccinatedStudents}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Pending Consent Forms</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.pendingConsent}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-5 border-b">
                    <h2 className="text-lg font-medium">Report Filters</h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                        <select
                            name="reportType"
                            value={filters.reportType}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <option value="all">All Types</option>
                            <option value="campaign">Campaign</option>
                            <option value="compliance">Compliance</option>
                            <option value="specific">Specific Vaccination</option>
                            <option value="exemption">Exemption</option>
                            <option value="grade">Grade-Specific</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                        <select
                            name="timePeriod"
                            value={filters.timePeriod}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <option value="all">All Time</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                        <select
                            name="grade"
                            value={filters.grade}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        >
                            <option value="all">All Grades</option>
                            <option value="kindergarten">Kindergarten</option>
                            <option value="elementary">Elementary</option>
                            <option value="middle">Middle School</option>
                            <option value="high">High School</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Reports</label>
                        <input
                            type="text"
                            name="searchQuery"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                            placeholder="Search by title or content..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Report Generation Button */}
            <div className="mb-6 flex justify-end">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate New Vaccination Report
                </button>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No reports found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Vaccination Coverage Chart Section (Placeholder) */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
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
            </div>
        </div>
    );
}

export default VaccinationReports;
