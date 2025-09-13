"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit3,
  Settings,
  MapPin,
} from "lucide-react";
import { RepairRequest, RepairStatus } from "@/types";
import { mockRepairRequests, repairRequestStatusConfig } from "@/lib/mockData";
import { Breadcrumb } from "antd";

export default function ChiTietBaoLoiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestId = searchParams.get("id");

  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      // Tìm request từ mock data
      const foundRequest = mockRepairRequests.find(
        (req) => req.id === requestId
      );
      setRequest(foundRequest || null);
    }
    setLoading(false);
  }, [requestId]);

  const getStatusBadge = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.color : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    return config ? config.label : status;
  };

  const getStatusIcon = (status: RepairStatus) => {
    const config = repairRequestStatusConfig[status];
    const IconComponent = config ? config.icon : Clock;
    return <IconComponent className="h-5 w-5" />;
  };

  const updateRequestStatus = (newStatus: RepairStatus) => {
    if (!request) return;

    const updatedRequest = {
      ...request,
      status: newStatus,
      acceptedAt:
        newStatus === RepairStatus.ĐANG_XỬ_LÝ && !request.acceptedAt
          ? new Date().toISOString()
          : request.acceptedAt,
      completedAt:
        newStatus === RepairStatus.ĐÃ_HOÀN_THÀNH
          ? new Date().toISOString()
          : request.completedAt,
    };

    setRequest(updatedRequest);

    // Cập nhật vào mock data (trong thực tế sẽ gọi API)
    const requestIndex = mockRepairRequests.findIndex(
      (req) => req.id === request.id
    );
    if (requestIndex !== -1) {
      mockRepairRequests[requestIndex] = updatedRequest;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy báo lỗi
          </h2>
          <p className="text-gray-600 mb-4">
            Báo lỗi bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/to-truong-ky-thuat/danh-sach-bao-loi",
              title: (
                <div className="flex items-center">
                  <span>Danh sách báo lỗi</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết báo lỗi</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chi tiết báo lỗi {request.requestCode}
              </h1>
              <p className="text-gray-600 mt-1">
                Thông tin chi tiết về báo cáo lỗi từ giảng viên
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(request.status)}
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                request.status
              )}`}>
              {getStatusText(request.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Thông tin tài sản
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã tài sản
                  </label>
                  <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-3 py-2 rounded">
                    {request.assetCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên thiết bị
                  </label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
                    {request.assetName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Linh kiện
                  </label>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
                    {request.componentName || "Tổng thể"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vị trí
                  </label>
                  <div className="flex items-center mt-1 bg-gray-50 px-3 py-2 rounded">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {request.roomName} - {request.buildingName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Description */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Mô tả lỗi
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại lỗi
                  </label>
                  <p className="text-sm text-gray-900 mt-1 bg-red-50 px-3 py-2 rounded border border-red-200">
                    {request.errorTypeName || "Chưa xác định"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chi tiết mô tả
                  </label>
                  <div className="mt-1 bg-gray-50 px-4 py-3 rounded-lg border">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {request.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Notes */}
          {request.resolutionNotes && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Edit3 className="h-5 w-5 mr-2" />
                  Ghi chú xử lý
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {request.resolutionNotes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Người báo cáo
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ tên
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {request.reporterName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {request.reporterRole}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày báo cáo
                  </label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {new Date(request.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Information */}
          {request.assignedTechnicianName && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Kỹ thuật viên
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ tên
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {request.assignedTechnicianName}
                    </p>
                  </div>
                  {request.acceptedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thời gian tiếp nhận
                      </label>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(request.acceptedAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  )}
                  {request.completedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thời gian hoàn thành
                      </label>
                      <div className="flex items-center mt-1">
                        <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(request.completedAt).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
