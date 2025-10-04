interface ProposalFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ProposalFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: ProposalFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm đề xuất thay thế
          </label>
          <input
            type="text"
            placeholder="Nhập mã đề xuất, tiêu đề, người tạo..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lọc theo trạng thái
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="verified">Đã xác minh</option>
            <option value="proposal_created">Đã lập tờ trình</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
            <option value="completed">Đã hoàn tất</option>
          </select>
        </div>
      </div>
    </div>
  );
}
