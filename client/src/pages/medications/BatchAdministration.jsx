import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMedications } from "../../services/medicationService";
import {
  recordAdministration,
  recordSkippedMedication,
} from "../../services/medicationAdministrationService";

function BatchAdministration() {
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    grade: "all",
    timeWindow: "all", // Options: 'next30', 'next60', 'all'
    medicationType: "all",
  });

  // Notes for administration
  const [batchNotes, setBatchNotes] = useState("");
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [currentTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Load medications
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await getMedications();
        setMedications(data);
        setFilteredMedications(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching medications:", error);
        setErrorMessage("Không thể tải thuốc. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...medications];

    // Filter by grade
    if (filters.grade !== "all") {
      filtered = filtered.filter((med) => med.grade.includes(filters.grade));
    }

    // Filter by time window
    if (filters.timeWindow !== "all") {
      const now = new Date();
      const minutesToAdd = filters.timeWindow === "next30" ? 30 : 60;
      const futureTime = new Date(now.getTime() + minutesToAdd * 60000);

      filtered = filtered.filter((med) => {
        // Convert medication time to comparable format
        const [hourMin, period] = med.time.split(" ");
        const [hour, minute] = hourMin.split(":").map(Number);
        let hours24 = hour;

        if (period.toUpperCase() === "PM" && hour !== 12) {
          hours24 += 12;
        } else if (period.toUpperCase() === "AM" && hour === 12) {
          hours24 = 0;
        }

        const medTime = new Date();
        medTime.setHours(hours24, minute, 0, 0);

        return medTime >= now && medTime <= futureTime;
      });
    }

    // Filter by medication type
    if (filters.medicationType !== "all") {
      filtered = filtered.filter((med) =>
        med.medication
          .toLowerCase()
          .includes(filters.medicationType.toLowerCase())
      );
    }

    setFilteredMedications(filtered);
  }, [filters, medications]);

  // Handle checkbox selection
  const handleSelectMedication = (id) => {
    setSelectedMedications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Select/deselect all
  const handleSelectAll = () => {
    const allSelected = filteredMedications.every(
      (med) => selectedMedications[med.id]
    );

    const newSelection = {};
    filteredMedications.forEach((med) => {
      newSelection[med.id] = !allSelected;
    });

    setSelectedMedications(newSelection);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle batch administration
  const handleBatchAdminister = async () => {
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const selectedIds = Object.keys(selectedMedications).filter(
      (id) => selectedMedications[id]
    );

    if (selectedIds.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất một loại thuốc để cấp phát.");
      setSubmitting(false);
      return;
    }

    try {
      const now = new Date();
      const administrationTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const administrationPromises = selectedIds.map((id) => {
        const medicationToAdminister = medications.find(
          (med) => med.id.toString() === id
        );

        return recordAdministration(id, {
          administeredBy: "Nurse Sarah", // In a real app, this would come from logged in user
          administeredAt: administrationTime,
          notes: batchNotes,
          dosage: medicationToAdminister.dosage,
        });
      });

      await Promise.all(administrationPromises);      setSuccessMessage(
        `Đã cấp phát thành công ${selectedIds.length} loại thuốc.`
      );

      // Reset selections
      setSelectedMedications({});
      setBatchNotes("");

      // Refresh medications list
      const updatedMedications = await getMedications();
      setMedications(updatedMedications);
    } catch (error) {
      console.error("Error administering medications:", error);      setErrorMessage(
        "Không thể ghi nhận việc cấp phát thuốc. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle batch skip
  const handleBatchSkip = async () => {
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const selectedIds = Object.keys(selectedMedications).filter(
      (id) => selectedMedications[id]
    );

    if (selectedIds.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất một loại thuốc để bỏ qua.");
      setSubmitting(false);
      return;
    }

    if (!batchNotes) {
      setErrorMessage("Vui lòng cung cấp lý do bỏ qua thuốc.");
      setSubmitting(false);
      return;
    }

    try {
      const now = new Date();
      const administrationTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const skipPromises = selectedIds.map((id) => {
        return recordSkippedMedication(id, {
          skippedBy: "Nurse Sarah", // In a real app, this would come from logged in user
          skippedAt: administrationTime,
          reason: batchNotes,
        });
      });

      await Promise.all(skipPromises);      setSuccessMessage(
        `Đã ghi nhận thành công ${selectedIds.length} loại thuốc bị bỏ qua.`
      );

      // Reset selections
      setSelectedMedications({});
      setBatchNotes("");

      // Refresh medications list
      const updatedMedications = await getMedications();
      setMedications(updatedMedications);
    } catch (error) {
      console.error("Error recording skipped medications:", error);      setErrorMessage(
        "Không thể ghi nhận thuốc bị bỏ qua. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>            <h1 className="text-3xl font-bold mb-1">
              Cấp phát Thuốc Hàng loạt
            </h1>
            <p className="text-gray-600">
              {currentDate} | {currentTime}
            </p>
          </div>

          <Link
            to="/nurse/medications/dashboard"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Trở về Bảng điều khiển
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Lọc Thuốc
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cấp độ Lớp
              </label>
              <select
                id="grade"
                name="grade"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filters.grade}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả các Lớp</option>
                <option value="K">Mẫu giáo</option>
                <option value="1st">Lớp 1</option>
                <option value="2nd">Lớp 2</option>
                <option value="3rd">Lớp 3</option>
                <option value="4th">Lớp 4</option>
                <option value="5th">Lớp 5</option>
                <option value="6th">Lớp 6</option>
                <option value="7th">Lớp 7</option>
                <option value="8th">Lớp 8</option>
              </select>
            </div>

            <div>              <label
                htmlFor="timeWindow"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Khoảng Thời gian
              </label>
              <select
                id="timeWindow"
                name="timeWindow"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filters.timeWindow}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả Thời gian</option>
                <option value="next30">30 Phút tới</option>
                <option value="next60">60 Phút tới</option>
              </select>
            </div>

            <div>              <label
                htmlFor="medicationType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Loại Thuốc
              </label>
              <select
                id="medicationType"
                name="medicationType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filters.medicationType}
                onChange={handleFilterChange}
              >
                <option value="all">Tất cả Loại</option>
                <option value="ibuprofen">Ibuprofen</option>
                <option value="albuterol">Albuterol</option>
                <option value="cetirizine">Cetirizine</option>
                <option value="methylphenidate">Methylphenidate</option>
                <option value="insulin">Insulin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Batch Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Hành động Hàng loạt
          </h2>

          <div className="mb-4">            <label
              htmlFor="batchNotes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ghi chú Cấp phát / Lý do Bỏ qua
            </label>
            <textarea
              id="batchNotes"
              rows="3"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Nhập ghi chú cho việc cấp phát hoặc lý do bỏ qua"
              value={batchNotes}
              onChange={(e) => setBatchNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              onClick={handleBatchAdminister}
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Cấp phát đã Chọn"}
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              onClick={handleBatchSkip}
              disabled={submitting}
            >
              {submitting ? "Đang xử lý..." : "Bỏ qua đã Chọn"}
            </button>
          </div>
        </div>
      </div>

      {/* Medications Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between p-4 border-b">          <h2 className="text-lg font-semibold text-gray-800">
            Thuốc ({filteredMedications.length})
          </h2>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="selectAll"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={
                filteredMedications.length > 0 &&
                filteredMedications.every((med) => selectedMedications[med.id])
              }
              onChange={handleSelectAll}
            />            <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700">
              Chọn Tất cả
            </label>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
            <p className="mt-2 text-gray-500">Đang tải thuốc...</p>
          </div>
        ) : filteredMedications.length === 0 ? (
          <div className="p-8 text-center">            <p className="text-gray-500">
              Không tìm thấy thuốc nào phù hợp với bộ lọc đã chọn.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Chọn
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Học sinh
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thuốc
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thời gian
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map((medication) => (
                <tr
                  key={medication.id}
                  className={
                    selectedMedications[medication.id]
                      ? "bg-blue-50"
                      : "bg-white"
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedMedications[medication.id] || false}
                      onChange={() => handleSelectMedication(medication.id)}
                      disabled={medication.status !== "pending"}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {medication.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medication.grade} | ID: {medication.studentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {medication.medication}
                      </div>
                      <div className="text-sm text-gray-500">
                        {medication.dosage}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {medication.instructions}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medication.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        medication.status === "administered"
                          ? "bg-green-100 text-green-800"
                          : medication.status === "missed"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {medication.status === "administered"
                        ? "Đã cấp phát"
                        : medication.status === "missed"
                        ? "Đã bỏ lỡ"
                        : medication.status === "pending"
                        ? "Chờ xử lý"
                        : medication.status.charAt(0).toUpperCase() +
                          medication.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Helper Info */}
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
          <div className="ml-3">            <p className="text-sm text-blue-700">
              Sử dụng trang này để cấp phát hoặc bỏ qua nhiều loại thuốc cùng một lúc.
              Lọc theo lớp, khoảng thời gian, hoặc loại thuốc để tìm các
              thuốc bạn cần quản lý.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchAdministration;
