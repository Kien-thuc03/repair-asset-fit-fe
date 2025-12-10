"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Modal } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  InspectionHeader,
  InspectionFilters,
  InspectionTable,
  InspectionMobileView,
} from "@/components/leadTechnician/inspection";
import { SignConfirmModal } from "@/components/modal";
import {
  useReplacementProposals,
  useUpdateReplacementProposalStatus,
} from "@/hooks/useReplacementProposals";
import { ReplacementProposalStatus } from "@/types";

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

export default function BienBanPage() {
  const router = useRouter();

  // API hook for updating status
  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  // Memoize query params - lấy tất cả rồi filter ở frontend để lấy cả B10 và B11
  const queryParams = useMemo(() => {
    const mappedSortBy =
      sortField === "reportNumber"
        ? "proposalCode"
        : sortField === "relatedReportTitle"
        ? "title"
        : sortField === "inspectionDate"
        ? "createdAt"
        : sortField || "createdAt";

    return {
      status: undefined, // Không filter ở API, sẽ filter ở frontend
      search: searchTerm || undefined,
      page: 1,
      limit: 1000, // Lấy tất cả để xử lý phân trang và sort trên client
      sortBy: mappedSortBy as
        | "createdAt"
        | "updatedAt"
        | "proposalCode"
        | "status",
      sortOrder: sortDirection.toUpperCase() as "ASC" | "DESC",
    };
  }, [searchTerm, sortField, sortDirection]);

  // Fetch data from API
  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useReplacementProposals(queryParams);

  // Transform API data to InspectionReport format
  const inspectionReports = useMemo(() => {
    if (!apiData?.data) return [];

    // Filter chỉ lấy B10 (ĐÃ_GỬI_BIÊN_BẢN) và B11 (ĐÃ_KÝ_BIÊN_BẢN)
    const ALLOWED_STATUSES = [
      ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN, // B10
      ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN, // B11
    ];

    const filteredProposals = apiData.data.filter((proposal) =>
      ALLOWED_STATUSES.includes(proposal.status)
    );

    return filteredProposals.map((proposal) => ({
      id: proposal.id,
      reportNumber: proposal.proposalCode,
      title: `Biên bản kiểm tra - ${proposal.title || "Không có tiêu đề"}`,
      relatedReportTitle: proposal.submissionFormUrl
        ? `${proposal.submissionFormUrl.split("/").pop()}`
        : proposal.title || "Không có tờ trình liên quan",
      createdBy: proposal.proposer?.fullName || "Unknown",
      inspectionDate: new Date(proposal.createdAt).toISOString().split("T")[0],
      status:
        proposal.status === ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN
          ? ("signed" as const)
          : ("pending" as const), // B10 = pending, B11 = signed
      leaderSignature: proposal.teamLeadApprover?.fullName,
      leaderSignedAt:
        proposal.status === ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN
          ? proposal.updatedAt
          : undefined,
    }));
  }, [apiData]);

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

  // Client-side filtering (đã filter B10 và B11 trong inspectionReports)
  const filteredReports = useMemo(() => {
    // Data đã được filter B10 và B11 trong inspectionReports
    return inspectionReports;
  }, [inspectionReports]);

  // Hàm xử lý sắp xếp
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle between asc and desc
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // API handles sorting, so sortedReports = filteredReports
  const sortedReports = filteredReports;

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
        return <Clock className="h-4 w-4" />; // Sử dụng Clock thay vì Send
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
      // Call API to update status to ĐÃ_KÝ_BIÊN_BẢN
      await updateStatus(selectedReportForSign.id, {
        status: ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN,
      });

      console.log("✅ Successfully signed inspection report:", {
        reportId: selectedReportForSign.id,
        newStatus: ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN,
      });

      // Đóng modal
      setShowSignModal(false);
      setSelectedReportForSign(null);

      // Refresh danh sách để cập nhật trạng thái
      refetch();

      // Hiển thị thông báo thành công
      Modal.success({
        title: "Ký biên bản thành công!",
        content: `Biên bản ${selectedReportForSign.reportNumber} đã được ký thành công. Trạng thái đã chuyển sang "Đã ký".`,
        centered: true,
        onOk: () => {
          // Sau khi ký, item vẫn hiển thị trong danh sách với trạng thái "Đã ký" (B11)
        },
      });
    } catch (error) {
      console.error("❌ Error signing report:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi ký biên bản. Vui lòng thử lại."
      );
    } finally {
      setIsSigningInProgress(false);
      setSelectedReportForSign(null);
    }
  };

  // Dummy function để thỏa mãn interface - không sử dụng vì đã bỏ tính năng gửi lại
  const handleSendBack = (reportId: string) => {
    // Không làm gì cả - tính năng gửi lại đã bị loại bỏ
    console.log("Send back functionality has been removed:", reportId);
  };

  // Pagination logic - Client-side pagination (vì đã filter ở frontend)
  const totalFiltered = sortedReports.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = sortedReports.slice(startIndex, endIndex);

  const getCurrentData = () => {
    return paginatedReports;
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
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen">
      <InspectionHeader />

      <InspectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedItems.length}
        onExportExcel={handleExportExcel}
      />

      {/* Loading State */}
      {loading && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Lỗi tải dữ liệu</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      )}

      {/* Data Display */}
      {!loading && !error && (
        <>
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
            <Pagination
              currentPage={currentPage}
              total={totalFiltered}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
                setCurrentPage(1);
              }}
            />
        </>
      )}

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
