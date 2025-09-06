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
  Download,
} from "lucide-react";

// Local interface cho trang này
interface RepairRequestForList {
  id: string;
  assetCode: string;
  assetName: string;
  assetLocation: string;
  issueType: "hardware" | "software" | "network" | "other";
  issueDescription: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  estimatedCompletionDate?: string;
  unit: string;
  notes?: string;
}

const mockRepairRequests: RepairRequestForList[] = [
  {
    id: "RR001",
    assetCode: "PC001",
    assetName: "Máy tính Dell OptiPlex 3070",
    assetLocation: "Phòng A101",
    issueType: "hardware",
    issueDescription:
      "Máy tính không khởi động được, có mùi cháy từ nguồn điện",
    priority: "high",
    status: "pending",
    reportedBy: "Nguyễn Văn A",
    reportedDate: "2024-01-15T08:30:00",
    assignedTo: "Trần Thị B",
    estimatedCompletionDate: "2024-01-16T17:00:00",
    unit: "Khoa CNTT",
    notes: "Cần thay nguồn điện mới",
  },
  {
    id: "RR002",
    assetCode: "PRJ004",
    assetName: "Máy chiếu Panasonic PT-VX510",
    assetLocation: "Phòng B204",
    issueType: "software",
    issueDescription: "Máy chiếu không hiển thị hình ảnh từ laptop",
    priority: "medium",
    status: "in_progress",
    reportedBy: "Lê Văn C",
    reportedDate: "2024-01-14T14:15:00",
    assignedTo: "Phạm Văn D",
    estimatedCompletionDate: "2024-01-15T10:00:00",
    unit: "Khoa Cơ khí",
    notes: "Đã kiểm tra cáp HDMI, đang test driver",
  },
  {
    id: "RR003",
    assetCode: "LAP005",
    assetName: "Laptop HP EliteBook 840",
    assetLocation: "Phòng C305",
    issueType: "hardware",
    issueDescription: "Pin laptop không sạc được, sạc rồi cũng hết nhanh",
    priority: "low",
    status: "completed",
    reportedBy: "Hoàng Thị E",
    reportedDate: "2024-01-12T09:00:00",
    assignedTo: "Nguyễn Văn F",
    estimatedCompletionDate: "2024-01-13T16:00:00",
    unit: "Khoa Kinh tế",
    notes: "Đã thay pin mới, test OK",
  },
];

export default function DanhSachBaoLoiPage() {
  const [requests, setRequests] =
    useState<RepairRequestForList[]>(mockRepairRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedIssueType, setSelectedIssueType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<RepairRequestForList | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || request.priority === selectedPriority;
    const matchesIssueType =
      selectedIssueType === "all" || request.issueType === selectedIssueType;
    const matchesSearch =
      searchTerm === "" ||
      request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assetLocation.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesStatus && matchesPriority && matchesIssueType && matchesSearch
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "in_progress":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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

  const getIssueTypeText = (issueType: string) => {
    switch (issueType) {
      case "hardware":
        return "Phần cứng";
      case "software":
        return "Phần mềm";
      case "network":
        return "Mạng";
      case "other":
        return "Khác";
      default:
        return issueType;
    }
  };

  const updateRequestStatus = (
    requestId: string,
    newStatus: "in_progress" | "completed" | "cancelled"
  ) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/to-truong-ky-thuat"
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
              <option value="pending">Chờ xử lý</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại lỗi
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedIssueType}
              onChange={(e) => setSelectedIssueType(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="hardware">Phần cứng</option>
              <option value="software">Phần mềm</option>
              <option value="network">Mạng</option>
              <option value="other">Khác</option>
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
                    Chờ xử lý
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {requests.filter((r) => r.status === "pending").length}
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
                    {requests.filter((r) => r.status === "in_progress").length}
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
                    {requests.filter((r) => r.status === "completed").length}
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
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ưu tiên cao
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {requests.filter((r) => r.priority === "high").length}
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
            Danh sách báo lỗi ({filteredRequests.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã báo lỗi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tài sản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người báo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại lỗi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày báo
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
                    <div className="text-sm font-medium text-gray-900">
                      {request.id}
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
                        {request.assetLocation}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.reportedBy}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.unit}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getIssueTypeText(request.issueType)}
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
                        {new Date(request.reportedDate).toLocaleDateString(
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
                  Chi tiết báo lỗi #{selectedRequest.id}
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
                      {selectedRequest.assetLocation}
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
                    Mô tả lỗi
                  </label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">
                    {selectedRequest.issueDescription}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại lỗi
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {getIssueTypeText(selectedRequest.issueType)}
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
                      {selectedRequest.reportedBy}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày báo cáo
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedRequest.reportedDate).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                {selectedRequest.assignedTo && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Kỹ thuật viên phụ trách
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedRequest.assignedTo}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dự kiến hoàn thành
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedRequest.estimatedCompletionDate &&
                          new Date(
                            selectedRequest.estimatedCompletionDate
                          ).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ghi chú
                    </label>
                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">
                      {selectedRequest.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                {selectedRequest.status === "pending" && (
                  <button
                    onClick={() =>
                      updateRequestStatus(selectedRequest.id, "in_progress")
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Bắt đầu xử lý
                  </button>
                )}
                {selectedRequest.status === "in_progress" && (
                  <>
                    <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "completed")
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      Hoàn thành
                    </button>
                    <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "cancelled")
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
