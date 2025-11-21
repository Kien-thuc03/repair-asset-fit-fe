"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Breadcrumb, Modal } from "antd";
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
import { ReplacementProposal} from "@/lib/api/replacement-proposals";
import { SubmissionPreviewModal } from "@/components/modal";
import { SubmissionFormData, ReplacementProposalStatus } from "@/types";

export default function ChiTietLapToTrinhPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for modal
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);

  // Fetch data from API
  const { data: request, loading, error } = useReplacementProposal(id);

  // Default form data for preview modal
  const defaultSubmissionFormData: SubmissionFormData = useMemo(
    () => ({
      recipientDepartment: "Ban Giám hiệu",
      submittedBy: "Giảng Thanh Trọn", // Always default to this name
      position: "Tổ trưởng Kỹ thuật",
      department: "Phòng Quản trị",
      subject: request?.title || "",
      attachments: "Biên bản kiểm tra kỹ thuật",
      content: request?.description || "",
      director: "TS. Lê Nhất Duy",
      rector: "TS. Phan Hồng Hải",
    }),
    [request?.title, request?.description]
  );

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

  // Helper function to get filename from URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      const fileName = url.split("/").pop() || url;
      return decodeURIComponent(fileName);
    } catch {
      return url;
    }
  };

  // Export handler for downloading DOCX file
  const generateSubmissionHTML = (
    formData: SubmissionFormData,
    proposal: ReplacementProposal
  ): string => {
    // Ensure formData.submittedBy is always "Giảng Thanh Trọn"
    const fixedFormData = {
      ...formData,
      submittedBy: "Giảng Thanh Trọn",
      position: "Tổ trưởng Kỹ thuật",
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; margin: 40px; }
          .header-table { width: 100%; border: none; margin-bottom: 10px; }
          .header-table td { border: none; padding: 0; vertical-align: top; font-size: 11pt; }
          .header-left { text-align: center; width: 50%; }
          .header-right { text-align: center; width: 50%; }
          .title { text-align: center; font-weight: bold; font-size: 14pt; margin: 20px 0; }
          .subtitle { text-align: center; font-size: 13pt; margin-bottom: 20px; }
          .content { margin: 20px 0; }
          table.items { width: 100%; border-collapse: collapse; margin: 20px 0; }
          table.items th, table.items td { border: 1px solid black; padding: 8px; text-align: left; }
          .signature-table { width: 100%; border: none; margin-top: 30px; }
          .signature-table td { border: none; text-align: center; vertical-align: top; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="header-left">
              <strong>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP</strong><br>
              <strong>THÀNH PHỐ HỒ CHÍ MINH</strong><br>
              <strong>${fixedFormData.department?.toUpperCase()}</strong>
            </td>
            <td class="header-right">
              <strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
              <strong>Độc lập - Tự do - Hạnh phúc</strong>
            </td>
          </tr>
        </table>
        <p style="text-align: right; margin: 20px 0;">
          <em>Thành phố Hồ Chí Minh, ngày ___ tháng ___ năm 2025</em>
        </p>
        <h2 class="title">PHIẾU ĐỀ NGHỊ GIẢI QUYẾT CÔNG VIỆC</h2>
        <h3 class="subtitle">${fixedFormData.subject}</h3>
        <div class="content">
          <p><strong>Kính gửi:</strong> ${fixedFormData.recipientDepartment}</p>
          <p><strong>Người đề nghị:</strong> ${
            fixedFormData.submittedBy
          } &nbsp;&nbsp;&nbsp;&nbsp; <strong>Chức vụ:</strong> ${
      fixedFormData.position
    }</p>
          <p><strong>Đơn vị:</strong> ${fixedFormData.department}</p>
          <p><strong>Đề nghị:</strong> ${fixedFormData.subject}</p>
          <p><strong>Văn bản kèm theo:</strong> ${fixedFormData.attachments}</p>
          <h4 style="text-align: center; margin: 20px 0;">NỘI DUNG</h4>
          <p style="text-align: justify;">${fixedFormData.content}</p>
          ${
            proposal.items && proposal.items.length > 0
              ? `
            <p><strong>Danh sách linh kiện đề xuất thay thế:</strong></p>
            <table class="items">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Linh kiện cũ</th>
                  <th>Linh kiện mới đề xuất</th>
                  <th>SL</th>
                  <th>Lý do</th>
                </tr>
              </thead>
              <tbody>
                ${proposal.items
                  .map(
                    (item, index) => `
                  <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${
                      item.oldComponent?.name || "Không xác định"
                    }<br><small>${
                      item.oldComponent?.componentSpecs || ""
                    }</small></td>
                    <td>${item.newItemName || "Không xác định"}<br><small>${
                      item.newItemSpecs || ""
                    }</small></td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td>${item.reason || "Cần thay thế"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : ""
          }
          <p style="margin-top: 20px;">${
            fixedFormData.department
          } kính trình Ban Giám hiệu xem xét và phê duyệt.</p>
          <table class="signature-table">
            <tr>
              <td style="width: 33%;">
                <strong>Trưởng phòng</strong><br><br><br><br><br>
                ${fixedFormData.director}
              </td>
              <td style="width: 33%;">
                <strong>Hiệu trưởng</strong><br><br><br><br><br>
                ${fixedFormData.rector}
              </td>
              <td style="width: 33%;">
                <strong>${fixedFormData.position}</strong><br>
                <em>(Ký và ghi rõ họ tên)</em><br><br><br><br>
                ${fixedFormData.submittedBy}
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  const handleExportSubmissionDocx = () => {
    if (!request) return;

    try {
      const htmlContent = generateSubmissionHTML(
        defaultSubmissionFormData,
        request
      );

      const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `To_trinh_${request.proposalCode}_${
        new Date().toISOString().split("T")[0]
      }.doc`;
      link.click();
      window.URL.revokeObjectURL(url);

      Modal.success({
        title: "Xuất file thành công!",
        content: `File tờ trình đã được tải xuống.`,
        centered: true,
      });
    } catch (error) {
      console.error("Lỗi xuất file:", error);
      Modal.error({
        title: "Lỗi",
        content: "Không thể xuất file. Vui lòng thử lại.",
        centered: true,
      });
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-blue-50">
              {request.submissionFormUrl && (
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getFileNameFromUrl(request.submissionFormUrl)}
                      </p>
                      <p className="text-xs text-gray-500">DOC Document</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSubmissionPreview(true)}
                      className="text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Xem tài liệu">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={handleExportSubmissionDocx}
                      className="text-gray-600 hover:bg-blue-100 rounded transition-colors"
                      title="Tải xuống">
                      <Download className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Preview Modal */}
      {request && (
        <SubmissionPreviewModal
          isOpen={showSubmissionPreview}
          onClose={() => setShowSubmissionPreview(false)}
          formData={defaultSubmissionFormData}
          proposal={request}
          onExport={handleExportSubmissionDocx}
          onSubmit={() => {}}
          showSubmitButton={false}
        />
      )}
    </div>
  );
}
