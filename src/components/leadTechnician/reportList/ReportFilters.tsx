import { Search } from "lucide-react";
import { RepairStatus } from "@/types";
import { errorTypes } from "@/lib/mockData";

interface ReportFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  selectedErrorType: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onErrorTypeChange: (value: string) => void;
}

export default function ReportFilters({
  searchTerm,
  selectedStatus,
  selectedErrorType,
  onSearchChange,
  onStatusChange,
  onErrorTypeChange,
}: ReportFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 filter-section">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onStatusChange(e.target.value)}>
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
            onChange={(e) => onErrorTypeChange(e.target.value)}>
            <option value="all">Tất cả</option>
            {errorTypes.map((errorType) => (
              <option key={errorType.id} value={errorType.name}>
                {errorType.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
