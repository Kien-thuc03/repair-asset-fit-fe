"use client";

import { Search, Download } from "lucide-react";

interface ProgressFiltersProps {
  searchTerm: string;
  totalCount: number;
  selectedCount: number;
  onSearchChange: (term: string) => void;
  onExport: () => void;
}

export default function ProgressFilters({
  searchTerm,
  totalCount,
  selectedCount,
  onSearchChange,
  onExport,
}: ProgressFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Search - chiếm 3 cột */}
        <div className="relative sm:col-span-3">
          <div
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            style={{ top: "0px" }}>
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

        {/* Xuất file Excel - chiếm 1 cột */}
        <div className="flex flex-col justify-end sm:col-span-1">
          <button
            onClick={onExport}
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="w-3 h-3 mr-1" />
            <span className="hidden lg:inline">Xuất Excel</span>
            <span className="lg:hidden">Excel</span>
            <span className="ml-1 text-xs">
              {selectedCount > 0 ? `(${selectedCount})` : `(${totalCount})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
