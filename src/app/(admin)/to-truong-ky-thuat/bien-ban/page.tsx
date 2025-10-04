"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Send, XCircle } from "lucide-react";
import { Modal } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  InspectionHeader,
  InspectionFilters,
  InspectionTable,
  InspectionMobileView,
} from "@/components/leadTechnician/inspection";
import { SignConfirmModal, SuccessModal } from "@/components/modal";
import {
  getReplacementRequestsByStatus,
  mockReplacementRequestItem,
} from "@/lib/mockData/replacementRequests";
import { ReplacementStatus, ReplacementRequestItem } from "@/types/repair";

// Interface cho InspectionReport
interface InspectionReport {
  id: string;
  reportNumber: string;
  title: string;
  relatedReportTitle: string;
  createdBy: string;
  inspectionDate: string;
  status: "pending" | "signed" | "sent_back";
  leaderSignature?: string;
  leaderSignedAt?: string;
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

  return {
    id: request.id,
    reportNumber: request.proposalCode,
    title: `Biên bản kiểm tra - ${request.title}`,
    relatedReportTitle: getRelatedReportTitle(
      request.submissionFormUrl,
      request.title
    ),
    createdBy: request.createdBy || "Unknown",
    inspectionDate: new Date(request.createdAt).toISOString().split("T")[0],
    status: "pending", // Mặc định là pending vì đã gửi biên bản
  };
};

export default function BienBanPage() {
  const router = useRouter();

  // Lấy các đề xuất có trạng thái ĐÃ_GỬI_BIÊN_BẢN và ĐÃ_KÝ_BIÊN_BẢN
  const sentReports = getReplacementRequestsByStatus(
    ReplacementStatus.ĐÃ_GỬI_BIÊN_BẢN
  );
  const signedReports = getReplacementRequestsByStatus(
    ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN
  );
  const allReplacementRequests = [...sentReports, ...signedReports];

  // Chuyển đổi sang InspectionReport format
  const mockInspectionReports: InspectionReport[] = allReplacementRequests.map(
    (request) => ({
      ...convertToInspectionReport(request),
      // Cập nhật status dựa trên ReplacementStatus
      status:
        request.status === ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN
          ? "signed"
          : "pending",
    })
  );

  const [inspectionReports, setInspectionReports] = useState<
    InspectionReport[]
  >(mockInspectionReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Export modals state
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);

  // Sign states
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedReportForSign, setSelectedReportForSign] =
    useState<InspectionReport | null>(null);
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);
  const [showSignSuccessModal, setShowSignSuccessModal] = useState(false);

  // Inject CSS vào head để xử lý scrollbar cho toàn trang
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      html {
        overflow-y: auto;
      }
      
      body {
        min-height: 100vh;
      }
      
      .main-content {
        min-height: calc(100vh - 2rem);
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const filteredReports = inspectionReports.filter((report) => {
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.relatedReportTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection("none");
        setSortField("");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sắp xếp dữ liệu
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortField === "" || sortDirection === "none") return 0;

    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case "reportNumber":
        aValue = a.reportNumber;
        bValue = b.reportNumber;
        break;
      case "relatedReportTitle":
        aValue = a.relatedReportTitle;
        bValue = b.relatedReportTitle;
        break;
      case "createdBy":
        aValue = a.createdBy;
        bValue = b.createdBy;
        break;
      case "inspectionDate":
        aValue = new Date(a.inspectionDate);
        bValue = new Date(b.inspectionDate);
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "signed":
        return "bg-green-100 text-green-800";
      case "sent_back":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ ký";
      case "signed":
        return "Đã ký";
      case "sent_back":
        return "Đã gửi lại";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "signed":
        return <CheckCircle className="h-4 w-4" />;
      case "sent_back":
        return <Send className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetail = (report: InspectionReport) => {
    router.push(`/to-truong-ky-thuat/bien-ban/chi-tiet?id=${report.id}`);
  };

  const handleSignReport = (report: InspectionReport) => {
    setSelectedReportForSign(report);
    setShowSignModal(true);
  };

  const handleConfirmSign = async () => {
    if (!selectedReportForSign) return;

    setIsSigningInProgress(true);

    try {
      // TODO: Get current user info (tổ trưởng kỹ thuật)
      const currentUserName = "Giảng Thanh Trọn"; // Mock user name
      const signedAt = new Date().toISOString();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Tìm và cập nhật trạng thái đề xuất trong mock data thành ĐÃ_KÝ_BIÊN_BẢN
      const requestIndex = mockReplacementRequestItem.findIndex(
        (request) => request.id === selectedReportForSign.id
      );

      if (requestIndex !== -1) {
        mockReplacementRequestItem[requestIndex] = {
          ...mockReplacementRequestItem[requestIndex],
          status: ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN,
          updatedAt: signedAt,
        };

        console.log("✅ Updated replacement request status:", {
          id: selectedReportForSign.id,
          newStatus: ReplacementStatus.ĐÃ_KÝ_BIÊN_BẢN,
          updatedAt: signedAt,
        });
      }

      // Cập nhật UI - chuyển trạng thái thành "signed"
      setInspectionReports((reports) =>
        reports.map((report) =>
          report.id === selectedReportForSign.id
            ? {
                ...report,
                status: "signed" as const,
                leaderSignature: currentUserName,
                leaderSignedAt: signedAt,
              }
            : report
        )
      );

      console.log("✅ Successfully signed inspection report:", {
        reportId: selectedReportForSign.id,
        signerName: currentUserName,
        signedAt,
      });

      // Đóng modal xác nhận và hiển thị thông báo thành công
      setShowSignModal(false);
      setShowSignSuccessModal(true);
    } catch (error) {
      console.error("❌ Error signing report:", error);
      alert("Có lỗi xảy ra khi ký biên bản. Vui lòng thử lại.");
    } finally {
      setIsSigningInProgress(false);
      setSelectedReportForSign(null);
    }
  };

  const handleSendBack = (reportId: string) => {
    setInspectionReports((reports) =>
      reports.map((report) =>
        report.id === reportId
          ? { ...report, status: "sent_back" as const }
          : report
      )
    );
  };

  // Pagination logic
  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedReports.slice(startIndex, endIndex);
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(checked ? sortedReports.map((report) => report.id) : []);
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      setSelectAll(false);
    }
  };

  // Export handler
  const handleExportExcel = async () => {
    const selectedData = sortedReports.filter((item) =>
      selectedItems.includes(item.id)
    );

    const itemsToExport =
      selectedData.length > 0 ? selectedData : sortedReports;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import("xlsx");

      // Tạo dữ liệu Excel
      const excelData = itemsToExport.map((item, index) => ({
        STT: index + 1,
        "Số biên bản": item.reportNumber,
        "Tiêu đề": item.title,
        "Tờ trình liên quan": item.relatedReportTitle,
        "Người tạo": item.createdBy,
        "Ngày kiểm tra": new Date(item.inspectionDate).toLocaleDateString(
          "vi-VN"
        ),
        "Trạng thái": getStatusText(item.status),
        "Người ký": item.leaderSignature || "Chưa ký",
        "Ngày ký": item.leaderSignedAt
          ? new Date(item.leaderSignedAt).toLocaleDateString("vi-VN")
          : "Chưa ký",
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột tự động
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Số biên bản
        { wch: 40 }, // Tiêu đề
        { wch: 35 }, // Tờ trình liên quan
        { wch: 20 }, // Người tạo
        { wch: 15 }, // Ngày kiểm tra
        { wch: 15 }, // Trạng thái
        { wch: 20 }, // Người ký
        { wch: 15 }, // Ngày ký
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách biên bản kiểm tra");

      // Xuất file
      const fileName = `danh-sach-bien-ban-kiem-tra-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      setExportCount(itemsToExport.length);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  // Reset pagination when changing search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-2 main-content">
      <InspectionHeader />

      <InspectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedItems.length}
        onExportExcel={handleExportExcel}
      />

      <InspectionTable
        reports={getCurrentData()}
        selectedItems={selectedItems}
        selectAll={selectAll}
        sortField={sortField}
        sortDirection={sortDirection}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onSort={handleSort}
        onViewDetail={handleViewDetail}
        onSignReport={handleSignReport}
        onSendBack={handleSendBack}
      />

      <InspectionMobileView
        reports={getCurrentData()}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onViewDetail={handleViewDetail}
        onSignReport={handleSignReport}
        onSendBack={handleSendBack}
        getStatusBadge={getStatusBadge}
        getStatusText={getStatusText}
        getStatusIcon={getStatusIcon}
      />

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          total={sortedReports.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Sign Confirmation Modal */}
      <SignConfirmModal
        isOpen={showSignModal}
        onClose={() => {
          setShowSignModal(false);
          setSelectedReportForSign(null);
        }}
        onConfirm={handleConfirmSign}
        reportTitle={selectedReportForSign?.title || ""}
        reportNumber={selectedReportForSign?.reportNumber || ""}
        isLoading={isSigningInProgress}
      />

      {/* Sign Success Modal */}
      <SuccessModal
        isOpen={showSignSuccessModal}
        onClose={() => setShowSignSuccessModal(false)}
        title="Ký biên bản thành công!"
        message="Biên bản đã được ký xác nhận thành công. Trạng thái đã được cập nhật."
      />

      {/* Export Modals */}
      <Modal
        open={showExportSuccessModal}
        onOk={() => setShowExportSuccessModal(false)}
        onCancel={() => setShowExportSuccessModal(false)}
        footer={null}
        closable={true}
        centered>
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <h3 className="text-lg font-semibold mb-2">Xuất Excel thành công!</h3>
          <p className="text-gray-600">Đã xuất {exportCount} biên bản</p>
        </div>
      </Modal>

      <Modal
        open={showExportErrorModal}
        onOk={() => setShowExportErrorModal(false)}
        onCancel={() => setShowExportErrorModal(false)}
        footer={null}
        closable={true}
        centered>
        <div className="text-center">
          <XCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h3 className="text-lg font-semibold mb-2">Lỗi xuất Excel</h3>
          <p className="text-gray-600">
            Vui lòng chọn ít nhất một biên bản để xuất
          </p>
        </div>
      </Modal>
    </div>
  );
}
