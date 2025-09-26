"use client";
import { Search, Filter } from "lucide-react";

interface DeviceFiltersProps {
  searchTerm: string;
  statusFilter: string;
  floorFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFloorChange: (value: string) => void;
  floors: string[];
}

export default function DeviceFilters({
  searchTerm,
  statusFilter,
  floorFilter,
  onSearchChange,
  onStatusChange,
  onFloorChange,
  floors,
}: DeviceFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên, model, phòng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            title="Chọn trạng thái thiết bị"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">Tất cả trạng thái</option>
            <option value="đang_sử_dụng">Đang sử dụng</option>
            <option value="chờ_bàn_giao">Chờ bàn giao</option>
            <option value="chờ_tiếp_nhận">Chờ tiếp nhận</option>
            <option value="hư_hỏng">Hư hỏng</option>
            <option value="đã_mất">Đã mất</option>
            <option value="đề_xuất_thanh_lý">Đề xuất thanh lý</option>
            <option value="đã_thanh_lý">Đã thanh lý</option>
          </select>
        </div>

        {/* Floor Filter */}
        <div>
          <select
            value={floorFilter}
            onChange={(e) => onFloorChange(e.target.value)}
            title="Chọn tầng làm việc"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">Tất cả tầng</option>
            {floors.map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}