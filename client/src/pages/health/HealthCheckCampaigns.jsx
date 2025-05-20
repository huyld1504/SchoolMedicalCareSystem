import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function HealthCheckCampaigns() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [campaigns, setCampaigns] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const isNurseOrManager = ['nurse', 'manager', 'admin'].includes(currentUser?.role);

    // Form state for new campaign
    const [newCampaign, setNewCampaign] = useState({
        title: "",
        checkType: "",
        targetGroup: "",
        startDate: "",
        endDate: "",
        description: "",
        status: "planning"
    });

    // Sample campaign data
    const sampleCampaigns = [
        {
            id: 1,
            title: "Annual Physical Examination",
            checkType: "Full physical exam",
            targetGroup: "All students",
            startDate: "2025-08-10",
            endDate: "2025-09-30",
            description: "Comprehensive physical examination for all students",
            status: "active",
            createdBy: "Nurse Jane",
            createdAt: "2025-01-15",
            stats: {
                eligible: 120,
                consented: 100,
                screened: 90
            }
        },
        {
            id: 2,
            title: "Vision Screening",
            checkType: "Vision screening",
            targetGroup: "All students",
            startDate: "2025-10-05",
            endDate: "2025-10-25",
            description: "Annual vision screening for early detection of vision problems",
            status: "upcoming",
            createdBy: "Nurse John",
            createdAt: "2025-02-20",
            stats: {
                eligible: 120,
                consented: 0,
                screened: 0
            }
        },
        {
            id: 3,
            title: "Dental Check-up",
            checkType: "Dental examination",
            targetGroup: "All students",
            startDate: "2025-04-15",
            endDate: "2025-05-15",
            description: "Routine dental examination and hygiene education",
            status: "completed",
            createdBy: "Nurse Jane",
            createdAt: "2025-03-10",
            stats: {
                eligible: 120,
                consented: 110,
                screened: 110
            }
        },
        {
            id: 4,
            title: "Mental Health Screening",
            checkType: "Mental health assessment",
            targetGroup: "Grades 6-12",
            startDate: "2025-11-01",
            endDate: "2025-12-15",
            description: "Confidential mental health assessment for middle and high school students",
            status: "planning",
            createdBy: "Nurse John",
            createdAt: "2025-04-05",
            stats: {
                eligible: 75,
                consented: 0,
                screened: 0
            }
        },
    ];

    // Load campaigns data
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);

                // In a real app, this would be an API call
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                setCampaigns(sampleCampaigns);
            } catch (error) {
                console.error('Error fetching health check campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Filter campaigns based on search term and status filter
    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.checkType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.targetGroup.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Handle creating a new campaign
    const handleCreateCampaign = () => {
        setNewCampaign({
            title: "",
            checkType: "",
            targetGroup: "",
            startDate: "",
            endDate: "",
            description: "",
            status: "planning"
        });
        setSelectedCampaign(null);
        setShowModal(true);
    };

    // Handle editing an existing campaign
    const handleEditCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setNewCampaign({
            title: campaign.title,
            checkType: campaign.checkType,
            targetGroup: campaign.targetGroup,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            description: campaign.description,
            status: campaign.status,
        });
        setShowModal(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCampaign({
            ...newCampaign,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCampaign) {
            // Edit existing campaign
            setCampaigns((prev) =>
                prev.map((campaign) =>
                    campaign.id === selectedCampaign.id ? { ...campaign, ...newCampaign } : campaign
                )
            );
        } else {
            // Create new campaign
            setCampaigns((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    ...newCampaign,
                    status: "upcoming",
                    createdBy: "Current User",
                    createdAt: new Date().toISOString(),
                    stats: {
                        eligible: 0,
                        consented: 0,
                        screened: 0
                    }
                },
            ]);
        }
        setShowModal(false);
        setSelectedCampaign(null);
        setNewCampaign({
            title: "",
            checkType: "",
            targetGroup: "",
            startDate: "",
            endDate: "",
            description: "",
            status: "planning"
        });
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500 text-white';
            case 'upcoming':
                return 'bg-blue-500 text-white';
            case 'completed':
                return 'bg-gray-500 text-white';
            case 'cancelled':
                return 'bg-red-500 text-white';
            case 'planning':
            default:
                return 'bg-yellow-500 text-white';
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Check if a campaign is recent (created in the last 7 days)
    const isRecentCampaign = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Health Check Campaigns</h1>
                    <p className="text-gray-600">Manage and monitor health screening programs</p>
                </div>

                {isNurseOrManager && (
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center transition duration-150"
                        onClick={handleCreateCampaign}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Campaign
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Campaigns
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by title, check type, or target group"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="planning">Planning</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Campaigns List */}
            {loading ? (
                <div className="bg-white rounded-lg shadow p-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <p className="mt-4 text-gray-500">No health check campaigns found matching your criteria.</p>
                    {isNurseOrManager && (
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleCreateCampaign}
                        >
                            Create New Campaign
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-lg shadow overflow-hidden">
                            {isRecentCampaign(campaign.createdAt) && (
                                <div className="absolute top-0 right-0 mt-4 mr-4">
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">NEW</span>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-start">
                                        <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Check Type</p>
                                            <p className="text-sm font-medium">{campaign.checkType}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Target Group</p>
                                            <p className="text-sm font-medium">{campaign.targetGroup}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <div>
                                            <p className="text-sm text-gray-500">Campaign Dates</p>
                                            <p className="text-sm font-medium">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{campaign.description}</p>

                                {/* Campaign Stats */}
                                {campaign.stats && (
                                    <div className="mt-6">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Campaign Status</h4>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{
                                                    width: `${(campaign.stats.consented / campaign.stats.eligible) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                                            <div>
                                                <p className="text-gray-500">Eligible</p>
                                                <p className="font-medium">{campaign.stats.eligible}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Consented</p>
                                                <p className="font-medium">{campaign.stats.consented}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Screened</p>
                                                <p className="font-medium">{campaign.stats.screened}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                    Created by {campaign.createdBy}
                                </div>

                                <div className="flex space-x-2">
                                    {isNurseOrManager && (
                                        <button
                                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium hover:bg-blue-200"
                                            onClick={() => handleEditCampaign(campaign)}
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {(campaign.status === 'upcoming' || campaign.status === 'active' || campaign.status === 'planning') && (
                                        <button
                                            className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm font-medium hover:bg-green-200"
                                            onClick={() => navigate(`/nurse/health-checks/${campaign.id}/schedule`)}
                                        >
                                            Schedule
                                        </button>
                                    )}

                                    <button
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200"
                                        onClick={() => navigate(`/nurse/health-checks/${campaign.id}/results`)}
                                    >
                                        Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Campaign Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">
                                {selectedCampaign ? 'Edit Health Check Campaign' : 'Create New Health Check Campaign'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Campaign Title<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={newCampaign.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="checkType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Check Type<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="checkType"
                                        name="checkType"
                                        value={newCampaign.checkType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Check Type</option>
                                        <option value="Vision">Vision</option>
                                        <option value="Hearing">Hearing</option>
                                        <option value="Dental">Dental</option>
                                        <option value="Height & Weight">Height & Weight</option>
                                        <option value="Posture/Spine">Posture/Spine</option>
                                        <option value="Blood Pressure">Blood Pressure</option>
                                        <option value="General Health">General Health</option>
                                        <option value="Mental Health">Mental Health</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="targetGroup" className="block text-sm font-medium text-gray-700 mb-1">
                                        Target Group<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="targetGroup"
                                        name="targetGroup"
                                        value={newCampaign.targetGroup}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={newCampaign.startDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            value={newCampaign.endDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={newCampaign.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>                                </div>                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={newCampaign.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="planning">Planning</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedCampaign(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {selectedCampaign ? 'Update Campaign' : 'Create Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>)}
        </div>
    );
}

export default HealthCheckCampaigns;