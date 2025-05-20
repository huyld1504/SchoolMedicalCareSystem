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
    });

    // Sample recent user activities
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            user: "Sarah Johnson (Nurse)",
            action: "Updated medication inventory",
            time: "10 minutes ago"
        },
        {
            id: 2,
            user: "Robert Lee (Manager)",
            action: "Generated monthly health report",
            time: "1 hour ago"
        },
        {
            id: 3,
            user: "Mary Williams (Admin)",
            action: "Added new user account",
            time: "3 hours ago"
        },
        {
            id: 4,
            user: "James Brown (Parent)",
            action: "Submitted medication request",
            time: "Yesterday"
        },
        {
            id: 5,
            user: "System",
            action: "Database backup completed",
            time: "Yesterday"
        }
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back, {currentUser?.name || "Admin"}. Here's what's happening in your system.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Total Users</h3>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-gray-500 mt-2">Across all user types</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Active Users</h3>
                        <div className="p-2 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{stats.activeUsers}</p>
                    <p className="text-sm text-gray-500 mt-2">Currently active accounts</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Pending Approvals</h3>
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                    <div className="mt-2 flex">
                        <Link to="/admin/users/approval" className="text-sm text-blue-600 hover:text-blue-800">Review now</Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Security Alerts</h3>
                        <div className="p-2 bg-red-100 rounded-full">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{stats.securityAlerts}</p>
                    <div className="mt-2 flex">
                        <Link to="/admin/settings/security" className="text-sm text-blue-600 hover:text-blue-800">View details</Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* System Health */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">System Health</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                    {systemHealth.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Uptime</span>
                                <span className="text-gray-800 font-medium">{systemHealth.uptime}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Last Backup</span>
                                <span className="text-gray-800 font-medium">{systemHealth.lastBackup}</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Disk Space</span>
                                    <span className="text-gray-800 font-medium">{systemHealth.diskSpace}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: systemHealth.diskSpace }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">CPU Usage</span>
                                    <span className="text-gray-800 font-medium">{systemHealth.cpuUsage}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: systemHealth.cpuUsage }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600">Memory Usage</span>
                                    <span className="text-gray-800 font-medium">{systemHealth.memoryUsage}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: systemHealth.memoryUsage }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Link to="/admin/settings/backup" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                Backup System
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
                        <h2 className="text-xl font-semibold">Recent Activities</h2>
                    </div>
                    <div className="p-6">
                        <ul className="divide-y divide-gray-200">
                            {recentActivities.map(activity => (
                                <li key={activity.id} className="py-3">
                                    <div className="flex items-start">
                                        <div className="mr-4 mt-1">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                            <p className="text-sm text-gray-500">{activity.action}</p>
                                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <Link to="/admin/activities" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                View all activities
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/admin/users" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">User Management</span>
                    </Link>

                    <Link to="/admin/settings" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">System Settings</span>
                    </Link>

                    <Link to="/admin/reports" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Reports</span>
                    </Link>

                    <Link to="/admin/settings/backup" className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Backup & Restore</span>
                    </Link>
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
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Admin Help Center</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Need help with admin functions? Check out the <a href="#" className="font-medium underline">Admin Guide</a> or contact technical support at support@schoolmedical.com.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
