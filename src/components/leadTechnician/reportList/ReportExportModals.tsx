import { Download, X } from "lucide-react";

interface ReportExportModalsProps {
  showExportSuccessModal: boolean;
  showExportErrorModal: boolean;
  exportCount: number;
  onCloseSuccessModal: () => void;
  onCloseErrorModal: () => void;
}

export default function ReportExportModals({
  showExportSuccessModal,
  showExportErrorModal,
  exportCount,
  onCloseSuccessModal,
  onCloseErrorModal,
}: ReportExportModalsProps) {
  return (
    <>
      {/* Export Success Modal */}
      {showExportSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Xuất Excel thành công!
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Đã xuất {exportCount} báo lỗi thành công.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={onCloseSuccessModal}
                  className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Error Modal */}
      {showExportErrorModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Không thể xuất Excel
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Không có dữ liệu để xuất. Vui lòng kiểm tra lại.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={onCloseErrorModal}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
