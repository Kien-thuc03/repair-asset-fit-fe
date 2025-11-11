"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal } from "antd";
import {
  InspectionDetailHeader,
  InspectionInfo,
  InspectionItemsTable,
  CreatorInfo,
  SignatureInfo,
  ActionPanel,
  LoadingState,
  NotFoundState,
} from "@/components/leadTechnician/inspectionDetail";
import {
  SignConfirmModal,
  SubmissionPreviewModal,
  InspectionPreviewModal,
} from "@/components/modal";
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks/useReplacementProposals";
import {
  ReplacementProposalStatus,
  ReplacementProposal,
} from "@/lib/api/replacement-proposals";
import { InspectionFormData, SubmissionFormData } from "@/types";

// Interface cho InspectionReport (sử dụng interface hiện có)
interface InspectionReport {
  id: string;
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
  relatedReportUrl?: string; // URL tờ trình
  verificationReportUrl?: string; // URL biên bản
  inspectionDate: string;
  department: string;
  createdBy: string;
  createdAt: string;
  status: "pending" | "signed" | "sent_back";
  leaderSignature?: string;
  leaderSignedAt?: string;
  items: InspectionItem[];
  notes: string;
}

interface InspectionItem {
  id: string;
  ktCode: string;
  assetName: string;
  location: string;
  condition: string;
  proposedSolution: string;
}

export default function ChiTietBienBanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [showSignModal, setShowSignModal] = useState(false);
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);
  const [showSubmissionPreview, setShowSubmissionPreview] = useState(false);
  const [showInspectionPreview, setShowInspectionPreview] = useState(false);

  // Fetch data from API
  const { data: proposal, loading, error } = useReplacementProposal(reportId);

  // API hook for updating status
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Transform API data to InspectionReport format
  const report: InspectionReport | null = useMemo(() => {
    if (!proposal) return null;

    const items: InspectionItem[] = (proposal.items || []).map((item) => {
      // Format asset code - use component ID as identifier
      const ktCode = item.oldComponent?.id
        ? `COMP-${item.oldComponent.id.substring(0, 8).toUpperCase()}`
        : "N/A";

      // Get room location from API response
      const location =
        item.oldComponent?.roomLocation || "Chưa xác định vị trí";

      return {
        id: item.id,
        ktCode,
        assetName: item.oldComponent?.name || "Không xác định",
        location,
        condition: `Hư hỏng - ${item.reason || "Không rõ"}`,
        proposedSolution: `Thay thế bằng ${item.newItemName}${
          item.newItemSpecs ? ` (${item.newItemSpecs})` : ""
        }`,
      };
    });

    const getRelatedReportTitle = () => {
      if (proposal.submissionFormUrl) {
        const fileName =
          proposal.submissionFormUrl.split("/").pop() ||
          proposal.submissionFormUrl;
        return `Tờ trình: ${fileName}`;
      }
      return proposal.title || "Không có tờ trình liên quan";
    };

    return {
      id: proposal.id,
      reportNumber: proposal.proposalCode,
      title: `Biên bản kiểm tra - ${proposal.title || "Không có tiêu đề"}`,
      relatedReportTitle: getRelatedReportTitle(),
      relatedReportUrl: proposal.submissionFormUrl, // URL tờ trình
      verificationReportUrl: proposal.verificationReportUrl, // URL biên bản
      inspectionDate: new Date(proposal.createdAt).toISOString().split("T")[0],
      department: "Phòng Quản trị Tài sản",
      createdBy: proposal.proposer?.fullName || "Unknown",
      createdAt: proposal.createdAt,
      status:
        proposal.status === ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN
          ? ("signed" as const)
          : ("pending" as const),
      leaderSignature: proposal.teamLeadApprover?.fullName,
      leaderSignedAt:
        proposal.status === ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN
          ? proposal.updatedAt
          : undefined,
      items,
      notes: proposal.description || "",
    };
  }, [proposal]);

  // Default form data for preview modals
  const defaultSubmissionFormData: SubmissionFormData = useMemo(
    () => ({
      recipientDepartment: "Ban Giám hiệu",
      submittedBy: "Giảng Thanh Trọn", // Always default to this name
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

  const defaultInspectionFormData: InspectionFormData = useMemo(
    () => ({
      requestedBy: "Khoa CNTT",
      year: new Date().getFullYear().toString(),
      inspectionDay: new Date().getDate().toString(),
      inspectionMonth: (new Date().getMonth() + 1).toString(),
      inspectionYear: new Date().getFullYear().toString(),
      location: "Phòng máy H1",
      departmentRep: "Giảng Thanh Trọn", // Always default to this name
      departmentName: "Khoa CNTT",
      adminRep: "",
      adminDepartment: "Phòng Quản trị",
      notes: "",
    }),
    []
  );

  // Export handlers for downloading DOCX files
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
    if (!proposal) return;

    try {
      const htmlContent = generateSubmissionHTML(
        defaultSubmissionFormData,
        proposal
      );

      const blob = new Blob([htmlContent], { type: "application/vnd.ms-word" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `To_trinh_${proposal.proposalCode}_${
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

  const handleExportInspectionDocx = () => {
    if (!proposal) return;

    try {
      // Implement inspection report export logic here
      Modal.info({
        title: "Chức năng đang phát triển",
        content: "Chức năng xuất biên bản đang được phát triển.",
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

  const handleSignReport = () => {
    setShowSignModal(true);
  };

  const confirmSign = async () => {
    if (!report || !reportId) return;

    setIsSigningInProgress(true);

    try {
      // Call API to update status to ĐÃ_KÝ_BIÊN_BẢN
      await updateStatus(reportId, {
        status: ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN,
      });

      console.log("✅ Successfully signed inspection report:", {
        reportId,
        newStatus: ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN,
      });

      setShowSignModal(false);

      // Redirect back to list after signing
      router.push("/to-truong-ky-thuat/bien-ban");
    } catch (error) {
      console.error("❌ Error signing report:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi ký biên bản. Vui lòng thử lại."
      );
    } finally {
      setIsSigningInProgress(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!report) {
    return <NotFoundState onGoBack={handleGoBack} />;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <InspectionDetailHeader
        reportNumber={report.reportNumber}
        status={report.status}
        onGoBack={handleGoBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <InspectionInfo
            reportNumber={report.reportNumber}
            title={report.title}
            relatedReportTitle={report.relatedReportTitle}
            relatedReportUrl={report.relatedReportUrl}
            verificationReportUrl={report.verificationReportUrl}
            inspectionDate={report.inspectionDate}
            department={report.department}
            onPreviewSubmission={() => setShowSubmissionPreview(true)}
            onPreviewInspection={() => setShowInspectionPreview(true)}
          />

          <InspectionItemsTable items={report.items} notes={report.notes} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CreatorInfo
            createdBy={report.createdBy}
            createdAt={report.createdAt}
          />

          <SignatureInfo
            leaderSignature={report.leaderSignature}
            leaderSignedAt={report.leaderSignedAt}
          />

          <ActionPanel
            status={report.status}
            onSignReport={handleSignReport}
            onGoBack={handleGoBack}
          />
        </div>
      </div>

      {/* Preview Modals */}
      <SubmissionPreviewModal
        isOpen={showSubmissionPreview}
        onClose={() => setShowSubmissionPreview(false)}
        formData={defaultSubmissionFormData}
        proposal={proposal}
        onExport={handleExportSubmissionDocx}
        onSubmit={() => {}}
      />

      <InspectionPreviewModal
        isOpen={showInspectionPreview}
        onClose={() => setShowInspectionPreview(false)}
        formData={defaultInspectionFormData}
        proposal={proposal}
        onExport={handleExportInspectionDocx}
        onSubmit={() => {}}
      />

      <SignConfirmModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onConfirm={confirmSign}
        reportTitle={report?.title || ""}
        reportNumber={report?.reportNumber || ""}
        isLoading={isSigningInProgress}
      />
    </div>
  );
}
