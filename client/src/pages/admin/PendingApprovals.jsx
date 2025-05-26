import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PendingApprovals() {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [showModal, setShowModal] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [actionType, setActionType] = useState('');

    // Sample pending approvals data
    const [approvals, setApprovals] = useState([
        {
            id: 1,
            type: 'medication',
            title: 'Medication Request - Amoxicillin',
            student: 'Emily Johnson',
            class: '6A',
            requestedBy: 'Sarah Johnson (Parent)',
            date: '2024-01-15',
            urgency: 'high',
            details: {
                medication: 'Amoxicillin 250mg',
                dosage: '1 tablet twice daily',
                duration: '7 days',
                condition: 'Respiratory infection',
                prescribedBy: 'Dr. Smith',
                allergies: 'None known'
            }
        },
        {
            id: 2,
            type: 'vaccination',
            title: 'Vaccination Consent - HPV',
            student: 'Michael Chen',
            class: '8B',
            requestedBy: 'Lisa Chen (Parent)',
            date: '2024-01-14',
            urgency: 'medium',
            details: {
                vaccine: 'HPV (Human Papillomavirus)',
                campaign: 'Grade 8 HPV Vaccination Program',
                scheduledDate: '2024-01-20',
                location: 'School Health Center',
                notes: 'Part of national immunization program'
            }
        },
        {
            id: 3,
            type: 'healthcheck',
            title: 'Health Check Consent - Annual Physical',
            student: 'Sophia Martinez',
            class: '5C',
            requestedBy: 'Carmen Martinez (Parent)',
            date: '2024-01-13',
            urgency: 'low',
            details: {
                checkType: 'Annual Physical Examination',
                scheduledDate: '2024-01-25',
                examiner: 'School Nurse Johnson',
                includesVision: true,
                includesHearing: true,
                includesWeightHeight: true
            }
        },
        {
            id: 4,
            type: 'user',
            title: 'New Parent Account Registration',
            student: 'David Park',
            class: '3A',
            requestedBy: 'Jennifer Park',
            date: '2024-01-12',
            urgency: 'medium',
            details: {
                accountType: 'Parent',
                email: 'jennifer.park@email.com',
                relationship: 'Mother',
                emergencyContact: true,
                documentsSubmitted: ['ID Copy', 'Proof of Address'],
                backgroundCheckStatus: 'Pending'
            }
        },
        {
            id: 5,
            type: 'medication',
            title: 'Emergency Medication - EpiPen',
            student: 'Alex Thompson',
            class: '4B',
            requestedBy: 'Mark Thompson (Parent)',
            date: '2024-01-11',
            urgency: 'high',
            details: {
                medication: 'EpiPen Auto-Injector',
                condition: 'Severe peanut allergy',
                emergencyOnly: true,
                trainingRequired: true,
                expiryDate: '2024-12-01',
                storageInstructions: 'Room temperature, easily accessible'
            }
        }
    ]);

    // Filter approvals based on selected filter
    const filteredApprovals = approvals.filter(approval => {
        if (filter === 'all') return true;
        return approval.type === filter;
    });

    // Sort approvals
    const sortedApprovals = [...filteredApprovals].sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.date) - new Date(a.date);
            case 'urgency':
                const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
            case 'type':
                return a.type.localeCompare(b.type);
            default:
                return 0;
        }
    });

    // Get summary counts
    const summary = {
        total: approvals.length,
        high: approvals.filter(a => a.urgency === 'high').length,
        medication: approvals.filter(a => a.type === 'medication').length,
        newAccounts: approvals.filter(a => a.type === 'user').length
    };

    const handleAction = (approval, action) => {
        setSelectedApproval(approval);
        setActionType(action);
        setShowModal(true);
    };

    const confirmAction = () => {
        // In a real app, this would make an API call
        console.log(`${actionType} approval for:`, selectedApproval);

        // Remove from pending list (simulate approval/denial)
        if (actionType === 'approve' || actionType === 'deny') {
            setApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));
        }

        setShowModal(false);
        setSelectedApproval(null);
        setActionType('');
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'medication':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                );
            case 'vaccination':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                );
            case 'healthcheck':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'user':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
                        <p className="text-gray-600 mt-1">Review and manage pending approval requests</p>
                    </div>
                    <Link
                        to="/admin"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Pending</p>
                            <p className="text-2xl font-bold">{summary.total}</p>
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
                            <p className="text-sm text-gray-600">High Priority</p>
                            <p className="text-2xl font-bold">{summary.high}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full mr-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Medications</p>
                            <p className="text-2xl font-bold">{summary.medication}</p>
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
                            <p className="text-sm text-gray-600">New Accounts</p>
                            <p className="text-2xl font-bold">{summary.newAccounts}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="medication">Medication Requests</option>
                                <option value="vaccination">Vaccination Consents</option>
                                <option value="healthcheck">Health Check Consents</option>
                                <option value="user">User Accounts</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="date">Date (Newest First)</option>
                                <option value="urgency">Urgency (High to Low)</option>
                                <option value="type">Type (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approvals List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Approval Requests ({sortedApprovals.length})</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {sortedApprovals.map(approval => (
                        <div key={approval.id} className="p-6 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-full ${approval.urgency === 'high' ? 'bg-red-100 text-red-600' : approval.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                        {getTypeIcon(approval.type)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-medium text-gray-900">{approval.title}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(approval.urgency)}`}>
                                                {approval.urgency.charAt(0).toUpperCase() + approval.urgency.slice(1)} Priority
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Student:</span> {approval.student}
                                                {approval.class && <span className="ml-2">({approval.class})</span>}
                                            </div>
                                            <div>
                                                <span className="font-medium">Requested by:</span> {approval.requestedBy}
                                            </div>
                                            <div>
                                                <span className="font-medium">Date:</span> {new Date(approval.date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {/* Type-specific details */}
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Details:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                {Object.entries(approval.details).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {
                                                            typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                                                Array.isArray(value) ? value.join(', ') : value
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                    <button
                                        onClick={() => handleAction(approval, 'approve')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(approval, 'deny')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Deny
                                    </button>
                                    <button
                                        onClick={() => handleAction(approval, 'moreInfo')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Request Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {sortedApprovals.length === 0 && (
                        <div className="p-12 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                            <p className="text-gray-600">There are no approval requests matching your current filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Modal */}
            {showModal && selectedApproval && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {actionType === 'approve' && 'Approve Request'}
                                {actionType === 'deny' && 'Deny Request'}
                                {actionType === 'moreInfo' && 'Request More Information'}
                            </h3>

                            <p className="text-gray-600 mb-4">
                                Are you sure you want to {actionType === 'moreInfo' ? 'request more information for' : actionType} this request?
                            </p>

                            <div className="bg-gray-50 p-3 rounded-md mb-4">
                                <p className="font-medium">{selectedApproval.title}</p>
                                <p className="text-sm text-gray-600">Student: {selectedApproval.student}</p>
                            </div>

                            {actionType === 'moreInfo' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message (optional):
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Specify what additional information is needed..."
                                    />
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${actionType === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : actionType === 'deny'
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {actionType === 'moreInfo' ? 'Send Request' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingApprovals;
