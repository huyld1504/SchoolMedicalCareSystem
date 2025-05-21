import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function VaccinationCampaigns() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleCampaign, setScheduleCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isNurseOrManager = ['nurse', 'manager', 'admin'].includes(currentUser?.role);

  // Form state for new campaign
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    vaccineType: "",
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
      title: "Annual Flu Vaccination",
      vaccineType: "Influenza",
      targetGroup: "All Students",
      startDate: "2023-10-15",
      endDate: "2023-10-20",
      description: "Annual influenza vaccination campaign for all students to prevent seasonal flu.",
      status: "upcoming",
      createdBy: "Emily Wilson",
      createdAt: "2023-05-20",
      stats: {
        eligible: 854,
        consented: 650,
        vaccinated: 0,
        declined: 45,
        pending: 159
      }
    },
    {
      id: 2,
      title: "COVID-19 Booster",
      vaccineType: "COVID-19 mRNA",
      targetGroup: "Grades 7-12",
      startDate: "2023-09-05",
      endDate: "2023-09-10",
      description: "Booster vaccination for eligible students aged 12 and above.",
      status: "upcoming",
      createdBy: "Robert Taylor",
      createdAt: "2023-05-18",
      stats: {
        eligible: 425,
        consented: 310,
        vaccinated: 0,
        declined: 80,
        pending: 35
      }
    },
    {
      id: 3,
      title: "MMR Catch-up",
      vaccineType: "Measles, Mumps, Rubella",
      targetGroup: "Grades K-5",
      startDate: "2023-08-10",
      endDate: "2023-08-12",
      description: "Catch-up MMR vaccination campaign for elementary students.",
      status: "planning",
      createdBy: "Sarah Johnson",
      createdAt: "2023-05-15",
      stats: {
        eligible: 410,
        consented: 180,
        vaccinated: 0,
        declined: 30,
        pending: 200
      }
    },
    {
      id: 4,
      title: "HPV Vaccination",
      vaccineType: "Human Papillomavirus",
      targetGroup: "7th Grade",
      startDate: "2023-11-15",
      endDate: "2023-11-17",
      description: "First dose of HPV vaccine for 7th grade students.",
      status: "planning",
      createdBy: "Michael Chen",
      createdAt: "2023-05-10",
      stats: {
        eligible: 120,
        consented: 45,
        vaccinated: 0,
        declined: 15,
        pending: 60
      }
    },
    {
      id: 5,
      title: "Spring Tdap Booster",
      vaccineType: "Tetanus, Diphtheria, Pertussis",
      targetGroup: "6th Grade",
      startDate: "2023-04-10",
      endDate: "2023-04-12",
      description: "Required Tdap booster for all 6th grade students.",
      status: "completed",
      createdBy: "Sarah Johnson",
      createdAt: "2023-03-01",
      stats: {
        eligible: 115,
        consented: 108,
        vaccinated: 105,
        declined: 7,
        pending: 0
      }
    },
    {
      id: 6,
      title: "Hepatitis B Vaccination",
      vaccineType: "Hepatitis B",
      targetGroup: "Kindergarten",
      startDate: "2023-03-15",
      endDate: "2023-03-17",
      description: "Hepatitis B vaccination series for kindergarten students.",
      status: "completed",
      createdBy: "Emily Wilson",
      createdAt: "2023-02-05",
      stats: {
        eligible: 95,
        consented: 90,
        vaccinated: 88,
        declined: 5,
        pending: 0
      }
    }
  ];

  // Sample schedule data
  const sampleSchedules = {
    1: [ // Schedule for Campaign ID 1
      {
        date: "2023-10-15",
        timeSlots: [
          { 
            time: "9:00 AM - 11:00 AM",
            location: "School Gymnasium",
            group: "1st & 2nd Grade",
            vaccinator: "Dr. Johnson",
            progress: { scheduled: 95, completed: 0 }
          },
          { 
            time: "1:00 PM - 3:00 PM",
            location: "School Gymnasium",
            group: "3rd & 4th Grade",
            vaccinator: "Dr. Williams",
            progress: { scheduled: 102, completed: 0 }
          }
        ]
      },
      {
        date: "2023-10-16",
        timeSlots: [
          { 
            time: "9:00 AM - 11:00 AM",
            location: "School Gymnasium",
            group: "5th & 6th Grade",
            vaccinator: "Dr. Johnson",
            progress: { scheduled: 110, completed: 0 }
          },
          { 
            time: "1:00 PM - 3:00 PM",
            location: "School Gymnasium",
            group: "7th & 8th Grade",
            vaccinator: "Dr. Williams",
            progress: { scheduled: 108, completed: 0 }
          }
        ]
      },
      {
        date: "2023-10-17",
        timeSlots: [
          { 
            time: "9:00 AM - 12:00 PM",
            location: "School Gymnasium",
            group: "Make-up Session",
            vaccinator: "Dr. Johnson & Dr. Williams",
            progress: { scheduled: 45, completed: 0 }
          }
        ]
      }
    ],
    2: [ // Schedule for Campaign ID 2
      {
        date: "2023-09-05",
        timeSlots: [
          { 
            time: "8:30 AM - 11:30 AM",
            location: "School Auditorium",
            group: "7th Grade",
            vaccinator: "Dr. Martin",
            progress: { scheduled: 110, completed: 0 }
          },
          { 
            time: "12:30 PM - 3:30 PM",
            location: "School Auditorium",
            group: "8th Grade",
            vaccinator: "Dr. Brown",
            progress: { scheduled: 105, completed: 0 }
          }
        ]
      },
      {
        date: "2023-09-06",
        timeSlots: [
          { 
            time: "8:30 AM - 11:30 AM",
            location: "School Auditorium",
            group: "9th Grade",
            vaccinator: "Dr. Martin",
            progress: { scheduled: 115, completed: 0 }
          },
          { 
            time: "12:30 PM - 3:30 PM",
            location: "School Auditorium",
            group: "10th Grade",
            vaccinator: "Dr. Brown",
            progress: { scheduled: 95, completed: 0 }
          }
        ]
      },
      {
        date: "2023-09-07",
        timeSlots: [
          { 
            time: "8:30 AM - 11:30 AM",
            location: "School Auditorium",
            group: "11th & 12th Grade",
            vaccinator: "Dr. Martin",
            progress: { scheduled: 100, completed: 0 }
          }
        ]
      }
    ]
  };

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
        console.error('Error fetching vaccination campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on search term and status filter
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.vaccineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.targetGroup.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle creating a new campaign
  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setNewCampaign({
      title: "",
      vaccineType: "",
      targetGroup: "",
      startDate: "",
      endDate: "",
      description: "",
      status: "planning"
    });
    setShowModal(true);
  };

  // Handle editing an existing campaign
  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setNewCampaign({
      title: campaign.title,
      vaccineType: campaign.vaccineType,
      targetGroup: campaign.targetGroup,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      description: campaign.description,
      status: campaign.status
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
      // Update existing campaign
      const updatedCampaigns = campaigns.map(campaign =>
        campaign.id === selectedCampaign.id
          ? { ...campaign, ...newCampaign }
          : campaign
      );
      setCampaigns(updatedCampaigns);
    } else {
      // Create new campaign
      const newCampaignObj = {
        id: Date.now(),
        ...newCampaign,
        createdBy: currentUser?.name || "Current User",
        createdAt: new Date().toISOString().split('T')[0],
        stats: {
          eligible: 0,
          consented: 0,
          vaccinated: 0,
          declined: 0,
          pending: 0
        }
      };
      setCampaigns([...campaigns, newCampaignObj]);
    }

    setShowModal(false);
    setSelectedCampaign(null);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Check if a campaign is recent (created in the last 7 days)
  const isRecentCampaign = (createdAt) => {
    const campaignDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - campaignDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Handle viewing schedule
  const handleViewSchedule = (campaign) => {
    setScheduleCampaign(campaign);
    setShowScheduleModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Vaccination Campaigns</h1>
          <p className="text-gray-600">Manage and monitor vaccination programs</p>
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
              placeholder="Search by title, vaccine type, or target group"
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
          <p className="mt-4 text-gray-500">No vaccination campaigns found matching your criteria.</p>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Vaccine Type</p>
                      <p className="text-sm font-medium">{campaign.vaccineType}</p>
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
                        <p className="text-gray-500">Vaccinated</p>
                        <p className="font-medium">{campaign.stats.vaccinated}</p>
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
                      onClick={() => handleViewSchedule(campaign)}
                    >
                      Schedule
                    </button>
                  )}

                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200"
                    onClick={() => navigate(`/nurse/vaccinations/${campaign.id}/records`)}
                  >
                    Records
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
                {selectedCampaign ? 'Edit Vaccination Campaign' : 'Create New Vaccination Campaign'}
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
                  <label htmlFor="vaccineType" className="block text-sm font-medium text-gray-700 mb-1">
                    Vaccine Type<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vaccineType"
                    name="vaccineType"
                    value={newCampaign.vaccineType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
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
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={newCampaign.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div>
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
        </div>
      )}

      {/* Schedule Modal - Điều chỉnh vị trí nằm giữa */}
      {showScheduleModal && scheduleCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div 
            className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
            style={{ marginLeft: "130px" }} // Điều chỉnh để cân đối với sidebar
          >
            <div className="bg-green-50 p-6 border-b border-green-100 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-semibold text-green-800">
                {scheduleCampaign.title} - Vaccination Schedule
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-green-600 hover:text-green-800 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-5">
                <div className="flex flex-wrap gap-4 mb-3">
                  <div className="bg-blue-50 p-3 rounded-lg flex-grow">
                    <h4 className="text-sm font-medium text-gray-500">Target Group</h4>
                    <p className="font-medium">{scheduleCampaign.targetGroup}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg flex-grow">
                    <h4 className="text-sm font-medium text-gray-500">Vaccine Type</h4>
                    <p className="font-medium">{scheduleCampaign.vaccineType}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg flex-grow">
                    <h4 className="text-sm font-medium text-gray-500">Campaign Period</h4>
                    <p className="font-medium">
                      {formatDate(scheduleCampaign.startDate)} - {formatDate(scheduleCampaign.endDate)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        All schedules are subject to change. Parents and students will be notified of any updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {sampleSchedules[scheduleCampaign.id] ? (
                <div className="space-y-8">
                  {sampleSchedules[scheduleCampaign.id].map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-lg mb-4 text-gray-800">{formatDate(day.date)}</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccinator</th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {day.timeSlots.map((slot, slotIndex) => (
                              <tr key={slotIndex} className={slotIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{slot.time}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{slot.group}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{slot.location}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{slot.vaccinator}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-green-600 h-2 rounded-full" 
                                        style={{ 
                                          width: `${(slot.progress.completed / slot.progress.scheduled) * 100}%`
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-xs whitespace-nowrap">
                                      {slot.progress.completed} / {slot.progress.scheduled}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    The schedule for this campaign is still being prepared.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
              <button
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => window.print()}
              >
                Print Schedule
              </button>
              <button
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => setShowScheduleModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Vaccination Campaigns</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Vaccination campaigns help protect students from preventable diseases. Each campaign is designed for specific age groups and follows health department guidelines.</p>
              <p className="mt-1">For parents: Please review and submit consent forms for upcoming campaigns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccinationCampaigns;
