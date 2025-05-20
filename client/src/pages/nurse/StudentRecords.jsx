import React from 'react';

function StudentRecords() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Student Health Records</h1>

            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">John Doe</h2>
                        <p className="text-gray-500">Grade: 10</p>
                    </div>
                    <button
                        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-150 flex items-center"
                        onClick={() => alert("This would open the mass health screening page")}
                    >
                        <div className="mr-4 p-2 bg-purple-100 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <div className="font-medium">Plan Health Screening</div>
                            <div className="text-sm text-gray-500">Schedule mass health checks</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Student health records are confidential. Please ensure you follow proper privacy protocols when accessing or sharing this information.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentRecords;