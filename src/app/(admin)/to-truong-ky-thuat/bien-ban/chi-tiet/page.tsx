"use client";

import { useState, useMemo } from "react";
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
import {
  useReplacementProposal,
  useUpdateReplacementProposalStatus,
} from "@/hooks/useReplacementProposals";
import { ReplacementProposalStatus } from "@/lib/api/replacement-proposals";

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

export default function ChiTietBienBanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [showSignModal, setShowSignModal] = useState(false);
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);

  // Fetch data from API
  const { data: proposal, loading, error } = useReplacementProposal(reportId);

  // API hook for updating status
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Transform API data to InspectionReport format
  const report: InspectionReport | null = useMemo(() => {
    if (!proposal) return null;

    const items: InspectionItem[] = (proposal.items || []).map((item) => {
      // Format asset code - use component ID as identifier
      const assetCode = item.oldComponent?.id
        ? `COMP-${item.oldComponent.id.substring(0, 8).toUpperCase()}`
        : "N/A";

      // Get room location from API response
      const location =
        item.oldComponent?.roomLocation || "Chưa xác định vị trí";

      return {
        id: item.id,
        assetCode,
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
        isLoading={isSigningInProgress}
      />
    </div>
  );
}
