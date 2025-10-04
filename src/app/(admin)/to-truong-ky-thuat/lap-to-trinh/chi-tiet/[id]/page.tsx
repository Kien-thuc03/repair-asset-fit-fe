"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  Calendar,
  MapPin,
  Package,
  FileText,
  Building,
  Eye,
  Download,
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ReplacementStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800 border-green-200";
      case ReplacementStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800 border-red-200";
      case ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <Package className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">
          Không tìm thấy tờ trình
        </h3>
        <p className="text-gray-500">
          Tờ trình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <a href="/to-truong-ky-thuat/lap-to-trinh">Quay lại danh sách</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Tổ trưởng kỹ thuật</span>
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
                  <span>Chi tiết tờ trình {request.proposalCode}</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Proposal Info Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Chi tiết tờ trình {request.proposalCode}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{request.title}</p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(
                request.status
              )}`}>
              {getStatusText(request.status)}
            </span>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề đề xuất
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {request.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tạo
                </label>
                <div className="flex items-center space-x-2 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md leading-relaxed">
                {request.description}
              </p>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin vị trí
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {(() => {
                // Lấy danh sách các phòng duy nhất từ tất cả components
                const uniqueRooms = Array.from(
                  new Set(
                    request.components.map(
                      (comp) => `${comp.buildingName}-${comp.roomName}`
                    )
                  )
                ).map((roomKey) => {
                  const [buildingName, roomName] = roomKey.split("-");
                  return { buildingName, roomName };
                });

                // Đếm số lượng linh kiện theo từng phòng
                const roomCounts = request.components.reduce((acc, comp) => {
                  const roomKey = `${comp.buildingName}-${comp.roomName}`;
                  acc[roomKey] = (acc[roomKey] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                // Nếu chỉ có 1 phòng, hiển thị đơn giản
                if (uniqueRooms.length === 1) {
                  const room = uniqueRooms[0];
                  return (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Tòa nhà:
                        </span>
                        <span className="text-sm text-gray-900">
                          {room.buildingName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Phòng:
                        </span>
                        <span className="text-sm text-gray-900">
                          {room.roomName}
                        </span>
                      </div>
                    </div>
                  );
                }

                // Nếu có nhiều phòng, hiển thị danh sách
                return (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Tòa nhà:
                      </span>
                      <span className="text-sm text-gray-900">
                        {uniqueRooms[0].buildingName}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-start space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <span className="text-sm font-medium text-gray-700">
                          Phòng liên quan:
                        </span>
                      </div>
                      <div className="ml-7 space-y-2">
                        {uniqueRooms.map((room, index) => {
                          const roomKey = `${room.buildingName}-${room.roomName}`;
                          const count = roomCounts[roomKey];
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm text-gray-900">
                                {room.roomName}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {count} linh kiện
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium">
                            Tổng cộng:
                          </span>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                              {uniqueRooms.length} phòng
                            </span>
                            <span className="text-gray-600">
                              {request.components.length} linh kiện
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Components Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách linh kiện cần thay thế ({request.components.length}{" "}
                loại linh kiện)
              </h3>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phòng/Vị trí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linh kiện hiện tại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Linh kiện thay thế
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lý do thay thế
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.components.map((component, index) => (
                    <tr
                      key={component.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {component.buildingName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {component.roomName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {component.componentName}
                            </div>
                            <div className="text-xs text-gray-500">
                              Mã: {component.assetCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {component.newItemName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {component.newItemSpecs}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {component.quantity}{" "}
                          {component.quantity > 1 ? "cái" : "cái"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs">
                          {component.reason}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tài liệu đính kèm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {request.submissionFormUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tờ trình 
                      </p>
                      <p className="text-xs text-gray-500">DOC Document</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={request.submissionFormUrl}
                      className="text-blue-600 hover:text-blue-900"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={request.submissionFormUrl}
                      download
                      className="text-gray-600 hover:text-gray-900"
                      title="Tải xuống">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
