import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function HealthCheckCampaigns() {
    // Sample data for health check campaigns
    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            name: "Annual Physical Examination",
            description: "Comprehensive physical examination for all students",
            startDate: "2025-08-10",
            endDate: "2025-09-30",
            status: "Active",
            targetGroups: "All students",
            checkupType: "Full physical exam",
            completedExams: 45,
            totalStudents: 120,
        },
        {
            id: 2,
            name: "Vision Screening",
            description: "Annual vision screening for early detection of vision problems",
            startDate: "2025-10-05",
            endDate: "2025-10-25",
            status: "Upcoming",
            targetGroups: "All students",
            checkupType: "Vision screening",
            completedExams: 0,
            totalStudents: 120,
        },
        {
            id: 3,
            name: "Dental Check-up",
            description: "Routine dental examination and hygiene education",
            startDate: "2025-04-15",
            endDate: "2025-05-15",
            status: "Completed",
            targetGroups: "All students",
            checkupType: "Dental examination",
            completedExams: 118,
            totalStudents: 120,
        },
        {
            id: 4,
            name: "Mental Health Screening",
            description: "Confidential mental health assessment for middle and high school students",
            startDate: "2025-11-01",
            endDate: "2025-12-15",
            status: "Planning",
            targetGroups: "Grades 6-12",
            checkupType: "Mental health assessment",
            completedExams: 0,
            totalStudents: 75,
        },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        targetGroups: "",
        checkupType: "",
    });

    // Filter campaigns by status
    const [filter, setFilter] = useState("all");

    const filteredCampaigns = filter === "all"
        ? campaigns
        : campaigns.filter(campaign => campaign.status.toLowerCase() === filter.toLowerCase());

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-wrap justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Health Check Campaigns</h1>

                <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Campaign
                    </button>

                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Export Report
                    </button>
                </div>
            </div>

            {/* Search and filter */}
            <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search health check campaigns..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Campaigns</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="planning">Planning</option>
                </select>
            </div>

            {/* Campaign Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                        <div className={`px-4 py-2 text-white font-semibold 
              ${campaign.status === 'Active' ? 'bg-green-600' :
                                campaign.status === 'Upcoming' ? 'bg-blue-600' :
                                    campaign.status === 'Planning' ? 'bg-purple-600' : 'bg-gray-600'}`}
                        >
                            {campaign.status}
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Progress:</span>
                                    <span className="font-medium">{campaign.completedExams}/{campaign.totalStudents}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${(campaign.completedExams / campaign.totalStudents) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                <div>
                                    <span className="text-gray-600 block">Start Date:</span>
                                    <span>{campaign.startDate}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600 block">End Date:</span>
                                    <span>{campaign.endDate}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-600 block">Target Groups:</span>
                                    <span>{campaign.targetGroups}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-600 block">Check-up Type:</span>
                                    <span>{campaign.checkupType}</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <Link
                                    to={`/nurse/health-checks/${campaign.id}/schedule`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    View Schedule
                                </Link>
                                <Link
                                    to={`/nurse/health-checks/${campaign.id}/results`}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    View Results
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Campaign Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Health Check Campaign</h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Campaign Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newCampaign.name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    value={newCampaign.description}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newCampaign.startDate}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newCampaign.endDate}
                                        onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Target Groups</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newCampaign.targetGroups}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, targetGroups: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Check-up Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newCampaign.checkupType}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, checkupType: e.target.value })}
                                >
                                    <option value="">Select type...</option>
                                    <option value="Full physical exam">Full physical exam</option>
                                    <option value="Vision screening">Vision screening</option>
                                    <option value="Hearing test">Hearing test</option>
                                    <option value="Dental examination">Dental examination</option>
                                    <option value="Mental health assessment">Mental health assessment</option>
                                    <option value="Growth and development">Growth and development</option>
                                    <option value="Nutrition assessment">Nutrition assessment</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Create Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HealthCheckCampaigns;