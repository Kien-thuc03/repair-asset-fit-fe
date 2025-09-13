"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  Wrench,
  FileText,
  CheckCircle,
  XCircle,
  Pause,
  Edit3,
  Trash2,
} from "lucide-react";
import { mockRepairRequests, repairRequestStatusConfig } from "@/lib/mockData";

export default function ChiTietTheoDaoTienDoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for modals
  const [showCancelModal, setShowCancelModal] = useState(false);

  const request = useMemo(
    () => mockRepairRequests.find((r) => r.id === id),
    [id]
  );

  // Handle edit request
  const handleEditRequest = () => {
    if (!request) return;

    // Prepare data for editing
    const editData = {
      requestId: request.id,
      assetId: request.assetId,
      assetName: request.assetName,
      roomId: request.roomId,
      roomName: request.roomName,
      componentId: request.componentId,
      componentName: request.componentName,
      errorTypeId: request.errorTypeId || "",
      errorTypeName: request.errorTypeName || "",
      description: request.description,
      // Add timestamp to ensure data freshness
      timestamp: Date.now(),
    };

    // Save to localStorage
    localStorage.setItem("editRequestData", JSON.stringify(editData));

    // Navigate to report page
    router.push("/giang-vien/bao-cao-loi?edit=true");
  };

  // Handle cancel request
  const handleCancelRequest = () => {
    setShowCancelModal(true);
  };

  // Confirm cancel request
  const confirmCancelRequest = () => {
    // TODO: Call API to cancel request
    console.log("Cancel request:", request?.id);
    setShowCancelModal(false);
    // After successful cancellation, redirect back
    router.push("/giang-vien/theo-doi-tien-do");
  };

  if (!request) {
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/giang-vien/theo-doi-tien-do",
              title: (
                <div className="flex items-center">
                  <span>Theo dõi tiến độ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết</span>
                </div>
              ),
            },
          ]}
        />
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Không tìm thấy yêu cầu
          </h1>
          <p className="mt-2 text-gray-600">
            Yêu cầu với ID này không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = repairRequestStatusConfig[request.status].icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/giang-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            href: "/giang-vien/theo-doi-tien-do",
            title: (
              <div className="flex items-center">
                <span>Theo dõi tiến độ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Chi tiết • {request.requestCode}</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Chi tiết yêu cầu • {request.requestCode}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Theo dõi chi tiết trạng thái xử lý yêu cầu
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            {/* Action buttons for pending requests */}
            {request.status === "CHỜ_TIẾP_NHẬN" && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEditRequest}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleCancelRequest}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hủy yêu cầu
                </button>
              </div>
            )}
            {/* Status badge */}
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${
                repairRequestStatusConfig[request.status].color
              }`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {repairRequestStatusConfig[request.status].label}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin yêu cầu */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin yêu cầu
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Wrench className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tài sản
                      </label>
                      <p className="mt-1 text-sm text-gray-900 font-medium">
                        {request.assetName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.assetCode}
                      </p>
                      {request.componentName && (
                        <p className="text-xs text-blue-600">
                          Linh kiện: {request.componentName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Vị trí
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {request.roomName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loại lỗi
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {request.errorTypeName || "Chưa phân loại"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Người báo cáo
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {request.reporterName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Wrench className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Người xử lý
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {request.assignedTechnicianName || "Chưa tiếp nhận"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày tạo
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả chi tiết
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-900">
                        {request.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ghi chú xử lý */}
          {request.resolutionNotes && request.resolutionNotes.trim() !== "" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Ghi chú xử lý
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-gray-900">
                        {request.resolutionNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Tiến độ xử lý
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Ngày tạo */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Yêu cầu được tạo
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Ngày tiếp nhận */}
                {request.acceptedAt && request.acceptedAt.trim() !== "" && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Đã tiếp nhận
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.acceptedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Trạng thái hiện tại */}
                {request.status !== "CHỜ_TIẾP_NHẬN" &&
                  request.status !== "ĐÃ_TIẾP_NHẬN" && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            request.status === "ĐÃ_HOÀN_THÀNH"
                              ? "bg-green-100"
                              : request.status === "ĐÃ_HỦY"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                          }`}>
                          {request.status === "ĐÃ_HOÀN_THÀNH" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : request.status === "ĐÃ_HỦY" ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Pause className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {repairRequestStatusConfig[request.status].label}
                        </p>
                        {request.completedAt &&
                          request.completedAt.trim() !== "" && (
                            <p className="text-xs text-gray-500">
                              {formatDate(request.completedAt)}
                            </p>
                          )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Thông tin thêm
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Notice for editable requests */}
              {request.status === "CHỜ_TIẾP_NHẬN" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">
                        Yêu cầu có thể chỉnh sửa
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Yêu cầu này chưa được tiếp nhận, bạn có thể chỉnh sửa
                        thông tin hoặc hủy yêu cầu.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mức độ ưu tiên
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                  Trung bình
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày dự kiến hoàn thành
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(
                    new Date(request.createdAt).getTime() +
                      7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("vi-VN")}
                </p>
              </div>

              {request.status === "ĐÃ_HOÀN_THÀNH" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thời gian xử lý
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.completedAt
                      ? Math.ceil(
                          (new Date(request.completedAt).getTime() -
                            new Date(request.createdAt).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : "N/A"}{" "}
                    ngày
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Request Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Xác nhận hủy yêu cầu
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn hủy yêu cầu sửa chữa này không? Hành
                  động này không thể hoàn tác.
                </p>
                <p className="text-sm text-gray-700 font-medium mt-2">
                  Mã yêu cầu: {request.requestCode}
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 px-4 py-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmCancelRequest}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
