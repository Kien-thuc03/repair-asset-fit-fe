import { Search } from "lucide-react";

interface InspectionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function InspectionFilters({
  searchTerm,
  onSearchChange,
}: InspectionFiltersProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Số biên bản, tiêu đề..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
