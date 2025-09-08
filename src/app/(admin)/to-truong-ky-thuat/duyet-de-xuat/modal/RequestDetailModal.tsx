"use client";
import { XCircle } from "lucide-react";
import { ReplacementRequestForList } from "@/types";

interface RequestDetailModalProps {
  show: boolean;
  selectedRequest: ReplacementRequestForList | null;
  onClose: () => void;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  getStatusBadge: (status: string) => string;
  getStatusText: (status: string) => string;
  getPriorityBadge: (priority: string) => string;
  getPriorityText: (priority: string) => string;
}

export default function RequestDetailModal({
  show,
  selectedRequest,
  onClose,
  onApprove,
  onReject,
  getStatusBadge,
  getStatusText,
  getPriorityBadge,
  getPriorityText,
}: RequestDetailModalProps) {
  if (!show || !selectedRequest) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-20 mx-auto p-3 sm:p-5 border w-11/12 sm:w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              Chi tiết đề xuất #{selectedRequest.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1">
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Mã tài sản
                </label>
                <p className="text-xs sm:text-sm text-gray-900 mt-1">
                  {selectedRequest.assetCode}
                </p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Tên thiết bị
                </label>
                <p className="text-xs sm:text-sm text-gray-900 mt-1">
                  {selectedRequest.assetName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Người yêu cầu
                </label>
                <p className="text-xs sm:text-sm text-gray-900 mt-1">
                  {selectedRequest.requestedBy}
                </p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Đơn vị
                </label>
                <p className="text-xs sm:text-sm text-gray-900 mt-1">
                  {selectedRequest.unit}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Vị trí
              </label>
              <p className="text-xs sm:text-sm text-gray-900 mt-1">
                {selectedRequest.location}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Lý do thay thế
              </label>
              <p className="text-xs sm:text-sm text-gray-900 mt-1">
                {selectedRequest.reason}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Mô tả chi tiết
              </label>
              <p className="text-xs sm:text-sm text-gray-900 mt-1">
                {selectedRequest.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Chi phí ước tính
                </label>
                <p className="text-xs sm:text-sm text-gray-900 mt-1">
                  {selectedRequest.estimatedCost.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Độ ưu tiên
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                    selectedRequest.priority
                  )} mt-1`}>
                  {getPriorityText(selectedRequest.priority)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    selectedRequest.status
                  )} mt-1`}>
                  {getStatusText(selectedRequest.status)}
                </span>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Ngày yêu cầu
                </label>
                <p className="text-xs sm:text-sm text-gray-900 mt-1">
                  {new Date(selectedRequest.requestDate).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
            </div>
          </div>

          {selectedRequest.status === "pending" && (
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6 pt-4 border-t">
              <button
                onClick={() => onReject(selectedRequest.id)}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
                Từ chối
              </button>
              <button
                onClick={() => onApprove(selectedRequest.id)}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Phê duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
