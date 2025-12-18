import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { RepairRequest } from "@/types";
import { repairRequestStatusConfig } from "@/lib/constants/repairStatus";
import { useRepairsByReporter } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import Pagination from "@/components/common/Pagination";
import ProgressHeader from "./ProgressHeader";
import ProgressFilters from "./ProgressFilters";
import RequestTable from "./RequestTable";
import RequestCards from "./RequestCards";
import NoRequestsFound from "./NoRequestsFound";
import type { Dayjs } from "dayjs";

export default function ProgressTrackingContainer() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

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

  // Use API hook để lấy dữ liệu theo reporterId
  const { data: apiData, loading, error } = useRepairsByReporter(user?.id);

  const [filteredRequests, setFilteredRequests] = useState<RepairRequest[]>([]);

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

  // Áp dụng filter và sort trên client side
  useEffect(() => {
    let filtered = [...apiData];

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
          (request.ktCode?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false) ||
          (request.roomName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            false)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    // Date range filtering
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((request) => {
        const requestDate = new Date(request.createdAt);
        const startDate = dateRange[0]?.startOf("day").toDate();
        const endDate = dateRange[1]?.endOf("day").toDate();
        return (
          startDate &&
          endDate &&
          requestDate >= startDate &&
          requestDate <= endDate
        );
      });
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
  }, [apiData, searchTerm, statusFilter, dateRange, sortField, sortDirection]);

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

  // Calculate paginated data for display
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(filteredRequests.map((req) => req.id));
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
      setSelectAll(newSelected.length === filteredRequests.length);
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
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách yêu cầu sửa chữa");

      // Tạo dữ liệu Excel
      const excelData = itemsToExport.map((item, index) => ({
        STT: index + 1,
        "Mã yêu cầu": item.requestCode,
        "Tên tài sản": item.assetName || "Chưa xác định",
        "Mã tài sản": item.ktCode || "Chưa xác định",
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

      const columnHeaders = [
        "STT",
        "Mã yêu cầu",
        "Tên tài sản",
        "Mã tài sản",
        "Vị trí",
        "Máy",
        "Người báo",
        "KTV phụ trách",
        "Loại lỗi",
        "Mô tả lỗi",
        "Trạng thái",
        "Ngày báo",
        "Ngày tiếp nhận",
        "Ngày hoàn thành",
        "Ghi chú xử lý",
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
      cell4.value = "DANH SÁCH YÊU CẦU SỬA CHỮA";
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
      const fileName = `danh-sach-yeu-cau-sua-chua-${
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

  // Update selectAll when filteredRequests changes
  useEffect(() => {
    if (selectedItems.length > 0 && filteredRequests.length > 0) {
      setSelectAll(
        selectedItems.length === filteredRequests.length &&
          filteredRequests.every((req: RepairRequest) =>
            selectedItems.includes(req.id)
          )
      );
    } else {
      setSelectAll(false);
    }
  }, [filteredRequests, selectedItems]);

  // Show loading or error state
  if (loading && apiData.length === 0) {
    return (
      <div className="space-y-6 min-h-screen">
        <ProgressHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error && apiData.length === 0) {
    return (
      <div className="space-y-6 min-h-screen">
        <ProgressHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Có lỗi xảy ra: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      <ProgressHeader />

      <ProgressFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateRange={dateRange}
        selectedCount={selectedItems.length}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onDateRangeChange={setDateRange}
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
