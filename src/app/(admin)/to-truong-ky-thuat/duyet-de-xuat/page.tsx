"use client";
import { useState } from "react";
import { ReplacementRequestForList, ReplacementStatus } from "@/types";
import { mockReplacementProposals } from "@/lib/mockData/replacementProposals";
import ExportExcelSuccessModal from "./modal/ExportExcelSuccessModal";
import ExportExcelErrorModal from "./modal/ExportExcelErrorModal";
import { Breadcrumb } from "antd";
import {
  ApprovalHeader,
  ApprovalFilters,
  ApprovalTable,
  ApprovalMobileCards,
  getComponentInfo,
} from "@/components/leadTechnician/approval";

export default function DuyetDeXuatPage() {
  const [requests, setRequests] = useState<ReplacementRequestForList[]>(
    mockReplacementProposals.map((proposal) => ({
      id: proposal.id,
      assetCode: proposal.assetCode || "",
      assetName: proposal.assetName || "",
      requestedBy: proposal.proposerName,
      unit: "Khoa CNTT", // Default unit from database
      location: proposal.roomName || "",
      reason: proposal.reason || "",
      status: proposal.status as ReplacementStatus,
      requestDate: proposal.createdAt,
      estimatedCost: 500000, // Placeholder cost
      description: `Đề xuất thay thế ${proposal.componentName || "linh kiện"}`,
    }))
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

  const filteredRequests = requests
    .filter((request) => {
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "pending" &&
          (request.status === ReplacementStatus.CHỜ_XÁC_MINH ||
            request.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT)) ||
        (selectedStatus === "approved" &&
          request.status === ReplacementStatus.ĐÃ_DUYỆT) ||
        (selectedStatus === "rejected" &&
          request.status === ReplacementStatus.ĐÃ_TỪ_CHỐI);
      const matchesSearch =
        searchTerm === "" ||
        request.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getComponentInfo()
          .componentName.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      // Chỉ sắp xếp khi có sortField được chọn
      if (!sortField) return 0;

      let aValue: string | number | Date;
      let bValue: string | number | Date;

      // Handle component name sorting
      if (sortField === "componentName") {
        aValue = getComponentInfo().componentName.toLowerCase();
        bValue = getComponentInfo().componentName.toLowerCase();
      } else {
        aValue = a[sortField as keyof ReplacementRequestForList];
        bValue = b[sortField as keyof ReplacementRequestForList];
      }

      // Handle date sorting
      if (sortField === "requestDate") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

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
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];

      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredRequests.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredRequests.map((req) => req.id));
    }
  };

  // Xử lý xuất Excel
  const handleExportExcel = () => {
    const itemsToExport =
      selectedItems.length > 0
        ? filteredRequests.filter((req) => selectedItems.includes(req.id))
        : filteredRequests;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    console.log("Xuất Excel:", itemsToExport);
    // TODO: Implement actual Excel export logic
    setExportCount(itemsToExport.length);
    setShowExportSuccessModal(true);
  };

  // Lấy các đề xuất đã được duyệt
  const getApprovedRequests = () => {
    return requests.filter(
      (request) => request.status === ReplacementStatus.ĐÃ_DUYỆT
    );
  };

  const approvedRequests = getApprovedRequests();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 ">
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

      {/* Header */}
      <ApprovalHeader
        approvedRequestsCount={approvedRequests.length}
        selectedItemsCount={selectedItems.length}
        filteredRequestsCount={filteredRequests.length}
        onExportExcel={handleExportExcel}
      />

      {/* Filters */}
      <ApprovalFilters
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
      />

      {/* Table and Mobile View Container */}
      <div className="bg-white shadow rounded-lg overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px] flex flex-col">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Danh sách đề xuất ({filteredRequests.length})
            </h2>
            {selectedItems.length > 0 && (
              <div className="text-xs sm:text-sm text-blue-600 font-medium">
                Đã chọn: {selectedItems.length} mục
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Mobile Card View */}
          <ApprovalMobileCards
            filteredRequests={filteredRequests}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onApprove={handleApprove}
            onReject={handleReject}
          />

          {/* Desktop Table View */}
          <ApprovalTable
            filteredRequests={filteredRequests}
            selectedItems={selectedItems}
            sortField={sortField}
            sortDirection={sortDirection}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onSort={handleSort}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
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
