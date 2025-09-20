"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RepairRequest } from "@/types";
import { mockRepairRequests } from "@/lib/mockData";
import { Breadcrumb } from "antd";
import Pagination from "@/components/common/Pagination";
import {
  ReportListHeader,
  ReportStats,
  ReportFilters,
  ReportTable,
  ReportExportModals,
} from "@/components/leadTechnician/reportList";

export default function DanhSachBaoLoiPage() {
  const router = useRouter();
  const [requests] = useState<RepairRequest[]>(mockRepairRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedErrorType, setSelectedErrorType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">("none");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        overflow-y: scroll;
        scrollbar-gutter: stable;
      }
      
      body {
        min-height: 100vh;
        overflow-x: hidden;
      }
      
      .main-content {
        min-height: calc(100vh - 2rem);
        width: 100vw;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Cố định width để tránh nhảy khi scrollbar xuất hiện/biến mất */
      .table-container {
        overflow-y: scroll;
        scrollbar-gutter: stable;
      }
      
      .container {
        width: 100% !important;
        max-width: none !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      
      /* Cố định layout cho filter section */
      .filter-section {
        position: relative;
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    // Cleanup khi component unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      selectedStatus === "all" || request.status === selectedStatus;
    const matchesErrorType =
      selectedErrorType === "all" ||
      request.errorTypeName === selectedErrorType;
    const matchesSearch =
      searchTerm === "" ||
      request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesErrorType && matchesSearch;
  });

  // Sắp xếp requests đã lọc
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortField || sortDirection === "none") return 0;

    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortField) {
      case "requestCode":
        aValue = a.requestCode;
        bValue = b.requestCode;
        break;
      case "assetCode":
        aValue = a.assetCode;
        bValue = b.assetCode;
        break;
      case "reporterName":
        aValue = a.reporterName;
        bValue = b.reporterName;
        break;
      case "errorTypeName":
        aValue = a.errorTypeName || "";
        bValue = b.errorTypeName || "";
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const getCurrentData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRequests.slice(startIndex, endIndex);
  };

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedItems(
      checked ? sortedRequests.map((request) => request.id) : []
    );
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
        ? sortedRequests.filter((request) => selectedItems.includes(request.id))
        : sortedRequests;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // View details handler
  const handleViewDetails = (requestId: string) => {
    router.push(`/to-truong-ky-thuat/danh-sach-bao-loi/chi-tiet?id=${requestId}`);
  };

  // Reset pagination when changing filters or search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
    setSelectAll(false);
  }, [selectedStatus, selectedErrorType, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-2 main-content">
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/to-truong-ky-thuat",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Danh sách báo lỗi</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <ReportListHeader
        selectedItemsCount={selectedItems.length}
        totalItems={sortedRequests.length}
        onExportExcel={handleExportExcel}
      />

      {/* Stats */}
      <ReportStats requests={requests} />

      {/* Filters */}
      <ReportFilters
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedErrorType={selectedErrorType}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
        onErrorTypeChange={setSelectedErrorType}
      />

      {/* Requests Table */}
      <ReportTable
        requests={getCurrentData()}
        selectedItems={selectedItems}
        selectAll={selectAll}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={sortedRequests.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        className="mt-6"
      />

      {/* Export Modals */}
      <ReportExportModals
        showExportSuccessModal={showExportSuccessModal}
        showExportErrorModal={showExportErrorModal}
        exportCount={exportCount}
        onCloseSuccessModal={() => setShowExportSuccessModal(false)}
        onCloseErrorModal={() => setShowExportErrorModal(false)}
      />
    </div>
  );
}