import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminActivities() {
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState('today');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const activitiesPerPage = 10;

    // Sample activities data
    const [activities] = useState([
        {
            id: 1,
            type: 'user_login',
            user: 'Sarah Johnson',
            userRole: 'Nurse',
            description: 'User logged into the system',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            ipAddress: '192.168.1.101',
            severity: 'info',
            details: { browser: 'Chrome 120.0', device: 'Desktop' }
        },
        {
            id: 2,
            type: 'medication_request',
            user: 'Lisa Chen',
            userRole: 'Parent',
            description: 'Submitted medication request for Michael Chen',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            ipAddress: '192.168.1.102',
            severity: 'medium',
            details: { medication: 'Inhaler', student: 'Michael Chen', class: '8B' }
        },
        {
            id: 3,
            type: 'security_alert',
            user: 'System',
            userRole: 'System',
            description: 'Multiple failed login attempts detected',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            ipAddress: '192.168.1.203',
            severity: 'high',
            details: { attempts: 5, account: 'admin@school.edu', blocked: true }
        },
        {
            id: 4,
            type: 'health_record_update',
            user: 'Dr. Smith',
            userRole: 'Doctor',
            description: 'Updated health record for Emily Johnson',
            timestamp: new Date(Date.now() - 90 * 60 * 1000),
            ipAddress: '192.168.1.104',
            severity: 'info',
            details: { student: 'Emily Johnson', type: 'Medical Examination', changes: 3 }
        },
        {
            id: 5,
            type: 'medication_approval',
            user: 'Robert Wilson',
            userRole: 'Admin',
            description: 'Approved medication request for Alex Thompson',
            timestamp: new Date(Date.now() - 120 * 60 * 1000),
            ipAddress: '192.168.1.105',
            severity: 'info',
            details: { medication: 'EpiPen', student: 'Alex Thompson', urgency: 'high' }
        },
        {
            id: 6,
            type: 'user_logout',
            user: 'Mary Williams',
            userRole: 'Manager',
            description: 'User logged out of the system',
            timestamp: new Date(Date.now() - 150 * 60 * 1000),
            ipAddress: '192.168.1.106',
            severity: 'info',
            details: { sessionDuration: '2h 35m' }
        },
        {
            id: 7,
            type: 'vaccination_scheduled',
            user: 'Jennifer Park',
            userRole: 'Parent',
            description: 'Scheduled vaccination appointment for David Park',
            timestamp: new Date(Date.now() - 180 * 60 * 1000),
            ipAddress: '192.168.1.107',
            severity: 'info',
            details: { vaccine: 'HPV', student: 'David Park', date: '2024-01-20' }
        },
        {
            id: 8,
            type: 'data_export',
            user: 'Admin User',
            userRole: 'Admin',
            description: 'Exported monthly health reports',
            timestamp: new Date(Date.now() - 210 * 60 * 1000),
            ipAddress: '192.168.1.108',
            severity: 'medium',
            details: { reportType: 'Monthly Health Summary', recordCount: 234 }
        }
    ]);

    // Filter activities
    const filteredActivities = activities.filter(activity => {
        const matchesType = filter === 'all' || activity.type === filter;
        const matchesSearch =
            activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.type.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        const now = new Date();
        const activityDate = new Date(activity.timestamp);

        switch (dateRange) {
            case 'today':
                matchesDate = activityDate.toDateString() === now.toDateString();
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = activityDate >= weekAgo;
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = activityDate >= monthAgo;
                break;
            default:
                matchesDate = true;
        }

        return matchesType && matchesSearch && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const paginatedActivities = filteredActivities.slice(startIndex, startIndex + activitiesPerPage);

    // Stats
    const stats = {
        total: activities.length,
        today: activities.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length,
        security: activities.filter(a => a.severity === 'high').length,
        active: activities.filter(a => a.type === 'user_login').length
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'user_login':
                return '🔑';
            case 'user_logout':
                return '🚪';
            case 'medication_request':
                return '💊';
            case 'medication_approval':
                return '✅';
            case 'health_record_update':
                return '📋';
            case 'vaccination_scheduled':
                return '💉';
            case 'security_alert':
                return '🚨';
            case 'data_export':
                return '📊';
            default:
                return '📝';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'info':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);

        if (diff < 60 * 1000) return 'Just now';
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} minutes ago`;
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    const handleSelectActivity = (activityId) => {
        setSelectedActivities(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    const handleSelectAll = () => {
        if (selectedActivities.length === paginatedActivities.length) {
            setSelectedActivities([]);
        } else {
            setSelectedActivities(paginatedActivities.map(a => a.id));
        }
    };

    const handleExport = () => {
        // In a real app, this would generate and download a CSV file
        alert(`Exporting ${selectedActivities.length} selected activities to CSV...`);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">System Activities</h1>
                        <p className="text-gray-600 mt-1">Monitor and track all system activities</p>
                    </div>
                    <Link
                        to="/admin"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Activities</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Today's Activities</p>
                            <p className="text-2xl font-bold">{stats.today}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 14c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Security Alerts</p>
                            <p className="text-2xl font-bold">{stats.security}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold">{stats.active}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Activities</option>
                                <option value="user_login">User Logins</option>
                                <option value="user_logout">User Logouts</option>
                                <option value="medication_request">Medication Requests</option>
                                <option value="medication_approval">Medication Approvals</option>
                                <option value="health_record_update">Health Record Updates</option>
                                <option value="vaccination_scheduled">Vaccination Scheduled</option>
                                <option value="security_alert">Security Alerts</option>
                                <option value="data_export">Data Exports</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users, descriptions..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleExport}
                                disabled={selectedActivities.length === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Export to CSV ({selectedActivities.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activities Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Activities ({filteredActivities.length})</h2>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedActivities.length === paginatedActivities.length && paginatedActivities.length > 0}
                                onChange={handleSelectAll}
                                className="mr-2"
                            />
                            Select All
                        </label>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Select
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Severity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IP Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedActivities.map(activity => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedActivities.includes(activity.id)}
                                            onChange={() => handleSelectActivity(activity.id)}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">{getActivityIcon(activity.type)}</span>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                                                <div className="text-sm text-gray-500 capitalize">{activity.type.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                                        <div className="text-sm text-gray-500">{activity.userRole}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatTimestamp(activity.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(activity.severity)}`}>
                                            {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {activity.ipAddress}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(startIndex + activitiesPerPage, filteredActivities.length)}</span> of{' '}
                                    <span className="font-medium">{filteredActivities.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}

                {filteredActivities.length === 0 && (
                    <div className="p-12 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                        <p className="text-gray-600">No activities match your current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminActivities;
