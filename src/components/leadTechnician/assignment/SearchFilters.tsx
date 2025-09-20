import React from "react";
import { Search } from "lucide-react";

type TabType = "areas" | "technicians";

interface SearchFiltersProps {
  activeTab: TabType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeTab,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Bộ lọc tìm kiếm</h3>
        <p className="text-sm text-gray-500">
          Tìm kiếm và lọc dữ liệu theo các tiêu chí
        </p>
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={
              activeTab === "areas"
                ? "Tìm theo phòng, tòa nhà, tầng..."
                : "Tìm theo tên, email kỹ thuật viên..."
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
