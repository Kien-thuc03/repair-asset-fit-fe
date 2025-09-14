"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Package,
  FileText,
  CheckCircle,
  XCircle,
  Hash,
  DollarSign,
  Clock,
  Info,
} from "lucide-react";
import { mockReplacementRequests } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus } from "@/types";

export default function ChiTietDuyetDeXuatPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for actions
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const request = useMemo(
    () => mockReplacementRequests.find((r) => r.id === id),
    [id]
  );

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy đề xuất
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "bg-yellow-100 text-yellow-800";
      case ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "bg-blue-100 text-blue-800";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: ReplacementStatus) => {
    switch (status) {
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "Chờ tổ trưởng duyệt";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "Đã duyệt";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "Đã từ chối";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã hoàn tất mua sắm";
      default:
        return "Không xác định";
    }
  };

  const handleApprove = () => {
    console.log("Approving request:", id);
    setShowApproveModal(false);
    // Implement approval logic here
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    console.log("Rejecting request:", id, "Reason:", rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
    // Implement rejection logic here
  };

  const canApproveOrReject =
    request.status === ReplacementStatus.CHỜ_XÁC_MINH ||
    request.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT;

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
            title: "Chi tiết đề xuất",
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chi tiết đề xuất thay thế linh kiện
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Mã đề xuất: {request.id}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                request.status
              )}`}>
              {getStatusText(request.status)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {canApproveOrReject && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={() => setShowApproveModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Phê duyệt</span>
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2">
                <XCircle className="h-4 w-4" />
                <span>Từ chối</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin cơ bản
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Người yêu cầu
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.requestedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Ngày yêu cầu
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.requestDate).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Vị trí
                      </p>
                      <p className="text-sm text-gray-600">
                        {request.location}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Component Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Chi tiết linh kiện
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Mã tài sản
                    </p>
                    <p className="text-sm text-gray-600">{request.assetCode}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tên linh kiện
                    </p>
                    <p className="text-sm text-gray-600">{request.assetName}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Lý do thay thế
                    </p>
                    <p className="text-sm text-gray-600">{request.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Mô tả
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {request.description || "Không có mô tả"}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Trạng thái
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        request.status === ReplacementStatus.CHỜ_XÁC_MINH ||
                        request.status ===
                          ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT ||
                        request.status === ReplacementStatus.ĐÃ_DUYỆT ||
                        request.status === ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Đề xuất đã được tạo
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                {request.status !== ReplacementStatus.CHỜ_XÁC_MINH && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status ===
                            ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT ||
                          request.status === ReplacementStatus.ĐÃ_DUYỆT ||
                          request.status ===
                            ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM
                            ? "bg-green-500"
                            : request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI
                            ? "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Đã xác minh
                      </p>
                    </div>
                  </div>
                )}

                {(request.status === ReplacementStatus.ĐÃ_DUYỆT ||
                  request.status === ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM) && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Đã phê duyệt
                      </p>
                    </div>
                  </div>
                )}

                {request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Đã từ chối
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Thao tác nhanh
              </h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              <button
                onClick={() => router.back()}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center justify-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại danh sách</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xác nhận phê duyệt
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn phê duyệt đề xuất này không?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Phê duyệt
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Từ chối đề xuất
            </h3>
            <p className="text-gray-600 mb-4">Vui lòng nhập lý do từ chối:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="w-full p-3 border border-gray-300 rounded-md mb-6 h-24 resize-none"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                Từ chối
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
