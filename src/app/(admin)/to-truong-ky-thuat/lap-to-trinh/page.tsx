"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Eye,
  FileText,
  Calendar,
  User,
  Building2,
  Computer,
  DollarSign,
  Filter,
} from "lucide-react";
import {
  mockReplacementLists,
  ReplacementList,
} from "@/lib/mockData/replacementLists";
import CreateReportModal from "./modal/CreateReportModal";

export default function LapToTrinhPage() {
  const [replacementLists] = useState<ReplacementList[]>(mockReplacementLists);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<ReplacementList | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);

  const filteredLists = replacementLists.filter((list) => {
    const matchesStatus =
      selectedStatus === "all" || list.status === selectedStatus;
    const matchesSearch =
      searchTerm === "" ||
      list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Nháp";
      case "submitted":
        return "Đã gửi";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const handleCreateReport = (listId: string) => {
    const list = replacementLists.find((l) => l.id === listId);
    if (list) {
      setSelectedList(list);
      setShowCreateReportModal(true);
    }
  };

  const handleViewDetail = (list: ReplacementList) => {
    setSelectedList(list);
    setShowDetailModal(true);
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
              Lập tờ trình
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Quản lý và lập tờ trình cho các danh sách đề xuất thay thế thiết
              bị
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
                placeholder="Tiêu đề, mã danh sách..."
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
                <option value="draft">Nháp</option>
                <option value="submitted">Đã gửi</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
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

      {/* Lists Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách đề xuất ({filteredLists.length})
          </h2>
        </div>

        <div className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="p-3 space-y-3">
              {filteredLists.length > 0 ? (
                filteredLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {list.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Mã: {list.id}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          list.status
                        )}`}>
                        {getStatusText(list.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-gray-500">Người tạo</div>
                        <div className="text-gray-900 font-medium">
                          {list.createdBy}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Số thiết bị</div>
                        <div className="text-gray-900 font-medium">
                          {list.totalItems} thiết bị
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Chi phí ước tính</div>
                        <div className="text-green-600 font-semibold">
                          {list.totalCost.toLocaleString("vi-VN")} VNĐ
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Ngày tạo</div>
                        <div className="text-gray-900">
                          {new Date(list.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetail(list)}
                        className="text-indigo-600 hover:text-indigo-900 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCreateReport(list.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200">
                        Lập tờ trình
                      </button>
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
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số thiết bị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi phí ước tính
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLists.length > 0 ? (
                  filteredLists.map((list) => (
                    <tr key={list.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {list.title.length > 50
                                ? `${list.title.substring(0, 50)}...`
                                : list.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              Mã: {list.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {list.createdBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Computer className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {list.totalItems} thiết bị
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-green-600">
                            {list.totalCost.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            list.status
                          )}`}>
                          {getStatusText(list.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(list.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetail(list)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleCreateReport(list.id)}
                            className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">
                            <FileText className="h-3 w-3 mr-1" />
                            Lập tờ trình
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
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

      {/* Detail Modal */}
      {showDetailModal && selectedList && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-8 mx-auto p-3 sm:p-5 border w-11/12 sm:w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết danh sách #{selectedList.id}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1">
                  <Eye className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* List Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Thông tin chung
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tiêu đề:</span>
                      <p className="font-medium">{selectedList.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Người tạo:</span>
                      <p className="font-medium">{selectedList.createdBy}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tổng thiết bị:</span>
                      <p className="font-medium">
                        {selectedList.totalItems} thiết bị
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Chi phí ước tính:</span>
                      <p className="font-medium text-green-600">
                        {selectedList.totalCost.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                  </div>
                  {selectedList.description && (
                    <div className="mt-3">
                      <span className="text-gray-600">Mô tả:</span>
                      <p className="text-sm mt-1">{selectedList.description}</p>
                    </div>
                  )}
                </div>

                {/* Equipment List */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Danh sách thiết bị ({selectedList.requests.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedList.requests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Computer className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium text-sm">
                              {request.assetCode} - {request.assetName}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {request.estimatedCost.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{request.requestedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            <span className="truncate">{request.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(request.requestDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                          <strong>Lý do:</strong> {request.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleCreateReport(selectedList.id);
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Lập tờ trình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      <CreateReportModal
        show={showCreateReportModal}
        onClose={() => setShowCreateReportModal(false)}
        selectedList={selectedList}
      />
    </div>
  );
}
