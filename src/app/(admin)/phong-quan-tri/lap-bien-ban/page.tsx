"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Building,
  Package,
  Search,
  Eye,
  User,
  Download,
  Loader2,
  AlertCircle,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import { Breadcrumb, Button } from "antd";
import { SortableHeader, Pagination } from "@/components/common";
import {
  ExportExcelSuccessModal,
  ExportExcelErrorModal,
} from "@/components/modal";
import { useReplacementProposals } from "@/hooks";
import { ReplacementProposal } from "@/lib/api/replacement-proposals";
import { ReplacementProposalStatus } from "@/types";

type SortField = keyof ReplacementProposal;
type SortDirection = "asc" | "desc" | null;

export default function LapBienBanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Export modal states
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");

  // Fetch proposals với status ĐÃ_XÁC_MINH (B9 - Phòng Quản trị đã xác nhận và xác minh thực tế xong)
  const {
    data: apiData,
    loading,
    error,
  } = useReplacementProposals({
    status: ReplacementProposalStatus.ĐÃ_XÁC_MINH,
    page: 1,
    limit: 1000,
  });

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction or reset
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: ReplacementProposalStatus) => {
    switch (status) {
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filteredReports = useMemo(() => {
    const proposals = apiData?.data || [];
    let filtered = [...proposals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.proposalCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          proposal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let compareValue = 0;

        switch (sortField) {
          case "updatedAt":
            compareValue =
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
          case "proposalCode":
            compareValue = a.proposalCode.localeCompare(b.proposalCode);
            break;
          case "status":
            compareValue = a.status.localeCompare(b.status);
            break;
          case "title":
            compareValue = (a.title || "").localeCompare(b.title || "");
            break;
          case "proposer":
            compareValue = (a.proposer?.fullName || "").localeCompare(
              b.proposer?.fullName || ""
            );
            break;
          case "itemsCount":
            compareValue = (a.itemsCount || 0) - (b.itemsCount || 0);
            break;
          default:
            compareValue = 0;
        }

        return sortDirection === "asc" ? compareValue : -compareValue;
      });
    }

    return filtered;
  }, [apiData?.data, searchTerm, sortField, sortDirection]);

  // Pagination
  const totalItems = filteredReports.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + pageSize
  );

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

  const handleViewReport = (proposalId: string) => {
    router.push(`/phong-quan-tri/lap-bien-ban/${proposalId}`);
  };

  // Tính toán thống kê cho mỗi proposal
  const getProposalStatistics = (proposal: ReplacementProposal) => {
    const totalComponents = proposal.itemsCount || 0;
    const totalQuantity =
      proposal.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Lấy danh sách phòng duy nhất từ items
    const rooms = [
      ...new Set(
        proposal.items
          ?.map((item) => item.oldComponent?.roomLocation)
          .filter((location) => location) || []
      ),
    ];

    return {
      totalComponents,
      totalQuantity,
      totalRooms: rooms.length,
      roomsList: rooms as string[],
    };
  };

  // Xử lý xuất Excel
  const handleExportExcel = async () => {
    // Kiểm tra xem có dữ liệu được chọn không
    const dataToExport =
      selectedRowKeys.length > 0
        ? filteredReports.filter((report) =>
            selectedRowKeys.includes(report.id)
          )
        : filteredReports;

    if (dataToExport.length === 0) {
      setExportError("Vui lòng chọn ít nhất một biên bản để xuất Excel!");
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách biên bản kiểm tra");

      // Tạo dữ liệu Excel
      const excelData = dataToExport.map((proposal, index) => {
        const stats = getProposalStatistics(proposal);
        return {
          STT: index + 1,
          "Mã tờ trình": proposal.proposalCode,
          "Tiêu đề": proposal.title || "",
          "Người tạo": proposal.teamLeadApprover?.fullName || "Chưa xác định",
          "Tổng số phòng": stats.totalRooms,
          "Tổng loại linh kiện": stats.totalComponents,
          "Tổng số lượng": stats.totalQuantity,
          "Trạng thái": "Đã xác minh",
          "Ngày tạo": new Date(proposal.createdAt).toLocaleDateString("vi-VN"),
          "Ngày cập nhật": new Date(proposal.updatedAt).toLocaleDateString(
            "vi-VN"
          ),
        };
      });

      const columnHeaders = [
        "STT",
        "Mã tờ trình",
        "Tiêu đề",
        "Người tạo",
        "Tổng số phòng",
        "Tổng loại linh kiện",
        "Tổng số lượng",
        "Trạng thái",
        "Ngày tạo",
        "Ngày cập nhật",
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
      const fileName = `Danh_sach_bien_ban_kiem_tra_${
        new Date().toISOString().split("T")[0]
      }_${dataToExport.length}_ban_ghi.xlsx`;

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

      // Thông báo thành công với modal
      setExportCount(dataToExport.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất thành công
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setExportError(
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
      setShowExportErrorModal(true);
    }
  };

  // Xử lý checkbox
  const handleSelectItem = (itemId: string) => {
    setSelectedRowKeys((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
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
                  <span>Lập biên bản</span>
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
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách biên bản kiểm tra
            </h1>
            <p className="text-gray-600">
              Danh sách các tờ trình đã được Phòng Quản trị xác minh. Bạn có thể
              lập biên bản kiểm tra cho các tờ trình này.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Export */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Search - 3 columns on desktop, full width on mobile */}
          <div className="sm:col-span-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nhập mã biên bản, tên người tạo..."
              />
            </div>
          </div>

          {/* Export Excel - 1 column on desktop, full width on mobile */}
          <div className="sm:col-span-1 flex justify-end">
            <Button
              onClick={handleExportExcel}
              icon={<Download className="w-3 h-3" />}
              size="middle"
              className={`w-full ${
                selectedRowKeys.length > 0
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                  : ""
              }`}
              type={selectedRowKeys.length > 0 ? "primary" : "default"}>
              <span className="hidden sm:inline">Xuất Excel</span>
              <span className="sm:hidden">Excel</span>
              {selectedRowKeys.length > 0 && ` (${selectedRowKeys.length})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow">
        {/* Table Header */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 ">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Danh sách biên bản ({filteredReports.length})
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

        {!loading && !error && (
          <>
            {filteredReports.length > 0 ? (
              <div className="overflow-x-auto min-h-[500px]">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[5%] px-2 py-3 text-left">
                        <input
                          title="Chọn tất cả biên bản"
                          type="checkbox"
                          checked={
                            selectedRowKeys.length ===
                              paginatedReports.length &&
                            paginatedReports.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              const currentPageKeys = paginatedReports.map(
                                (report) => report.id
                              );
                              setSelectedRowKeys((prev) => [
                                ...prev,
                                ...currentPageKeys,
                              ]);
                            } else {
                              const currentPageKeys = paginatedReports.map(
                                (report) => report.id
                              );
                              setSelectedRowKeys((prev) =>
                                prev.filter(
                                  (key) => !currentPageKeys.includes(key)
                                )
                              );
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <SortableHeader<ReplacementProposal>
                        field="proposalCode"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-[18%] px-2">
                        Mã tờ trình
                      </SortableHeader>
                      <SortableHeader<ReplacementProposal>
                        field="updatedAt"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-[12%] px-2">
                        Ngày lập
                      </SortableHeader>
                      <SortableHeader<ReplacementProposal>
                        field="proposer"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-[15%] px-2">
                        Người tạo
                      </SortableHeader>
                      <SortableHeader<ReplacementProposal>
                        field="itemsCount"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-[25%] px-2">
                        Phòng/Linh kiện
                      </SortableHeader>
                      <SortableHeader<ReplacementProposal>
                        field="status"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="w-[15%] px-2">
                        Trạng thái
                      </SortableHeader>
                      <th className="w-[10%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedReports.map((proposal) => {
                      const stats = getProposalStatistics(proposal);
                      return (
                        <tr key={proposal.id} className="hover:bg-gray-50">
                          <td className="px-2 py-4">
                            <input
                              title="Chọn biên bản này"
                              type="checkbox"
                              checked={selectedRowKeys.includes(proposal.id)}
                              onChange={() => handleSelectItem(proposal.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex items-center">
                              <div className="min-w-0 flex-1">
                                <div
                                  className="text-sm font-medium text-blue-600 truncate cursor-pointer hover:text-blue-800 hover:underline"
                                  onClick={() => handleViewReport(proposal.id)}>
                                  {proposal.proposalCode}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {proposal.title || "Không có tiêu đề"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-sm text-gray-900">
                              {new Date(proposal.updatedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex items-center">
                              <User className="h-3 w-3 text-gray-400 mr-1 flex-shrink-0" />
                              <div className="text-sm text-gray-900 truncate">
                                {proposal.proposer?.fullName || "Chưa xác định"}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Building className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="font-medium">
                                  {stats.totalRooms} phòng
                                </span>
                                <Package className="h-3 w-3 text-gray-400 ml-2 mr-1" />
                                <span>{stats.totalComponents} loại</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {stats.roomsList
                                  .slice(0, 1)
                                  .map((room: string, index: number) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                                      {room.length > 15
                                        ? `${room.substring(0, 15)}...`
                                        : room}
                                    </span>
                                  ))}
                                {stats.roomsList.length > 1 && (
                                  <span className="text-xs text-gray-400">
                                    +{stats.roomsList.length - 1}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                proposal.status
                              )}`}>
                              {getStatusIcon(proposal.status)}
                              <span className="ml-1 truncate">Đã xác minh</span>
                            </span>
                          </td>
                          <td className="px-2 py-4">
                            <button
                              title="Xem chi tiết biên bản"
                              onClick={() => handleViewReport(proposal.id)}
                              className="ml-4 text-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <Eye className="w-3 h-3 mr-1" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có biên bản nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy biên bản nào phù hợp với từ khóa tìm kiếm."
                    : "Chưa có biên bản nào được tạo."}
                </p>
              </div>
            )}
          </>
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
        <div className="px-3 sm:px-6 py-3 sm:py-4 ">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Danh sách biên bản ({filteredReports.length})
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
          <div className="flex items-center justify-center py-12 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Không thể tải dữ liệu. Vui lòng thử lại sau.</span>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && (
          <div className="p-4 space-y-4">
            {paginatedReports.length > 0 ? (
              paginatedReports.map((proposal) => {
                const stats = getProposalStatistics(proposal);
                return (
                  <div
                    key={proposal.id}
                    className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {proposal.proposalCode}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {proposal.title || "Không có tiêu đề"}
                          </p>
                        </div>
                      </div>
                      <input
                        title="Chọn biên bản này"
                        type="checkbox"
                        checked={selectedRowKeys.includes(proposal.id)}
                        onChange={() => handleSelectItem(proposal.id)}
                        className="mt-0.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0"
                      />
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Ngày lập:</span>
                        <p className="font-medium text-gray-900 mt-0.5">
                          {new Date(proposal.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Người tạo:</span>
                        <p className="font-medium text-gray-900 mt-0.5">
                          {proposal.proposer?.fullName || "Chưa xác định"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phòng:</span>
                        <p className="font-medium text-gray-900 mt-0.5">
                          {stats.totalRooms} phòng
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Linh kiện:</span>
                        <p className="font-medium text-gray-900 mt-0.5">
                          {stats.totalComponents} loại
                        </p>
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="flex flex-wrap gap-1">
                      {stats.roomsList
                        .slice(0, 2)
                        .map((room: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {room.length > 20
                              ? `${room.substring(0, 20)}...`
                              : room}
                          </span>
                        ))}
                      {stats.roomsList.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          +{stats.roomsList.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Footer with Status and Action */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          proposal.status
                        )}`}>
                        {getStatusIcon(proposal.status)}
                        <span className="ml-1">Đã xác minh</span>
                      </span>
                      <button
                        onClick={() => handleViewReport(proposal.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có biên bản nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Không tìm thấy biên bản nào phù hợp với từ khóa tìm kiếm."
                    : "Chưa có biên bản nào được tạo."}
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
