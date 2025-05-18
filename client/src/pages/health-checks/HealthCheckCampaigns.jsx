import React, { useState } from "react";
import { Link } from "react-router-dom";

function HealthCheckCampaigns() {
  // Demo data for health check campaigns
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Annual Vision & Hearing Screening",
      description: "Routine vision and hearing tests for all students",
      targetGroup: "All Students",
      status: "Active",
      startDate: "2023-10-15",
      endDate: "2023-11-15",
      location: "School Gymnasium",
      organizer: "School Health Department",
      screeningTypes: ["Vision Test", "Hearing Test"],
      consentRequired: true,
      consentDeadline: "2023-10-10",
      totalStudents: 250,
      consentsReceived: 220,
      checkupsCompleted: 150,
    },
    {
      id: 2,
      name: "Dental Health Screening",
      description: "Basic dental checkup and dental hygiene education",
      targetGroup: "Elementary Students",
      status: "Upcoming",
      startDate: "2023-12-01",
      endDate: "2023-12-10",
      location: "School Nurse Office",
      organizer: "City Dental Association",
      screeningTypes: ["Dental Checkup", "Dental Education"],
      consentRequired: true,
      consentDeadline: "2023-11-25",
      totalStudents: 120,
      consentsReceived: 85,
      checkupsCompleted: 0,
    },
    {
      id: 3,
      name: "Growth & BMI Assessment",
      description: "Height, weight, and BMI evaluation",
      targetGroup: "All Students",
      status: "Completed",
      startDate: "2023-02-05",
      endDate: "2023-02-20",
      location: "Physical Education Department",
      organizer: "School Health Department",
      screeningTypes: ["Height & Weight", "BMI Calculation"],
      consentRequired: false,
      consentDeadline: null,
      totalStudents: 250,
      consentsReceived: 250,
      checkupsCompleted: 245,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.targetGroup.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && campaign.status === "Active") ||
      (filterStatus === "upcoming" && campaign.status === "Upcoming") ||
      (filterStatus === "completed" && campaign.status === "Completed");

    return matchesSearch && matchesStatus;
  });

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Health Check Campaigns</h1>
        <p className="text-gray-600">
          View and respond to school health screenings
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search health check campaigns"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Campaigns</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length > 0 ? (
        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Campaign Header */}
              <div
                className={`px-6 py-4 border-l-4 ${
                  campaign.status === "Active"
                    ? "border-green-500 bg-green-50"
                    : campaign.status === "Upcoming"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-500 bg-gray-50"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h2 className="text-xl font-bold">{campaign.name}</h2>
                    <p className="text-gray-600">{campaign.description}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        campaign.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Target Group
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.targetGroup}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Health Checks
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.screeningTypes.join(", ")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Campaign Period
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(campaign.startDate)} -{" "}
                      {formatDate(campaign.endDate)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Location
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Organized By
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.organizer}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Consent Required
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {campaign.consentRequired ? (
                        <span>
                          Yes (Deadline: {formatDate(campaign.consentDeadline)})
                        </span>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress Bar (if Active or Completed) */}
                {(campaign.status === "Active" ||
                  campaign.status === "Completed") && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-medium text-gray-700">
                        Health Checks Completed
                      </h3>
                      <span className="text-sm font-medium text-gray-700">
                        {campaign.checkupsCompleted} of {campaign.totalStudents}{" "}
                        (
                        {Math.round(
                          (campaign.checkupsCompleted /
                            campaign.totalStudents) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.round(
                            (campaign.checkupsCompleted /
                              campaign.totalStudents) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center mt-4 mb-1">
                      <h3 className="text-sm font-medium text-gray-700">
                        Consents Received
                      </h3>
                      <span className="text-sm font-medium text-gray-700">
                        {campaign.consentsReceived} of {campaign.totalStudents}{" "}
                        (
                        {Math.round(
                          (campaign.consentsReceived / campaign.totalStudents) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.round(
                            (campaign.consentsReceived /
                              campaign.totalStudents) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Campaign Actions */}
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  {campaign.status === "Active" && campaign.consentRequired && (
                    <Link
                      to={`/parent/health-checks/${campaign.id}/consent`}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit Consent Form
                    </Link>
                  )}

                  {campaign.status === "Active" && (
                    <Link
                      to={`/parent/health-checks/${campaign.id}/schedule`}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Schedule
                    </Link>
                  )}

                  {(campaign.status === "Active" ||
                    campaign.status === "Completed") &&
                    campaign.checkupsCompleted > 0 && (
                      <Link
                        to={`/parent/health-checks/${campaign.id}/results`}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Results
                      </Link>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No health check campaigns found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria."
              : "There are currently no health check campaigns planned."}
          </p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Regular health screenings help identify potential health issues
              early and ensure students' well-being. Please submit consent forms
              by the deadline to ensure your child can participate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthCheckCampaigns;
