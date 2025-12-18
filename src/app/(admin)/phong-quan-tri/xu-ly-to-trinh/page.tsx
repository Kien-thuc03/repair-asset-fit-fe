"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  Calendar,
  Eye,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Breadcrumb, Button, Modal } from "antd";
import { Pagination, SortableHeader } from "@/components/common";
import {
  ExportExcelSuccessModal,
  ExportExcelErrorModal,
} from "@/components/modal";
import { useRouter } from "next/navigation";
import {
  useReplacementProposals,
  useUpdateReplacementProposalStatus,
  useProfile,
} from "@/hooks";
import { ReplacementProposal } from "@/lib/api/replacement-proposals";
import { ReplacementProposalStatus } from "@/types/repair";

type SortField = keyof ReplacementProposal;
type SortDirection = "asc" | "desc" | null;

export default function XuLyToTrinhPage() {
  const router = useRouter();
  const { userDetails } = useProfile();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { updateStatus } = useUpdateReplacementProposalStatus();

  // Fetch data từ API - lấy tất cả rồi filter ở frontend để lấy cả B5/B6
  const {
    data: apiData,
    loading,
    error,
  } = useReplacementProposals({
    status: undefined, // Không filter ở API, sẽ filter ở frontend
    page: 1,
    limit: 1000, // Lấy tất cả để xử lý phân trang và sort trên client
  });

  const filteredData = useMemo(() => {
    const proposals = apiData?.data || [];

    // Filter chỉ lấy các trạng thái cần xử lý: B5/B6
    const ALLOWED_STATUSES = [
      ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH, // B5
      ReplacementProposalStatus.CHỜ_XÁC_MINH, // B6
    ];

    let filtered = proposals.filter((proposal) =>
      ALLOWED_STATUSES.includes(proposal.status)
    );

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.proposalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | Date | number;
        let bValue: string | Date | number;

        switch (sortField) {
          case "createdAt":
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case "proposalCode":
            aValue = a.proposalCode;
            bValue = b.proposalCode;
            break;
          case "title":
            aValue = a.title || "";
            bValue = b.title || "";
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "itemsCount":
            aValue = a.itemsCount || 0;
            bValue = b.itemsCount || 0;
            break;
          case "proposer":
            aValue = a.proposer?.fullName?.toLowerCase() || "";
            bValue = b.proposer?.fullName?.toLowerCase() || "";
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [apiData?.data, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalItems = filteredData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowKeys([]);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setSelectedRowKeys([]);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Cycle through: asc -> desc -> null (default)
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      // New field selected, start with asc
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "bg-lime-100 text-lime-800 border-lime-200";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH:
        return "Khoa đã duyệt tờ trình";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      default:
        return status;
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = filteredData.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
      setExportError("Vui lòng chọn ít nhất một tờ trình để xuất Excel!");
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách tờ trình");

      // Tạo dữ liệu Excel
      const excelData = selectedData.map((item, index) => ({
        STT: index + 1,
        "Mã đề xuất": item.proposalCode,
        "Tiêu đề": item.title || "",
        "Mô tả": item.description || "",
        "Người tạo": item.proposer?.fullName || "Chưa xác định",
        "Số lượng linh kiện": item.itemsCount || 0,
        "Trạng thái": getStatusText(item.status),
        "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
      }));

      const columnHeaders = [
        "STT",
        "Mã đề xuất",
        "Tiêu đề",
        "Mô tả",
        "Người tạo",
        "Số lượng linh kiện",
        "Trạng thái",
        "Ngày tạo",
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
      cell4.value = "DANH SÁCH TỜ TRÌNH THAY THẾ THIẾT BỊ";
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

      // Hàng 8: Thông tin người lập và thời gian
      const now = new Date();
      const infoRow = worksheet.getRow(currentRow);
      const infoCell = infoRow.getCell(1);
      infoCell.value = `Người lập: ${
        userDetails?.fullName || "N/A"
      } | Thời gian xuất: ${now.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
      infoCell.font = { name: "Arial", size: 9 };
      infoCell.alignment = { horizontal: "left", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      // Hàng 9: Dòng trống
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
      const fileName = `Danh_sach_to_trinh_${
        new Date().toISOString().split("T")[0]
      }_${selectedData.length}_ban_ghi.xlsx`;

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

      // Hiển thị thông báo thành công
      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setExportError(
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
      setShowExportErrorModal(true);
    }
  };

  // Hàm xử lý chọn row
  const handleRowSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    }
  };

  // Hàm xử lý chọn tất cả
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const currentPageKeys = paginatedData.map((row) => row.id);
      setSelectedRowKeys((prev) => [...prev, ...currentPageKeys]);
    } else {
      const currentPageKeys = paginatedData.map((row) => row.id);
      setSelectedRowKeys((prev) =>
        prev.filter((key) => !currentPageKeys.includes(key))
      );
    }
  };

  // Hàm xử lý khi click xem chi tiết
  // Nếu đang ở KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH, tự động chuyển sang CHỜ_XÁC_MINH trước khi điều hướng
  const handleViewDetail = async (
    e: React.MouseEvent<HTMLElement>,
    item: ReplacementProposal
  ) => {
    if (item.status === ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH) {
      e.preventDefault();
      setProcessingId(item.id);
      try {
        await updateStatus(item.id, {
          status: ReplacementProposalStatus.CHỜ_XÁC_MINH,
        });
      } catch (err) {
        console.error("Error updating status:", err);
        Modal.error({
          title: "Lỗi",
          content:
            err instanceof Error
              ? err.message
              : "Không thể chuyển trạng thái. Vui lòng thử lại.",
          okText: "Đóng",
        });
        return;
      } finally {
        setProcessingId(null);
      }
    }

    router.push(`/phong-quan-tri/xu-ly-to-trinh/${item.id}`);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              href: "/phong-quan-tri",
              title: (
                <div className="flex items-center">
                  <span>Phòng quản trị</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Xử lý tờ trình</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}

      <div className="bg-white shadow rounded-lg p-6 mt-2">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách tờ trình thay thế thiết bị
            </h1>
            <p className="text-gray-600">
              Theo dõi tiến độ xử lý các tờ trình thay thế thiết bị.
            </p>
          </div>
        </div>
      </div>

      {/* Search và Xuất Excel */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Search - chiếm 3 cột */}
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đề xuất, tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Nút Xuất Excel - chiếm 1 cột */}
          <div className="md:col-span-1">
            <Button
              type="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportExcel}
              disabled={selectedRowKeys.length === 0}
              style={{
                backgroundColor:
                  selectedRowKeys.length > 0 ? "#16a34a" : undefined,
                borderColor: selectedRowKeys.length > 0 ? "#16a34a" : undefined,
              }}
              className="w-full h-[40px] flex items-center justify-center">
              <span className="hidden sm:inline">
                Xuất Excel{" "}
                {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </span>
              <span className="sm:hidden">
                Xuất{" "}
                {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden lg:block">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách tờ trình ({filteredData.length})
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-red-600">Lỗi: {error}</span>
          </div>
        )}

        {/* Table Content */}
        {!loading && !error && (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={
                          paginatedData.length > 0 &&
                          paginatedData.every((row) =>
                            selectedRowKeys.includes(row.id)
                          )
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Chọn tất cả tờ trình"
                      />
                      <span>STT</span>
                    </div>
                  </th>
                  <SortableHeader<ReplacementProposal>
                    field="proposalCode"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[12%]">
                    Mã ĐX
                  </SortableHeader>
                  <SortableHeader<ReplacementProposal>
                    field="title"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[22%]">
                    Tiêu đề
                  </SortableHeader>
                  <SortableHeader<ReplacementProposal>
                    field="proposer"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[15%]">
                    Người tạo
                  </SortableHeader>
                  <SortableHeader<ReplacementProposal>
                    field="itemsCount"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[10%]">
                    Số lượng
                  </SortableHeader>
                  <SortableHeader<ReplacementProposal>
                    field="status"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[15%]">
                    Trạng thái
                  </SortableHeader>
                  <SortableHeader<ReplacementProposal>
                    field="createdAt"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[11%]">
                    Ngày
                  </SortableHeader>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-3 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <input
                          title="Chọn tờ trình này"
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedRowKeys.includes(item.id)}
                          onChange={(e) =>
                            handleRowSelect(item.id, e.target.checked)
                          }
                          aria-label={`Chọn tờ trình ${item.proposalCode}`}
                        />
                        <span>{(currentPage - 1) * pageSize + index + 1}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-blue-600 truncate cursor-pointer hover:text-blue-800 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleViewDetail(e, item);
                        }}>
                        {item.proposalCode}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900 font-medium truncate"
                        title={item.title || ""}>
                        {item.title || "Không có tiêu đề"}
                      </div>
                      <div
                        className="text-sm text-gray-500 truncate"
                        title={item.description || ""}>
                        {item.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <span className="truncate text-sm font-medium">
                            {item.proposer?.fullName || "Chưa xác định"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {item.itemsCount || 0}
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}>
                        <span className="hidden lg:inline text-xs">
                          {getStatusText(item.status)}
                        </span>
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {processingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        ) : (
                          <Link
                            href={`/phong-quan-tri/xu-ly-to-trinh/${item.id}`}
                            onClick={(e) => handleViewDetail(e, item)}
                            className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {paginatedData.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có tờ trình nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không tìm thấy tờ trình nào phù hợp với tiêu chí tìm kiếm.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSizeChanger={true}
            pageSizeOptions={[10, 20, 50, 100]}
            showQuickJumper={true}
            showTotal={true}
          />
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Danh sách tờ trình ({filteredData.length})
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-red-600">Lỗi: {error}</span>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && (
          <div className="p-4 space-y-4">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {item.proposalCode}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {item.title || "Không có tiêu đề"}
                        </p>
                      </div>
                    </div>
                    <input
                      title="Chọn tờ trình này"
                      type="checkbox"
                      checked={selectedRowKeys.includes(item.id)}
                      onChange={(e) =>
                        handleRowSelect(item.id, e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                    />
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Người tạo:</span>
                      <p className="font-medium text-gray-900 mt-0.5">
                        {item.proposer?.fullName || "Chưa xác định"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Số lượng:</span>
                      <p className="font-medium text-gray-900 mt-0.5">
                        {item.itemsCount || 0} thiết bị
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <p className="font-medium text-gray-900 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Trạng thái:</span>
                      <div className="mt-0.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                            item.status
                          )}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Actions */}
                  <div className="space-y-2 pt-2">
                    {processingId === item.id ? (
                      <div className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-600 text-xs font-medium rounded-md">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <Link
                        href={`/phong-quan-tri/xu-ly-to-trinh/${item.id}`}
                        onClick={(e) => handleViewDetail(e, item)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Xem chi tiết</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Không tìm thấy tờ trình nào
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSizeChanger={true}
            pageSizeOptions={[10, 20, 50, 100]}
            showQuickJumper={true}
            showTotal={true}
          />
        )}
      </div>

      {/* Export Modals */}
      <ExportExcelSuccessModal
        isOpen={showExportSuccessModal}
        onClose={() => setShowExportSuccessModal(false)}
        fileName={exportFileName}
        recordCount={exportCount}
      />

      <ExportExcelErrorModal
        isOpen={showExportErrorModal}
        onClose={() => setShowExportErrorModal(false)}
        errorMessage={exportError}
      />
    </div>
  );
}
