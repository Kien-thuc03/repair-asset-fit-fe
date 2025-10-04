"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  User,
  Calendar,
  MapPin,
  Package,
  FileText,
  Hash,
  Clock,
  Info,
} from "lucide-react";
import { mockReplacementRequestItem } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus } from "@/types/repair";

export default function ChiTietLapToTrinhPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  const request = useMemo(() => {
    // Lấy đề xuất từ mockReplacementRequestItem với trạng thái ĐÃ_LẬP_TỜ_TRÌNH
    return mockReplacementRequestItem.find(
      (r) => r.id === id && r.status === ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH
    );
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
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-purple-100 text-purple-800";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-indigo-100 text-indigo-800";
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
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Đã lập tờ trình";
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết tờ trình {request.proposalCode}
            </h1>
            <p className="text-gray-600 mt-1">
              Tờ trình đã lập cho đề xuất: {request.title}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Tổng quan tài sản
              </h2>
            </div>

            {request.components && request.components.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Unique assets */}
                {Array.from(
                  new Map(
                    request.components.map((c) => [c.assetId, c])
                  ).values()
                ).map((component) => (
                  <div
                    key={component.assetId}
                    className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {component.assetName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Mã: {component.assetCode}
                        </div>
                        <div className="text-xs text-gray-500">
                          Vị trí: {component.buildingName} -{" "}
                          {component.roomName}
                          {component.machineLabel &&
                            ` (Máy ${component.machineLabel})`}
                        </div>
                        <div className="text-xs text-blue-600 mt-2">
                          {
                            request.components?.filter(
                              (c) => c.assetId === component.assetId
                            ).length
                          }{" "}
                          linh kiện cần thay
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Form Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Thông tin tờ trình đã lập
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Người đề nghị
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    Giảng Thanh Trọn
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Chức vụ
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    Tổ trưởng kỹ thuật
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Đơn vị đề nghị
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    Khoa Công Nghệ Thông Tin
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Đơn vị tiếp nhận
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    Phòng Quản trị
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Đề nghị
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    Đề xuất thay thế linh kiện thiết bị
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Văn bản kèm theo
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    Đề xuất {request.proposalCode}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Giám đốc
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    TS. Lê Nhất Duy
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Hiệu trưởng
                  </label>
                  <div className="text-sm text-gray-900 p-3 bg-gray-50 rounded-md">
                    TS. Phan Hồng Hải
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Nội dung tờ trình
              </label>
              <div className="text-sm text-gray-900 p-4 bg-gray-50 rounded-md min-h-[200px] leading-relaxed">
                {`Phòng Lab ${request.components?.[0]?.buildingName} - ${
                  request.components?.[0]?.roomName
                } của Khoa CNTT đang cần thay thế thiết bị. Một số linh kiện máy tính đã hư hỏng và cần được thay thế để đảm bảo hoạt động ổn định của hệ thống.

Thông tin chi tiết về đề xuất thay thế:

${
  request.components
    ?.map(
      (comp) =>
        `- ${comp.componentName} (${comp.assetCode}) tại ${comp.roomName}: ${comp.reason} → Thay thế bằng ${comp.newItemName} (${comp.newItemSpecs})`
    )
    .join("\n") || ""
}

Khoa CNTT kính trình Ban Giám hiệu phê duyệt chi ngân sách cho Phòng Quản trị tiến hành thay thế các linh kiện để phục vụ công tác giảng dạy cho sinh viên được tốt hơn.

Thông tin tổng hợp:
- Mã đề xuất: ${request.proposalCode}
- Tiêu đề: ${request.title}
- Người đề xuất: ${request.createdBy || "Không xác định"}
- Tổng số linh kiện cần thay: ${request.components?.length || 0}

Khoa rất mong Ban Giám hiệu xem xét và đồng ý cho thực hiện.

Trân trọng kính trình.`}
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  Tờ trình đã được lập và gửi tới Phòng Quản trị
                </span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                Ngày lập: {new Date().toLocaleDateString("vi-VN")} -{" "}
                {new Date().toLocaleTimeString("vi-VN")}
              </div>
            </div>
          </div>

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
                  <div className="text-sm text-gray-900">
                    {request.proposalCode}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Tiêu đề
                  </div>
                  <div className="text-sm text-gray-900">{request.title}</div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Người đề xuất
                  </div>
                  <div className="text-sm text-gray-900">
                    {request.createdBy || "Không xác định"}
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
                    {request.components?.[0]?.buildingName &&
                    request.components?.[0]?.roomName
                      ? `${request.components[0].buildingName} - ${request.components[0].roomName}`
                      : "Không có vị trí cụ thể"}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Số lượng linh kiện
                  </div>
                  <div className="text-sm text-gray-900">
                    {request.components?.length || 0} linh kiện
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Ngày tạo đề xuất
                  </div>
                  <div className="text-sm text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString("vi-VN")}
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

          {/* Components Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Chi tiết linh kiện cần thay thế
              </h2>
            </div>

            {request.components && request.components.length > 0 ? (
              <div className="space-y-4">
                {request.components.map((component) => (
                  <div
                    key={component.id}
                    className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Linh kiện hiện tại:
                        </span>
                        <p className="text-sm text-gray-900">
                          {component.componentName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Linh kiện thay thế:
                        </span>
                        <p className="text-sm text-gray-900">
                          {component.newItemName}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Vị trí:
                        </span>
                        <p className="text-sm text-gray-900">
                          {component.buildingName} - {component.roomName}
                          {component.machineLabel &&
                            ` (Máy ${component.machineLabel})`}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Số lượng:
                        </span>
                        <p className="text-sm text-gray-900">
                          {component.quantity}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500">
                          Lý do thay thế:
                        </span>
                        <p className="text-sm text-gray-900">
                          {component.reason}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500">
                          Thông số kỹ thuật mới:
                        </span>
                        <p className="text-sm text-gray-900">
                          {component.newItemSpecs}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700">
                Không có thông tin chi tiết về linh kiện
              </p>
            )}
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
                {new Date(request.updatedAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin bổ sung
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng số linh kiện:</span>
                <span className="font-medium">
                  {request.components?.length || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Số phòng liên quan:</span>
                <span className="font-medium">
                  {new Set(
                    request.components?.map(
                      (c) => `${c.buildingName}-${c.roomName}`
                    )
                  ).size || 0}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Loại linh kiện:</span>
                <span className="font-medium">
                  {new Set(request.components?.map((c) => c.componentType))
                    .size || 0}{" "}
                  loại
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="text-gray-500 mb-2">Tiến trình xử lý:</div>
                <div className="text-xs space-y-1">
                  <div>✓ Đã được kỹ thuật viên đề xuất</div>
                  <div>✓ Đã được tổ trưởng phê duyệt</div>
                  <div className="text-purple-600 font-medium">
                    ✓ Đã lập tờ trình
                  </div>
                  <div className="text-gray-400">⏳ Chờ phê duyệt tờ trình</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
