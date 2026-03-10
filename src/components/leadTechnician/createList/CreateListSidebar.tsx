import { useRouter } from "next/navigation";
import { Send, ArrowLeft, AlertCircle } from "lucide-react";

interface CreateListSidebarProps {
  selectedCount: number;
  totalCount: number;
  totalCost: number;
  title: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function CreateListSidebar({
  selectedCount,
  totalCount,
  totalCost,
  title,
  isSubmitting,
  onSubmit,
}: CreateListSidebarProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200">
        <div className="px-6 py-4 border-b border-blue-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="text-sm font-semibold text-blue-900">
              Tóm tắt danh sách
            </h4>
          </div>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tổng thiết bị:</span>
            <span className="font-semibold text-blue-900">
              {selectedCount} / {totalCount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Chi phí ước tính:</span>
            <span className="font-semibold text-green-600">
              {totalCost.toLocaleString("vi-VN")} VND
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="font-semibold text-gray-900">
              {new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 space-y-3">
          <button
            onClick={onSubmit}
            disabled={!title.trim() || selectedCount === 0 || isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Tạo danh sách đề xuất
              </>
            )}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
            disabled={isSubmitting}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
