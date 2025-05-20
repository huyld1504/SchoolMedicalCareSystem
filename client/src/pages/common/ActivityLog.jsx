import React, { useState, useEffect } from 'react';
import { formatTimestamp, getRelativeTime, getActivityTypeColor } from '../../utils/helpers';

function ActivityLog() {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        // Fetch activities from API or other source
        const fetchActivities = async () => {
            // Mocked fetch function
            const response = await fetch('/api/activities');
            const data = await response.json();
            setActivities(data);
        };

        fetchActivities();
    }, []);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activities.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activities.length / itemsPerPage);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Activity Log</h1>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {activities.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <p>No activities found.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Timestamp
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            IP Address
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatTimestamp(activity.timestamp)}</div>
                                                <div className="text-xs text-gray-500">{getRelativeTime(activity.timestamp)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getActivityTypeColor(activity.type)}`}>
                                                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{activity.user}</div>
                                                <div className="text-xs text-gray-500">{activity.userRole}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{activity.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {activity.ip}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                                            {Math.min(indexOfLastItem, activities.length)}
                                        </span> of <span className="font-medium">{activities.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Logic to show pages around current page
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                // Show all pages if there are 5 or fewer
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                // Near the start
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                // Near the end
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                // In the middle
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Types</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-blue-100`}></div>
                        <span className="text-sm text-gray-700">Login</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-green-100`}></div>
                        <span className="text-sm text-gray-700">Record</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-red-100`}></div>
                        <span className="text-sm text-gray-700">Medication</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-purple-100`}></div>
                        <span className="text-sm text-gray-700">Appointment</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-yellow-100`}></div>
                        <span className="text-sm text-gray-700">Request</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-gray-100`}></div>
                        <span className="text-sm text-gray-700">System</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-indigo-100`}></div>
                        <span className="text-sm text-gray-700">Configuration</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-4 h-4 mr-2 rounded-full bg-pink-100`}></div>
                        <span className="text-sm text-gray-700">User</span>
                    </div>
                </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            This activity log is used for system auditing purposes. All user actions are recorded to ensure data integrity and security. Please refer to the system privacy policy for more information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityLog;