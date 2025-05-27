import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ParentDashboard() {
  const [profileStatus, setProfileStatus] = useState({
    studentInfo: {
      completed: true,
      lastUpdated: '2023-09-15'
    },
    healthDeclaration: {
      completed: false,
      lastUpdated: null
    },
    immunizationRecords: {
      completed: true,
      lastUpdated: '2023-08-20'
    },
    emergencyContacts: {
      completed: true,
      lastUpdated: '2023-09-10'
    },
    consentForms: {
      completed: false,
      lastUpdated: null
    },
    medication: {
      completed: false,
      lastUpdated: null
    }
  });

  const [updateHistory, setUpdateHistory] = useState([
    {
      date: '2023-09-15',
      section: 'Student Information',
      details: 'Updated student class and ID number'
    },
    {
      date: '2023-09-10',
      section: 'Emergency Contacts',
      details: 'Added secondary emergency contact'
    },
    {
      date: '2023-08-20',
      section: 'Immunization Records',
      details: 'Uploaded updated immunization certificate'
    }
  ]);

  const getCompletionPercentage = () => {
    const totalSections = Object.keys(profileStatus).length;
    const completedSections = Object.values(profileStatus).filter(status => status.completed).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  const getNextAction = () => {
    for (const [key, value] of Object.entries(profileStatus)) {
      if (!value.completed) {
        switch (key) {
          case 'studentInfo':
            return 'Hoàn thành thông tin học sinh';
          case 'healthDeclaration':
            return 'Hoàn thành tờ khai sức khỏe';
          case 'immunizationRecords':
            return 'Tải lên hồ sơ tiêm chủng';
          case 'emergencyContacts':
            return 'Thêm liên hệ khẩn cấp';
          case 'consentForms':
            return 'Ký đơn đồng ý';
          case 'medication':
            return 'Thêm thông tin thuốc';
          default:
            return 'Cập nhật hồ sơ';
        }
      }
    }
    return 'Tất cả các phần đã hoàn thành';
  };

  const statusToColor = (status) => {
    return status ? '#10b981' : '#f59e0b';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa hoàn thành';

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">          <Link to="/" className="text-white text-xl font-bold">Hệ thống Y tế Magnus</Link>
          <button className="text-white">Đăng xuất</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Status */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Profile Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(profileStatus).map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <span className={`px-2 py-1 rounded ${value.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {value.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Last updated: {value.lastUpdated || 'Never'}
                    </p>                    <Link
                      to={key.toLowerCase() === 'medication' ? '/medication-form' : `/${key.toLowerCase()}`}
                      className="mt-2 inline-block text-blue-600 hover:text-blue-800"
                    >
                      {value.completed ? 'Update' : 'Complete'}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Completion Progress */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Overall Completion</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-center">{getCompletionPercentage()}% Complete</p>
              </div>
            </div>
          </div>

          {/* Right Column - Update History */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
              <div className="space-y-4">
                {updateHistory.map((update, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{update.section}</h4>
                        <p className="text-sm text-gray-600">{update.details}</p>
                      </div>
                      <span className="text-sm text-gray-500">{update.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;