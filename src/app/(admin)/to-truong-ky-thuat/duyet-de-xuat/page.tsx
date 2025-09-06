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
} from "lucide-react";

interface ReplacementRequest {
  id: string;
  assetCode: string;
  assetName: string;
  requestedBy: string;
  unit: string;
  location: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  priority: "high" | "medium" | "low";
  requestDate: string;
  estimatedCost: number;
  description: string;
}

const mockRequests: ReplacementRequest[] = [
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
  const [requests, setRequests] = useState<ReplacementRequest[]>(mockRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<ReplacementRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredRequests = requests.filter((request) => {
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
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
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
              Duyệt đề xuất thay thế
            </h1>
            <p className="text-gray-600 mt-1">
              Xem xét và phê duyệt các đề xuất thay thế thiết bị
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
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
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ ưu tiên
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
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

      {/* Requests Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Danh sách đề xuất ({filteredRequests.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tài sản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người yêu cầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi phí ước tính
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Computer className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.assetCode}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.assetName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.requestedBy}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.unit}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {request.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                        request.priority
                      )}`}>
                      {getPriorityText(request.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        request.status
                      )}`}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(request.requestDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.estimatedCost.toLocaleString("vi-VN")} VNĐ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết đề xuất #{selectedRequest.id}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
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
                      Người yêu cầu
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.requestedBy}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Đơn vị
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.unit}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vị trí
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedRequest.location}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lý do thay thế
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedRequest.reason}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả chi tiết
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chi phí ước tính
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedRequest.estimatedCost.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
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
