import React, { useState, useEffect } from "react";
import {
  getMedicalEventStats,
  getEventsByDateRange,
  eventTypes
} from "../../services/medicalEventService";

function MedicalEventReports() {
  // Set default date range to last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const [dateRange, setDateRange] = useState({
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  });
  
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("type"); // "type", "severity", "status"
  
  useEffect(() => {
    loadReportData();
  }, []);
  
  const loadReportData = () => {
    setLoading(true);
    try {
      // Get events in the selected date range
      const eventsInRange = getEventsByDateRange(dateRange.startDate, dateRange.endDate);
      setEvents(eventsInRange);
      
      // Get statistics for the date range
      const statsData = getMedicalEventStats(dateRange.startDate, dateRange.endDate);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading report data:", error);
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
  
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };
  
  const updateReport = () => {
    loadReportData();
  };
  
  // Calculate daily event counts for the time series chart
  const calculateDailyEventCounts = () => {
    const dailyCounts = {};
    
    // Initialize all dates in the range with 0 counts
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      dailyCounts[dateString] = 0;
    }
    
    // Count events for each date
    events.forEach(event => {
      if (dailyCounts[event.date] !== undefined) {
        dailyCounts[event.date]++;
      }
    });
    
    return dailyCounts;
  };
  
  // Function to determine percentages for pie chart segments
  const calculatePercentages = (data) => {
    if (!data || Object.keys(data).length === 0) return [];
    
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(data).map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading report data...</p>
      </div>
    );
  }
  
  // Get the appropriate data for the current chart type
  const chartData = stats ? (
    chartType === "type" ? stats.countByType :
    chartType === "severity" ? stats.countBySeverity :
    stats.countByStatus
  ) : {};
  
  const pieChartData = calculatePercentages(chartData);
  const dailyEventCounts = calculateDailyEventCounts();
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Medical Event Reports</h1>
        <p className="text-gray-600">
          Analyze medical events and identify trends
        </p>
      </div>
      
      {/* Report Controls */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={updateReport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Report
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Total Events</h3>
            <p className="text-3xl font-bold">{stats.totalEvents}</p>
            <p className="text-sm text-gray-500 mt-2">
              {dateRange.startDate} to {dateRange.endDate}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Open Cases</h3>
            <p className="text-3xl font-bold">{stats.openEvents}</p>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round((stats.openEvents / stats.totalEvents) * 100) || 0}% of total events
            </p>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Require Follow-up</h3>
            <p className="text-3xl font-bold">{stats.followUpRequired}</p>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round((stats.followUpRequired / stats.totalEvents) * 100) || 0}% of total events
            </p>
          </div>
          
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Resolved Cases</h3>
            <p className="text-3xl font-bold">{stats.countByStatus?.Resolved || 0}</p>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round(((stats.countByStatus?.Resolved || 0) / stats.totalEvents) * 100) || 0}% of total events
            </p>
          </div>
        </div>
      )}
      
      {/* Chart Controls */}
      <div className="mb-4">
        <div className="inline-block bg-white rounded shadow p-2">
          <div className="flex">
            <button
              onClick={() => setChartType("type")}
              className={`px-4 py-2 rounded ${
                chartType === "type" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              By Type
            </button>
            <button
              onClick={() => setChartType("severity")}
              className={`px-4 py-2 rounded ${
                chartType === "severity" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              By Severity
            </button>
            <button
              onClick={() => setChartType("status")}
              className={`px-4 py-2 rounded ${
                chartType === "status" ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              By Status
            </button>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">
            Distribution by {chartType === "type" ? "Event Type" : chartType === "severity" ? "Severity" : "Status"}
          </h2>
          
          {pieChartData.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No data available</p>
          ) : (
            <div>
              {/* Visual Pie Chart Representation */}
              <div className="flex items-center justify-center my-4">
                <div className="relative w-48 h-48">
                  {pieChartData.map((item, index) => {
                    // For a real app, you would use a proper charting library
                    // This is a simplified visual representation
                    const startAngle = index > 0 
                      ? pieChartData.slice(0, index).reduce((sum, i) => sum + i.percentage, 0) * 3.6
                      : 0;
                    const endAngle = startAngle + (item.percentage * 3.6);
                    
                    // Generate a color based on index
                    const hue = (index * 137) % 360; // Golden angle approximation for color distribution
                    const color = `hsl(${hue}, 70%, 65%)`;
                    
                    return (
                      <div
                        key={item.label}
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `conic-gradient(transparent ${startAngle}deg, ${color} ${startAngle}deg, ${color} ${endAngle}deg, transparent ${endAngle}deg)`,
                          borderRadius: '50%'
                        }}
                      ></div>
                    );
                  })}
                  {/* Inner white circle to create donut effect */}
                  <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">{stats.totalEvents}</span>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pieChartData.map((item, index) => {
                  // Generate the same color as in the chart
                  const hue = (index * 137) % 360;
                  const color = `hsl(${hue}, 70%, 65%)`;
                  
                  return (
                    <div key={item.label} className="flex items-center">
                      <div 
                        className="w-4 h-4 mr-2 rounded-sm" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="flex-grow">
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{item.count}</span>
                        <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Time Series Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Daily Event Counts</h2>
          
          {Object.keys(dailyEventCounts).length === 0 ? (
            <p className="text-center text-gray-500 py-4">No data available</p>
          ) : (
            <div>
              {/* Simple bar chart representation */}
              <div className="h-48 flex items-end space-x-1">
                {Object.entries(dailyEventCounts).map(([date, count]) => {
                  const maxCount = Math.max(...Object.values(dailyEventCounts));
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {new Date(date).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Total events in period: {stats.totalEvents}</p>
                <p>
                  Average: 
                  {Math.round(stats.totalEvents / Object.keys(dailyEventCounts).length * 10) / 10} 
                  events per day
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Event Listing */}
      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Event List</h2>
          <p className="text-sm text-gray-500">
            {events.length} events from {dateRange.startDate} to {dateRange.endDate}
          </p>
        </div>
        
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No events found in the selected date range
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{event.date}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{event.studentName}</div>
                      <div className="text-sm text-gray-500">{event.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{event.eventType}</div>
                      <div className="text-sm text-gray-500">{event.eventSubtype}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${event.severity === 'Minor' ? 'bg-green-100 text-green-800' : 
                          event.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          event.severity === 'Serious' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}
                      >
                        {event.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${event.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                          event.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalEventReports;
