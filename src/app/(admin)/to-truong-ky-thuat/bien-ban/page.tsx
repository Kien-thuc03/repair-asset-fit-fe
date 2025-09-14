"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  FileText,
  User,
  CheckCircle,
  Clock,
  Send,
  Signature,
  ChevronUp,
  ChevronDown,
  Download,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import {
  mockInspectionReports,
  InspectionReport,
} from "@/lib/mockData/inspectionReports";
import InspectionReportDetailModal from "./modal/InspectionReportDetailModal";
import SignConfirmationModal from "./modal/SignConfirmationModal";
import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";

export default function BienBanPage() {
  const router = useRouter();
  const [inspectionReports, setInspectionReports] = useState<
    InspectionReport[]
  >(mockInspectionReports);
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Export states
  const [exportCount, setExportCount] = useState(0);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);

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
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.relatedReportTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
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
    router.push(`/to-truong-ky-thuat/bien-ban/chi-tiet?id=${report.id}`);
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

  // Pagination logic
  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedReports.slice(startIndex, endIndex);
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? sortedReports.map((report) => report.id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      setSelectAll(false);
    }
  };

  // Export handler
  const handleExportExcel = () => {
    const itemsToExport =
      selectedItems.length > 0
        ? sortedReports.filter((report) => selectedItems.includes(report.id))
        : sortedReports;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // Reset pagination when changing search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 main-content">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Xác nhận biên bản</span>
                </div>
              ),
            },
          ]}
        />
      </div>
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Số biên bản, tiêu đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Danh sách biên bản ({sortedReports.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSelectAll(!selectAll)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                {selectAll ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                Chọn tất cả
              </button>
              {selectedItems.length > 0 && (
                <span className="text-sm text-blue-600">
                  ({selectedItems.length} mục đã chọn)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
          <div className="flex-1 overflow-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="p-3 space-y-3">
                {getCurrentData().length > 0 ? (
                  getCurrentData().map((report) => (
                    <div
                      key={report.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              handleSelectItem(
                                report.id,
                                !selectedItems.includes(report.id)
                              )
                            }
                            className="mr-2 flex-shrink-0">
                            {selectedItems.includes(report.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
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
                    <th className="w-[5%] px-3 py-3 text-center">
                      <button
                        onClick={() => handleSelectAll(!selectAll)}
                        className="flex items-center justify-center">
                        {selectAll ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </th>
                    <th className="w-[28%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("reportNumber")}>
                        <span>Số biên bản</span>
                        {getSortIcon("reportNumber")}
                      </button>
                    </th>
                    <th className="w-[32%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("relatedReportTitle")}>
                        <span>Tờ trình liên quan</span>
                        {getSortIcon("relatedReportTitle")}
                      </button>
                    </th>
                    <th className="w-[15%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentData().length > 0 ? (
                    getCurrentData().map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() =>
                              handleSelectItem(
                                report.id,
                                !selectedItems.includes(report.id)
                              )
                            }>
                            {selectedItems.includes(report.id) ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </td>
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
                            {report.relatedReportTitle.length > 50
                              ? `${report.relatedReportTitle.substring(
                                  0,
                                  50
                                )}...`
                              : report.relatedReportTitle}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center">
                            <User className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900 truncate">
                              {report.createdBy.length > 12
                                ? `${report.createdBy.substring(0, 12)}...`
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

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          total={sortedReports.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setCurrentPage(1);
          }}
        />
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

      {/* Export Success Modal */}
      {showExportSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Xuất Excel thành công
                </h3>
                <p className="text-sm text-gray-500">
                  Đã xuất {exportCount} biên bản ra file Excel
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowExportSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Error Modal */}
      {showExportErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Lỗi xuất Excel
                </h3>
                <p className="text-sm text-gray-500">
                  Không có dữ liệu để xuất hoặc đã xảy ra lỗi
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowExportErrorModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
