"use client";

import { useParams } from "next/navigation";
import { Breadcrumb } from "antd";
import {
  Calendar,
  Package,
  FileText,
  Eye,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useReplacementProposal } from "@/hooks/useReplacementProposals";
import { ReplacementProposalStatus } from "@/lib/api/replacement-proposals";

export default function ChiTietLapToTrinhPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // Fetch data from API
  const { data: request, loading, error } = useReplacementProposal(id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case ReplacementProposalStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800 border-green-200";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800 border-red-200";
      case ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-lime-100 text-lime-800 border-lime-200";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN:
        return "bg-teal-100 text-teal-800 border-teal-200";
      case ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "Chờ duyệt";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "Đã xác minh";
      case ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Đã lập tờ trình";
      case ReplacementProposalStatus.ĐÃ_DUYỆT:
        return "Đã duyệt";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI:
        return "Từ chối";
      case ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Đã duyệt tờ trình";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH:
        return "Từ chối tờ trình";
      case ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN:
        return "Đã gửi biên bản";
      case ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN:
        return "Đã ký biên bản";
      case ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã mua sắm";
      default:
        return status;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <h3 className="text-lg font-medium text-gray-900">
          Đang tải dữ liệu...
        </h3>
        <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900">Lỗi tải dữ liệu</h3>
        <p className="text-gray-500">{error}</p>
        <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <a href="/to-truong-ky-thuat/lap-to-trinh">Quay lại danh sách</a>
        </div>
      </div>
    );
  }

  // Not found state
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

          {/* Location Information - Simplified for API data */}
          {request.items &&
            request.items.length > 0 &&
            request.items[0].oldComponent && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thông tin linh kiện
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Tổng số linh kiện cần thay thế:
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {request.itemsCount || request.items?.length || 0} linh
                      kiện
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* Components Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách linh kiện cần thay thế (
                {request.itemsCount || request.items?.length || 0} linh kiện)
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
                  {request.items?.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            {item.oldComponent ? (
                              <>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.oldComponent.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Loại: {item.oldComponent.componentType}
                                </div>
                                {item.oldComponent.componentSpecs && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {item.oldComponent.componentSpecs}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-sm text-gray-500">
                                Không xác định
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.newItemName}
                          </div>
                          {item.newItemSpecs && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.newItemSpecs}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.quantity} {item.quantity > 1 ? "cái" : "cái"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs">
                          {item.reason || "Không có lý do"}
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
