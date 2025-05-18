import React from "react";
import { useAuth } from "../../contexts/AuthContext";

function ParentDashboard() {
  const { currentUser } = useAuth();

  // Sample data for dashboard
  const children = [
    {
      id: 1,
      name: "Emma Johnson",
      grade: "5th Grade",
      healthStatus: "Good",
      alerts: 1,
    },
    {
      id: 2,
      name: "Thomas Johnson",
      grade: "8th Grade",
      healthStatus: "Attention Needed",
      alerts: 2,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Medication",
      description: "Daily asthma medication administered",
      date: "2023-05-16",
      status: "Completed",
    },
    {
      id: 2,
      type: "Health Check",
      description: "Vision screening",
      date: "2023-05-10",
      status: "Attention Required",
    },
    {
      id: 3,
      type: "Vaccination",
      description: "Flu shot consent form",
      date: "2023-05-05",
      status: "Action Needed",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Health Check",
      date: "2023-05-25",
      description: "Complete physical examination",
    },
    {
      id: 2,
      title: "Dental Screening",
      date: "2023-06-10",
      description: "Preventive dental check",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {currentUser?.name}
        </h1>
        <p className="text-gray-600">
          Manage your children's health records and activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Children</h2>
          <div className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{child.name}</h3>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs ${
                      child.healthStatus === "Good"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {child.healthStatus}
                  </div>
                </div>
                {child.alerts > 0 && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {child.alerts} action{child.alerts > 1 ? "s" : ""} needed
                  </div>
                )}
              </div>
            ))}
            <a
              href="/parent/health-records/new"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Add Child
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100">
                    {activity.type}
                  </span>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </div>
                <p className="mt-1">{activity.description}</p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    activity.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "Action Needed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <a
            href="/parent/activities"
            className="block mt-4 text-blue-600 hover:text-blue-800 text-center"
          >
            View all activity →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between">
                  <h3 className="font-medium">{event.title}</h3>
                  <span className="text-sm text-gray-500">{event.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
          <a
            href="/parent/calendar"
            className="block mt-4 text-blue-600 hover:text-blue-800 text-center"
          >
            View calendar →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/parent/health-records"
              className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <h3 className="font-medium">Health Records</h3>
              <p className="text-sm text-gray-600 mt-1">
                View & update health information
              </p>
            </a>
            <a
              href="/parent/medications/request"
              className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
            >
              <h3 className="font-medium">Medication Request</h3>
              <p className="text-sm text-gray-600 mt-1">
                Submit medication for school nurse
              </p>
            </a>
            <a
              href="/parent/vaccinations"
              className="block p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition"
            >
              <h3 className="font-medium">Vaccination Consent</h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage vaccination permissions
              </p>
            </a>
            <a
              href="/parent/health-checks"
              className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
            >
              <h3 className="font-medium">Health Check Results</h3>
              <p className="text-sm text-gray-600 mt-1">
                Review health check findings
              </p>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <ul className="space-y-3">
            <li>
              <a
                href="/resources/flu-season"
                className="text-blue-600 hover:text-blue-800"
              >
                Preparing for Flu Season
              </a>
            </li>
            <li>
              <a
                href="/resources/vision-care"
                className="text-blue-600 hover:text-blue-800"
              >
                Children's Vision Care Tips
              </a>
            </li>
            <li>
              <a
                href="/resources/vaccination-guide"
                className="text-blue-600 hover:text-blue-800"
              >
                School Vaccination Guide
              </a>
            </li>
            <li>
              <a
                href="/resources/mental-health"
                className="text-blue-600 hover:text-blue-800"
              >
                Supporting Student Mental Health
              </a>
            </li>
            <li>
              <a
                href="/resources/nutrition"
                className="text-blue-600 hover:text-blue-800"
              >
                Healthy School Lunches
              </a>
            </li>
          </ul>
          <a
            href="/resources"
            className="block mt-4 text-blue-600 hover:text-blue-800 text-center"
          >
            View all resources →
          </a>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
