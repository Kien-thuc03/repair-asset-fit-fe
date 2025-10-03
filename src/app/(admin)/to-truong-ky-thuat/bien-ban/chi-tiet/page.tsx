"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { SignConfirmModal } from "@/components/modal";
import { getReplacementRequestsByStatus } from "@/lib/mockData/replacementRequests";
import { ReplacementStatus, ReplacementRequestItem } from "@/types/repair";

// Interface cho InspectionReport (sử dụng interface hiện có)
interface InspectionReport {
  id: string;
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
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
  assetCode: string;
  assetName: string;
  location: string;
  condition: string;
  proposedSolution: string;
}

// Chuyển đổi ReplacementRequestItem thành InspectionReport
const convertToInspectionReport = (
  request: ReplacementRequestItem
): InspectionReport => {
  // Lấy tên file từ submissionFormUrl để hiển thị tờ trình liên quan
  const getRelatedReportTitle = (
    submissionFormUrl?: string,
    fallbackTitle?: string
  ) => {
    if (submissionFormUrl) {
      const fileName = submissionFormUrl.split("/").pop() || submissionFormUrl;
      return `Tờ trình: ${fileName}`;
    }
    return fallbackTitle || "Không có tờ trình liên quan";
  };

  const items: InspectionItem[] = request.components.map((component) => ({
    id: component.id,
    assetCode: component.assetCode,
    assetName: component.assetName,
    location: `${component.buildingName} - ${component.roomName}${
      component.machineLabel ? ` - Máy ${component.machineLabel}` : ""
    }`,
    condition: "Hư hỏng - " + component.reason,
    proposedSolution: `Thay thế bằng ${component.newItemName} (${component.newItemSpecs})`,
  }));

  return {
    id: request.id,
    reportNumber: request.proposalCode,
    title: `Biên bản kiểm tra - ${request.title}`,
    relatedReportTitle: getRelatedReportTitle(
      request.submissionFormUrl,
      request.title
    ),
    inspectionDate: new Date(request.createdAt).toISOString().split("T")[0],
    department: "Phòng Quản trị Tài sản",
    createdBy: request.createdBy || "Unknown",
    createdAt: request.createdAt,
    status: "pending" as const,
    items,
    notes: request.description,
  };
};

export default function ChiTietBienBanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showSignSuccessModal, setShowSignSuccessModal] = useState(false);

  useEffect(() => {
    if (reportId) {
      // Lấy các đề xuất có trạng thái ĐÃ_GỬI_BIÊN_BẢN
      const replacementRequests = getReplacementRequestsByStatus(
        ReplacementStatus.ĐÃ_GỬI_BIÊN_BẢN
      );

      // Tìm replacement request theo ID
      const foundRequest = replacementRequests.find(
        (req) => req.id === reportId
      );

      if (foundRequest) {
        const inspectionReport = convertToInspectionReport(foundRequest);
        setReport(inspectionReport);
      } else {
        setReport(null);
      }
    }
    setLoading(false);
  }, [reportId]);

  const handleSignReport = () => {
    setShowSignModal(true);
  };

  const confirmSign = () => {
    if (report) {
      const updatedReport = {
        ...report,
        status: "signed" as const,
        leaderSignature: "Nguyễn Thanh Tú",
        leaderSignedAt: new Date().toISOString(),
      };
      setReport(updatedReport);

      // TODO: Trong thực tế sẽ gọi API để cập nhật trạng thái thành ĐÃ_KÝ_BIÊN_BẢN
      console.log("Signed report:", updatedReport);

      setShowSignModal(false);
      setShowSignSuccessModal(true);
    }
  };

  const handleSendBack = () => {
    if (report) {
      const updatedReport = {
        ...report,
        status: "sent_back" as const,
      };
      setReport(updatedReport);

      // TODO: Trong thực tế sẽ gọi API để gửi biên bản lại cho Phòng Quản trị
      console.log("Sent back report:", updatedReport);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingState />;
  }

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
            inspectionDate={report.inspectionDate}
            department={report.department}
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
            onSendBack={handleSendBack}
            onGoBack={handleGoBack}
          />
        </div>
      </div>

      <SignConfirmModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        onConfirm={confirmSign}
        reportTitle={report?.title || ""}
        reportNumber={report?.reportNumber || ""}
      />

      <SignConfirmModal
        isOpen={showSignSuccessModal}
        onClose={() => setShowSignSuccessModal(false)}
        onConfirm={() => setShowSignSuccessModal(false)}
        reportTitle={report?.title || ""}
        reportNumber={report?.reportNumber || ""}
      />
    </div>
  );
}
