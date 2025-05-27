import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import medicationReportService from "../../services/medicationReportService";

// Chart components (these would typically be imported from a chart library like Chart.js or Recharts)
const ComplianceChart = ({ data }) => {
  // Placeholder for actual chart implementation
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">Tỷ lệ Tuân thủ</h4>
        <p className="text-lg font-bold">{data.complianceRate}%</p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${data.complianceRate}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <p>Tổng: {data.total}</p>
        <p>Đã cấp phát: {data.administered}</p>
        <p>Đã bỏ qua: {data.skipped}</p>
      </div>
    </div>
  );
};

const TimeBarChart = ({ data }) => {
  // Placeholder for actual chart implementation
  return (
    <div className="bg-white p-4 rounded-md">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Cấp phát theo Thời gian trong Ngày
      </h4>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs mb-1">
              <span>{item.period}</span>
              <span>{item.total} loại thuốc</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="flex h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-l-full"
                  style={{
                    width:
                      item.total > 0
                        ? `${(item.administered / item.total) * 100}%`
                        : "0%",
                  }}
                ></div>
                <div
                  className="bg-yellow-500 h-2.5 rounded-r-full"
                  style={{
                    width:
                      item.total > 0
                        ? `${(item.skipped / item.total) * 100}%`
                        : "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-2 space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Đã cấp phát</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>Đã bỏ qua</span>
        </div>
      </div>
    </div>
  );
};

function MedicationReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [studentReports, setStudentReports] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [integratedHealthReport, setIntegratedHealthReport] = useState(null);
  // Extract tab from URL if present
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }

    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);

    // Load initial report on component mount
    loadReport();
  }, [searchParams, loadReport]);
  // Update URL when tab changes
  useEffect(() => {
    searchParams.set("tab", activeTab);
    setSearchParams(searchParams);
  }, [activeTab, searchParams, setSearchParams]);
  // Load report data
  const loadReport = async () => {
    setLoading(true);
    try {
      // Get comprehensive report data
      const reportData =
        await medicationReportService.generateComprehensiveReport(
          startDate || null,
          endDate || null
        );
      setReport(reportData);

      // Get student-specific reports
      const students =
        await medicationReportService.generateStudentMedicationReport(
          null,
          startDate || null,
          endDate || null
        );
      setStudentReports(students);

      // Get integrated health report data
      const healthReportData =
        await medicationReportService.generateIntegratedHealthReport(
          null,
          startDate || null,
          endDate || null
        );
      setIntegratedHealthReport(healthReportData);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date filter change
  const handleApplyFilter = (e) => {
    e.preventDefault();
    loadReport();
  };

  // Handle downloading the report
  const handleDownloadReport = () => {
    if (!report) return;

    // Create report JSON
    const reportJson = JSON.stringify(report, null, 2);
    const blob = new Blob([reportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger click
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `medication_report_${startDate}_to_${endDate}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Generate CSV export of student data
  const handleExportCsv = () => {
    if (!studentReports || studentReports.length === 0) return;

    // Create CSV header
    const csvHeader =
      "Student Name,Student ID,Grade,Medication,Dosage,Administered,Skipped,Compliance Rate\n";

    // Create CSV rows
    const csvRows = studentReports
      .map((student) => {
        return [
          student.studentName,
          student.studentId,
          student.grade,
          student.medication,
          student.dosage,
          student.administered,
          student.skipped,
          `${student.complianceRate}%`,
        ].join(",");
      })
      .join("\n");

    // Combine and create download
    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `medication_student_report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link
          to="/nurse/medications"
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>          Trở về Bảng điều khiển
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Báo cáo Cấp phát Thuốc
        </h1>
        <p className="text-gray-600">
          Phân tích và theo dõi thống kê cấp phát thuốc
        </p>
      </div>
      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form
          onSubmit={handleApplyFilter}
          className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4"
        >
          <div>            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày Bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày Kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Áp dụng Bộ lọc"}
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={loading || !report}
            >
              Tải Báo cáo
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={loading || studentReports.length === 0}
            >
              Xuất CSV
            </button>
          </div>
        </form>
      </div>

      {/* Report Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"              }`}
            >
              Tổng quan
            </button>

            <button
              onClick={() => setActiveTab("compliance")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "compliance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tuân thủ
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "inventory"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Kho thuốc
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "students"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Báo cáo Học sinh
            </button>
          </nav>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Report Content */}
      {!loading && report && (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-4">
                    Tóm tắt Cấp phát
                  </h3>
                  <ComplianceChart data={report.compliance.overallCompliance} />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-4">Sử dụng Thuốc</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Tổng Liều Đã cấp phát
                      </p>
                      <p className="text-2xl font-bold">
                        {report.inventory.totalDosesAdministered}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Thuốc Được sử dụng Nhiều nhất
                      </p>
                      {report.inventory.medicationUsage.length > 0 ? (
                        <p className="text-lg font-medium">
                          {report.inventory.medicationUsage.sort(
                            (a, b) => b.administered - a.administered
                          )[0]?.name || "None"}
                        </p>
                      ) : (                        <p className="text-lg font-medium">Không có</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-4">
                    Phân bổ Thời gian
                  </h3>
                  <TimeBarChart data={report.timeAnalysis.timeAnalysis} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">                <div className="px-6 py-4 border-b">
                  <h3 className="font-medium text-lg">
                    Tuân thủ theo Cấp độ Lớp
                  </h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Lớp
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tổng Cấp phát
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Đã cấp phát
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Đã bỏ qua
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tỷ lệ Tuân thủ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.compliance.gradeCompliance.map(
                          (grade, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {grade.grade}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {grade.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {grade.administered}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {grade.skipped}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    grade.complianceRate >= 90
                                      ? "bg-green-100 text-green-800"
                                      : grade.complianceRate >= 75
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {grade.complianceRate}%
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === "compliance" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-4">
                    Tuân thủ Tổng thể
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-4xl font-bold text-blue-600">
                      {report.compliance.overallCompliance.complianceRate}%
                    </p>
                    <p className="text-sm text-gray-500">Tỷ lệ Cấp phát</p>
                  </div>
                  <ComplianceChart data={report.compliance.overallCompliance} />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-4">
                    Cấp phát theo Thời gian
                  </h3>
                  <TimeBarChart data={report.timeAnalysis.timeAnalysis} />
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    {report.timeAnalysis.timeAnalysis.map((period, index) => (
                      <div key={index} className="bg-gray-50 rounded-md p-3">
                        <p className="text-xs text-gray-500">{period.period}</p>
                        <p className="text-lg font-bold">
                          {period.complianceRate}%
                        </p>
                        <p className="text-xs text-gray-500">Tuân thủ</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow mb-6">                <div className="px-6 py-4 border-b">
                  <h3 className="font-medium text-lg">
                    Học sinh có Tuân thủ Thấp
                  </h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
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
                            Lớp
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
                            Tỷ lệ Tuân thủ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.compliance.studentReports
                          .filter((student) => student.complianceRate < 80)
                          .sort((a, b) => a.complianceRate - b.complianceRate)
                          .map((student, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.studentName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {student.studentId}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.grade}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.medication}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.dosage}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    student.complianceRate < 50
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {student.complianceRate}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Link
                                  to="#"
                                  onClick={() => {
                                    setActiveTab("students");
                                    setSelectedStudentId(student.studentId);
                                  }}                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Xem Chi tiết
                                </Link>
                              </td>
                            </tr>
                          ))}
                        {report.compliance.studentReports.filter(
                          (student) => student.complianceRate < 80
                        ).length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              Không tìm thấy học sinh có tuân thủ thấp
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-2">Tổng Liều thuốc</h3>
                  <div className="flex space-x-6">
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        {report.inventory.totalDosesAdministered}
                      </p>
                      <p className="text-xs text-gray-500">Đã cấp phát</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-yellow-500">
                        {report.inventory.totalDosesSkipped}
                      </p>
                      <p className="text-xs text-gray-500">Đã bỏ qua</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                  <h3 className="font-medium text-lg mb-4">Tỷ lệ Sử dụng</h3>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                          Đã cấp phát
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-green-600">
                          {report.inventory.totalDosesAdministered +
                            report.inventory.totalDosesSkipped >
                          0
                            ? Math.round(
                                (report.inventory.totalDosesAdministered /
                                  (report.inventory.totalDosesAdministered +
                                    report.inventory.totalDosesSkipped)) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex h-2">
                      <div
                        style={{
                          width: `${
                            report.inventory.totalDosesAdministered +
                              report.inventory.totalDosesSkipped >
                            0
                              ? (report.inventory.totalDosesAdministered /
                                  (report.inventory.totalDosesAdministered +
                                    report.inventory.totalDosesSkipped)) *
                                100
                              : 0
                          }%`,
                        }}
                        className="bg-green-500 rounded-l"
                      ></div>
                      <div
                        style={{
                          width: `${
                            report.inventory.totalDosesAdministered +
                              report.inventory.totalDosesSkipped >
                            0
                              ? (report.inventory.totalDosesSkipped /
                                  (report.inventory.totalDosesAdministered +
                                    report.inventory.totalDosesSkipped)) *
                                100
                              : 0
                          }%`,
                        }}
                        className="bg-yellow-500 rounded-r"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">                <div className="px-6 py-4 border-b">
                  <h3 className="font-medium text-lg">Sử dụng Thuốc</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
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
                            Liều lượng
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
                            Đã cấp phát
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Đã bỏ qua
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tổng
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {report.inventory.medicationUsage
                          .sort((a, b) => b.administered - a.administered)
                          .map((medication, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {medication.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medication.dosage}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medication.studentCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medication.administered}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medication.skipped}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {medication.total}
                              </td>
                            </tr>
                          ))}
                        {report.inventory.medicationUsage.length === 0 && (
                          <tr>                            <td
                              colSpan="6"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              Không có dữ liệu sử dụng thuốc
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Reports Tab */}
          {activeTab === "students" && (
            <div>
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="px-6 py-4 border-b">                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="font-medium text-lg">
                      Báo cáo Thuốc cho Học sinh
                    </h3>
                    <div className="mt-3 md:mt-0">
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                      >
                        <option value="">Tất cả Học sinh</option>
                        {studentReports.map((student, index) => (
                          <option key={index} value={student.studentId}>
                            {student.studentName} ({student.studentId})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">                        <tr>
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
                            Lớp
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
                            Đã cấp phát
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Đã bỏ qua
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tuân thủ
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentReports
                          .filter(
                            (student) =>
                              !selectedStudentId ||
                              student.studentId === selectedStudentId
                          )
                          .map((student, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.studentName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {student.studentId}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.grade}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.medication}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.dosage}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.administered}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.skipped}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    student.complianceRate >= 90
                                      ? "bg-green-100 text-green-800"
                                      : student.complianceRate >= 75
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.complianceRate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        {studentReports.filter(
                          (student) =>
                            !selectedStudentId ||
                            student.studentId === selectedStudentId
                        ).length === 0 && (
                          <tr>                            <td
                              colSpan="6"
                              className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                              Không có dữ liệu học sinh
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Student Administration History */}
              {selectedStudentId && (
                <div className="bg-white rounded-lg shadow">                  <div className="px-6 py-4 border-b">
                    <h3 className="font-medium text-lg">
                      Lịch sử Cấp phát
                    </h3>
                  </div>
                  <div className="p-6">
                    {studentReports
                      .filter(
                        (student) => student.studentId === selectedStudentId
                      )
                      .map((student, index) => (
                        <div key={index}>
                          <div className="mb-4">
                            <h4 className="font-medium text-lg">
                              {student.studentName} - {student.medication}{" "}
                              {student.dosage}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Thời gian cấp phát: {student.startDate} đến{" "}
                              {student.endDate}
                            </p>
                          </div>

                          {student.administrationHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Ngày
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
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Ghi chú
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {student.administrationHistory.map(
                                    (record, idx) => (
                                      <tr
                                        key={idx}
                                        className={
                                          idx % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                        }
                                      >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {record.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {record.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">                                          <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                              record.administered
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                          >
                                            {record.administered
                                              ? "Đã cấp phát"
                                              : "Đã bỏ qua"}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                          {record.notes || "—"}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (                            <div className="text-center p-6 bg-gray-50 rounded-md">
                              <p className="text-gray-500">
                                Không có lịch sử cấp phát
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* No Data State */}
      {!loading && (!report || Object.keys(report).length === 0) && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có dữ liệu báo cáo
          </h3>
          <p className="text-gray-500 mb-6">
            Đặt khoảng thời gian và áp dụng bộ lọc để tạo báo cáo cấp phát thuốc.
          </p>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tạo Báo cáo
          </button>
        </div>
      )}
    </div>
  );
}

export default MedicationReports;
