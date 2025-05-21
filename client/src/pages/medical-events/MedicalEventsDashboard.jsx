import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllMedicalEvents,
  getFollowUpEvents,
  getMedicalEventStats
} from "../../services/medicalEventService";

function MedicalEventsDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [followUpEvents, setFollowUpEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get current date for default reporting period
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const [dateRange, setDateRange] = useState({
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = () => {
    setLoading(true);
    try {
      // Get statistics
      const statsData = getMedicalEventStats(dateRange.startDate, dateRange.endDate);
      setStats(statsData);
      
      // Get all events and sort by date (descending)
      const allEvents = getAllMedicalEvents();
      const sortedEvents = [...allEvents].sort((a, b) => {
        return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time);
      });
      
      // Get 5 most recent events
      setRecentEvents(sortedEvents.slice(0, 5));
      
      // Get events requiring follow-up
      setFollowUpEvents(getFollowUpEvents());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const updateStats = () => {
    // Get updated statistics based on selected date range
    const statsData = getMedicalEventStats(dateRange.startDate, dateRange.endDate);
    setStats(statsData);
  };
  
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Minor':
        return 'bg-green-100 text-green-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Serious':
        return 'bg-orange-100 text-orange-800';
      case 'Severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800';
      case 'Requires Follow-up':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard data...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Medical Events Dashboard</h1>
          <p className="text-gray-600">Overview of medical incidents and events</p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/nurse/medical-events/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            <i className="bi bi-plus-circle me-2"></i> New Medical Event
          </Link>
          <Link
            to="/nurse/medical-events/reports"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            <i className="bi bi-graph-up me-2"></i> View Reports
          </Link>
        </div>
      </div>
      
      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Reporting Period</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={updateStats}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Events</p>
                <h3 className="text-3xl font-bold">{stats.totalEvents}</h3>
              </div>
              <div className="rounded-full p-3 bg-blue-100">
                <i className="bi bi-clipboard-pulse text-2xl text-blue-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/nurse/medical-events" className="text-sm text-blue-600 hover:underline">
                View all events <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Open Cases</p>
                <h3 className="text-3xl font-bold">{stats.openEvents}</h3>
              </div>
              <div className="rounded-full p-3 bg-yellow-100">
                <i className="bi bi-exclamation-circle text-2xl text-yellow-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/nurse/medical-events?status=Open" className="text-sm text-blue-600 hover:underline">
                View open cases <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Require Follow-up</p>
                <h3 className="text-3xl font-bold">{stats.followUpRequired}</h3>
              </div>
              <div className="rounded-full p-3 bg-purple-100">
                <i className="bi bi-calendar-check text-2xl text-purple-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/nurse/medical-events?status=Requires%20Follow-up" className="text-sm text-blue-600 hover:underline">
                View follow-ups <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Resolved Cases</p>
                <h3 className="text-3xl font-bold">
                  {stats.countByStatus?.Resolved || 0}
                </h3>
              </div>
              <div className="rounded-full p-3 bg-green-100">
                <i className="bi bi-check-circle text-2xl text-green-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/nurse/medical-events?status=Resolved" className="text-sm text-blue-600 hover:underline">
                View resolved cases <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Distribution by Type and Severity */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Distribution by Event Type</h2>
            <div className="space-y-4">
              {Object.entries(stats.countByType || {}).map(([type, count]) => (
                <div key={type} className="flex items-center">
                  <div className="w-32 md:w-40 flex-shrink-0">
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                  <div className="flex-grow bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-5 rounded-full" 
                      style={{ width: `${(count / stats.totalEvents) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right pl-2">
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Distribution by Severity</h2>
            <div className="space-y-4">
              {Object.entries(stats.countBySeverity || {}).map(([severity, count]) => {
                let barColor;
                
                switch (severity) {
                  case 'Minor':
                    barColor = 'bg-green-500';
                    break;
                  case 'Moderate':
                    barColor = 'bg-yellow-500';
                    break;
                  case 'Serious':
                    barColor = 'bg-orange-500';
                    break;
                  case 'Severe':
                    barColor = 'bg-red-500';
                    break;
                  default:
                    barColor = 'bg-gray-500';
                }
                
                return (
                  <div key={severity} className="flex items-center">
                    <div className="w-32 md:w-40 flex-shrink-0">
                      <span className="text-sm font-medium">{severity}</span>
                    </div>
                    <div className="flex-grow bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div 
                        className={`${barColor} h-5 rounded-full`}
                        style={{ width: `${(count / stats.totalEvents) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right pl-2">
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Events and Needs Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Medical Events</h2>
            <Link to="/nurse/medical-events" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          
          {recentEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent events found.</p>
          ) : (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">
                        <Link to={`/nurse/medical-events/${event.id}`} className="text-blue-600 hover:underline">
                          {event.eventType}: {event.studentName}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityClass(event.severity)}`}>
                        {event.severity}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{event.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Follow-up Required */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Events Requiring Follow-up</h2>
            <Link to="/nurse/medical-events?status=Requires%20Follow-up" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          
          {followUpEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events requiring follow-up.</p>
          ) : (
            <div className="space-y-4">
              {followUpEvents.map((event) => (
                <div key={event.id} className="border-b pb-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">
                        <Link to={`/nurse/medical-events/${event.id}`} className="text-blue-600 hover:underline">
                          {event.eventType}: {event.studentName}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">
                        {event.followUpDate ? `Follow-up date: ${event.followUpDate}` : 'No follow-up date set'}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityClass(event.severity)}`}>
                        {event.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{event.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalEventsDashboard;
