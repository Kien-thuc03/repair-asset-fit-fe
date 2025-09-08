"use client";
import { useState } from "react";
import {
  XCircle,
  Send,
  Computer,
  User,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { ReplacementRequestForList } from "@/types";

interface CreateReplacementListModalProps {
  show: boolean;
  onClose: () => void;
  approvedRequests: ReplacementRequestForList[];
  onSuccess?: (count: number) => void;
}

export default function CreateReplacementListModal({
  show,
  onClose,
  approvedRequests,
  onSuccess,
}: CreateReplacementListModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<string[]>(
    approvedRequests.map((req) => req.id)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) => {
      if (prev.includes(requestId)) {
        return prev.filter((id) => id !== requestId);
      } else {
        return [...prev, requestId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === approvedRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(approvedRequests.map((req) => req.id));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || selectedRequests.length === 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const selectedItems = approvedRequests.filter((req) =>
      selectedRequests.includes(req.id)
    );

    console.log("Danh sách đề xuất được tạo:", {
      title,
      description,
      items: selectedItems,
      createdAt: new Date().toISOString(),
    });

    setIsSubmitting(false);
    onClose();

    // Call success callback with the count of items
    if (onSuccess) {
      onSuccess(selectedItems.length);
    }

    // Reset form
    setTitle("");
    setDescription("");
    setSelectedRequests(approvedRequests.map((req) => req.id));
  };

  const getTotalEstimatedCost = () => {
    return selectedRequests
      .map((id) => approvedRequests.find((req) => req.id === id))
      .filter(Boolean)
      .reduce((total, req) => total + (req?.estimatedCost || 0), 0);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-8 mx-auto p-3 sm:p-5 border w-11/12 sm:w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Tạo danh sách đề xuất thay thế
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              disabled={isSubmitting}>
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Title and Description */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề danh sách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tiêu đề cho danh sách đề xuất..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về danh sách đề xuất này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="text-sm font-semibold text-blue-900">
                  Tóm tắt danh sách
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Tổng thiết bị:</span>
                  <span className="ml-2 font-semibold text-blue-900">
                    {selectedRequests.length} / {approvedRequests.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Chi phí ước tính:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {getTotalEstimatedCost().toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="sm:col-span-1 col-span-2">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {new Date().toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Equipment Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Chọn thiết bị cần thay thế ({approvedRequests.length} thiết bị
                  đã duyệt)
                </h4>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isSubmitting}>
                  {selectedRequests.length === approvedRequests.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {approvedRequests.length > 0 ? (
                  approvedRequests.map((request, index) => (
                    <div
                      key={request.id}
                      className={`p-4 ${
                        index < approvedRequests.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      } hover:bg-gray-50`}>
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded mt-1"
                          checked={selectedRequests.includes(request.id)}
                          onChange={() => handleSelectRequest(request.id)}
                          disabled={isSubmitting}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <Computer className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {request.assetCode} - {request.assetName}
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                              {request.estimatedCost?.toLocaleString("vi-VN")}{" "}
                              VNĐ
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>{request.requestedBy}</span>
                            </div>
                            <div className="flex items-center">
                              <Building2 className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {request.location}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(
                                  request.requestDate
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </div>

                          {request.reason && (
                            <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                              <strong>Lý do:</strong> {request.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Không có đề xuất nào đã được duyệt
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}>
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !title.trim() || selectedRequests.length === 0 || isSubmitting
              }
              className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Tạo danh sách đề xuất
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
