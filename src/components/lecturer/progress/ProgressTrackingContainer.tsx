"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { RepairRequest } from "@/types";
import { mockRepairRequests, repairRequestStatusConfig } from "@/lib/mockData";
import Pagination from "@/components/common/Pagination";
import ProgressHeader from "./ProgressHeader";
import ProgressFilters from "./ProgressFilters";
import RequestTable from "./RequestTable";
import RequestCards from "./RequestCards";
import NoRequestsFound from "./NoRequestsFound";

export default function ProgressTrackingContainer() {
  const router = useRouter();
  const [requests] = useState<RepairRequest[]>(mockRepairRequests);
  const [filteredRequests, setFilteredRequests] =
    useState<RepairRequest[]>(mockRepairRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection state for export
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Export modals state
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");

  // Sorting state
  const [sortField, setSortField] = useState<keyof RepairRequest | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedRequests, setPaginatedRequests] = useState<RepairRequest[]>(
    []
  );

  // Handle sorting
  const handleSort = (field: keyof RepairRequest) => {
    if (sortField === field) {
      // Cycling through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
        setSortField(field);
      }
    } else {
      // New field, start with asc
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    let filtered = requests;

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.requestCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (request.assetName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false) ||
          (request.assetCode
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false) ||
          (request.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue: string | undefined = a[sortField] as string | undefined;
        const bValue: string | undefined = b[sortField] as string | undefined;

        // Handle null/undefined values
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortDirection === "asc" ? -1 : 1;
        if (!bValue) return sortDirection === "asc" ? 1 : -1;

        // Handle date comparison
        if (
          sortField === "createdAt" ||
          sortField === "acceptedAt" ||
          sortField === "completedAt"
        ) {
          const aTime = new Date(aValue).getTime();
          const bTime = new Date(bValue).getTime();
          return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
        }

        // Handle string comparison
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();

        if (aLower < bLower) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aLower > bLower) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredRequests([...filtered]);

    // Reset selection when filter changes
    setSelectedItems([]);
    setSelectAll(false);

    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [requests, searchTerm, statusFilter, sortField, sortDirection]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredRequests.slice(startIndex, endIndex);

    setPaginatedRequests(paginated);
  }, [filteredRequests, currentPage, pageSize]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]); // Reset selection when changing page
    setSelectAll(false);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    setSelectedItems([]); // Reset selection
    setSelectAll(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(paginatedRequests.map((req) => req.id));
      setSelectAll(true);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      const newSelected = selectedItems.filter((item) => item !== id);
      setSelectedItems(newSelected);
      setSelectAll(false);
    } else {
      const newSelected = [...selectedItems, id];
      setSelectedItems(newSelected);
      setSelectAll(newSelected.length === paginatedRequests.length);
    }
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    router.push(`/giang-vien/danh-sach-yeu-cau-sua-chua/chi-tiet/${id}`);
  };

  // Xử lý xuất Excel
  const handleExportExcel = async () => {
    const itemsToExport =
      selectedItems.length > 0
        ? filteredRequests.filter((req) => selectedItems.includes(req.id))
        : filteredRequests;

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
        "Mã yêu cầu": item.requestCode,
        "Tên tài sản": item.assetName || "Chưa xác định",
        "Mã tài sản": item.assetCode || "Chưa xác định",
        "Vị trí": `${item.buildingName || "Chưa xác định"} - ${
          item.roomName || "Chưa xác định"
        }`,
        Máy: `Máy ${item.machineLabel || "Chưa xác định"}`,
        "Người báo": item.reporterName || "Chưa xác định",
        "KTV phụ trách": item.assignedTechnicianName || "Chưa phân công",
        "Loại lỗi": item.errorTypeName || "Chưa xác định",
        "Mô tả lỗi": item.description || "",
        "Trạng thái":
          repairRequestStatusConfig[item.status]?.label || item.status,
        "Ngày báo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
        "Ngày tiếp nhận": item.acceptedAt
          ? new Date(item.acceptedAt).toLocaleDateString("vi-VN")
          : "Chưa tiếp nhận",
        "Ngày hoàn thành": item.completedAt
          ? new Date(item.completedAt).toLocaleDateString("vi-VN")
          : "Chưa hoàn thành",
        "Ghi chú xử lý": item.resolutionNotes || "",
      }));

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách yêu cầu sửa chữa");

      // Xuất file
      const fileName = `danh-sach-yeu-cau-sua-chua-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      setExportCount(itemsToExport.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedItems([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  // Update selectAll when paginatedRequests changes
  useEffect(() => {
    if (selectedItems.length > 0 && paginatedRequests.length > 0) {
      setSelectAll(
        selectedItems.length === paginatedRequests.length &&
          paginatedRequests.every((req) => selectedItems.includes(req.id))
      );
    } else {
      setSelectAll(false);
    }
  }, [paginatedRequests, selectedItems]);

  return (
    <div className="space-y-6 min-h-screen">
      <ProgressHeader />

      <ProgressFilters
        searchTerm={searchTerm}
        totalCount={filteredRequests.length}
        selectedCount={selectedItems.length}
        onSearchChange={setSearchTerm}
        onExport={handleExportExcel}
      />

      {/* Requests List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <RequestTable
          requests={paginatedRequests}
          selectedItems={selectedItems}
          selectAll={selectAll}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          onViewDetails={handleViewDetails}
          formatDate={formatDate}
        />

        <RequestCards
          requests={paginatedRequests}
          selectedItems={selectedItems}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          onViewDetails={handleViewDetails}
          formatDate={formatDate}
        />

        {filteredRequests.length === 0 && <NoRequestsFound />}

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={filteredRequests.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSizeChanger={true}
            showQuickJumper={true}
            showTotal={true}
          />
        )}
      </div>

      {/* Spacer to ensure minimum height and consistent scrollbar */}
      <div className="min-h-[200px]"></div>

      {/* Export Success Modal */}
      <Modal
        open={showExportSuccessModal}
        onCancel={() => setShowExportSuccessModal(false)}
        footer={[
          <button
            key="ok"
            onClick={() => setShowExportSuccessModal(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Đóng
          </button>,
        ]}
        centered
        width={400}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Xuất Excel thành công!
            </h3>
            <p className="text-sm text-gray-500">
              Đã xuất {exportCount} yêu cầu ra file {exportFileName} thành công.
            </p>
          </div>
        </div>
      </Modal>

      {/* Export Error Modal */}
      <Modal
        open={showExportErrorModal}
        onCancel={() => setShowExportErrorModal(false)}
        footer={[
          <button
            key="ok"
            onClick={() => setShowExportErrorModal(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Đóng
          </button>,
        ]}
        centered
        width={400}>
        <div className="flex items-center space-x-3">
          <XCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Không thể xuất Excel
            </h3>
            <p className="text-sm text-gray-500">
              Không có dữ liệu để xuất hoặc có lỗi xảy ra. Vui lòng thử lại.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
