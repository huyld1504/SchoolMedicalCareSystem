import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function StudentDashboard() {
    const { currentUser } = useAuth();

    // Sample student data
    const [studentData, setStudentData] = useState({
        name: currentUser?.name || "Alex Johnson",
        grade: "10th Grade",
        class: "10-A",
        studentId: "S2023045",
        healthStatus: "Good",
        allergies: ["Peanuts", "Penicillin"],
        medications: [
            { name: "Albuterol Inhaler", schedule: "As needed", lastTaken: "2023-06-01" }
        ]
    });

    // Sample upcoming appointments
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            type: "Nurse Visit",
            date: "2023-06-15",
            time: "10:30 AM",
            location: "School Health Office",
            reason: "Asthma check-up"
        },
        {
            id: 2,
            type: "Vaccination",
            date: "2023-07-10",
            time: "9:00 AM",
            location: "School Gymnasium",
            reason: "Annual flu shot"
        }
    ]);

    // Sample recent health events
    const [healthEvents, setHealthEvents] = useState([
        {
            id: 1,
            date: "2023-06-01",
            event: "Medication administered",
            notes: "Albuterol inhaler used after PE class"
        },
        {
            id: 2,
            date: "2023-05-20",
            event: "Nurse visit",
            notes: "Headache complaint, rested for 30 minutes"
        },
        {
            id: 3,
            date: "2023-05-05",
            event: "Health screening",
            notes: "Vision and hearing check - all normal"
        }
    ]);

    // Sample health metrics
    const [healthMetrics, setHealthMetrics] = useState([
        {
            id: 1,
            name: "Height",
            value: "5'8\"",
            date: "2023-05-05",
            change: "+1 inch from last measurement"
        },
        {
            id: 2,
            name: "Weight",
            value: "145 lbs",
            date: "2023-05-05",
            change: "+3 lbs from last measurement"
        },
        {
            id: 3,
            name: "Vision",
            value: "20/20",
            date: "2023-05-05",
            change: "No change"
        },
        {
            id: 4,
            name: "Blood Pressure",
            value: "110/70",
            date: "2023-05-05",
            change: "Normal range"
        }
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Health Dashboard</h1>
                <p className="text-gray-600">
                    Welcome, {studentData.name}. Here's your health information.
                </p>
            </div>

            {/* Student Profile Overview */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-blue-100 rounded-full p-3 mr-4">
                            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{studentData.name}</h2>
                            <p className="text-gray-600">{studentData.grade} | {studentData.class} | ID: {studentData.studentId}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Health Status: {studentData.healthStatus}
                            </span>
                        </div>
                        <Link to="/student/profile" className="text-blue-600 hover:text-blue-800 text-sm">
                            View full profile
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Health Alerts */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Health Alerts</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {studentData.allergies.length > 0 && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Allergies</h3>
                                            <div className="mt-1 text-sm text-red-700">
                                                <ul className="list-disc list-inside">
                                                    {studentData.allergies.map((allergy, index) => (
                                                        <li key={index}>{allergy}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {studentData.medications.length > 0 && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Current Medications</h3>
                                            <div className="mt-1 text-sm text-yellow-700">
                                                <ul className="list-disc list-inside">
                                                    {studentData.medications.map((medication, index) => (
                                                        <li key={index}>{medication.name} - {medication.schedule}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">Health Reminders</h3>
                                        <div className="mt-1 text-sm text-blue-700">
                                            <p>Remember to bring your inhaler to PE class</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                    </div>
                    <div className="p-6">
                        {appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map(appointment => (
                                    <div key={appointment.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
                                                <p className="text-gray-600 text-sm">{appointment.reason}</p>
                                            </div>
                                            <span className="text-sm text-white bg-blue-500 rounded-full px-2 py-1">
                                                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span>{appointment.time}</span>
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                </svg>
                                                <span>{appointment.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">No upcoming appointments</p>
                        )}
                        <div className="mt-4">
                            <Link to="/student/calendar" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                                View calendar
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Health Events */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Recent Health Events</h2>
                    </div>
                    <div className="p-6">
                        {healthEvents.length > 0 ? (
                            <div className="space-y-4">
                                {healthEvents.map(event => (
                                    <div key={event.id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{event.event}</span>
                                            <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">No recent health events</p>
                        )}
                        <div className="mt-4">
                            <Link to="/student/activities" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                                View all activities
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">My Health Metrics</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {healthMetrics.map(metric => (
                            <div key={metric.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                                    <span className="text-xs text-gray-400">{new Date(metric.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-2xl font-bold mt-2">{metric.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link to="/student/health-records" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
                            View complete health records
                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/student/medications" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="mr-4 p-2 bg-blue-100 rounded-full">
                                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium">View Medications</h3>
                                <p className="text-sm text-gray-600">See your medication schedule</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/student/vaccinations" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="mr-4 p-2 bg-green-100 rounded-full">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium">Vaccination Records</h3>
                                <p className="text-sm text-gray-600">Check your immunization history</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/student/health-checks" className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                            <div className="mr-4 p-2 bg-purple-100 rounded-full">
                                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium">Health Check Results</h3>
                                <p className="text-sm text-gray-600">View your screening results</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
