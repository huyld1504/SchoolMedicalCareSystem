import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    FaUserMd, FaUsers, FaBriefcaseMedical, FaClipboardList,
    FaNotesMedical, FaFileMedical, FaCalendarAlt, FaPills,
    FaThermometerHalf, FaChartLine, FaExclamationTriangle,
    FaHeartbeat, FaLungs, FaAllergies
} from "react-icons/fa";

function ManagerDashboard() {
    const { currentUser } = useAuth();    // Health-related statistics data
    const [stats, setStats] = useState({
        totalStudents: 854,
        studentsWithHealthIssues: 67,
        medicationsAdministeredToday: 42,
        pendingApprovals: 8,
        staffOnDuty: 12,
        immunizationRate: 92,
        incidentsThisMonth: 38,
        chronicConditions: 43,
        allergiesTracked: 124
    });

    // Upcoming health events
    const [events, setEvents] = useState([
        { id: 1, title: "Dental Screening - Grade 3", date: "May 22, 2025", location: "Health Center", status: "scheduled" },
        { id: 2, title: "Vision Screening - Grade 5", date: "May 24, 2025", location: "Room 105", status: "scheduled" },
        { id: 3, title: "Influenza Vaccination Drive", date: "May 28, 2025", location: "School Gymnasium", status: "preparation" },
        { id: 4, title: "Staff Health & Safety Training", date: "June 2, 2025", location: "Conference Room", status: "scheduled" }
    ]);

    // Medical supplies inventory
    const [resources, setResources] = useState([
        { id: 1, name: "First Aid Kits", available: 24, alert: false },
        { id: 2, name: "Epinephrine Auto-injectors", available: 15, alert: false },
        { id: 3, name: "Asthma Inhalers", available: 8, alert: true },
        { id: 4, name: "Thermometers", available: 35, alert: false },
        { id: 5, name: "Bandages & Dressings", available: 120, alert: false }
    ]);

    // Recent health-related staff activities
    const [staffActivities, setStaffActivities] = useState([
        { id: 1, name: "Dr. Sarah Chen", role: "School Physician", action: "Conducted health check-up for 12 students", time: "1 hour ago" },
        { id: 2, name: "Nurse Michael Rodriguez", role: "Head School Nurse", action: "Updated vaccination records for Grade 2", time: "3 hours ago" },
        { id: 3, name: "Nurse Emily Clark", role: "School Nurse", action: "Administered medications to 8 students", time: "5 hours ago" },
        { id: 4, name: "David Wilson", role: "Health Coordinator", action: "Created new health awareness campaign", time: "Yesterday" }
    ]);    // Health alerts and notices
    const [healthAlerts, setHealthAlerts] = useState([
        { id: 1, title: "Seasonal Allergies Alert", level: "moderate", description: "Increased cases of seasonal allergies reported. Ensure medication is available for affected students." },
        { id: 2, title: "Medical Supplies Restock", level: "low", description: "Asthma inhalers running low. Please order more supplies." },
        { id: 3, title: "Influenza Cases Detected", level: "high", description: "3 confirmed cases of Influenza A in Grade 4. Monitor students for symptoms." },
        { id: 4, title: "Health Screening Reminder", level: "info", description: "Annual vision screening for Grades 1-3 due next week. Prepare documentation." }
    ]);

    // Recent medical incidents
    const [incidents, setIncidents] = useState([
        { id: 1, student: "Oliver Thompson", grade: "4th", type: "Minor Injury", description: "Scraped knee during recess", status: "treated", time: "Today, 10:45 AM" },
        { id: 2, student: "Emma Rodriguez", grade: "6th", type: "Asthma", description: "Mild asthma attack after PE", status: "monitored", time: "Today, 9:15 AM" },
        { id: 3, student: "Noah Chen", grade: "2nd", type: "Allergic Reaction", description: "Mild skin rash, possible food allergy", status: "treated", time: "Yesterday, 1:30 PM" },
        { id: 4, student: "Sophia Williams", grade: "5th", type: "Fever", description: "Temperature of 100.4°F, sent home", status: "referred", time: "Yesterday, 11:20 AM" }
    ]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Medical Department Dashboard</h1>
                <p className="text-gray-600">
                    Welcome back, {currentUser?.name || "Manager"}. Here's your school health overview for May 21, 2025.
                </p>
            </div>            {/* Health Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Total Students</span>
                    <div className="flex items-center">
                        <FaUsers className="text-blue-500 mr-2" />
                        <span className="text-xl font-bold">{stats.totalStudents}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Health Issues</span>
                    <div className="flex items-center">
                        <FaNotesMedical className="text-amber-500 mr-2" />
                        <span className="text-xl font-bold">{stats.studentsWithHealthIssues}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Meds Today</span>
                    <div className="flex items-center">
                        <FaPills className="text-green-500 mr-2" />
                        <span className="text-xl font-bold">{stats.medicationsAdministeredToday}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Incidents (Month)</span>
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-orange-500 mr-2" />
                        <span className="text-xl font-bold">{stats.incidentsThisMonth}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Staff On Duty</span>
                    <div className="flex items-center">
                        <FaUserMd className="text-purple-500 mr-2" />
                        <span className="text-xl font-bold">{stats.staffOnDuty}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Immunization Rate</span>
                    <div className="flex items-center">
                        <div className="relative w-full h-2 bg-gray-200 rounded mr-2">
                            <div className="absolute top-0 left-0 h-full bg-teal-500 rounded" style={{ width: `${stats.immunizationRate}%` }}></div>
                        </div>
                        <span className="text-md font-bold">{stats.immunizationRate}%</span>
                    </div>
                </div>
            </div>

            {/* Health Trends Summary */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Health Trends</h2>
                    <Link to="/manager/reports/health-trends" className="text-sm text-blue-600 hover:text-blue-800">View detailed reports</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaAllergies className="text-blue-600 mr-2" />
                            <h3 className="text-sm font-medium text-blue-700">Allergies</h3>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-blue-800">{stats.allergiesTracked}</span>
                            <span className="text-xs text-blue-600 font-medium">Tracked cases</span>
                        </div>
                        <div className="mt-2 text-xs text-blue-600">
                            Top allergens: Peanuts, Pollen, Dust
                        </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaLungs className="text-green-600 mr-2" />
                            <h3 className="text-sm font-medium text-green-700">Respiratory</h3>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-green-800">28</span>
                            <span className="text-xs text-green-600 font-medium">Active cases</span>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                            Includes asthma, seasonal conditions
                        </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaHeartbeat className="text-purple-600 mr-2" />
                            <h3 className="text-sm font-medium text-purple-700">Chronic Conditions</h3>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-purple-800">{stats.chronicConditions}</span>
                            <span className="text-xs text-purple-600 font-medium">Monitored students</span>
                        </div>
                        <div className="mt-2 text-xs text-purple-600">
                            Diabetes, epilepsy, heart conditions
                        </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center mb-2">
                            <FaThermometerHalf className="text-amber-600 mr-2" />
                            <h3 className="text-sm font-medium text-amber-700">Illness Trends</h3>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-amber-800">3.2%</span>
                            <span className="text-xs text-amber-600 font-medium">Absence rate</span>
                        </div>
                        <div className="mt-2 text-xs text-amber-600">
                            <span className="text-amber-700">↑1.1%</span> from last week
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Medical Incidents */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Medical Incidents</h2>
                    <Link to="/manager/reports/incidents" className="text-sm text-blue-600 hover:text-blue-800">View all incidents</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {incidents.map(incident => (
                                <tr key={incident.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{incident.student}</div>
                                        <div className="text-xs text-gray-500">Grade {incident.grade}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${incident.type === 'Allergic Reaction' ? 'bg-red-100 text-red-800' :
                                                incident.type === 'Asthma' ? 'bg-blue-100 text-blue-800' :
                                                    incident.type === 'Fever' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {incident.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{incident.description}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${incident.status === 'treated' ? 'bg-green-100 text-green-800' :
                                                incident.status === 'monitored' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-amber-100 text-amber-800'
                                            }`}>
                                            {incident.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{incident.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Health Alerts */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Health Alerts</h2>
                    </div>
                    <div className="p-4">
                        {healthAlerts.map(alert => (
                            <div key={alert.id} className={`mb-3 p-3 rounded-lg ${alert.level === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                                    alert.level === 'moderate' ? 'bg-amber-50 border-l-4 border-amber-500' :
                                        'bg-blue-50 border-l-4 border-blue-500'
                                }`}>
                                <h3 className="font-medium text-gray-900">{alert.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            </div>
                        ))}
                        {healthAlerts.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No active health alerts</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Health Events */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Upcoming Health Events</h2>
                    </div>
                    <div className="p-4">
                        <ul className="divide-y divide-gray-200">
                            {events.map(event => (
                                <li key={event.id} className="py-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span>{event.date}</span>
                                                <span className="mx-1">•</span>
                                                <span>{event.location}</span>
                                            </div>
                                            <span className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-xs font-medium ${event.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-3">
                            <Link to="/manager/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                View full health calendar
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Staff Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Medical Staff Activity</h2>
                    </div>
                    <div className="p-4">
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
                        <div className="mt-3">
                            <Link to="/manager/staff" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                View all medical staff
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Supplies */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Medical Supplies Inventory</h2>
                    <Link to="/manager/resources/inventory" className="text-sm text-blue-600 hover:text-blue-800">View full inventory</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {resources.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.available} units</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.alert ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {item.alert ? 'Low Stock' : 'Sufficient'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Medical Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/manager/staff" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-between transition-colors">
                        <div>
                            <h3 className="font-medium text-blue-700">Medical Staff</h3>
                            <p className="text-sm text-blue-600">Manage healthcare team</p>
                        </div>
                        <FaUserMd className="h-6 w-6 text-blue-500" />
                    </Link>

                    <Link to="/manager/resources" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-between transition-colors">
                        <div>
                            <h3 className="font-medium text-green-700">Medical Supplies</h3>
                            <p className="text-sm text-green-600">Manage inventory</p>
                        </div>
                        <FaBriefcaseMedical className="h-6 w-6 text-green-500" />
                    </Link>

                    <Link to="/manager/reports" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-between transition-colors">
                        <div>
                            <h3 className="font-medium text-purple-700">Health Reports</h3>
                            <p className="text-sm text-purple-600">View analytics</p>
                        </div>
                        <FaFileMedical className="h-6 w-6 text-purple-500" />
                    </Link>

                    <Link to="/manager/calendar" className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-between transition-colors">
                        <div>
                            <h3 className="font-medium text-amber-700">Health Events</h3>
                            <p className="text-sm text-amber-600">Schedule screenings</p>
                        </div>
                        <FaCalendarAlt className="h-6 w-6 text-amber-500" />
                    </Link>
                </div>
            </div>            {/* Health Guidelines */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-100 mb-6">
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-blue-800 mb-2">Health Guidelines & Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="flex items-center mb-2">
                                <svg className="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                <h3 className="text-sm font-medium text-blue-800">CDC School Guidelines</h3>
                            </div>
                            <p className="text-xs text-blue-700 mb-2">New CDC guidelines for school health management are available. Review the updated protocols.</p>
                            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center">
                                View guidelines
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>

                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="flex items-center mb-2">
                                <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
                                </svg>
                                <h3 className="text-sm font-medium text-green-800">Training Resources</h3>
                            </div>
                            <p className="text-xs text-green-700 mb-2">Access the latest training materials for health protocols, first aid, and emergency response procedures.</p>
                            <a href="#" className="text-xs font-medium text-green-600 hover:text-green-800 inline-flex items-center">
                                Access training
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>

                        <div className="bg-white p-3 rounded shadow-sm">
                            <div className="flex items-center mb-2">
                                <svg className="h-5 w-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                                </svg>
                                <h3 className="text-sm font-medium text-purple-800">Medical Forms</h3>
                            </div>
                            <p className="text-xs text-purple-700 mb-2">Download and print standard medical authorization forms, incident reports, and health records.</p>
                            <a href="#" className="text-xs font-medium text-purple-600 hover:text-purple-800 inline-flex items-center">
                                Get forms
                                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;