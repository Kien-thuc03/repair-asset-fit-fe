"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Eye,
  FileText,
  User,
  CheckCircle,
  Clock,
  Send,
  Filter,
  Signature,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  mockInspectionReports,
  InspectionReport,
} from "@/lib/mockData/inspectionReports";
import InspectionReportDetailModal from "./modal/InspectionReportDetailModal";
import SignConfirmationModal from "./modal/SignConfirmationModal";

export default function BienBanPage() {
  const [inspectionReports, setInspectionReports] = useState<
    InspectionReport[]
  >(mockInspectionReports);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<InspectionReport | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        overflow-y: auto;
      }
      
      body {
        min-height: 100vh;
      }
      
      .main-content {
        min-height: calc(100vh - 2rem);
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filteredReports = inspectionReports.filter((report) => {
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.relatedReportTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sắp xếp dữ liệu
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortField === "" || sortDirection === "none") return 0;

    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case "reportNumber":
        aValue = a.reportNumber;
        bValue = b.reportNumber;
        break;
      case "relatedReportTitle":
        aValue = a.relatedReportTitle;
        bValue = b.relatedReportTitle;
        break;
      case "createdBy":
        aValue = a.createdBy;
        bValue = b.createdBy;
        break;
      case "inspectionDate":
        aValue = new Date(a.inspectionDate);
        bValue = new Date(b.inspectionDate);
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Hàm hiển thị icon sắp xếp
  const getSortIcon = (field: string) => {
    return (
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={`h-3 w-3 ${
            sortField === field && sortDirection === "asc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortField === field && sortDirection === "desc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "signed":
        return "bg-green-100 text-green-800";
      case "sent_back":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ ký";
      case "signed":
        return "Đã ký";
      case "sent_back":
        return "Đã gửi lại";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "signed":
        return <CheckCircle className="h-4 w-4" />;
      case "sent_back":
        return <Send className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetail = (report: InspectionReport) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleSignReport = (report: InspectionReport) => {
    setSelectedReport(report);
    setShowSignModal(true);
  };

  const confirmSign = () => {
    if (selectedReport) {
      setInspectionReports((reports) =>
        reports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                status: "signed" as const,
                leaderSignature: "Nguyễn Thanh Tú",
                leaderSignedAt: new Date().toISOString(),
              }
            : report
        )
      );
      setShowSignModal(false);
      setSelectedReport(null);
    }
  };

  const handleSendBack = (reportId: string) => {
    setInspectionReports((reports) =>
      reports.map((report) =>
        report.id === reportId
          ? { ...report, status: "sent_back" as const }
          : report
      )
    );
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 main-content">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Xác nhận biên bản
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Xem và ký xác nhận các biên bản kiểm tra do Phòng Quản trị gửi đến
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <div className="flex flex-col h-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
              Tìm kiếm
            </label>
            <div className="relative flex-1 min-w-0 h-9 sm:h-10">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none flex-shrink-0 z-10" />
              <input
                type="text"
                className="absolute inset-0 w-full h-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                placeholder="Số biên bản, tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
              Trạng thái
            </label>
            <div className="flex-1 h-9 sm:h-10">
              <select
                className="w-full h-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="pending">Chờ ký</option>
                <option value="signed">Đã ký</option>
                <option value="sent_back">Đã gửi lại</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col h-full justify-end">
            <div className="h-9 sm:h-10">
              <button className="w-full h-full inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách biên bản ({sortedReports.length})
          </h2>
        </div>

        <div className="flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
          <div className="flex-1 overflow-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="p-3 space-y-3">
                {sortedReports.length > 0 ? (
                  sortedReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {report.reportNumber}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              Tờ trình: {report.relatedReportTitle}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            report.status
                          )}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">
                            {getStatusText(report.status)}
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <div className="text-gray-500">Người lập</div>
                          <div className="text-gray-900 font-medium">
                            {report.createdBy}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Ngày kiểm tra</div>
                          <div className="text-gray-900">
                            {new Date(report.inspectionDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetail(report)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Xem chi tiết">
                          <Eye className="h-4 w-4" />
                        </button>
                        {report.status === "pending" && (
                          <button
                            onClick={() => handleSignReport(report)}
                            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200">
                            Ký xác nhận
                          </button>
                        )}
                        {report.status === "signed" && (
                          <button
                            onClick={() => handleSendBack(report.id)}
                            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200">
                            Gửi lại
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-xs text-gray-500">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="w-[25%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("reportNumber")}>
                        <span>Số biên bản</span>
                        {getSortIcon("reportNumber")}
                      </button>
                    </th>
                    <th className="w-[30%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("relatedReportTitle")}>
                        <span>Tờ trình liên quan</span>
                        {getSortIcon("relatedReportTitle")}
                      </button>
                    </th>
                    <th className="w-[12%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("createdBy")}>
                        <span>Người lập</span>
                        {getSortIcon("createdBy")}
                      </button>
                    </th>
                    <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase"
                        onClick={() => handleSort("inspectionDate")}>
                        <span>Ngày KT</span>
                        {getSortIcon("inspectionDate")}
                      </button>
                    </th>
                    <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase"
                        onClick={() => handleSort("status")}>
                        <span>Trạng thái</span>
                        {getSortIcon("status")}
                      </button>
                    </th>
                    <th className="w-[13%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedReports.length > 0 ? (
                    sortedReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {report.reportNumber}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                #{report.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="text-sm text-gray-900 truncate">
                            {report.relatedReportTitle.length > 40
                              ? `${report.relatedReportTitle.substring(
                                  0,
                                  40
                                )}...`
                              : report.relatedReportTitle}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center">
                            <User className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900 truncate">
                              {report.createdBy.length > 10
                                ? `${report.createdBy.substring(0, 10)}...`
                                : report.createdBy}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <div className="text-sm text-gray-900">
                            {new Date(report.inspectionDate).toLocaleDateString(
                              "vi-VN",
                              { day: "2-digit", month: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              report.status
                            )}`}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">
                              {getStatusText(report.status)}
                            </span>
                          </span>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleViewDetail(report)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </button>
                            {report.status === "pending" && (
                              <button
                                onClick={() => handleSignReport(report)}
                                className="inline-flex items-center px-2 py-1 border border-green-300 rounded text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100"
                                title="Ký xác nhận">
                                <Signature className="h-3 w-3" />
                                <span className="ml-1 hidden xl:inline">
                                  Ký
                                </span>
                              </button>
                            )}
                            {report.status === "signed" && (
                              <button
                                onClick={() => handleSendBack(report.id)}
                                className="inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                                title="Gửi lại">
                                <Send className="h-3 w-3" />
                                <span className="ml-1 hidden xl:inline">
                                  Gửi
                                </span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          Không tìm thấy kết quả
                        </h3>
                        <p className="text-xs text-gray-500">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <InspectionReportDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedReport={selectedReport}
        onSignReport={handleSignReport}
        onSendBack={handleSendBack}
        getStatusBadge={getStatusBadge}
        getStatusText={getStatusText}
        getStatusIcon={getStatusIcon}
      />

      {/* Sign Confirmation Modal */}
      <SignConfirmationModal
        show={showSignModal}
        onClose={() => setShowSignModal(false)}
        selectedReport={selectedReport}
        onConfirmSign={confirmSign}
      />
    </div>
  );
}
