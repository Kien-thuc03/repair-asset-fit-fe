import { FileText, ArrowLeft } from "lucide-react";

interface NotFoundStateProps {
  onGoBack: () => void;
}

export function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  );
}

export function NotFoundState({ onGoBack }: NotFoundStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy biên bản
        </h2>
        <p className="text-gray-600 mb-4">
          Biên bản bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={onGoBack}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </button>
      </div>
    </div>
  );
}
