"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  FileText,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus } from "@/types/repair";
import { Pagination } from "@/components/common";

type FilterStatus =
  | "ALL"
  | "ĐÃ_LẬP_TỜ_TRÌNH"
  | "ĐÃ_DUYỆT_TỜ_TRÌNH"
  | "ĐÃ_TỪ_CHỐI_TỜ_TRÌNH";
type SortField = "proposalCode" | "createdAt" | "title" | "status";
type SortDirection = "asc" | "desc";

export default function XuLyToTrinhPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    // Lọc dữ liệu: chỉ lấy các đề xuất có status là ĐÃ_LẬP_TỜ_TRÌNH, ĐÃ_DUYỆT_TỜ_TRÌNH, ĐÃ_TỪ_CHỐI_TỜ_TRÌNH
    const relevantStatuses: ReplacementStatus[] = [
      ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
      ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
      ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
    ];

    let filtered = mockReplacementRequestItem.filter((item) =>
      relevantStatuses.includes(item.status)
    );

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.proposalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "proposalCode":
          aValue = a.proposalCode;
          bValue = b.proposalCode;
          break;
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-green-100 text-green-800 border-green-200";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return <FileText className="w-4 h-4" />;
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return <CheckCircle className="w-4 h-4" />;
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Chờ xử lý";
      case ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "Đã từ chối";
      default:
        return status;
    }
  };

  const statsData = useMemo(() => {
    const choXuLy = filteredData.filter(
      (item) => item.status === ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH
    ).length;
    const daDuyet = filteredData.filter(
      (item) => item.status === ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH
    ).length;
    const daTuChoi = filteredData.filter(
      (item) => item.status === ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH
    ).length;

    return { choXuLy, daDuyet, daTuChoi, total: filteredData.length };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xử lý tờ trình thay thế
        </h1>
        <p className="mt-2 text-gray-600">
          Xem xét và phê duyệt các tờ trình đề xuất thay thế linh kiện từ tổ
          trưởng kỹ thuật
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-blue-600">
                {statsData.choXuLy}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {statsData.daDuyet}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
              <p className="text-2xl font-bold text-red-600">
                {statsData.daTuChoi}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng tờ trình</p>
              <p className="text-2xl font-bold text-gray-600">
                {statsData.total}
              </p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đề xuất, tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="min-w-[200px]">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as FilterStatus)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ĐÃ_LẬP_TỜ_TRÌNH">Chờ xử lý</option>
                <option value="ĐÃ_DUYỆT_TỜ_TRÌNH">Đã duyệt</option>
                <option value="ĐÃ_TỪ_CHỐI_TỜ_TRÌNH">Đã từ chối</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("proposalCode")}>
                  <div className="flex items-center space-x-1">
                    <span>Mã đề xuất</span>
                    {sortField === "proposalCode" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("title")}>
                  <div className="flex items-center space-x-1">
                    <span>Tiêu đề</span>
                    {sortField === "title" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin tài sản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số linh kiện
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}>
                  <div className="flex items-center space-x-1">
                    <span>Trạng thái</span>
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center space-x-1">
                    <span>Ngày tạo</span>
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.proposalCode}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span>
                          {item.components[0]?.buildingName} -{" "}
                          {item.components[0]?.roomName}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.components[0]?.assetCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.components.length} linh kiện
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}>
                      <span className="mr-1">{getStatusIcon(item.status)}</span>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/phong-quan-tri/xu-ly-to-trinh/${item.id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Eye className="w-4 h-4 mr-1" />
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedData.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có tờ trình nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy tờ trình nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <Pagination
              currentPage={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={() => {}}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
