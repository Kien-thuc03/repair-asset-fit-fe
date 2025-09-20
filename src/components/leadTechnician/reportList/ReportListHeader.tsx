import { Download } from "lucide-react";

interface ReportListHeaderProps {
  selectedItemsCount: number;
  totalItems: number;
  onExportExcel: () => void;
}

export default function ReportListHeader({
  selectedItemsCount,
  totalItems,
  onExportExcel,
}: ReportListHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Danh sách báo lỗi
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý các báo cáo lỗi từ giảng viên
          </p>
        </div>
        {/* Export Excel Button */}
        <button
          onClick={onExportExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Download className="h-4 w-4 mr-2" />
          <span>
            {selectedItemsCount > 0
              ? `Xuất Excel (${selectedItemsCount} mục)`
              : `Xuất Excel (${totalItems} mục)`}
          </span>
        </button>
      </div>
    </div>
  );
}
