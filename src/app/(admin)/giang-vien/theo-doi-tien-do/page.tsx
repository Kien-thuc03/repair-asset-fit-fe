"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Eye,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Download,
} from "lucide-react";
import { RepairRequest } from "@/types";
import { mockRepairRequests, repairRequestStatusConfig } from "@/lib/mockData";
import { Breadcrumb } from "antd";

export default function TheoDaoTienDoPage() {
  const [requests] = useState<RepairRequest[]>(mockRepairRequests);
  const [filteredRequests, setFilteredRequests] =
    useState<RepairRequest[]>(mockRepairRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(
    null
  );

  // Selection state for export
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Export modals state
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState<keyof RepairRequest | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    "asc"
  );

  // Handle sorting
  const handleSort = (field: keyof RepairRequest) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.requestCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue: string | undefined = a[sortField] as string | undefined;
        const bValue: string | undefined = b[sortField] as string | undefined;

        // Handle null/undefined values
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortDirection === "asc" ? -1 : 1;
        if (!bValue) return sortDirection === "asc" ? 1 : -1;

        // Handle date comparison
        if (
          sortField === "createdAt" ||
          sortField === "acceptedAt" ||
          sortField === "completedAt"
        ) {
          const aTime = new Date(aValue).getTime();
          const bTime = new Date(bValue).getTime();
          return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
        }

        // Handle string comparison
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();

        if (aLower < bLower) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aLower > bLower) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRequests(filtered);

    // Reset selection when filter changes
    setSelectedItems([]);
    setSelectAll(false);
  }, [requests, searchTerm, statusFilter, sortField, sortDirection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(filteredRequests.map((req) => req.id));
      setSelectAll(true);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      const newSelected = selectedItems.filter((item) => item !== id);
      setSelectedItems(newSelected);
      setSelectAll(false);
    } else {
      const newSelected = [...selectedItems, id];
      setSelectedItems(newSelected);
      setSelectAll(newSelected.length === filteredRequests.length);
    }
  };

  // Xử lý xuất Excel
  const handleExportExcel = () => {
    const itemsToExport =
      selectedItems.length > 0
        ? filteredRequests.filter((req) => selectedItems.includes(req.id))
        : filteredRequests;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // Update selectAll when filteredRequests changes
  useEffect(() => {
    if (selectedItems.length > 0 && filteredRequests.length > 0) {
      setSelectAll(selectedItems.length === filteredRequests.length);
    }
  }, [filteredRequests, selectedItems]);

  // Sortable header component
  const SortableHeader = ({
    field,
    children,
  }: {
    field: keyof RepairRequest;
    children: React.ReactNode;
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => handleSort(field)}>
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "asc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 ${
              sortField === field && sortDirection === "desc"
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="space-y-6 min-h-screen">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Theo dõi tiến độ</span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Theo dõi tiến độ
            </h1>
            <p className="text-gray-600">
              Theo dõi trạng thái xử lý các báo cáo đã gửi
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã yêu cầu, tài sản, phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="CHỜ_TIẾP_NHẬN">Chờ tiếp nhận</option>
              <option value="ĐÃ_TIẾP_NHẬN">Đã tiếp nhận</option>
              <option value="ĐANG_XỬ_LÝ">Đang xử lý</option>
              <option value="CHỜ_THAY_THẾ">Chờ thay thế</option>
              <option value="ĐÃ_HOÀN_THÀNH">Đã hoàn thành</option>
              <option value="ĐÃ_HỦY">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách yêu cầu ({filteredRequests.length})
          </h3>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            <span>
              {selectedItems.length > 0
                ? `Xuất Excel (${selectedItems.length} mục)`
                : `Xuất Excel (${filteredRequests.length} mục)`}
            </span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <SortableHeader field="requestCode">Mã yêu cầu</SortableHeader>
                <SortableHeader field="assetName">Tài sản</SortableHeader>
                <SortableHeader field="roomName">Phòng</SortableHeader>
                <SortableHeader field="errorTypeName">Loại lỗi</SortableHeader>
                <SortableHeader field="status">Trạng thái</SortableHeader>
                <SortableHeader field="assignedTechnicianName">
                  Người xử lý
                </SortableHeader>
                <SortableHeader field="createdAt">Ngày tạo</SortableHeader>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const StatusIcon =
                  repairRequestStatusConfig[request.status].icon;
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(request.id)}
                        onChange={() => handleSelectItem(request.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      <div
                        className="max-w-[120px] truncate"
                        title={request.requestCode}>
                        {request.requestCode}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-[160px]">
                        <div
                          className="text-sm font-medium text-gray-900 truncate"
                          title={request.assetName}>
                          {request.assetName}
                        </div>
                        <div
                          className="text-xs text-gray-500 truncate"
                          title={request.assetCode}>
                          {request.assetCode}
                        </div>
                        {request.componentName && (
                          <div
                            className="text-xs text-gray-400 truncate"
                            title={`Linh kiện: ${request.componentName}`}>
                            LK: {request.componentName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div
                        className="max-w-[100px] truncate"
                        title={request.roomName}>
                        {request.roomName}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div
                        className="max-w-[120px] truncate"
                        title={request.errorTypeName || "Chưa phân loại"}>
                        {request.errorTypeName || "Chưa phân loại"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                          repairRequestStatusConfig[request.status].color
                        }`}>
                        <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {repairRequestStatusConfig[request.status].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div
                        className="max-w-[120px] truncate"
                        title={
                          request.assignedTechnicianName || "Chưa tiếp nhận"
                        }>
                        {request.assignedTechnicianName || "Chưa tiếp nhận"}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div
                        className="max-w-[100px] truncate"
                        title={formatDate(request.createdAt)}>
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Cards */}
        <div className="lg:hidden">
          {/* Mobile Select All */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {selectAll
                  ? `Bỏ chọn tất cả`
                  : `Chọn tất cả (${filteredRequests.length} mục)`}
              </span>
            </label>
          </div>

          <div className="space-y-4 p-4">
            {filteredRequests.map((request) => {
              const StatusIcon = repairRequestStatusConfig[request.status].icon;
              return (
                <div
                  key={request.id}
                  className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(request.id)}
                        onChange={() => handleSelectItem(request.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {request.requestCode}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {request.assetName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {request.assetCode}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                        repairRequestStatusConfig[request.status].color
                      }`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {repairRequestStatusConfig[request.status].label}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Phòng:</span>
                      <p className="text-gray-900 truncate">
                        {request.roomName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Loại lỗi:</span>
                      <p className="text-gray-900 truncate">
                        {request.errorTypeName || "Chưa phân loại"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Người xử lý:</span>
                      <p className="text-gray-900 truncate">
                        {request.assignedTechnicianName || "Chưa tiếp nhận"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <p className="text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>

                  {request.componentName && (
                    <div className="text-xs text-gray-400">
                      Linh kiện: {request.componentName}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có yêu cầu
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy yêu cầu nào phù hợp với bộ lọc.
            </p>
          </div>
        )}
      </div>

      {/* Spacer to ensure minimum height and consistent scrollbar */}
      <div className="min-h-[200px]"></div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết yêu cầu {selectedRequest.requestCode}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tài sản
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.assetName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedRequest.assetCode}
                    </p>
                    {selectedRequest.componentName && (
                      <p className="text-xs text-gray-400">
                        Linh kiện: {selectedRequest.componentName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phòng
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.roomName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại lỗi
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.errorTypeName || "Chưa phân loại"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${
                        repairRequestStatusConfig[selectedRequest.status].color
                      }`}>
                      {repairRequestStatusConfig[selectedRequest.status].label}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedRequest.createdAt)}
                    </p>
                  </div>
                  {selectedRequest.acceptedAt &&
                    selectedRequest.acceptedAt.trim() !== "" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ngày tiếp nhận
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedRequest.acceptedAt)}
                        </p>
                      </div>
                    )}
                  {selectedRequest.completedAt &&
                    selectedRequest.completedAt.trim() !== "" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ngày hoàn thành
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedRequest.completedAt)}
                        </p>
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Người báo cáo
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.reporterName}
                    </p>
                  </div>
                  {selectedRequest.assignedTechnicianName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Người xử lý
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRequest.assignedTechnicianName}
                      </p>
                    </div>
                  )}
                </div>

                {selectedRequest.resolutionNotes &&
                  selectedRequest.resolutionNotes.trim() !== "" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ghi chú xử lý
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRequest.resolutionNotes}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Success Modal */}
      {showExportSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Xuất Excel thành công!
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Đã xuất {exportCount} yêu cầu ra file Excel thành công.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowExportSuccessModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Error Modal */}
      {showExportErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Không thể xuất Excel
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Không có dữ liệu để xuất. Vui lòng chọn ít nhất một yêu cầu.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowExportErrorModal(false)}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
