import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  createdListCount: number;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  createdListCount,
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tạo danh sách thành công!
          </h3>
          <p className="text-gray-600 mb-6">
            Đã tạo danh sách đề xuất với {createdListCount} thiết bị.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Quay về danh sách
          </button>
        </div>
      </div>
    </div>
  );
}
