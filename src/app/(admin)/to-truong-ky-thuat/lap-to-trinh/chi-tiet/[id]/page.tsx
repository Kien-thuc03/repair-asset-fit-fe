"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Package,
  FileText,
  Hash,
  Clock,
  Info,
} from "lucide-react";
import { getReportListsByStatus } from "@/lib/mockData/reportLists";
import { ReplacementStatus } from "@/types";

export default function ChiTietLapToTrinhPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const request = useMemo(() => {
    // Lấy tất cả các items từ các danh sách đã tạo có trạng thái "CHỜ_LẬP_TỜ_TRÌNH"
    const reportLists = getReportListsByStatus("CHỜ_LẬP_TỜ_TRÌNH");
    const allItems = reportLists.flatMap((list) => list.items);
    return allItems.find((r) => r.id === id);
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "bg-yellow-100 text-yellow-800";
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "Chờ duyệt";
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "Đã duyệt";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "Từ chối";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã mua sắm";
      default:
        return status;
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-6">
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
              href: "/to-truong-ky-thuat/lap-to-trinh",
              title: (
                <div className="flex items-center">
                  <span>Lập tờ trình</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Chi tiết đề xuất</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Quay lại</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết đề xuất #{request.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Thông tin chi tiết về đề xuất thay thế thiết bị
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Thông tin cơ bản
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Mã đề xuất
                  </div>
                  <div className="text-sm text-gray-900">{request.id}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Tên tài sản
                  </div>
                  <div className="text-sm text-gray-900">
                    {request.assetName}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Mã tài sản
                  </div>
                  <div className="text-sm text-gray-900">
                    {request.assetCode}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Người đề xuất
                  </div>
                  <div className="text-sm text-gray-900">
                    {request.requestedBy}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Vị trí
                  </div>
                  <div className="text-sm text-gray-900">
                    {request.location}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Đơn vị
                  </div>
                  <div className="text-sm text-gray-900">{request.unit}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Ngày đề xuất
                  </div>
                  <div className="text-sm text-gray-900">
                    {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Mô tả</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {request.description || "Không có mô tả"}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Lý do thay thế
              </h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {request.reason || "Không có lý do cụ thể"}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Trạng thái
              </h2>
            </div>

            <div className="text-center">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                  request.status
                )}`}>
                {getStatusText(request.status)}
              </span>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Cập nhật lần cuối:{" "}
                {new Date(request.requestDate).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Actions */}
          {request.status === ReplacementStatus.ĐÃ_DUYỆT && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    router.push(
                      `/to-truong-ky-thuat/lap-to-trinh/lap-to-trinh/${request.id}`
                    );
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
                  title="Lập tờ trình">
                  <FileText className="h-4 w-4" />
                  <span>Lập tờ trình</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
