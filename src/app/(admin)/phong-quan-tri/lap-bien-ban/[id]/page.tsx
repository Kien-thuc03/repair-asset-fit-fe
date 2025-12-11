"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Download,
} from "lucide-react";
import { Breadcrumb, Modal } from "antd";
import {
  InspectionFormModal,
  InspectionPreviewModal,
  SubmissionPreviewModal,
} from "@/components/modal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks";
import {
  InspectionFormData,
  SubmissionFormData,
  ReplacementProposalStatus,
} from "@/types";
import { uploadFile } from "@/lib/api/upload";
import { useAuth } from "@/contexts/AuthContext";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [showInspectionPreview, setShowInspectionPreview] = useState(false);
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      adminRep: "",
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

  // Tự động điền thông tin người quản trị và vị trí từ proposal hoặc user hiện tại
  useEffect(() => {
    if (proposal) {
      setInspectionFormData((prev) => ({
        ...prev,
        adminRep:
          proposal.adminVerifier?.fullName ||
          user?.fullName ||
          prev.adminRep ||
          "",
        location:
          proposal.items?.[0]?.oldComponent?.roomLocation ||
          prev.location ||
          "",
      }));
    }
  }, [proposal, user]);

  // Helper function to extract filename from URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      // Decode URL encoding (e.g., %20 to space)
      return decodeURIComponent(filename);
    } catch {
      return url;
    }
  };

  // Default form data for submission preview modal
  const defaultSubmissionFormData: SubmissionFormData = useMemo(
    () => ({
      recipientDepartment: "Ban Giám hiệu",
      submittedBy: "Giảng Thanh Trọn",
      position: "Tổ trưởng Kỹ thuật",
      department: "Phòng Quản trị",
      subject: proposal?.title || "",
      attachments: "Biên bản kiểm tra kỹ thuật",
      content: proposal?.description || "",
      director: "TS. Lê Nhất Duy",
      rector: "TS. Phan Hồng Hải",
    }),
    [proposal?.title, proposal?.description]
  );

  // Handler để export submission docx
  const handleExportSubmissionDocx = () => {
    if (!proposal || !proposal.submissionFormUrl) return;

    try {
      // Tạo download link
      const link = document.createElement("a");
      link.href = proposal.submissionFormUrl;
      link.download = getFileNameFromUrl(proposal.submissionFormUrl);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
    // Đảm bảo thông tin người quản trị được điền trước khi mở form
    if (proposal) {
      setInspectionFormData((prev) => ({
        ...prev,
        adminRep:
          proposal.adminVerifier?.fullName ||
          user?.fullName ||
          prev.adminRep ||
          "",
      }));
    }
    setShowInspectionForm(true);
  };

  const handleCloseInspectionForm = () => {
    setShowInspectionForm(false);
  };

  const handleSubmitInspectionReport = async () => {
    if (!proposal) return;

    try {
      setIsSubmitting(true);
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
      // Workflow: KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH → ĐÃ_DUYỆT_TỜ_TRÌNH → CHỜ_XÁC_MINH → ĐÃ_XÁC_MINH → ĐÃ_GỬI_BIÊN_BẢN (B10)

      // Chuyển từ ĐÃ_XÁC_MINH (B9) sang ĐÃ_GỬI_BIÊN_BẢN (B10) sau khi lập biên bản
      await updateStatus(proposal.id, {
        status: ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN, // B10
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

  // Hàm helper để generate HTML content cho biên bản kiểm tra (layout theo mẫu)
  const generateInspectionHTML = (
    formData: InspectionFormData,
    proposalData: typeof proposal
  ): string => {
    if (!proposalData) return "";

    type OldComponentWithComputer =
      | (NonNullable<typeof proposalData.items>[number]["oldComponent"] & {
          computer?: { name?: string; machineLabel?: string };
        })
      | null
      | undefined;

    const getComputerName = (oldComp: OldComponentWithComputer) => {
      if (!oldComp) return "Máy tính";
      return (
        oldComp.computer?.name ||
        oldComp.computerName ||
        oldComp.name ||
        oldComp.componentType ||
        "Máy tính"
      );
    };

    const getComputerLabel = (oldComp: OldComponentWithComputer) => {
      if (!oldComp) return "Không rõ";
      return (
        oldComp.componentSpecs ||
        oldComp.name ||
        oldComp.computer?.machineLabel ||
        "Không rõ"
      );
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; margin: 32px 36px; }
            .header-table { width: 100%; border: none; margin-bottom: 6px; }
            .header-table td { border: none; padding: 0; vertical-align: top; font-size: 11pt; text-align: center; }
            .title { text-align: center; font-weight: bold; font-size: 16pt; margin: 12px 0 4px 0; }
            .subtitle { text-align: center; font-weight: bold; font-size: 13pt; color: #0056b3; margin: 4px 0 14px 0; }
            .info { margin: 4px 0; font-size: 13pt; }
            .list { margin: 2px 0 10px 0; font-size: 13pt; }
            .data-table { width: 100%; border-collapse: collapse; margin: 14px 0; }
            .data-table th, .data-table td { border: 1px solid #000; padding: 6px 8px; font-size: 13pt; }
            .data-table th { text-align: center; font-weight: bold; }
            .signature-table { width: 100%; border: none; margin-top: 20px; }
            .signature-table td { border: none; text-align: center; padding: 10px 4px; vertical-align: top; font-size: 13pt; }
            .small { font-size: 11pt; }
            .center { text-align: center; font-size: 13pt; }
            .note { margin-top: 12px; font-size: 13pt; }
            .no-break { page-break-inside: avoid; break-inside: avoid; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td class="header-left">
                <p><strong>TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP</strong></p>
                <p><strong>THÀNH PHỐ HỒ CHÍ MINH</strong></p>
                <p><strong>PHÒNG QUẢN TRỊ</strong></p>
              </td>
              <td class="header-right">
                <p><strong>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
                <p><u><strong>Độc lập - Tự do - Hạnh phúc</strong></u></p>
              </td>
            </tr>
          </table>
          <p class="center"><em>Thành phố Hồ Chí Minh, ngày ${
            formData.inspectionDay || "__"
          } tháng ${formData.inspectionMonth || "__"} năm ${
      formData.inspectionYear || "2025"
    }</em></p>

          <h2 class="title">BIÊN BẢN</h2>
          <div class="subtitle">
            Kiểm tra tình trạng kỹ thuật cơ sở vật chất hư hỏng hoặc cần cải tạo<br/>
            và đề nghị giải pháp khác phục
          </div>

          <p class="info"><strong>Căn cứ đề nghị của:</strong> ${
            formData.requestedBy || "Khoa CNTT"
          } &nbsp; Năm ${formData.year || "2025"}</p>
          <p class="info"><strong>Hôm nay, lúc ____giờ</strong>, <strong>ngày</strong> ${
            formData.inspectionDay || "__"
          } <strong>tháng</strong> ${
      formData.inspectionMonth || "__"
    } <strong>năm</strong> <strong>${
      formData.inspectionYear || "2025"
    }.</strong></p>
          <p class="info"><strong>Tại vị trí:</strong> ${
            proposalData.items?.[0]?.oldComponent?.roomLocation ||
            formData.location ||
            "H8.01"
          }</p>

          <p class="info"><strong>Chúng tôi gồm:</strong></p>
          <div class="list">
            1. Ông: ${formData.departmentRep || "Giang Thanh Trọn"} &nbsp;&nbsp;
            đại diện: ${formData.departmentName || "Khoa CNTT"}<br/>
            2. Ông: ${
              proposalData?.adminVerifier?.fullName ||
              formData.adminRep ||
              "Nguyễn Ngữ"
            } &nbsp;&nbsp; đại diện: ${
      formData.adminDepartment || "Phòng Quản trị"
    }
          </div>

          <p class="info"><strong>Cùng lập biên bản kiểm tra tình trạng kỹ thuật của cơ sở vật chất hư hỏng như sau:</strong></p>

          <table class="data-table">
            <thead>
              <tr>
                <th width="5%">TT</th>
                <th width="28%">Nội dung kiểm tra</th>
                <th width="8%">Số lượng</th>
                <th width="15%">Vị trí</th>
                <th width="12%">Tình trạng</th>
                <th width="32%">Giải pháp khác phục</th>
              </tr>
            </thead>
            <tbody>
              ${
                proposalData.items
                  ?.map(
                    (item, index) => `
                <tr>
                  <td class="center">${index + 1}</td>
                  <td>
                    <div><strong>${getComputerName(
                      item.oldComponent
                    )}</strong></div>
                    <div><em>${
                      item.oldComponent?.name || "Linh kiện"
                    }</em></div>
                    <div class="small">(${getComputerLabel(
                      item.oldComponent
                    )})</div>
                  </td>
                  <td class="center">${item.quantity || 1}</td>
                  <td class="center">${
                    item.oldComponent?.roomLocation || "N/A"
                  }</td>
                  <td class="center">Hỏng</td>
                  <td>
                    - Đề nghị nâng cấp:<br/>
                    ${item.newItemName ? `1. ${item.newItemName}` : ""}${
                      item.newItemSpecs ? ` ${item.newItemSpecs}` : ""
                    }${item.reason ? `<br/>Ghi chú: ${item.reason}` : ""}
                  </td>
                </tr>
              `
                  )
                  .join("") || ""
              }
            </tbody>
          </table>

          <p class="note"><strong>Đại diện các đơn vị tham gia công tác kiểm tra tình trạng kỹ thuật của cơ sở vật chất hư hỏng cùng đọc, đồng ý và ký tên.</strong></p>

          <div class="no-break">
          <table class="signature-table">
            <tr>
              <td><strong>Khoa CNTT</strong><br/><br/><br/>${
                formData.departmentRep || "Giang Thanh Trọn"
              }</td>
              <td><strong>Nhân viên Kỹ thuật</strong><br/><br/><br/>${
                proposalData?.adminVerifier?.fullName ||
                formData.adminRep ||
                "Nguyễn Ngữ"
              }</td>
            </tr>
          </table>

          <p class="center" style="margin-top: 12px;"><strong>Ý kiến của Lãnh đạo Phòng Quản trị:</strong></p>
          <p class="center">_______________________________</p>
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
                      {proposal.teamLeadApprover?.fullName || "Chưa xác định"}
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
                    {proposal.teamLeadApprover?.fullName || "Chưa xác định"}
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

            {/* Documents */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tài liệu đính kèm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 bg-blue-50">
                {proposal.submissionFormUrl && (
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getFileNameFromUrl(proposal.submissionFormUrl)}
                        </p>
                        <p className="text-xs text-gray-500">DOC Document</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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

        {/* Modal lập biên bản */}
        <InspectionFormModal
          isOpen={showInspectionForm}
          onClose={handleCloseInspectionForm}
          formData={inspectionFormData}
          onFormDataChange={setInspectionFormData}
          onExport={handleExportInspectionDocx}
          onPreview={() => setShowInspectionPreview(true)}
          onSubmit={handleSubmitInspectionReport}
          isLoading={isSubmitting}
        />

        {/* Modal xem trước biên bản */}
        <InspectionPreviewModal
          isOpen={showInspectionPreview}
          onClose={() => setShowInspectionPreview(false)}
          formData={inspectionFormData}
          proposal={proposal}
          onExport={handleExportInspectionDocx}
          onSubmit={handleSubmitInspectionReport}
          isLoading={isSubmitting}
        />

        {/* Modal xem trước tờ trình */}
        <SubmissionPreviewModal
          isOpen={showSubmissionPreview}
          onClose={() => setShowSubmissionPreview(false)}
          formData={defaultSubmissionFormData}
          proposal={proposal}
          onExport={handleExportSubmissionDocx}
          onSubmit={() => {}}
          showSubmitButton={false}
        />
      </div>
    </div>
  );
}
