import { Download, ListPlus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovalHeaderProps {
  approvedRequestsCount: number;
  selectedItemsCount: number;
  filteredRequestsCount: number;
  onExportExcel: () => void;
}

export default function ApprovalHeader({
  approvedRequestsCount,
  selectedItemsCount,
  filteredRequestsCount,
  onExportExcel,
}: ApprovalHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Duyệt đề xuất thay thế
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Xem xét và phê duyệt các đề xuất thay thế thiết bị
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          {/* Create List Button */}
          <button
            onClick={() =>
              router.push("/to-truong-ky-thuat/duyet-de-xuat/tao-danh-sach")
            }
            disabled={approvedRequestsCount === 0}
            className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed">
            <ListPlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">
              Tạo danh sách đề xuất ({approvedRequestsCount})
            </span>
            <span className="sm:hidden">Tạo danh sách</span>
          </button>

          {/* Export Excel Button */}
          <button
            onClick={onExportExcel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-4 w-4 mr-2" />
            <span>
              {selectedItemsCount > 0
                ? `Xuất Excel (${selectedItemsCount} mục)`
                : `Xuất Excel (${filteredRequestsCount} mục)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
