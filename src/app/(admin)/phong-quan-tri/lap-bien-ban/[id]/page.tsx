"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Building,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Breadcrumb, Modal } from "antd";
import {
  InspectionFormModal,
  InspectionPreviewModal,
} from "@/components/modal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import { InspectionFormData } from "@/types";
import { ReplacementProposalStatus } from "@/lib/api/replacement-proposals";
import { uploadFile } from "@/lib/api/upload";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [showInspectionPreview, setShowInspectionPreview] = useState(false);
  const [inspectionFormData, setInspectionFormData] =
    useState<InspectionFormData>({
      requestedBy: "Khoa CNTT",
      year: "2025",
      inspectionDay: "",
      inspectionMonth: "",
      inspectionYear: "2025",
      location: "",
      departmentRep: "Giang Thanh Trọn",
      departmentName: "Khoa CNTT",
      adminRep: "Nguyễn Văn Ngã",
      adminDepartment: "Phòng Quản trị",
      notes: "",
    });

  // Fetch proposal data từ API
  const {
    data: proposal,
    loading,
    error,
    refetch,
  } = useReplacementProposal(id);

  // Update status hook
  const { updateStatus } = useUpdateReplacementProposalStatus();

  const getStatusColor = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "Đã xác minh - Cần lập biên bản";
      default:
        return status;
    }
  };

  const handleCreateInspectionReport = () => {
    setShowInspectionForm(true);
  };

  const handleCloseInspectionForm = () => {
    setShowInspectionForm(false);
  };

  const handleSubmitInspectionReport = async () => {
    if (!proposal) return;

    try {
      // 1. Tạo file DOCX từ HTML content
      const htmlContent = generateInspectionHTML(inspectionFormData, proposal);

      const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" });
      const fileName = `Bien_ban_kiem_tra_${proposal.proposalCode}_${
        new Date().toISOString().split("T")[0]
      }.doc`;
      const file = new File([blob], fileName, {
        type: "application/vnd.ms-word",
      });

      // 2. Upload file lên Cloudinary
      Modal.info({
        title: "Đang xử lý...",
        content: "Đang tải file biên bản lên server...",
        centered: true,
      });

      const uploadResult = await uploadFile(file, "inspection-reports");

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Upload file thất bại");
      }

      // 3. Cập nhật trạng thái theo workflow
      // Workflow: KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH → ĐÃ_DUYỆT_TỜ_TRÌNH → CHỜ_XÁC_MINH → ĐÃ_XÁC_MINH → ĐÃ_GỬI_BIÊN_BẢN

      // Chuyển từ ĐÃ_XÁC_MINH sang ĐÃ_GỬI_BIÊN_BẢN sau khi lập biên bản
      if (proposal.status === ReplacementProposalStatus.ĐÃ_XÁC_MINH) {
        await updateStatus(proposal.id, {
          status: ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN,
          verificationReportUrl: uploadResult.url,
        });
      }
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN,
        verificationReportUrl: uploadResult.url,
      });

      // Close modals
      setShowInspectionForm(false);
      setShowInspectionPreview(false);

      // Refetch data
      refetch();

      // Redirect
      setTimeout(() => {
        router.push("/phong-quan-tri/lap-bien-ban");
      }, 300);

      Modal.success({
        title: "Gửi biên bản thành công!",
        content: `Biên bản kiểm tra cho đề xuất ${proposal.proposalCode} đã được tạo và gửi.`,
        centered: true,
        mask: false,
        keyboard: false,
      });
    } catch (err) {
      console.error("Error creating inspection report:", err);
      Modal.error({
        title: "Lỗi",
        content: err instanceof Error ? err.message : "Không thể lập biên bản.",
        centered: true,
      });
    }
  };

  // Hàm helper để generate HTML content cho biên bản kiểm tra
  const generateInspectionHTML = (
    formData: InspectionFormData,
    proposalData: typeof proposal
  ): string => {
    if (!proposalData) return "";

    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 13pt; line-height: 1.5; margin: 40px; }
            .header-table { width: 100%; border: none; margin-bottom: 10px; }
            .header-table td { border: none; padding: 0; vertical-align: top; font-size: 11pt; text-align: center; }
            .header-left { width: 50%; }
            .header-right { width: 50%; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            table.data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table.data-table th, table.data-table td { border: 1px solid black; padding: 8px; }
            table.data-table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            h2 { font-size: 14pt; font-weight: bold; text-align: center; margin: 20px 0 10px 0; }
            h3 { font-size: 13pt; font-weight: bold; text-align: center; margin: 5px 0 20px 0; }
            p { margin: 5px 0; }
            .right-text { text-align: right; margin-bottom: 20px; }
            .signature-section { margin-top: 40px; }
            .signature-table { width: 100%; border: none; }
            .signature-table td { border: none; text-align: center; padding: 10px; vertical-align: top; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td class="header-left">
                <p>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP</p>
                <p>THÀNH PHỐ HỒ CHÍ MINH</p>
                <p class="bold">PHÒNG QUẢN TRỊ</p>
              </td>
              <td class="header-right">
                <p class="bold">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p class="bold underline">Độc lập - Tự do - Hạnh phúc</p>
              </td>
            </tr>
          </table>
          
          <p class="right-text">
            <em>Thành phố Hồ Chí Minh, ngày ${
              formData.inspectionDay || "___"
            } tháng ${formData.inspectionMonth || "___"} năm ${
      formData.inspectionYear || "2025"
    }</em>
          </p>
          
          <h2>BIÊN BẢN</h2>
          <h3>Kiểm tra tình trạng kỹ thuật cơ sở vật chất hư hỏng hoặc cần cải tạo<br>để đề xuất giải pháp khắc phục</h3>
          
          <p><strong>Căn cứ đề nghị của:</strong> ${
            formData.requestedBy
          } &nbsp;&nbsp;&nbsp;&nbsp; <strong>Năm:</strong> ${formData.year}</p>
          <p><strong>Hôm nay, Ngày:</strong> ${
            formData.inspectionDay || "___"
          } <strong>Tháng:</strong> ${
      formData.inspectionMonth || "___"
    } <strong>Năm:</strong> ${formData.inspectionYear || "2025"}</p>
          <p><strong>Tại vị trí:</strong> ${formData.location}</p>
          
          <p><strong>Chúng tôi gồm có:</strong></p>
          <p style="margin-left: 20px;">
            <strong>1. Ông:</strong> ${
              formData.departmentRep
            } &nbsp;&nbsp;&nbsp;&nbsp; <strong>đại diện:</strong> ${
      formData.departmentName
    }
          </p>
          <p style="margin-left: 20px;">
            <strong>2. Ông:</strong> ${
              formData.adminRep
            } &nbsp;&nbsp;&nbsp;&nbsp; <strong>đại diện:</strong> ${
      formData.adminDepartment
    }
          </p>
          
          <p><strong>Cùng lập biên bản kiểm tra tình trạng kỹ thuật của cơ sở vật chất hư hỏng cần thay thế:</strong></p>
          
          <table class="data-table">
            <thead>
              <tr>
                <th width="5%">TT</th>
                <th width="25%">Nội dung kiểm tra</th>
                <th width="8%">SL</th>
                <th width="20%">Vị trí</th>
                <th width="12%">Tình trạng</th>
                <th width="30%">Giải pháp</th>
              </tr>
            </thead>
            <tbody>
              ${
                proposalData.items
                  ?.map(
                    (item, index) => `
                <tr>
                  <td style="text-align: center;">${index + 1}</td>
                  <td>
                    <strong>${
                      item.oldComponent?.componentType || "Không xác định"
                    }</strong><br>
                    <small>${item.oldComponent?.name || "N/A"}</small>
                  </td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td>
                    ${item.oldComponent?.roomLocation || "Chưa xác định"}<br>
                    <small>${item.oldComponent?.componentSpecs || "N/A"}</small>
                  </td>
                  <td>Hỏng</td>
                  <td>
                    - Đề nghị thay thế:<br>
                    1. ${item.newItemName || "Không xác định"}<br>
                    2. ${item.newItemSpecs || "N/A"}
                  </td>
                </tr>
              `
                  )
                  .join("") || ""
              }
            </tbody>
          </table>
          
          <p><strong>Đại diện các đơn vị tham gia công tác kiểm tra tình trạng kỹ thuật của cơ sở vật chất hư hỏng cùng đồng ý với nội dung trên; Đồng ý với kỹ sư.</strong></p>
          
          ${
            formData.notes
              ? `<p><strong>Ghi chú:</strong> ${formData.notes}</p>`
              : ""
          }
          
          <div class="signature-section">
            <table class="signature-table">
              <tr>
                <td width="50%">
                  <p><strong>${formData.departmentName}</strong></p>
                  <br><br><br>
                  <p><strong>Tổ trưởng Kỹ thuật</strong></p>
                  <br><br>
                  <p>${formData.departmentRep}</p>
                </td>
                <td width="50%">
                  <p><strong>${formData.adminDepartment}</strong></p>
                  <br><br><br>
                  <p><strong>Người thực hiện</strong></p>
                  <br><br>
                  <p>${formData.adminRep}</p>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <p><strong>Ý kiến của Lãnh đạo Phòng Quản trị:</strong></p>
            <br><br><br>
            <p>_______________________________</p>
          </div>
        </body>
        </html>
      `;
  };

  // Hàm xuất file DOCX cho biên bản kiểm tra
  const handleExportInspectionDocx = async () => {
    if (!proposal) return;

    try {
      // Tạo nội dung HTML cho biên bản
      const htmlContent = generateInspectionHTML(inspectionFormData, proposal);

      // Tạo Blob và download
      const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Bien_ban_kiem_tra_${proposal.proposalCode}_${
        new Date().toISOString().split("T")[0]
      }.doc`;
      link.click();
      window.URL.revokeObjectURL(url);

      Modal.success({
        title: "Xuất file thành công!",
        content: `File biên bản kiểm tra đã được tải xuống.`,
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
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-600" />
        <h3 className="text-lg font-medium text-gray-900">
          Không thể tải dữ liệu
        </h3>
        <p className="text-gray-500">
          Đã xảy ra lỗi khi tải thông tin tờ trình. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  // Not found state
  if (!proposal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">
          Không tìm thấy tờ trình
        </h3>
        <p className="text-gray-500">
          Tờ trình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen">
      <div className="space-y-4 sm:space-y-6">
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
                href: "/phong-quan-tri",
                title: (
                  <div className="flex items-center">
                    <span>Phòng quản trị</span>
                  </div>
                ),
              },
              {
                href: "/phong-quan-tri/lap-bien-ban",
                title: (
                  <div className="flex items-center">
                    <span>Lập biên bản</span>
                  </div>
                ),
              },
              {
                title: (
                  <div className="flex items-center">
                    <span>Chi tiết biên bản {proposal.proposalCode}</span>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Chi tiết tờ trình thay thế linh kiện
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">
                  Mã tờ trình: {proposal.proposalCode}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <span
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(
                    proposal.status
                  )}`}>
                  {getStatusIcon(proposal.status)}
                  <span className="ml-2">{getStatusText(proposal.status)}</span>
                </span>
                <button
                  onClick={handleCreateInspectionReport}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FileCheck className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Lập biên bản</span>
                  <span className="sm:hidden">Lập BB</span>
                </button>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            {/* Request Information */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Thông tin tờ trình
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Mã tờ trình
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">
                      {proposal.proposalCode}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Tiêu đề
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">
                      {proposal.title || "Không có tiêu đề"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Ngày tạo
                    </label>
                    <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-900">
                      <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2 text-gray-400" />
                      {new Date(proposal.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Người tạo
                    </label>
                    <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-900">
                      <User className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2 text-gray-400" />
                      {proposal.proposer?.fullName || "Chưa xác định"}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-gray-900">
                      {proposal.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Components List */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Danh sách linh kiện cần thay thế ({proposal.items?.length || 0}{" "}
                loại)
              </h3>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                        Lý do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {proposal.items?.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 text-gray-400 mr-2" />
                              {item.oldComponent?.roomLocation ||
                                "Chưa xác định vị trí"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.oldComponent?.name || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.oldComponent?.componentType ||
                                  "Không xác định"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.oldComponent?.componentSpecs || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.newItemName || "Không xác định"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.newItemSpecs || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {item.reason || "Không có lý do"}
                          </p>
                        </td>
                      </tr>
                    )) || []}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {proposal.items?.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg shadow-sm p-3 space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {item.oldComponent?.componentType || "Không xác định"}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {item.oldComponent?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 bg-gray-50 p-2 rounded">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <p className="font-medium text-gray-900">
                          {item.oldComponent?.roomLocation ||
                            "Chưa xác định vị trí"}
                        </p>
                        <p className="text-gray-600 mt-0.5">
                          {item.oldComponent?.componentSpecs || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Số lượng:</span>
                        <p className="font-medium text-gray-900 mt-0.5">
                          {item.quantity}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Lý do:</span>
                        <p className="font-medium text-gray-900 mt-0.5 line-clamp-2">
                          {item.reason || "Không có lý do"}
                        </p>
                      </div>
                    </div>

                    {/* Replacement Info */}
                    <div className="border-t pt-2 space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">
                          Linh kiện thay thế:
                        </span>
                        <p className="text-xs font-medium text-green-700 mt-0.5">
                          {item.newItemName || "Không xác định"}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {item.newItemSpecs || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <div>
                  <span className="font-medium">Ngày tạo:</span>
                  <span className="ml-2 block sm:inline mt-1 sm:mt-0">
                    {new Date(proposal.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Cập nhật lần cuối:</span>
                  <span className="ml-2 block sm:inline mt-1 sm:mt-0">
                    {new Date(proposal.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Người tạo:</span>
                  <span className="ml-2 block sm:inline mt-1 sm:mt-0">
                    {proposal.proposer?.fullName || "Chưa xác định"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>
                  <span className="ml-2 block sm:inline mt-1 sm:mt-0">
                    {getStatusText(proposal.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal lập biên bản */}
        <InspectionFormModal
          isOpen={showInspectionForm}
          onClose={handleCloseInspectionForm}
          formData={inspectionFormData}
          onFormDataChange={setInspectionFormData}
          onExport={handleExportInspectionDocx}
          onPreview={() => setShowInspectionPreview(true)}
          onSubmit={handleSubmitInspectionReport}
        />

        {/* Modal xem trước biên bản */}
        <InspectionPreviewModal
          isOpen={showInspectionPreview}
          onClose={() => setShowInspectionPreview(false)}
          formData={inspectionFormData}
          proposal={proposal}
          onExport={handleExportInspectionDocx}
          onSubmit={handleSubmitInspectionReport}
        />
      </div>
    </div>
  );
}
