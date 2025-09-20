import { Download, X } from "lucide-react";

interface InspectionExportModalsProps {
  showExportSuccessModal: boolean;
  showExportErrorModal: boolean;
  exportCount: number;
  onCloseSuccessModal: () => void;
  onCloseErrorModal: () => void;
}

export default function InspectionExportModals({
  showExportSuccessModal,
  showExportErrorModal,
  exportCount,
  onCloseSuccessModal,
  onCloseErrorModal,
}: InspectionExportModalsProps) {
  return (
    <>
      {/* Export Success Modal */}
      {showExportSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Xuất Excel thành công
                </h3>
                <p className="text-sm text-gray-500">
                  Đã xuất {exportCount} biên bản ra file Excel
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onCloseSuccessModal}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Error Modal */}
      {showExportErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Lỗi xuất Excel
                </h3>
                <p className="text-sm text-gray-500">
                  Không có dữ liệu để xuất hoặc đã xảy ra lỗi
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onCloseErrorModal}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
