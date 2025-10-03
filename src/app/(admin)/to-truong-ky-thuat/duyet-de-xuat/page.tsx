"use client";
import { useState } from "react";
import { ReplacementRequestItem, ReplacementStatus } from "@/types";
import { mockReplacementRequestItem } from "@/lib/mockData";
import ExportExcelSuccessModal from "./modal/ExportExcelSuccessModal";
import ExportExcelErrorModal from "./modal/ExportExcelErrorModal";
import { Breadcrumb } from "antd";
import { Pagination } from "@/components/common";
import {
  ProposalHeader,
  ProposalFilters,
  ProposalTable,
  STATUS_CONFIG,
  filterProposals,
  sortProposals,
} from "@/components/leadTechnician/proposalApproval";

export default function DuyetDeXuatPage() {
  // Lấy các đề xuất CHỜ TỔ TRƯỞNG DUYỆT - Kỹ thuật viên đã lập, chờ tổ trưởng duyệt
  const [requests, setRequests] = useState<ReplacementRequestItem[]>(
    mockReplacementRequestItem
      .filter(
        (proposal) => proposal.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT
      )
      .map((proposal) => ({
        ...proposal,
      }))
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle actions
  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: ReplacementStatus.ĐÃ_DUYỆT,
            }
          : req
      )
    );
    console.log("Approved request:", requestId);
  };

  const handleReject = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: ReplacementStatus.ĐÃ_TỪ_CHỐI,
            }
          : req
      )
    );
    console.log("Rejected request:", requestId);
  };

  // Use helper functions
  const filteredData = filterProposals(requests, selectedStatus, searchTerm);
  const sortedData = sortProposals(filteredData, sortField, sortDirection);

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        // Reset về không sắp xếp
        setSortField("");
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Xử lý checkbox
  const handleRowSelect = (itemId: string, checked: boolean) => {
    setSelectedRowKeys((prev) => {
      const newSelected = checked
        ? [...prev, itemId]
        : prev.filter((id) => id !== itemId);
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(paginatedData.map((req) => req.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  // Xử lý xuất Excel
  const handleExportExcel = () => {
    const itemsToExport =
      selectedRowKeys.length > 0
        ? sortedData.filter((req) => selectedRowKeys.includes(req.id))
        : sortedData;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-2">
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
                  <span>Duyệt đề xuất</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header với thống kê */}
      <ProposalHeader
        totalCount={sortedData.length}
        selectedCount={selectedRowKeys.length}
        onExportExcel={handleExportExcel}
      />

      {/* Filters */}
      <ProposalFilters
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
      />

      {/* Table */}
      <ProposalTable
        paginatedData={paginatedData}
        selectedRowKeys={selectedRowKeys}
        currentPage={currentPage}
        pageSize={pageSize}
        statusConfig={STATUS_CONFIG}
        sortField={sortField}
        sortDirection={sortDirection}
        onSelectAll={handleSelectAll}
        onRowSelect={handleRowSelect}
        onSort={handleSort}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={sortedData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
        />
      </div>

      {/* Success Modals */}
      <ExportExcelSuccessModal
        isOpen={showExportSuccessModal}
        onClose={() => setShowExportSuccessModal(false)}
        exportCount={exportCount}
      />

      <ExportExcelErrorModal
        isOpen={showExportErrorModal}
        onClose={() => setShowExportErrorModal(false)}
      />
    </div>
  );
}
