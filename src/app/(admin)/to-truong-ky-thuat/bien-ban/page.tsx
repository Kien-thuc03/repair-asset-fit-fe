"use client";
import { useState } from "react";
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
} from "lucide-react";
import {
  mockInspectionReports,
  InspectionReport,
} from "@/lib/mockData/inspectionReports";

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
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/to-truong-ky-thuat"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Về trang chủ
        </Link>

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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách biên bản ({filteredReports.length})
          </h2>
        </div>

        <div className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="p-3 space-y-3">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
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
            <div className="overflow-hidden">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[25%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số biên bản
                    </th>
                    <th className="w-[30%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tờ trình liên quan
                    </th>
                    <th className="w-[12%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người lập
                    </th>
                    <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày KT
                    </th>
                    <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="w-[13%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
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
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-3 sm:p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết biên bản #{selectedReport.reportNumber}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1">
                  ×
                </button>
              </div>

              <div className="space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Report Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin biên bản
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Số biên bản:</span>
                      <p className="font-medium">
                        {selectedReport.reportNumber}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tờ trình liên quan:</span>
                      <p className="font-medium">
                        {selectedReport.relatedReportTitle}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày kiểm tra:</span>
                      <p className="font-medium">
                        {new Date(
                          selectedReport.inspectionDate
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Người kiểm tra:</span>
                      <p className="font-medium">{selectedReport.createdBy}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Đơn vị:</span>
                      <p className="font-medium">{selectedReport.department}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          selectedReport.status
                        )}`}>
                        {getStatusIcon(selectedReport.status)}
                        <span className="ml-1">
                          {getStatusText(selectedReport.status)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center">
                  <h2 className="text-lg font-bold text-gray-900 uppercase">
                    {selectedReport.title}
                  </h2>
                </div>

                {/* Items Table */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Danh sách thiết bị kiểm tra ({selectedReport.items.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                            TT
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                            Nội dung kiểm tra
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                            Số lượng
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                            Vị trí
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                            Tình trạng
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                            Giải pháp khắc phục
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedReport.items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border border-gray-300 text-center">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                              <div className="font-medium">
                                {item.assetName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Mã: {item.assetCode}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border border-gray-300 text-center">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                              {item.location}
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                              <span className="text-red-600 font-medium">
                                {item.condition}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900 border border-gray-300">
                              <div>{item.proposedSolution}</div>
                              <div className="text-xs text-green-600 font-medium mt-1">
                                Chi phí:{" "}
                                {item.estimatedCost.toLocaleString("vi-VN")} VNĐ
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {selectedReport.notes && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Ghi chú:</h4>
                    <p className="text-sm text-gray-700">
                      {selectedReport.notes}
                    </p>
                  </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Phòng Quản trị
                    </h4>
                    <div className="text-sm text-gray-600 mb-4">
                      Nhân viên Kỹ thuật
                    </div>
                    {selectedReport.inspectorSignature && (
                      <div className="border border-dashed border-gray-300 p-4 min-h-[80px] flex items-center justify-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {selectedReport.inspectorName}
                          </div>
                          <div className="text-xs text-gray-500">Đã ký</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Khoa CNTT
                    </h4>
                    <div className="text-sm text-gray-600 mb-4">
                      Tổ trưởng Kỹ thuật
                    </div>
                    <div className="border border-dashed border-gray-300 p-4 min-h-[80px] flex items-center justify-center">
                      {selectedReport.leaderSignature ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {selectedReport.leaderSignature}
                          </div>
                          <div className="text-xs text-gray-500">
                            Đã ký:{" "}
                            {new Date(
                              selectedReport.leaderSignedAt!
                            ).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">
                          Chờ ký xác nhận
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                  Đóng
                </button>
                {selectedReport.status === "pending" && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleSignReport(selectedReport);
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                    <Signature className="h-4 w-4 mr-2" />
                    Ký xác nhận
                  </button>
                )}
                {selectedReport.status === "signed" && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleSendBack(selectedReport.id);
                    }}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Gửi lại Phòng Quản trị
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Confirmation Modal */}
      {showSignModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Signature className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Xác nhận ký biên bản
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn ký xác nhận biên bản{" "}
                  <span className="font-medium">
                    {selectedReport.reportNumber}
                  </span>{" "}
                  không?
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Sau khi ký, bạn có thể gửi biên bản lại cho Phòng Quản trị.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSignModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none">
                    Hủy
                  </button>
                  <button
                    onClick={confirmSign}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none">
                    Ký xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
