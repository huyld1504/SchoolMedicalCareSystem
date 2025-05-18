import React from "react";
import { useAuth } from "../../contexts/AuthContext";

function NurseDashboard() {
  const { currentUser } = useAuth();
  // Sample data for school nurse dashboard
  const todayStats = {
    visitCount: 15,
    medicationAdmins: 28,
    pendingRequests: 3,
    absentStudents: 12,
  };

  const recentIncidents = [
    {
      id: 1,
      studentName: "Mia Chen",
      grade: "3rd Grade",
      issue: "Minor injury (scraped knee)",
      time: "10:15 AM",
      status: "Treated",
    },
    {
      id: 2,
      studentName: "James Rodriguez",
      grade: "7th Grade",
      issue: "Fever (100.4°F)",
      time: "9:30 AM",
      status: "Sent Home",
    },
    {
      id: 3,
      studentName: "Sarah Kim",
      grade: "4th Grade",
      issue: "Headache",
      time: "11:20 AM",
      status: "Resting",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: "Administer medication to Lucas White",
      time: "12:30 PM",
      priority: "High",
    },
    {
      id: 2,
      task: "Vision screening for 5th grade",
      time: "1:00 PM",
      priority: "Medium",
    },
    {
      id: 3,
      task: "Review new medication forms",
      time: "3:00 PM",
      priority: "Medium",
    },
    {
      id: 4,
      task: "Prepare vaccination clinic supplies",
      time: "4:00 PM",
      priority: "High",
    },
  ];

  const stockAlerts = [
    { id: 1, item: "Band-aids", status: "Low Stock", level: "15%" },
    { id: 2, item: "Ibuprofen", status: "Low Stock", level: "20%" },
    { id: 3, item: "Ice packs", status: "Adequate", level: "60%" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nurse Dashboard</h1>
        <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Clinic Visits Today
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">{todayStats.visitCount}</div>
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              +3 from yesterday
            </span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Medications Administered
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">
              {todayStats.medicationAdmins}
            </div>
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              On track
            </span>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Pending Requests
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">
              {todayStats.pendingRequests}
            </div>
            <a
              href="/nurse/requests"
              className="ml-2 text-yellow-800 text-sm underline"
            >
              Review now
            </a>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">
            Absent Students
          </h3>
          <div className="flex items-center mt-2">
            <div className="text-3xl font-bold">
              {todayStats.absentStudents}
            </div>
            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              3 due to illness
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Incidents */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Incidents</h2>
            <a
              href="/nurse/events"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Issue
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {incident.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {incident.grade}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          incident.status === "Treated"
                            ? "bg-green-100 text-green-800"
                            : incident.status === "Sent Home"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <a
              href="/nurse/events/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Record New Incident
            </a>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <ul className="divide-y divide-gray-200">
            {upcomingTasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs rounded-full 
                    ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-gray-500 text-sm">{task.time}</span>
                </div>
                <p className="mt-1">{task.task}</p>
              </li>
            ))}
          </ul>
          <a
            href="/nurse/schedule"
            className="block mt-4 text-center text-blue-600 hover:text-blue-800"
          >
            View full schedule →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/nurse/medications/dashboard"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <h3 className="font-medium">Medication Dashboard</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all medications
              </p>
            </a>
            <a
              href="/nurse/medications/admin"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <h3 className="font-medium">Administer Medication</h3>
              <p className="text-sm text-gray-600 mt-1">
                Record medication given to student
              </p>
            </a>
            <a
              href="/nurse/medications/approval"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <h3 className="font-medium">Review Medication Requests</h3>
              <p className="text-sm text-gray-600 mt-1">
                Approve pending medication requests
              </p>
            </a>
            <a
              href="/nurse/events/new"
              className="block p-4 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
              <h3 className="font-medium">Record Medical Event</h3>
              <p className="text-sm text-gray-600 mt-1">
                Document incidents or symptoms
              </p>
            </a>
            <a
              href="/nurse/health-checks"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <h3 className="font-medium">Health Checkups</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage scheduled health screenings
              </p>
            </a>
            <a
              href="/nurse/vaccinations"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <h3 className="font-medium">Vaccination Programs</h3>
              <p className="text-sm text-gray-600 mt-1">
                View and manage vaccination campaigns
              </p>
            </a>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Inventory Status</h2>
            <a
              href="/nurse/medications/inventory"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Manage inventory
            </a>
          </div>
          <ul className="divide-y divide-gray-200">
            {stockAlerts.map((item) => (
              <li
                key={item.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{item.item}</h3>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full
                    ${
                      item.status === "Low Stock"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="w-24">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        item.status === "Low Stock"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                      style={{ width: item.level }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {item.level}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <a
            href="/nurse/medications/inventory/order"
            className="block mt-4 text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Place Supply Order
          </a>
        </div>
      </div>
    </div>
  );
}

export default NurseDashboard;
