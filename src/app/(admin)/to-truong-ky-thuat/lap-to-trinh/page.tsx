"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Eye,
  FileText,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  mockReplacementLists,
  ReplacementList,
} from "@/lib/mockData/replacementLists";
import CreateReportModal from "./modal/CreateReportModal";
import ListDetailModal from "./modal/ListDetailModal";

export default function LapToTrinhPage() {
  const [replacementLists] = useState<ReplacementList[]>(mockReplacementLists);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState<ReplacementList | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateReportModal, setShowCreateReportModal] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

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
  const sortedLists = [...filteredLists].sort((a, b) => {
    if (sortField === "" || sortDirection === "none") return 0;

    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case "title":
        aValue = a.title;
        bValue = b.title;
        break;
      case "createdBy":
        aValue = a.createdBy;
        bValue = b.createdBy;
        break;
      case "totalItems":
        aValue = a.totalItems;
        bValue = b.totalItems;
        break;
      case "totalCost":
        aValue = a.totalCost;
        bValue = b.totalCost;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
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
            Danh sách đề xuất đã được duyệt ({sortedLists.length})
          </h2>
        </div>

        <div className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="p-3 space-y-3">
              {sortedLists.length > 0 ? (
                sortedLists.map((list) => (
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

          {/* Desktop Table View - Optimized for full width display */}
          <div className="hidden sm:block">
            <div className="overflow-hidden">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[35%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("title")}>
                        <span>Danh sách</span>
                        {getSortIcon("title")}
                      </button>
                    </th>
                    <th className="w-[12%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center space-x-1 hover:text-gray-700 uppercase"
                        onClick={() => handleSort("createdBy")}>
                        <span>Người tạo</span>
                        {getSortIcon("createdBy")}
                      </button>
                    </th>
                    <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase"
                        onClick={() => handleSort("totalItems")}>
                        <span>Thiết bị</span>
                        {getSortIcon("totalItems")}
                      </button>
                    </th>
                    <th className="w-[15%] px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-end space-x-1 hover:text-gray-700 ml-auto uppercase"
                        onClick={() => handleSort("totalCost")}>
                        <span>Chi phí</span>
                        {getSortIcon("totalCost")}
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
                    <th className="w-[10%] hidden lg:table-cell px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase"
                        onClick={() => handleSort("createdAt")}>
                        <span>Ngày tạo</span>
                        {getSortIcon("createdAt")}
                      </button>
                    </th>
                    <th className="w-[8%] lg:w-[8%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLists.length > 0 ? (
                    sortedLists.map((list) => (
                      <tr key={list.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3">
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {list.title.length > 45
                                  ? `${list.title.substring(0, 45)}...`
                                  : list.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                #{list.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="text-sm text-gray-900 truncate">
                            {list.createdBy.length > 12
                              ? `${list.createdBy.substring(0, 12)}...`
                              : list.createdBy}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-900">
                              {list.totalItems}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-right">
                          <div className="text-sm font-semibold text-green-600">
                            {(list.totalCost / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500">VNĐ</div>
                        </td>
                        <td className="px-2 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              list.status
                            )}`}>
                            {getStatusText(list.status)}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-2 py-3 text-center">
                          <div className="text-sm text-gray-900">
                            {new Date(list.createdAt).toLocaleDateString(
                              "vi-VN",
                              { day: "2-digit", month: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleViewDetail(list)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Xem chi tiết">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCreateReport(list.id)}
                              className="inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                              title="Lập tờ trình">
                              <FileText className="h-3 w-3" />
                              <span className="ml-1 hidden xl:inline">
                                Trình
                              </span>
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
      </div>

      {/* Detail Modal */}
      <ListDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedList={selectedList}
        onCreateReport={handleCreateReport}
      />

      {/* Create Report Modal */}
      <CreateReportModal
        show={showCreateReportModal}
        onClose={() => setShowCreateReportModal(false)}
        selectedList={selectedList}
      />
    </div>
  );
}
