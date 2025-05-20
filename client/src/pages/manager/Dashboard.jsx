import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ManagerDashboard() {
    const { currentUser } = useAuth();

    // Sample statistics data
    const [stats, setStats] = useState({
        totalStaff: 32,
        activeStaff: 28,
        totalStudents: 854,
        activeRequests: 17
    });

    // Sample upcoming events
    const [events, setEvents] = useState([
        // ...existing code...
    ]);

    // Sample resource allocation data
    const [resources, setResources] = useState([
        // ...existing code...
    ]);

    // Sample staff activity data
    const [staffActivities, setStaffActivities] = useState([
        // ...existing code...
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back, {currentUser?.name || "Manager"}. Here's what's happening in your medical department.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* ...existing code... */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Upcoming Events */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    {/* ...existing code... */}
                </div>

                {/* Resource Allocation */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    {/* ...existing code... */}
                </div>

                {/* Staff Activity */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Staff Activity</h2>
                    </div>
                    <div className="p-6">
                        <ul className="divide-y divide-gray-200">
                            {staffActivities.map(activity => (
                                <li key={activity.id} className="py-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">{activity.name}</h3>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{activity.role}</p>
                                        <p className="mt-1 text-sm text-gray-600">{activity.action}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <Link to="/manager/staff" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                                View all staff
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
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/manager/staff" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Staff Management</span>
                    </Link>

                    <Link to="/manager/resources" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Resource Management</span>
                    </Link>

                    <Link to="/manager/reports" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Reports & Analytics</span>
                    </Link>

                    <Link to="/manager/calendar" className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex flex-col items-center justify-center transition duration-150">
                        <svg className="w-8 h-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Schedule & Calendar</span>
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
                        <h3 className="text-sm font-medium text-blue-800">Manager Resources</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>Need help managing your medical team? Check out the <a href="#" className="font-medium underline">Manager Handbook</a> or schedule a training session with our support team.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;