"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  ArrowLeft,
  Send,
  Computer,
  User,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle,
} from "lucide-react";
import { ReplacementStatus } from "@/types";
import { mockReplacementRequests } from "@/lib/mockData/replacementRequests";

export default function TaoDanhSachDePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Get approved requests
  const approvedRequests = useMemo(() => {
    return mockReplacementRequests.filter(
      (request) => request.status === ReplacementStatus.ĐÃ_DUYỆT
    );
  }, []);

  // Initialize with all approved requests selected
  const [selectedRequests, setSelectedRequests] = useState<string[]>(() =>
    approvedRequests.map((req) => req.id)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdListCount, setCreatedListCount] = useState(0);

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
    setCreatedListCount(selectedItems.length);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/to-truong-ky-thuat/duyet-de-xuat");
  };

  const getTotalEstimatedCost = () => {
    return selectedRequests
      .map((id) => approvedRequests.find((req) => req.id === id))
      .filter(Boolean)
      .reduce((total, req) => total + (req?.estimatedCost || 0), 0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mt-0 mb-6"
        items={[
          {
            title: (
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => router.push("/to-truong-ky-thuat")}>
                Tổ trưởng kỹ thuật
              </span>
            ),
          },
          {
            title: (
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() =>
                  router.push("/to-truong-ky-thuat/duyet-de-xuat")
                }>
                Duyệt đề xuất
              </span>
            ),
          },
          {
            title: "Tạo danh sách đề xuất",
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}>
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Tạo danh sách đề xuất thay thế
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Tạo danh sách tổng hợp các đề xuất thay thế đã được phê duyệt
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin danh sách
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về danh sách đề xuất này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Equipment Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chọn thiết bị cần thay thế ({approvedRequests.length} thiết bị
                  đã duyệt)
                </h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  disabled={isSubmitting}>
                  {selectedRequests.length === approvedRequests.length
                    ? "Bỏ chọn tất cả"
                    : "Chọn tất cả"}
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {approvedRequests.length > 0 ? (
                approvedRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className={`p-6 ${
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
                        <div className="flex items-center mb-3">
                          <Computer className="h-5 w-5 text-gray-400 mr-2" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {request.assetCode} - {request.assetName}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            {request.estimatedCost?.toLocaleString("vi-VN")} VND
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>{request.requestedBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span className="truncate">{request.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(request.requestDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>

                        {request.reason && (
                          <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
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

        {/* Sidebar */}
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
                  {selectedRequests.length} / {approvedRequests.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chi phí ước tính:</span>
                <span className="font-semibold text-green-600">
                  {getTotalEstimatedCost().toLocaleString("vi-VN")} VND
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
                onClick={handleSubmit}
                disabled={
                  !title.trim() || selectedRequests.length === 0 || isSubmitting
                }
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
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
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
                onClick={handleSuccessClose}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Quay về danh sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
