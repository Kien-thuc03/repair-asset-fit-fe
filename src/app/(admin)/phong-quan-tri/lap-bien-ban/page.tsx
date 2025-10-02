"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Building,
  Package,
  Search,
  Filter,
  Eye,
  Download,
  User,
  CheckCircle,
  Clock,
  FileCheck,
} from "lucide-react";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import {
  ReplacementRequestItem,
  ReplacementStatus,
  ComponentFromRequest,
} from "@/types/repair";

export default function LapBienBanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "ALL"
  );
  const [sortBy, setSortBy] = useState<"date" | "proposalCode" | "status">(
    "date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Chỉ lấy các tờ trình đã được duyệt để tạo biên bản kiểm tra
  const approvedRequests = mockReplacementRequestItem.filter(
    (request) => request.status === ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH
  );

  const getStatusColor = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt - Cần lập biên bản";
      default:
        return status;
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filteredReports = useMemo(() => {
    let filtered = approvedRequests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.proposalCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy) {
        case "date":
          compareValue =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case "proposalCode":
          compareValue = a.proposalCode.localeCompare(b.proposalCode);
          break;
        case "status":
          compareValue = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [approvedRequests, searchTerm, statusFilter, sortBy, sortOrder]);

  // Thống kê tổng quan
  const statistics = useMemo(() => {
    const total = approvedRequests.length;
    const needInspection = approvedRequests.length; // Tất cả đều cần kiểm tra

    return {
      total,
      needInspection,
      completed: 0, // Sẽ cập nhật khi có workflow hoàn chỉnh
      approved: 0, // Sẽ cập nhật khi có workflow hoàn chỉnh
    };
  }, [approvedRequests]);

  const handleViewReport = (requestId: string) => {
    router.push(`/phong-quan-tri/lap-bien-ban/${requestId}`);
  };

  // Tính toán thống kê cho mỗi request
  const getRequestStatistics = (request: ReplacementRequestItem) => {
    const totalComponents = request.components.length;
    const totalQuantity = request.components.reduce(
      (sum: number, comp: ComponentFromRequest) => sum + comp.quantity,
      0
    );
    const rooms = [
      ...new Set(
        request.components.map(
          (comp: ComponentFromRequest) =>
            `${comp.buildingName} - ${comp.roomName}`
        )
      ),
    ];

    return {
      totalComponents,
      totalQuantity,
      totalRooms: rooms.length,
      roomsList: rooms,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Danh sách biên bản kiểm tra
          </h1>
          <p className="text-gray-600">
            Quản lý các biên bản kiểm tra thực tế đã được tạo
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Tổng biên bản
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statistics.total}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Đã hoàn thành
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statistics.completed}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileCheck className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Đã duyệt
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statistics.approved}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Cần lập biên bản
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {statistics.needInspection}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Tìm kiếm biên bản..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ĐANG_SOẠN_THẢO">Đang soạn thảo</option>
                  <option value="ĐÃ_HOÀN_THÀNH">Đã hoàn thành</option>
                  <option value="ĐÃ_DUYỆT">Đã duyệt</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sắp xếp:</span>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split("-");
                    setSortBy(sort as typeof sortBy);
                    setSortOrder(order as typeof sortOrder);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="date-desc">Ngày kiểm tra (Mới nhất)</option>
                  <option value="date-asc">Ngày kiểm tra (Cũ nhất)</option>
                  <option value="reportNumber-asc">Số biên bản (A-Z)</option>
                  <option value="reportNumber-desc">Số biên bản (Z-A)</option>
                  <option value="status-asc">Trạng thái (A-Z)</option>
                  <option value="status-desc">Trạng thái (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="w-full">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã tờ trình
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tờ trình gốc
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày cập nhật
                </th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người tạo
                </th>
                <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng/Linh kiện
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((request) => {
                const stats = getRequestStatistics(request);
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {request.proposalCode}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {request.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 truncate">
                        {request.proposalCode}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(request.updatedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                        <div className="text-sm text-gray-900 truncate">
                          {request.createdBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Building className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="font-medium">
                            {stats.totalRooms} phòng
                          </span>
                          <Package className="h-3 w-3 text-gray-400 ml-2 mr-1" />
                          <span>{stats.totalComponents} loại</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {stats.roomsList
                            .slice(0, 2)
                            .map((room: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {room}
                              </span>
                            ))}
                          {stats.roomsList.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{stats.roomsList.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          request.status
                        )}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">
                          {getStatusText(request.status)}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewReport(request.id)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <Eye className="w-3 h-3 mr-1" />
                          Xem
                        </button>
                        <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <Download className="w-3 h-3 mr-1" />
                          Tạo biên bản
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có biên bản nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "ALL"
                ? "Không tìm thấy biên bản nào phù hợp với tiêu chí tìm kiếm."
                : "Chưa có biên bản nào được tạo."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
