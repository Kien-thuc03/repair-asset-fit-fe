import React from "react";

interface AssignmentHeaderProps {
  selectedItemsCount: number;
  totalItems: number;
  onExportExcel: () => void;
  activeTab?: "areas" | "technicians"; // Thêm prop để biết tab hiện tại
}

const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  selectedItemsCount,
  totalItems,
  onExportExcel,
  activeTab = "areas", // Default là areas
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Phân công khu vực
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và phân công khu vực cho kỹ thuật viên
          </p>
        </div>
        {/* Export Excel Button - chỉ hiển thị khi tab areas */}
        {activeTab === "areas" && (
          <button
            onClick={onExportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>
              {selectedItemsCount > 0
                ? `Xuất Excel (${selectedItemsCount} mục)`
                : `Xuất Excel (${totalItems} mục)`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AssignmentHeader;
