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
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách biên bản kiểm tra");

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

      const columnHeaders = [
        "STT",
        "Số biên bản",
        "Tiêu đề",
        "Tờ trình liên quan",
        "Người tạo",
        "Ngày kiểm tra",
        "Trạng thái",
        "Người ký",
        "Ngày ký",
      ];

      // Tạo footer
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const dateStr = `Ngày ${day} Tháng ${
        month < 10 ? "0" + month : month
      } Năm ${year}`;

      const footerRow: string[] = new Array(columnHeaders.length).fill("");
      footerRow[0] = "Người lập biểu";
      footerRow[Math.floor(columnHeaders.length / 4)] = "Thư ký";
      footerRow[Math.floor((columnHeaders.length * 2) / 4)] =
        "Trưởng nhóm kiểm kê";
      footerRow[columnHeaders.length - 1] = "Đại diện ĐV sử dụng";

      let currentRow = 1;

      // Hàng 1: TRƯỜNG ĐẠI HỌC...
      const row1 = worksheet.getRow(currentRow);
      const cell1 = row1.getCell(1);
      cell1.value = "TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP HỒ CHÍ MINH";
      cell1.font = { name: "Arial", size: 9 };
      cell1.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 2: Địa chỉ
      const row2 = worksheet.getRow(currentRow);
      const cell2 = row2.getCell(1);
      cell2.value =
        "Địa chỉ : 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP Hồ Chí Minh";
      cell2.font = { name: "Arial", size: 9 };
      cell2.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 3: Dòng trống
      currentRow++;

      // Hàng 4: Tiêu đề sheet - màu đỏ
      const row4 = worksheet.getRow(currentRow);
      const cell4 = row4.getCell(1);
      cell4.value = "DANH SÁCH BIÊN BẢN KIỂM TRA";
      cell4.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "FFFF0000" },
      };
      cell4.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 5: KHOA CÔNG NGHỆ THÔNG TIN
      const row5 = worksheet.getRow(currentRow);
      const cell5 = row5.getCell(1);
      cell5.value = "KHOA CÔNG NGHỆ THÔNG TIN";
      cell5.font = { name: "Arial", size: 9 };
      cell5.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 6: NĂM
      const row6 = worksheet.getRow(currentRow);
      const cell6 = row6.getCell(1);
      cell6.value = `NĂM ${new Date().getFullYear()}`;
      cell6.font = { name: "Arial", size: 9 };
      cell6.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 7: Dòng trống
      currentRow++;

      // Header của bảng - in hoa và màu vàng
      const headerRow = worksheet.getRow(currentRow);
      columnHeaders.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = header.toUpperCase();
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFF00" },
        };
      });
      currentRow++;

      // Data rows
      excelData.forEach((rowData) => {
        const row = worksheet.getRow(currentRow);

        columnHeaders.forEach((header, index) => {
          const cell = row.getCell(index + 1);
          cell.value = rowData[header as keyof typeof rowData] ?? "";
          cell.font = { name: "Arial", size: 9 };
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          };
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        });
        currentRow++;
      });

      // Dòng trống
      currentRow++;

      // Hàng ngày tháng
      const dateRow = worksheet.getRow(currentRow);
      const dateCell = dateRow.getCell(columnHeaders.length);
      dateCell.value = dateStr;
      dateCell.font = { name: "Arial", size: 9 };
      dateCell.alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;

      // Footer row
      const footerRowExcel = worksheet.getRow(currentRow);
      footerRow.forEach((value, index) => {
        const cell = footerRowExcel.getCell(index + 1);
        cell.value = value;
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Set column widths
      columnHeaders.forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 20;
      });

      // Xuất file
      const fileName = `danh-sach-bien-ban-kiem-tra-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

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
