"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "antd";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus } from "@/types/repair";
import { Pagination } from "@/components/common";

type FilterStatus = "ALL" | "ĐÃ_LẬP_TỜ_TRÌNH";
type SortField =
  | "proposalCode"
  | "createdAt"
  | "title"
  | "status"
  | "createdBy";
type SortDirection = "asc" | "desc";

export default function XuLyToTrinhPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    // Lọc dữ liệu: chỉ lấy các tờ trình đang chờ xử lý (trạng thái ĐÃ_LẬP_TỜ_TRÌNH)
    // Đây là những tờ trình mà Tổ trưởng kỹ thuật đã lập và gửi lên Phòng Quản trị để xem xét phê duyệt
    let filtered = mockReplacementRequestItem.filter(
      (item) => item.status === ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH
    );

    // Apply status filter - chỉ có thể filter tất cả hoặc theo trạng thái ĐÃ_LẬP_TỜ_TRÌNH
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
        case "createdBy":
          aValue = a.createdBy || "";
          bValue = b.createdBy || "";
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

  const getStatusColor = () => {
    // Chỉ có trạng thái ĐÃ_LẬP_TỜ_TRÌNH nên luôn hiển thị màu xanh dương (chờ xử lý)
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusText = () => {
    // Chỉ có trạng thái ĐÃ_LẬP_TỜ_TRÌNH nên luôn hiển thị "Chờ xử lý"
    return "Chờ xử lý";
  };

  const statsData = useMemo(() => {
    // Chỉ có một trạng thái ĐÃ_LẬP_TỜ_TRÌNH nên stats đơn giản hơn
    const choXuLy = filteredData.length; // Tất cả đều là "chờ xử lý"

    return {
      choXuLy,
      total: filteredData.length,
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/phong-quan-tri",
              title: (
                <div className="flex items-center">
                  <span>Phòng quản trị</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Xử lý tờ trình</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Xử lý tờ trình thay thế
        </h1>
        <p className="mt-2 text-gray-600">
          Danh sách các tờ trình đang chờ xử lý từ tổ trưởng kỹ thuật. Tất cả tờ
          trình ở đây đều có trạng thái &ldquo;Đã lập tờ trình&rdquo; và cần
          được xem xét phê duyệt.
        </p>
      </div>

      {/* Stats Cards - Chỉ hiển thị 2 cards cho trạng thái chờ xử lý */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tờ trình chờ xử lý
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {statsData.choXuLy}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng số tờ trình
              </p>
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
                <option value="ALL">Tất cả tờ trình</option>
                <option value="ĐÃ_LẬP_TỜ_TRÌNH">Chờ xử lý</option>
              </select>
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
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[15%]"
                  onClick={() => handleSort("proposalCode")}>
                  <div className="flex items-center space-x-1">
                    <span>Mã ĐX</span>
                    {sortField === "proposalCode" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[25%]"
                  onClick={() => handleSort("title")}>
                  <div className="flex items-center space-x-1">
                    <span>Tiêu đề</span>
                    {sortField === "title" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[20%]"
                  onClick={() => handleSort("createdBy")}>
                  <div className="flex items-center space-x-1">
                    <span>Người tạo</span>
                    {sortField === "createdBy" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                  Số lượng
                </th>
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[12%]"
                  onClick={() => handleSort("status")}>
                  <div className="flex items-center space-x-1">
                    <span>Trạng thái</span>
                    {sortField === "status" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[10%]"
                  onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center space-x-1">
                    <span>Ngày</span>
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3">
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {item.proposalCode}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div
                      className="text-xs text-gray-900 font-medium truncate"
                      title={item.title}>
                      {item.title}
                    </div>
                    <div
                      className="text-xs text-gray-500 truncate"
                      title={item.description}>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-xs text-gray-900">
                      <div className="flex items-center space-x-1">
                        <span className="truncate text-xs font-medium">
                          {item.createdBy || "Chưa xác định"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.components.length}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
                      <span className="hidden lg:inline text-xs">
                        {getStatusText()}
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <Link
                      href={`/phong-quan-tri/xu-ly-to-trinh/${item.id}`}
                      className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Xem chi tiết">
                      <Eye className="w-3 h-3" />
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
