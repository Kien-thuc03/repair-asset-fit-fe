"use client";

import { Search } from "lucide-react";

interface ProgressFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string) => void;
}

export default function ProgressFilters({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: ProgressFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm yêu cầu sửa chữa
          </label>
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            style={{ top: "32px" }}>
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Nhập mã yêu cầu, tên tài sản, số phòng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lọc theo trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
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
  );
}
