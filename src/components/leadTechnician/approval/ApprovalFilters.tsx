import { Search } from "lucide-react";

interface ApprovalFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ApprovalFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: ApprovalFiltersProps) {
  return (
    <div className="bg-white p-3 sm:p-6 rounded-lg shadow mb-4 sm:mb-6">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 items-end">
        <div className="flex flex-col h-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
            Tìm kiếm
          </label>
          <div className="relative flex-1 min-w-0 h-9 sm:h-10">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none flex-shrink-0 z-10" />
            <input
              type="text"
              className="absolute inset-0 w-full h-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              placeholder="Mã tài sản, tên thiết bị..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 flex-shrink-0 h-5 sm:h-6">
            Trạng thái
          </label>
          <div className="flex-1 h-9 sm:h-10">
            <select
              className="w-full h-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
