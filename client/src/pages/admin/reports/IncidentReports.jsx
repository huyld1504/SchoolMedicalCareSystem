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
            try {
                // Create sample incident reports
                const incidentReports = [
                    {
                        id: 'IR-2025-05-15',
                        title: 'Sports Field Injury Report',
                        date: '2025-05-15',
                        type: 'Physical Injury',
                        location: 'Sports Field',
                        student: 'James Wilson',
                        grade: '10A',
                        severity: 'Moderate',
                        status: 'Resolved',
                        description: 'Twisted ankle during soccer practice. Ice applied, parents notified.',
                        reporter: 'Coach Thomas Johnson',
                        actionTaken: 'First aid administered, parent pickup arranged',
                        tags: ['Sports', 'First Aid'],
                        followUp: 'Required'
                    },
                    {
                        id: 'IR-2025-05-10',
                        title: 'Cafeteria Allergic Reaction',
                        date: '2025-05-10',
                        type: 'Allergic Reaction',
                        location: 'Cafeteria',
                        student: 'Emma Davis',
                        grade: '8B',
                        severity: 'Severe',
                        status: 'Resolved',
                        description: 'Allergic reaction to peanuts. Epinephrine administered.',
                        reporter: 'Cafeteria Staff',
                        actionTaken: 'Emergency protocol followed, hospitalized',
                        tags: ['Allergy', 'Emergency'],
                        followUp: 'Completed'
                    },
                    {
                        id: 'IR-2025-05-08',
                        title: 'Classroom Fall Incident',
                        date: '2025-05-08',
                        type: 'Physical Injury',
                        location: 'Classroom',
                        student: 'Michael Brown',
                        grade: '5C',
                        severity: 'Minor',
                        status: 'Resolved',
                        description: 'Tripped and fell in classroom. Minor scrape on knee.',
                        reporter: 'Ms. Patricia Smith',
                        actionTaken: 'Cleaned wound and applied bandage',
                        tags: ['Classroom', 'First Aid'],
                        followUp: 'Not Required'
                    },
                    {
                        id: 'IR-2025-05-05',
                        title: 'Laboratory Chemical Exposure',
                        date: '2025-05-05',
                        type: 'Chemical Exposure',
                        location: 'Science Lab',
                        student: 'Sarah Johnson',
                        grade: '11A',
                        severity: 'Moderate',
                        status: 'Resolved',
                        description: 'Eye irritation from chemical splash. Emergency eye wash used immediately.',
                        reporter: 'Dr. Robert White',
                        actionTaken: 'Emergency eye wash, medical assessment',
                        tags: ['Lab', 'Chemical', 'Emergency'],
                        followUp: 'Completed'
                    },
                    {
                        id: 'IR-2025-05-01',
                        title: 'Playground Equipment Failure',
                        date: '2025-05-01',
                        type: 'Equipment Failure',
                        location: 'Playground',
                        student: 'Multiple Students',
                        grade: 'Various',
                        severity: 'Minor',
                        status: 'Pending',
                        description: 'Swing set chain broke. No injuries but requires immediate repair.',
                        reporter: 'Playground Supervisor',
                        actionTaken: 'Area cordoned off, maintenance notified',
                        tags: ['Equipment', 'Maintenance'],
                        followUp: 'Required'
                    }
                ];

                setReports(incidentReports);

                // Set sample stats
                setStats({
                    totalIncidents: 13,
                    minor: 7,
                    moderate: 4,
                    severe: 2,
                    resolved: 11,
                    pending: 2
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
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'Minor': 'bg-yellow-100 text-yellow-800',
            'Moderate': 'bg-orange-100 text-orange-800',
            'Severe': 'bg-red-100 text-red-800'
        };
        return colors[severity] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        return status === 'Resolved'
            ? 'bg-green-100 text-green-800'
            : 'bg-amber-100 text-amber-800';
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-700"></div></div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Incident Reports</h1>
                <p className="text-gray-600">Track and manage all medical incidents and emergency responses</p>
            </div>

            {/* Incident Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Total Incidents</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalIncidents}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Minor</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.minor}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Moderate</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.moderate}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Severe</p>
                        <p className="text-3xl font-bold text-red-600">{stats.severe}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Resolved</p>
                        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm">Pending</p>
                        <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-5 border-b">
                    <h2 className="text-lg font-medium">Incident Filters</h2>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                        <select
                            name="reportType"
                            value={filters.reportType}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            <option value="all">All Types</option>
                            <option value="physical">Physical Injury</option>
                            <option value="allergic">Allergic Reaction</option>
                            <option value="chemical">Chemical Exposure</option>
                            <option value="equipment">Equipment Failure</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                            name="severity"
                            value={filters.severity}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            <option value="all">All Severities</option>
                            <option value="minor">Minor</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                        <select
                            name="timePeriod"
                            value={filters.timePeriod}
                            onChange={handleFilterChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            name="searchQuery"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                            placeholder="Search by title, student, location..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Report Actions */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <span className="text-gray-500">{filteredReports.length} incidents found</span>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Report New Incident
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Export Report
                    </button>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No incidents found matching your criteria.
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
            </div> */}

            {/* Emergency Protocol Reminder */}
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-5 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Emergency Protocol Reminder</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>For severe incidents, always follow the school emergency response protocol and notify the appropriate authorities. All staff members should be familiar with the <a href="#" className="underline font-medium">Emergency Response Handbook</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IncidentReports;
