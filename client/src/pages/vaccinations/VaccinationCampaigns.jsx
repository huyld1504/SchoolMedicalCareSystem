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
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedCampaignForResponse, setSelectedCampaignForResponse] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [userResponses, setUserResponses] = useState({}); // Track user responses to campaigns
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
      title: "Chiến dịch tiêm vắc xin cúm hàng năm",
      vaccineType: "Vắc xin cúm",
      targetGroup: "Tất cả học sinh",
      startDate: "2023-10-15",
      endDate: "2023-10-20",
      description: "Chiến dịch tiêm vắc xin cúm hàng năm cho tất cả học sinh để phòng ngừa cúm mùa.",
      status: "upcoming",
      createdBy: "Y tá Emily Wilson",
      createdAt: "2023-05-20",
      stats: {
        eligible: 854,
        consented: 650,
        vaccinated: 0,
        declined: 45,
        pending: 159
      }
    }, {
      id: 2,
      title: "Mũi tiêm nhắc lại COVID-19",
      vaccineType: "COVID-19 mRNA",
      targetGroup: "Lớp 7-12",
      startDate: "2023-09-05",
      endDate: "2023-09-10",
      description: "Tiêm nhắc lại vắc xin COVID-19 cho học sinh đủ điều kiện từ 12 tuổi trở lên.",
      status: "active",
      createdBy: "Bác sĩ Robert Taylor",
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
      title: "Tiêm bù vắc xin MMR",
      vaccineType: "Sởi, Quai bị, Rubella (MMR)",
      targetGroup: "Lớp Mẫu giáo-5",
      startDate: "2023-08-10",
      endDate: "2023-08-12",
      description: "Chiến dịch tiêm bù vắc xin MMR cho học sinh tiểu học.",
      status: "planning",
      createdBy: "Y tá Sarah Johnson",
      createdAt: "2023-05-15",
      stats: {
        eligible: 410,
        consented: 180,
        vaccinated: 0,
        declined: 30,
        pending: 200
      }
    }, {
      id: 4,
      title: "Tiêm vắc xin HPV",
      vaccineType: "Vi rút u nhú người (HPV)",
      targetGroup: "Lớp 7",
      startDate: "2023-11-15",
      endDate: "2023-11-17",
      description: "Mũi tiêm đầu tiên vắc xin HPV cho học sinh lớp 7.",
      status: "active",
      createdBy: "Bác sĩ Michael Chen",
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
      title: "Tiêm nhắc lại Tdap mùa xuân",
      vaccineType: "Uốn ván, Bạch hầu, Ho gà (Tdap)",
      targetGroup: "Lớp 6",
      startDate: "2023-04-10",
      endDate: "2023-04-12",
      description: "Tiêm nhắc lại Tdap bắt buộc cho tất cả học sinh lớp 6.",
      status: "completed",
      createdBy: "Y tá Sarah Johnson",
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
      title: "Tiêm vắc xin viêm gan B",
      vaccineType: "Viêm gan B",
      targetGroup: "Mẫu giáo",
      startDate: "2023-03-15",
      endDate: "2023-03-17",
      description: "Chuỗi tiêm vắc xin viêm gan B cho học sinh mẫu giáo.",
      status: "completed",
      createdBy: "Y tá Emily Wilson",
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
            time: "9:00 SA - 11:00 SA",
            location: "Nhà thi đấu trường học",
            group: "Lớp 1 & 2",
            vaccinator: "Bác sĩ Johnson",
            progress: { scheduled: 95, completed: 0 }
          },
          {
            time: "1:00 CH - 3:00 CH",
            location: "Nhà thi đấu trường học",
            group: "Lớp 3 & 4",
            vaccinator: "Bác sĩ Williams",
            progress: { scheduled: 102, completed: 0 }
          }
        ]
      },
      {
        date: "2023-10-16",
        timeSlots: [
          {
            time: "9:00 SA - 11:00 SA",
            location: "Nhà thi đấu trường học",
            group: "Lớp 5 & 6",
            vaccinator: "Bác sĩ Johnson",
            progress: { scheduled: 110, completed: 0 }
          },
          {
            time: "1:00 CH - 3:00 CH",
            location: "Nhà thi đấu trường học",
            group: "Lớp 7 & 8",
            vaccinator: "Bác sĩ Williams",
            progress: { scheduled: 108, completed: 0 }
          }
        ]
      },
      {
        date: "2023-10-17",
        timeSlots: [
          {
            time: "9:00 SA - 12:00 CH",
            location: "Nhà thi đấu trường học",
            group: "Buổi tiêm bù",
            vaccinator: "Bác sĩ Johnson & Bác sĩ Williams",
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
            time: "8:30 SA - 11:30 SA",
            location: "Hội trường trường học",
            group: "Lớp 7",
            vaccinator: "Bác sĩ Martin",
            progress: { scheduled: 110, completed: 0 }
          },
          {
            time: "12:30 CH - 3:30 CH",
            location: "Hội trường trường học",
            group: "Lớp 8",
            vaccinator: "Bác sĩ Brown",
            progress: { scheduled: 105, completed: 0 }
          }
        ]
      },
      {
        date: "2023-09-06",
        timeSlots: [
          {
            time: "8:30 SA - 11:30 SA",
            location: "Hội trường trường học",
            group: "Lớp 9",
            vaccinator: "Bác sĩ Martin",
            progress: { scheduled: 115, completed: 0 }
          },
          {
            time: "12:30 CH - 3:30 CH",
            location: "Hội trường trường học",
            group: "Lớp 10",
            vaccinator: "Bác sĩ Brown",
            progress: { scheduled: 95, completed: 0 }
          }
        ]
      },
      {
        date: "2023-09-07",
        timeSlots: [
          {
            time: "8:30 SA - 11:30 SA",
            location: "Hội trường trường học",
            group: "Lớp 11 & 12",
            vaccinator: "Bác sĩ Martin",
            progress: { scheduled: 100, completed: 0 }
          }
        ]
      }
    ]
  };  // Load campaigns data
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);

        // In a real app, this would be an API call
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setCampaigns(sampleCampaigns);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu chiến dịch tiêm chủng:', error);
      } finally {
        setLoading(false);
      }
    }; fetchCampaigns();
  }, []); // Remove dependency to prevent infinite loop

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

  // Get status text in Vietnamese
  const getStatusText = (status) => {
    switch (status) {
      case 'planning':
        return 'Đang lập kế hoạch';
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'active':
        return 'Đang thực hiện';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
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

  // Handle consent for vaccination
  const handleConsent = (campaignId) => {
    setUserResponses(prev => ({
      ...prev,
      [campaignId]: {
        type: 'consent',
        timestamp: new Date().toISOString(),
        reason: null
      }
    }));
  };

  // Handle decline for vaccination
  const handleDecline = (campaignId) => {
    setSelectedCampaignForResponse(campaignId);
    setShowDeclineModal(true);
  };

  // Handle decline submission
  const handleDeclineSubmit = () => {
    if (selectedCampaignForResponse && declineReason.trim()) {
      setUserResponses(prev => ({
        ...prev,
        [selectedCampaignForResponse]: {
          type: 'decline',
          timestamp: new Date().toISOString(),
          reason: declineReason.trim()
        }
      }));
      setShowDeclineModal(false);
      setSelectedCampaignForResponse(null);
      setDeclineReason('');
    }
  };

  // Check if user has responded to a campaign
  const getUserResponse = (campaignId) => {
    return userResponses[campaignId] || null;
  };

  return (
    <div className="container mx-auto px-4 py-8">      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-1">Chiến dịch tiêm chủng</h1>
        <p className="text-gray-600">Quản lý và giám sát các chương trình tiêm chủng</p>
      </div>


    </div>      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm chiến dịch
            </label>
            <input
              type="text"
              id="search"
              placeholder="Tìm kiếm theo tên, loại vắc xin hoặc nhóm đối tượng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="planning">Đang lập kế hoạch</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="active">Đang thực hiện</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (<div className="bg-white rounded-lg shadow p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
        <p className="mt-4 text-gray-500">Không tìm thấy chiến dịch tiêm chủng nào phù hợp với tiêu chí của bạn.</p>
        {isNurseOrManager && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleCreateCampaign}
          >
            Tạo chiến dịch mới
          </button>
        )}
      </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow overflow-hidden">              {isRecentCampaign(campaign.createdAt) && (
              <div className="absolute top-0 right-0 mt-4 mr-4">
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">MỚI</span>
              </div>
            )}

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Loại vắc xin</p>
                      <p className="text-sm font-medium">{campaign.vaccineType}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Nhóm đối tượng</p>
                      <p className="text-sm font-medium">{campaign.targetGroup}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Thời gian chiến dịch</p>
                      <p className="text-sm font-medium">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-600 line-clamp-2">{campaign.description}</p>                {/* Campaign Stats */}


                {/* Show consent/decline buttons for active campaigns (parent view) */}
                {campaign.status === 'active' && !isNurseOrManager && (
                  <div className="flex space-x-2 w-full">                    {getUserResponse(campaign.id) ? (<div className="w-full">
                    {getUserResponse(campaign.id).type === 'consent' ? (
                      <div className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-center justify-center text-green-700 font-medium mb-2">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Đã đồng ý tham gia
                        </div>
                        <div className="text-sm text-green-600 text-center">
                          Xác nhận ngày: {new Date(getUserResponse(campaign.id).timestamp).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                        <div className="flex items-center justify-center text-red-700 font-medium mb-2">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Đã từ chối
                        </div>
                        <div className="text-sm text-red-600 text-center">
                          Từ chối ngày: {new Date(getUserResponse(campaign.id).timestamp).toLocaleDateString('vi-VN')}
                        </div>
                        {getUserResponse(campaign.id).reason && (
                          <div className="text-sm text-red-600 text-center mt-2 italic">
                            Lý do: {getUserResponse(campaign.id).reason}
                          </div>
                        )}
                      </div>
                    )}
                  </div>) : (
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        onClick={() => handleConsent(campaign.id)}
                        className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition duration-150 shadow-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Đồng ý tham gia
                      </button>
                      <button
                        onClick={() => handleDecline(campaign.id)}
                        className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition duration-150 shadow-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Từ chối
                      </button>
                    </div>
                  )}
                  </div>
                )}

                {/* Admin/nurse controls */}

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">            <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">
              {selectedCampaign ? 'Chỉnh sửa chiến dịch tiêm chủng' : 'Tạo chiến dịch tiêm chủng mới'}
            </h3>
          </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên chiến dịch<span className="text-red-500">*</span>
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
                    Loại vắc xin<span className="text-red-500">*</span>
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
                    Nhóm đối tượng<span className="text-red-500">*</span>
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
                      Ngày bắt đầu<span className="text-red-500">*</span>
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
                      Ngày kết thúc<span className="text-red-500">*</span>
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
                    Mô tả
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
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newCampaign.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="planning">Đang lập kế hoạch</option>
                    <option value="upcoming">Sắp diễn ra</option>
                    <option value="active">Đang thực hiện</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
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
                  Hủy
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {selectedCampaign ? 'Cập nhật chiến dịch' : 'Tạo chiến dịch'}
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
          >            <div className="bg-green-50 p-6 border-b border-green-100 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-semibold text-green-800">
                {scheduleCampaign.title} - Lịch trình tiêm chủng
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
              <div className="mb-5">                <div className="flex flex-wrap gap-4 mb-3">
                <div className="bg-blue-50 p-3 rounded-lg flex-grow">
                  <h4 className="text-sm font-medium text-gray-500">Nhóm đối tượng</h4>
                  <p className="font-medium">{scheduleCampaign.targetGroup}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex-grow">
                  <h4 className="text-sm font-medium text-gray-500">Loại vắc xin</h4>
                  <p className="font-medium">{scheduleCampaign.vaccineType}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg flex-grow">
                  <h4 className="text-sm font-medium text-gray-500">Thời gian chiến dịch</h4>
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
                        Tất cả lịch trình có thể thay đổi. Phụ huynh và học sinh sẽ được thông báo về bất kỳ cập nhật nào.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {sampleSchedules[scheduleCampaign.id] ? (
                <div className="space-y-8">
                  {sampleSchedules[scheduleCampaign.id].map((day, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-lg mb-4 text-gray-800">{formatDate(day.date)}</h4>                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
                        {day.timeSlots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="bg-white border rounded-lg shadow-sm overflow-hidden h-full flex flex-col border-gray-200 hover:shadow-md transition duration-200"
                          >
                            <div className={`px-4 py-3 font-medium text-white ${slotIndex % 2 === 0 ? 'bg-blue-600' : 'bg-green-600'}`}>
                              <div className="flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm md:text-base">{slot.time}</span>
                              </div>
                            </div>
                            <div className="flex-1 p-5">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-5">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nhóm</p>
                                    <div className="flex items-center">
                                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      <p className="text-sm font-medium truncate">{slot.group}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Địa điểm</p>
                                    <div className="flex items-center">
                                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <p className="text-sm font-medium truncate">{slot.location}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-5">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Người tiêm</p>
                                    <div className="flex items-center">
                                      <svg className="flex-shrink-0 h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <p className="text-sm font-medium truncate">{slot.vaccinator}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tiến độ</p>
                                    <div className="flex items-center">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                        <div
                                          className={`h-2.5 rounded-full ${slotIndex % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                                          style={{
                                            width: `${(slot.progress.completed / slot.progress.scheduled) * 100}%`
                                          }}
                                        ></div>
                                      </div>
                                      <span className="text-xs font-medium whitespace-nowrap">
                                        {slot.progress.completed} / {slot.progress.scheduled}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (<div className="text-center py-12">
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch trình</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Lịch trình cho chiến dịch này vẫn đang được chuẩn bị.
                </p>
              </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
              <button
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => window.print()}
              >
                In lịch trình
              </button>
              <button
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => setShowScheduleModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Từ chối tham gia chiến dịch tiêm chủng</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Vui lòng cho biết lý do từ chối tham gia chiến dịch tiêm chủng này:
              </p>

              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Nhập lý do từ chối..."
                required
              />

              {declineReason.trim() === '' && (
                <p className="text-sm text-red-600 mt-1">Vui lòng nhập lý do từ chối</p>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setSelectedCampaignForResponse(null);
                  setDeclineReason('');
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeclineSubmit}
                disabled={declineReason.trim() === ''}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Xác nhận từ chối
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
            <h3 className="text-sm font-medium text-blue-800">Về các chiến dịch tiêm chủng</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Các chiến dịch tiêm chủng giúp bảo vệ học sinh khỏi các bệnh có thể phòng ngừa được. Mỗi chiến dịch được thiết kế cho các nhóm tuổi cụ thể và tuân theo hướng dẫn của sở y tế.</p>
              <p className="mt-1">Dành cho phụ huynh: Vui lòng xem xét và nộp phiếu đồng ý cho các chiến dịch sắp tới.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaccinationCampaigns;
