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
import { RepairRequest, RepairStatus } from "@/types";
import {
  mockRepairRequests,
  repairRequestStatusConfig,
  errorTypes,
} from "@/lib/mockData";

export default function DanhSachBaoLoiPage() {
  const [requests, setRequests] = useState<RepairRequest[]>(mockRepairRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedErrorType, setSelectedErrorType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

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

  // Hàm lấy icon sắp xếp với trạng thái rõ ràng hơn
  const getSortIcon = (field: string) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
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
    if (!sortField || sortDirection === "none") return 0;

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

  const getStatusBadge = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.color : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.label : status;
  };

  const getStatusIcon = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    const IconComponent = config ? config.icon : Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const updateRequestStatus = (requestId: string, newStatus: RepairStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              acceptedAt:
                newStatus === RepairStatus.ĐANG_XỬ_LÝ && !req.acceptedAt
                  ? new Date().toISOString()
                  : req.acceptedAt,
              completedAt:
                newStatus === RepairStatus.ĐÃ_HOÀN_THÀNH
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
              <option value={RepairStatus.CHỜ_TIẾP_NHẬN}>Chờ tiếp nhận</option>
              <option value={RepairStatus.ĐÃ_TIẾP_NHẬN}>Đã tiếp nhận</option>
              <option value={RepairStatus.ĐANG_XỬ_LÝ}>Đang xử lý</option>
              <option value={RepairStatus.CHỜ_THAY_THẾ}>Chờ thay thế</option>
              <option value={RepairStatus.ĐÃ_HOÀN_THÀNH}>Hoàn thành</option>
              <option value={RepairStatus.ĐÃ_HỦY}>Đã hủy</option>
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
              {errorTypes.map((errorType) => (
                <option key={errorType.id} value={errorType.name}>
                  {errorType.name}
                </option>
              ))}
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
                      requests.filter(
                        (r) => r.status === RepairStatus.CHỜ_TIẾP_NHẬN
                      ).length
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
                    {
                      requests.filter(
                        (r) => r.status === RepairStatus.ĐANG_XỬ_LÝ
                      ).length
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
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Hoàn thành
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      requests.filter(
                        (r) => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH
                      ).length
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

        <div className="overflow-hidden">
          <div className="overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-[15%]"
                    onClick={() => handleSort("requestCode")}>
                    <div className="flex items-center space-x-1">
                      <span>Mã báo lỗi</span>
                      {getSortIcon("requestCode")}
                    </div>
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-[25%]"
                    onClick={() => handleSort("assetCode")}>
                    <div className="flex items-center space-x-1">
                      <span>Tài sản</span>
                      {getSortIcon("assetCode")}
                    </div>
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-[15%]"
                    onClick={() => handleSort("reporterName")}>
                    <div className="flex items-center space-x-1">
                      <span>Người báo</span>
                      {getSortIcon("reporterName")}
                    </div>
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-[12%]"
                    onClick={() => handleSort("errorTypeName")}>
                    <div className="flex items-center space-x-1">
                      <span>Loại lỗi</span>
                      {getSortIcon("errorTypeName")}
                    </div>
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-[13%]"
                    onClick={() => handleSort("status")}>
                    <div className="flex items-center space-x-1">
                      <span>Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group w-[12%]"
                    onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center space-x-1">
                      <span>Ngày báo</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRequests.length > 0 ? (
                  sortedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap w-[15%]">
                        <div
                          className="text-sm font-medium text-gray-900 truncate"
                          title={request.requestCode}>
                          {request.requestCode}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-[25%]">
                        <div>
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={request.assetCode}>
                            {request.assetCode}
                          </div>
                          <div
                            className="text-sm text-gray-500 truncate"
                            title={request.assetName}>
                            {request.assetName}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span
                              className="truncate"
                              title={`${request.roomName} - ${request.buildingName}`}>
                              {request.roomName} - {request.buildingName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-[15%]">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <div
                              className="text-sm font-medium text-gray-900 truncate"
                              title={request.reporterName}>
                              {request.reporterName}
                            </div>
                            <div
                              className="text-sm text-gray-500 truncate"
                              title={request.reporterRole}>
                              {request.reporterRole}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-[12%]">
                        <span
                          className="text-sm text-gray-900 truncate block"
                          title={request.errorTypeName || "Chưa xác định"}>
                          {request.errorTypeName || "Chưa xác định"}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-[13%]">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getStatusIcon(request.status)}
                          </div>
                          <span
                            className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full truncate ${getStatusBadge(
                              request.status
                            )}`}
                            title={getStatusText(request.status)}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-[12%]">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                          <span
                            className="text-xs text-gray-900 truncate"
                            title={new Date(
                              request.createdAt
                            ).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}>
                            {new Date(request.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium w-[8%]">
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
                {selectedRequest.status === RepairStatus.CHỜ_TIẾP_NHẬN && (
                  <button
                    onClick={() =>
                      updateRequestStatus(
                        selectedRequest.id,
                        RepairStatus.ĐANG_XỬ_LÝ
                      )
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Bắt đầu xử lý
                  </button>
                )}
                {selectedRequest.status === RepairStatus.ĐANG_XỬ_LÝ && (
                  <>
                    <button
                      onClick={() =>
                        updateRequestStatus(
                          selectedRequest.id,
                          RepairStatus.ĐÃ_HOÀN_THÀNH
                        )
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      Hoàn thành
                    </button>
                    <button
                      onClick={() =>
                        updateRequestStatus(
                          selectedRequest.id,
                          RepairStatus.ĐÃ_HỦY
                        )
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
