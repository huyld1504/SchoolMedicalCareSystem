import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaUserMd, FaUserNurse, FaCalendarAlt, FaBell, FaGraduationCap,
    FaStethoscope, FaNotesMedical, FaClipboardCheck, FaExclamationTriangle,
    FaHeartbeat, FaBriefcaseMedical, FaFileMedical, FaFileAlt
} from 'react-icons/fa';

function StaffDashboard() {
    // Mock data for medical staff
    const [medicalStaff, setMedicalStaff] = useState([
        { id: 1, name: "Dr. Sarah Chen", role: "School Physician", specialty: "Pediatrics", status: "active", avatar: "SC" },
        { id: 2, name: "Michael Rodriguez", role: "Head School Nurse", specialty: "Emergency Care", status: "active", avatar: "MR" },
        { id: 3, name: "Emily Clark", role: "School Nurse", specialty: "General Care", status: "active", avatar: "EC" },
        { id: 4, name: "David Wilson", role: "Health Coordinator", specialty: "Public Health", status: "active", avatar: "DW" },
        { id: 5, name: "Olivia Johnson", role: "School Nurse", specialty: "Mental Health", status: "leave", avatar: "OJ" },
        { id: 6, name: "James Brown", role: "Medical Assistant", specialty: "First Aid", status: "active", avatar: "JB" }
    ]);

    // Staff availability for current day
    const [staffAvailability, setStaffAvailability] = useState({
        onDuty: 5,
        onLeave: 1,
        totalStaff: 6,
        coverage: 85 // percentage of healthcare needs covered
    });

    // Mock data for upcoming training sessions
    const [trainingSessions, setTrainingSessions] = useState([
        { id: 1, title: "CPR Recertification", date: "May 25, 2025", location: "Health Center", attendees: 12, status: "scheduled" },
        { id: 2, title: "Diabetic Care Training", date: "May 29, 2025", location: "Room 105", attendees: 8, status: "scheduled" },
        { id: 3, title: "Mental Health First Aid", date: "June 3, 2025", location: "Conference Room", attendees: 15, status: "preparation" }
    ]);

    // Mock data for staff certifications status
    const [certifications, setCertifications] = useState({
        current: 18,
        expiringSoon: 4,
        expired: 1,
        total: 23
    });

    // Mock data for recent staff activities
    const [recentActivities, setRecentActivities] = useState([
        { id: 1, staffMember: "Dr. Sarah Chen", action: "Conducted health check-up for 12 students", time: "1 hour ago" },
        { id: 2, staffMember: "Michael Rodriguez", action: "Updated vaccination records for Grade 2", time: "3 hours ago" },
        { id: 3, staffMember: "Emily Clark", action: "Administered medications to 8 students", time: "5 hours ago" },
        { id: 4, staffMember: "David Wilson", action: "Completed health awareness campaign planning", time: "Yesterday" }
    ]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Medical Staff Management</h1>
                <p className="text-gray-600">
                    Manage your healthcare team, track certifications, and organize training sessions.
                </p>
            </div>

            {/* Staff Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Staff On Duty</h3>
                        <FaUserMd className="text-blue-500 h-5 w-5" />
                    </div>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-800 mr-2">{staffAvailability.onDuty}</div>
                        <div className="text-sm text-gray-500">/ {staffAvailability.totalStaff}</div>
                    </div>
                    <div className="mt-2 text-xs text-green-600">
                        {staffAvailability.coverage}% coverage today
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Certifications</h3>
                        <FaClipboardCheck className="text-green-500 h-5 w-5" />
                    </div>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-800 mr-2">{certifications.current}</div>
                        <div className="text-sm text-gray-500">current</div>
                    </div>
                    <div className="mt-2 text-xs text-amber-600">
                        {certifications.expiringSoon} expiring within 30 days
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Training Sessions</h3>
                        <FaGraduationCap className="text-purple-500 h-5 w-5" />
                    </div>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-800 mr-2">{trainingSessions.length}</div>
                        <div className="text-sm text-gray-500">upcoming</div>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                        Next: {trainingSessions[0].title} ({trainingSessions[0].date})
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Staff Requests</h3>
                        <FaNotesMedical className="text-red-500 h-5 w-5" />
                    </div>
                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-800 mr-2">3</div>
                        <div className="text-sm text-gray-500">pending</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                        2 leave requests, 1 schedule change
                    </div>
                </div>
            </div>

            {/* Medical Staff Table */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Medical Staff Directory</h2>
                    <div className="flex">
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition duration-150 flex items-center mr-2">
                            <FaFileAlt className="h-4 w-4 mr-1" />
                            Export
                        </button>
                        <Link to="/manager/staff/add" className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150 flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                            </svg>
                            Add Staff
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {medicalStaff.map(staff => (
                                <tr key={staff.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                {staff.avatar}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{staff.role}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{staff.specialty}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {staff.status === 'active' ? 'Active' : 'On Leave'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                        <button className="text-gray-600 hover:text-gray-900">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Upcoming Training */}
                <div className="bg-white rounded-lg shadow col-span-1">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Upcoming Medical Training</h2>
                    </div>
                    <div className="p-4">
                        <ul className="divide-y divide-gray-200">
                            {trainingSessions.map(session => (
                                <li key={session.id} className="py-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <FaGraduationCap className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{session.title}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>{session.date}</span>
                                                <span className="mx-1">•</span>
                                                <span>{session.location}</span>
                                            </div>
                                            <div className="mt-1 flex items-center">
                                                <span className="text-xs text-gray-500 mr-2">{session.attendees} attendees</span>
                                                <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${session.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {session.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <Link to="/manager/staff/training" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                Manage all training sessions
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Certification Alerts */}
                <div className="bg-white rounded-lg shadow col-span-1">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Certification Alerts</h2>
                    </div>
                    <div className="p-4">
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">James Brown's First Aid certification expired</p>
                                    <p className="text-xs text-red-600 mt-1">Expired on May 15, 2025 (6 days ago)</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-amber-700 font-medium">Michael Rodriguez's CPR certification expiring soon</p>
                                    <p className="text-xs text-amber-600 mt-1">Expires on June 5, 2025 (15 days left)</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-amber-700 font-medium">Emily Clark's Medication Administration certification expiring soon</p>
                                    <p className="text-xs text-amber-600 mt-1">Expires on June 12, 2025 (22 days left)</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Link to="/manager/staff/certifications" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                View all certifications
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow col-span-1">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Staff Activity</h2>
                    </div>
                    <div className="p-4">
                        <ul className="divide-y divide-gray-200">
                            {recentActivities.map(activity => (
                                <li key={activity.id} className="py-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">{activity.staffMember}</h3>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">{activity.action}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <Link to="/manager/staff/activity" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                View all activity
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Staff Management Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                        className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-between transition-colors"
                        onClick={() => alert("This would open the staff scheduling page")}
                    >
                        <div>
                            <h3 className="font-medium text-blue-700">Schedule Staff</h3>
                            <p className="text-sm text-blue-600">Manage duty roster</p>
                        </div>
                        <FaCalendarAlt className="h-6 w-6 text-blue-500" />
                    </button>

                    <button
                        className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-between transition-colors"
                        onClick={() => alert("This would open the training scheduling page")}
                    >
                        <div>
                            <h3 className="font-medium text-green-700">Schedule Training</h3>
                            <p className="text-sm text-green-600">Plan medical training</p>
                        </div>
                        <FaGraduationCap className="h-6 w-6 text-green-500" />
                    </button>

                    <button
                        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-between transition-colors"
                        onClick={() => alert("This would send notifications to staff")}
                    >
                        <div>
                            <h3 className="font-medium text-purple-700">Send Notifications</h3>
                            <p className="text-sm text-purple-600">Alert healthcare team</p>
                        </div>
                        <FaBell className="h-6 w-6 text-purple-500" />
                    </button>

                    <button
                        className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-between transition-colors"
                        onClick={() => alert("This would open the certification management page")}
                    >
                        <div>
                            <h3 className="font-medium text-amber-700">Certification Tracking</h3>
                            <p className="text-sm text-amber-600">Monitor staff credentials</p>
                        </div>
                        <FaClipboardCheck className="h-6 w-6 text-amber-500" />
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FaUserNurse className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-blue-800 mb-1">Medical Staff Management Resources</h3>
                        <p className="text-sm text-blue-700 mb-3">
                            Efficiently manage your healthcare team with these resources:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <a href="#" className="text-sm bg-white px-3 py-2 rounded shadow-sm text-blue-700 font-medium hover:bg-blue-50">
                                Staff Management Guide
                            </a>
                            <a href="#" className="text-sm bg-white px-3 py-2 rounded shadow-sm text-blue-700 font-medium hover:bg-blue-50">
                                Healthcare Certification Tracker
                            </a>
                            <a href="#" className="text-sm bg-white px-3 py-2 rounded shadow-sm text-blue-700 font-medium hover:bg-blue-50">
                                Medical Training Resources
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffDashboard;