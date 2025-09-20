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
import { InspectionSignConfirmModal } from "@/components/modal";

interface InspectionItem {
  id: string;
  assetCode: string;
  assetName: string;
  location: string;
  condition: string;
  proposedSolution: string;
}

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
  notes?: string;
}

// Mock data
const mockInspectionReports: InspectionReport[] = [
  {
    id: "1",
    reportNumber: "BB-2024-001",
    title: "Biên bản kiểm tra thiết bị máy tính",
    relatedReportTitle: "Tờ trình về việc kiểm tra thiết bị máy tính phòng 101",
    inspectionDate: "2024-03-15",
    department: "Phòng Kỹ thuật",
    createdBy: "Nguyễn Văn A",
    createdAt: "2024-03-15T08:00:00",
    status: "pending",
    items: [
      {
        id: "1",
        assetCode: "MT001",
        assetName: "Máy tính Dell Optiplex",
        location: "Phòng 101",
        condition: "Hỏng bàn phím",
        proposedSolution: "Thay thế bàn phím mới",
      },
    ],
    notes: "Cần kiểm tra thêm các thiết bị khác trong phòng",
  },
];

export default function ChiTietBienBanPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<InspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);

  useEffect(() => {
    if (reportId) {
      // Tìm report từ mock data
      const foundReport = mockInspectionReports.find(
        (rep) => rep.id === reportId
      );
      setReport(foundReport || null);
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

      // Cập nhật vào mock data (trong thực tế sẽ gọi API)
      const reportIndex = mockInspectionReports.findIndex(
        (rep) => rep.id === report.id
      );
      if (reportIndex !== -1) {
        mockInspectionReports[reportIndex] = updatedReport;
      }

      setShowSignModal(false);
    }
  };

  const handleSendBack = () => {
    if (report) {
      const updatedReport = {
        ...report,
        status: "sent_back" as const,
      };
      setReport(updatedReport);

      // Cập nhật vào mock data (trong thực tế sẽ gọi API)
      const reportIndex = mockInspectionReports.findIndex(
        (rep) => rep.id === report.id
      );
      if (reportIndex !== -1) {
        mockInspectionReports[reportIndex] = updatedReport;
      }
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

      <InspectionSignConfirmModal
        show={showSignModal}
        selectedReport={report}
        onClose={() => setShowSignModal(false)}
        onConfirmSign={confirmSign}
      />
    </div>
  );
}
