"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  User,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Local interface cho trang này theo database schema
interface RepairRequestForList {
  id: string;
  requestCode: string; // Mã yêu cầu tự tăng: YCSC-2025-0001
  assetId: string;
  assetCode: string; // Mã tài sản QR code được in từ bảng assets
  assetName: string;
  componentId?: string;
  componentName?: string; // Tên linh kiện cụ thể bị lỗi
  reporterId: string;
  reporterName: string; // Tên người báo lỗi
  reporterRole: string; // Vai trò: Giảng viên/KTV
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  roomId: string;
  roomName: string; // Tên phòng máy
  buildingName: string; // Tên tòa nhà
  errorTypeId?: string;
  errorTypeName?: string; // Tên loại lỗi
  description: string; // Mô tả chi tiết lỗi
  mediaUrls?: string[]; // Mảng URL ảnh/video minh họa
  status: "CHỜ_TIẾP_NHẬN" | "ĐANG_XỬ_LÝ" | "HOÀN_THÀNH" | "HỦY_BỎ";
  resolutionNotes?: string; // Ghi chú KTV về kết quả xử lý
  createdAt: string; // Thời điểm báo lỗi
  acceptedAt?: string; // Thời điểm KTV tiếp nhận
  completedAt?: string; // Thời điểm hoàn tất
  unit: string; // Đơn vị/Khoa
}

const mockRepairRequests: RepairRequestForList[] = [
  {
    id: "req-001",
    requestCode: "YCSC-2025-0001",
    assetId: "asset-001",
    assetCode: "PC-H301-01",
    assetName: "Máy tính Dell OptiPlex 3070",
    componentId: "comp-001",
    componentName: "Nguồn điện 500W",
    reporterId: "user-001",
    reporterName: "Nguyễn Văn A",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "tech-001",
    assignedTechnicianName: "Trần Thị B",
    roomId: "room-001",
    roomName: "H301",
    buildingName: "Tòa H",
    errorTypeId: "error-001",
    errorTypeName: "Hỏng nguồn điện",
    description:
      "Máy tính không khởi động được, có mùi cháy từ nguồn điện 500W, cần thay thay nguồn mới ngay lập tức",
    mediaUrls: ["image1.jpg", "image2.jpg"],
    status: "CHỜ_TIẾP_NHẬN",
    resolutionNotes: "",
    createdAt: "2024-01-15T08:30:00",
    acceptedAt: "",
    completedAt: "",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-002",
    requestCode: "YCSC-2025-0002",
    assetId: "asset-002",
    assetCode: "PC-H205-15",
    assetName: "Máy tính HP EliteDesk 800",
    componentId: "comp-002",
    componentName: "RAM DDR4 8GB",
    reporterId: "user-002",
    reporterName: "Lê Văn C",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "tech-002",
    assignedTechnicianName: "Phạm Văn D",
    roomId: "room-002",
    roomName: "H205",
    buildingName: "Tòa H",
    errorTypeId: "error-002",
    errorTypeName: "Lỗi RAM",
    description: "RAM DDR4 8GB bị lỗi, máy không khởi động được, màn hình đen",
    mediaUrls: ["ram_error.jpg"],
    status: "ĐANG_XỬ_LÝ",
    resolutionNotes: "Đã kiểm tra RAM, đang chờ linh kiện mới",
    createdAt: "2024-01-14T14:15:00",
    acceptedAt: "2024-01-14T15:00:00",
    completedAt: "",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-003",
    requestCode: "YCSC-2025-0003",
    assetId: "asset-003",
    assetCode: "PC-H704-08",
    assetName: "Máy tính Asus VivoPC",
    componentId: "comp-003",
    componentName: "SSD 256GB",
    reporterId: "user-003",
    reporterName: "Hoàng Thị E",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "tech-003",
    assignedTechnicianName: "Nguyễn Văn F",
    roomId: "room-003",
    roomName: "H704",
    buildingName: "Tòa H",
    errorTypeId: "error-003",
    errorTypeName: "Lỗi ổ cứng",
    description:
      "Ổ cứng SSD 256GB bị bad sector nghiêm trọng, mất dữ liệu, không thể truy cập",
    mediaUrls: ["ssd_error.jpg"],
    status: "HOÀN_THÀNH",
    resolutionNotes:
      "Đã thay SSD mới Samsung 256GB, phục hồi dữ liệu thành công từ backup",
    createdAt: "2024-01-12T09:00:00",
    acceptedAt: "2024-01-12T10:00:00",
    completedAt: "2024-01-13T16:00:00",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-004",
    requestCode: "YCSC-2025-0004",
    assetId: "asset-004",
    assetCode: "PC-H508-11",
    assetName: "Máy tính MSI Pro",
    componentId: "comp-004",
    componentName: "Card đồ họa GTX 1050",
    reporterId: "user-004",
    reporterName: "Võ Thị F",
    reporterRole: "KTV",
    assignedTechnicianId: "tech-004",
    assignedTechnicianName: "Hoàng Văn E",
    roomId: "room-004",
    roomName: "H508",
    buildingName: "Tòa H",
    errorTypeId: "error-004",
    errorTypeName: "Lỗi card đồ họa",
    description:
      "Card đồ họa NVIDIA GTX 1050 2GB bị lỗi chip, màn hình không hiển thị hình ảnh",
    mediaUrls: ["gpu_error.jpg", "screen_black.jpg"],
    status: "CHỜ_TIẾP_NHẬN",
    resolutionNotes: "",
    createdAt: "2024-01-13T11:20:00",
    acceptedAt: "",
    completedAt: "",
    unit: "Khoa Công nghệ Thông tin",
  },
  {
    id: "req-005",
    requestCode: "YCSC-2025-0005",
    assetId: "asset-005",
    assetCode: "PC-H109-22",
    assetName: "Máy tính Lenovo ThinkCentre",
    componentId: "comp-005",
    componentName: "CPU Intel i5-8400",
    reporterId: "user-005",
    reporterName: "Phạm Thị D",
    reporterRole: "Giảng viên",
    assignedTechnicianId: "tech-005",
    assignedTechnicianName: "Lê Văn C",
    roomId: "room-005",
    roomName: "H109",
    buildingName: "Tòa H",
    errorTypeId: "error-005",
    errorTypeName: "Lỗi CPU",
    description:
      "CPU Intel i5-8400 bị quá nhiệt, máy tự động tắt liên tục sau 5-10 phút sử dụng",
    mediaUrls: ["cpu_temp.jpg"],
    status: "ĐANG_XỬ_LÝ",
    resolutionNotes:
      "Đang thay tản nhiệt mới và kiểm tra CPU, có thể cần thay CPU",
    createdAt: "2024-01-16T07:45:00",
    acceptedAt: "2024-01-16T08:30:00",
    completedAt: "",
    unit: "Khoa Công nghệ Thông tin",
  },
];

export default function DanhSachBaoLoiPage() {
  const [requests, setRequests] =
    useState<RepairRequestForList[]>(mockRepairRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedErrorType, setSelectedErrorType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<RepairRequestForList | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Hàm xử lý sắp xếp
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Hàm lấy icon sắp xếp
  const getSortIcon = (field: string) => {
    return (
      <div className="flex flex-col">
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

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    const matchesErrorType =
      selectedErrorType === "all" ||
      request.errorTypeName === selectedErrorType;
    const matchesSearch =
      searchTerm === "" ||
      request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesErrorType && matchesSearch;
  });

  // Sắp xếp dữ liệu đã lọc
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | Date = "";
    let bValue: string | Date = "";

    switch (sortField) {
      case "requestCode":
        aValue = a.requestCode;
        bValue = b.requestCode;
        break;
      case "assetCode":
        aValue = a.assetCode;
        bValue = b.assetCode;
        break;
      case "reporterName":
        aValue = a.reporterName;
        bValue = b.reporterName;
        break;
      case "errorTypeName":
        aValue = a.errorTypeName || "";
        bValue = b.errorTypeName || "";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CHỜ_TIẾP_NHẬN":
        return "bg-yellow-100 text-yellow-800";
      case "ĐANG_XỬ_LÝ":
        return "bg-blue-100 text-blue-800";
      case "HOÀN_THÀNH":
        return "bg-green-100 text-green-800";
      case "HỦY_BỎ":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CHỜ_TIẾP_NHẬN":
        return "Chờ tiếp nhận";
      case "ĐANG_XỬ_LÝ":
        return "Đang xử lý";
      case "HOÀN_THÀNH":
        return "Hoàn thành";
      case "HỦY_BỎ":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CHỜ_TIẾP_NHẬN":
        return <Clock className="h-4 w-4" />;
      case "ĐANG_XỬ_LÝ":
        return <AlertCircle className="h-4 w-4" />;
      case "HOÀN_THÀNH":
        return <CheckCircle className="h-4 w-4" />;
      case "HỦY_BỎ":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const updateRequestStatus = (
    requestId: string,
    newStatus: "CHỜ_TIẾP_NHẬN" | "ĐANG_XỬ_LÝ" | "HOÀN_THÀNH" | "HỦY_BỎ"
  ) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              acceptedAt:
                newStatus === "ĐANG_XỬ_LÝ" && !req.acceptedAt
                  ? new Date().toISOString()
                  : req.acceptedAt,
              completedAt:
                newStatus === "HOÀN_THÀNH"
                  ? new Date().toISOString()
                  : req.completedAt,
            }
          : req
      )
    );
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/to-truong-ky-thuat"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Về trang chủ
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách báo lỗi
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý các báo cáo lỗi từ giảng viên
            </p>
          </div>

        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mã tài sản, tên thiết bị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="CHỜ_TIẾP_NHẬN">Chờ tiếp nhận</option>
              <option value="ĐANG_XỬ_LÝ">Đang xử lý</option>
              <option value="HOÀN_THÀNH">Hoàn thành</option>
              <option value="HỦY_BỎ">Đã hủy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại lỗi
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedErrorType}
              onChange={(e) => setSelectedErrorType(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Hỏng nguồn điện">Hỏng nguồn điện</option>
              <option value="Lỗi RAM">Lỗi RAM</option>
              <option value="Lỗi ổ cứng">Lỗi ổ cứng</option>
              <option value="Lỗi card đồ họa">Lỗi card đồ họa</option>
              <option value="Lỗi CPU">Lỗi CPU</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chờ tiếp nhận
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      requests.filter((r) => r.status === "CHỜ_TIẾP_NHẬN")
                        .length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang xử lý
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {requests.filter((r) => r.status === "ĐANG_XỬ_LÝ").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hoàn thành
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {requests.filter((r) => r.status === "HOÀN_THÀNH").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng cộng
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {requests.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Danh sách báo lỗi ({sortedRequests.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("requestCode")}>
                  <div className="flex items-center space-x-1">
                    <span>Mã báo lỗi</span>
                    {getSortIcon("requestCode")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("assetCode")}>
                  <div className="flex items-center space-x-1">
                    <span>Tài sản</span>
                    {getSortIcon("assetCode")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("reporterName")}>
                  <div className="flex items-center space-x-1">
                    <span>Người báo</span>
                    {getSortIcon("reporterName")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("errorTypeName")}>
                  <div className="flex items-center space-x-1">
                    <span>Loại lỗi</span>
                    {getSortIcon("errorTypeName")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}>
                  <div className="flex items-center space-x-1">
                    <span>Trạng thái</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center space-x-1">
                    <span>Ngày báo</span>
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.requestCode}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {request.assetCode}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.assetName}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Building2 className="h-3 w-3 mr-1" />
                        {request.roomName} - {request.buildingName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.reporterName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.reporterRole}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.errorTypeName || "Chưa xác định"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          request.status
                        )}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết báo lỗi {selectedRequest.requestCode}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã tài sản
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.assetCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên thiết bị
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.assetName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vị trí
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.roomName} -{" "}
                      {selectedRequest.buildingName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Linh kiện
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.componentName || "Tổng thể"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả lỗi
                  </label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại lỗi
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.errorTypeName || "Chưa xác định"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        selectedRequest.status
                      )} mt-1`}>
                      {getStatusText(selectedRequest.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Người báo cáo
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.reporterName} (
                      {selectedRequest.reporterRole})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày báo cáo
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedRequest.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                {selectedRequest.assignedTechnicianName && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Kỹ thuật viên phụ trách
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedRequest.assignedTechnicianName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thời gian tiếp nhận
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedRequest.acceptedAt &&
                          new Date(selectedRequest.acceptedAt).toLocaleString(
                            "vi-VN"
                          )}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.resolutionNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú kỹ thuật viên
                    </label>
                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">
                      {selectedRequest.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                {selectedRequest.status === "CHỜ_TIẾP_NHẬN" && (
                  <button
                    onClick={() =>
                      updateRequestStatus(selectedRequest.id, "ĐANG_XỬ_LÝ")
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Bắt đầu xử lý
                  </button>
                )}
                {selectedRequest.status === "ĐANG_XỬ_LÝ" && (
                  <>
                    <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "HOÀN_THÀNH")
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      Hoàn thành
                    </button>
                    <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "HỦY_BỎ")
                      }
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                      Hủy bỏ
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
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
