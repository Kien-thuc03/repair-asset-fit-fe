"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Calendar,
  User,
  Building2,
  Computer,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ReplacementRequestForList } from "@/types";

const mockRequests: ReplacementRequestForList[] = [
  {
    id: "REQ-001",
    assetCode: "PC-H301-01",
    assetName: "Máy tính Desktop Dell OptiPlex 3070",
    requestedBy: "Nguyễn Văn A",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H301",
    reason: "Hỏng mainboard Intel H310, không thể sửa chữa",
    status: "pending",
    priority: "high",
    requestDate: "2024-01-15",
    estimatedCost: 8500000,
    description:
      "Máy tính bị hỏng mainboard sau 4 năm sử dụng, đã kiểm tra và xác định cần thay thế mainboard mới Intel H310 hoặc tương đương.",
  },
  {
    id: "REQ-002",
    assetCode: "PC-H205-15",
    assetName: "Máy tính Desktop HP EliteDesk 800",
    requestedBy: "Trần Thị B",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H205",
    reason: "RAM DDR4 8GB hỏng, máy không khởi động được",
    status: "pending",
    priority: "medium",
    requestDate: "2024-01-14",
    estimatedCost: 1200000,
    description:
      "RAM DDR4 8GB bị lỗi sau 3 năm sử dụng, máy báo lỗi memory test failed, cần thay RAM mới cùng loại.",
  },
  {
    id: "REQ-003",
    assetCode: "PC-H704-08",
    assetName: "Máy tính Desktop Asus VivoPC",
    requestedBy: "Lê Văn C",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H704",
    reason: "Ổ cứng SSD 256GB hỏng, mất dữ liệu",
    status: "approved",
    priority: "high",
    requestDate: "2024-01-12",
    estimatedCost: 2800000,
    description:
      "Ổ cứng SSD Samsung 256GB bị bad sector nghiêm trọng, không thể phục hồi dữ liệu, cần thay SSD mới cùng dung lượng.",
  },
  {
    id: "REQ-004",
    assetCode: "PC-H109-22",
    assetName: "Máy tính Desktop Lenovo ThinkCentre",
    requestedBy: "Phạm Thị D",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H109",
    reason: "Nguồn điện 500W bị cháy, có mùi khét",
    status: "pending",
    priority: "high",
    requestDate: "2024-01-16",
    estimatedCost: 1800000,
    description:
      "Nguồn điện Cooler Master 500W bị short mạch, có tiếng nổ nhỏ và mùi cháy, cần thay nguồn mới ngay lập tức để đảm bảo an toàn.",
  },
  {
    id: "REQ-005",
    assetCode: "PC-H508-11",
    assetName: "Máy tính Desktop MSI Pro",
    requestedBy: "Hoàng Văn E",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H508",
    reason: "Card đồ họa GTX 1050 hỏng, không hiển thị hình ảnh",
    status: "pending",
    priority: "medium",
    requestDate: "2024-01-13",
    estimatedCost: 4200000,
    description:
      "Card đồ họa NVIDIA GTX 1050 2GB bị lỗi chip, màn hình không hiển thị gì, cần thay card đồ họa mới tương đương hoặc cao hơn.",
  },
  {
    id: "REQ-006",
    assetCode: "PC-H902-03",
    assetName: "Máy tính Desktop Acer Veriton",
    requestedBy: "Võ Thị F",
    unit: "Khoa Công nghệ Thông tin",
    location: "Tòa H - Phòng H902",
    reason: "CPU Intel i5-8400 quá nóng, máy tự động tắt",
    status: "rejected",
    priority: "low",
    requestDate: "2024-01-10",
    estimatedCost: 5500000,
    description:
      "CPU Intel i5-8400 bị quá nhiệt do tản nhiệt hỏng, đã thay tản nhiệt mới nhưng CPU vẫn bị lỗi, cần thay CPU mới.",
  },
];

export default function DuyetDeXuatPage() {
  const [requests, setRequests] =
    useState<ReplacementRequestForList[]>(mockRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<ReplacementRequestForList | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const filteredRequests = requests
    .filter((request) => {
      const matchesStatus =
        selectedStatus === "all" || request.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "all" || request.priority === selectedPriority;
      const matchesSearch =
        searchTerm === "" ||
        request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      // Chỉ sắp xếp khi có sortField được chọn
      if (!sortField) return 0;

      let aValue: string | number | Date =
        a[sortField as keyof ReplacementRequestForList];
      let bValue: string | number | Date =
        b[sortField as keyof ReplacementRequestForList];

      // Handle date sorting
      if (sortField === "requestDate") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        // Reset về không sắp xếp
        setSortField("");
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      // Hiển thị icon active cho cột đang được sắp xếp
      if (sortDirection === "asc") {
        return (
          <div className="flex flex-col ml-1">
            <ChevronUp className="h-3 w-3 text-blue-600" />
            <ChevronDown className="h-3 w-3 text-gray-300 -mt-1" />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col ml-1">
            <ChevronUp className="h-3 w-3 text-gray-300" />
            <ChevronDown className="h-3 w-3 text-blue-600 -mt-1" />
          </div>
        );
      }
    } else {
      // Hiển thị icon mặc định cho các cột khác
      return (
        <div className="flex flex-col ml-1 opacity-50 hover:opacity-100 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
        </div>
      );
    }
  };

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" as const } : req
      )
    );
    setShowModal(false);
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      )
    );
    setShowModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  // Xử lý checkbox
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];

      // Update selectAll state based on new selection
      setSelectAll(
        newSelected.length === filteredRequests.length &&
          filteredRequests.length > 0
      );
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectAll || selectedItems.length === filteredRequests.length) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(filteredRequests.map((req) => req.id));
      setSelectAll(true);
    }
  };

  // Xử lý xuất Excel
  const handleExportExcel = () => {
    const itemsToExport =
      selectedItems.length > 0
        ? filteredRequests.filter((req) => selectedItems.includes(req.id))
        : filteredRequests;

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    alert(`Xuất ${itemsToExport.length} bản ghi ra Excel`);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 ">
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
              Duyệt đề xuất thay thế
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Xem xét và phê duyệt các đề xuất thay thế thiết bị
            </p>
          </div>

          {/* Export Button */}
          <div className="flex-shrink-0">
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="flex flex-col h-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
              Tìm kiếm
            </label>
            <div className="relative flex-1 min-w-0 h-9 sm:h-10">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none flex-shrink-0 z-10" />
              <input
                type="text"
                className="absolute inset-0 w-full h-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                placeholder="Mã tài sản, tên thiết bị..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
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
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
              Độ ưu tiên
            </label>
            <div className="flex-1 h-9 sm:h-10">
              <select
                className="w-full h-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
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

      {/* Requests Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Danh sách đề xuất ({filteredRequests.length})
            </h2>
            {selectedItems.length > 0 && (
              <div className="text-xs sm:text-sm text-blue-600 font-medium">
                Đã chọn: {selectedItems.length} mục
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Mobile Card View */}
          <div className="block sm:hidden flex-1 overflow-y-auto">
            <div className="p-3 space-y-3">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded mr-2 mt-1 flex-shrink-0"
                          checked={selectedItems.includes(request.id)}
                          onChange={() => handleSelectItem(request.id)}
                        />
                        <Computer className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {request.assetCode}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {request.assetName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900 p-1">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-900 p-1">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Người yêu cầu</div>
                        <div className="text-gray-900 font-medium">
                          {request.requestedBy}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Vị trí</div>
                        <div className="text-gray-900 font-medium truncate">
                          {request.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Trạng thái</div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            request.status
                          )}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <div>
                        <div className="text-gray-500">Độ ưu tiên</div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                            request.priority
                          )}`}>
                          {getPriorityText(request.priority)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString(
                        "vi-VN"
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
          <div className="hidden sm:block flex-1 overflow-y-auto">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="h-10 sm:h-12">
                  <th className="w-12 px-2 py-2 sm:py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={
                        filteredRequests.length > 0 &&
                        selectedItems.length === filteredRequests.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    className="w-28 sm:w-32 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("assetCode")}>
                    <div className="flex items-center">
                      <span className="truncate">Tài sản</span>
                      {getSortIcon("assetCode")}
                    </div>
                  </th>
                  <th
                    className="w-24 sm:w-28 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("requestedBy")}>
                    <div className="flex items-center">
                      <span className="truncate">Người YC</span>
                      {getSortIcon("requestedBy")}
                    </div>
                  </th>
                  <th
                    className="w-28 sm:w-32 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("location")}>
                    <div className="flex items-center">
                      <span className="truncate">Vị trí</span>
                      {getSortIcon("location")}
                    </div>
                  </th>
                  <th
                    className="w-20 sm:w-24 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("priority")}>
                    <div className="flex items-center">
                      <span className="truncate">Ưu tiên</span>
                      {getSortIcon("priority")}
                    </div>
                  </th>
                  <th
                    className="w-20 sm:w-24 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      <span className="truncate">Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="w-24 sm:w-28 px-2 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("requestDate")}>
                    <div className="flex items-center">
                      <span className="truncate">Ngày YC</span>
                      {getSortIcon("requestDate")}
                    </div>
                  </th>
                  <th className="w-20 px-2 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 h-16 sm:h-20">
                      <td className="w-12 px-2 py-2 sm:py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded"
                          checked={selectedItems.includes(request.id)}
                          onChange={() => handleSelectItem(request.id)}
                        />
                      </td>
                      <td className="w-28 sm:w-32 px-2 py-2 sm:py-4">
                        <div className="flex items-center">
                          <Computer className="h-5 w-5 text-gray-400 mr-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {request.assetCode}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {request.assetName
                                .split(" ")
                                .slice(0, 2)
                                .join(" ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-24 sm:w-28 px-2 py-2 sm:py-4">
                        <div className="flex items-center">
                          <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {request.requestedBy}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {request.unit.split(" ").slice(-2).join(" ")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-28 sm:w-32 px-2 py-2 sm:py-4">
                        <div className="flex items-center">
                          <Building2 className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span className="text-xs text-gray-900 truncate">
                            {request.location}
                          </span>
                        </div>
                      </td>
                      <td className="w-20 sm:w-24 px-2 py-2 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-1 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                            request.priority
                          )}`}>
                          {request.priority === "high"
                            ? "Cao"
                            : request.priority === "medium"
                            ? "TB"
                            : "Thấp"}
                        </span>
                      </td>
                      <td className="w-20 sm:w-24 px-2 py-2 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-1 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            request.status
                          )}`}>
                          {request.status === "pending"
                            ? "Chờ"
                            : request.status === "approved"
                            ? "Duyệt"
                            : "Từ chối"}
                        </span>
                      </td>
                      <td className="w-24 sm:w-28 px-2 py-2 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span className="text-xs text-gray-900">
                            {new Date(request.requestDate).toLocaleDateString(
                              "vi-VN",
                              { day: "2-digit", month: "2-digit" }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="w-20 px-2 py-2 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="Xem chi tiết">
                            <Eye className="h-3 w-3" />
                          </button>
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Phê duyệt">
                                <CheckCircle className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Từ chối">
                                <XCircle className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-16 sm:h-20">
                    <td colSpan={8} className="h-16 sm:h-20">
                      <div className="h-16 sm:h-20 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <Search className="h-6 w-6 text-gray-300 mb-2" />
                          <h3 className="text-xs font-medium text-gray-900 mb-1">
                            Không tìm thấy kết quả
                          </h3>
                          <p className="text-xs text-gray-500">
                            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-3 sm:p-5 border w-11/12 sm:w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  Chi tiết đề xuất #{selectedRequest.id}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Mã tài sản
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900 mt-1">
                      {selectedRequest.assetCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Tên thiết bị
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900 mt-1">
                      {selectedRequest.assetName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Người yêu cầu
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900 mt-1">
                      {selectedRequest.requestedBy}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Đơn vị
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900 mt-1">
                      {selectedRequest.unit}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Vị trí
                  </label>
                  <p className="text-xs sm:text-sm text-gray-900 mt-1">
                    {selectedRequest.location}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Lý do thay thế
                  </label>
                  <p className="text-xs sm:text-sm text-gray-900 mt-1">
                    {selectedRequest.reason}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Mô tả chi tiết
                  </label>
                  <p className="text-xs sm:text-sm text-gray-900 mt-1">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Chi phí ước tính
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900 mt-1">
                      {selectedRequest.estimatedCost.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Độ ưu tiên
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                        selectedRequest.priority
                      )} mt-1`}>
                      {getPriorityText(selectedRequest.priority)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6 pt-4 border-t">
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Phê duyệt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
