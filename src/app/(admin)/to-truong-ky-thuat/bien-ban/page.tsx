"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import {
  InspectionHeader,
  InspectionFilters,
  InspectionTable,
  InspectionMobileView,
  InspectionExportModals,
} from "@/components/leadTechnician/inspection";

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

// Mock data
const mockInspectionReports: InspectionReport[] = [
  {
    id: "1",
    reportNumber: "BB-2024-001",
    title: "Biên bản kiểm tra thiết bị máy tính",
    relatedReportTitle: "Tờ trình về việc kiểm tra thiết bị máy tính phòng 101",
    createdBy: "Nguyễn Văn A",
    inspectionDate: "2024-03-15",
    status: "pending",
  },
  {
    id: "2",
    reportNumber: "BB-2024-002",
    title: "Biên bản kiểm tra thiết bị máy chiếu",
    relatedReportTitle: "Tờ trình về việc kiểm tra thiết bị máy chiếu phòng 201",
    createdBy: "Trần Thị B",
    inspectionDate: "2024-03-14",
    status: "signed",
  },
];

export default function BienBanPage() {
  const router = useRouter();
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

  // Export states
  const [exportCount, setExportCount] = useState(0);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);

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
    // TODO: Implement sign modal
    console.log("Sign report:", report);
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
  const handleExportExcel = () => {
    const itemsToExport =
      selectedItems.length > 0
        ? sortedReports.filter((report) => selectedItems.includes(report.id))
        : sortedReports;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // Reset pagination when changing search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-2 main-content">
      <InspectionHeader onExportExcel={handleExportExcel} />

      <InspectionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
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

      {/* Modals would go here if they exist */}

      <InspectionExportModals
        showExportSuccessModal={showExportSuccessModal}
        showExportErrorModal={showExportErrorModal}
        exportCount={exportCount}
        onCloseSuccessModal={() => setShowExportSuccessModal(false)}
        onCloseErrorModal={() => setShowExportErrorModal(false)}
      />
    </div>
  );
}