"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  FileText,
  ChevronUp,
  ChevronDown,
  Download,
  CheckSquare,
  Square,
  X,
} from "lucide-react";

import { Breadcrumb, Modal, Row, Col, Input, Button } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { useReplacementProposals } from "@/hooks/useReplacementProposals";
import { ReplacementProposalStatus } from "@/types";

export default function LapToTrinhPage() {
  const router = useRouter();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection states
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Export modals state
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");

  // Memoize query params
  const queryParams = useMemo(() => {
    const mapSortFieldToAPI = (
      field: string
    ): "createdAt" | "updatedAt" | "proposalCode" | "status" | null => {
      const fieldMap: Record<
        string,
        "createdAt" | "updatedAt" | "proposalCode" | "status" | null
      > = {
        proposalCode: "proposalCode",
        status: "status",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        title: null,
        createdBy: null,
      };
      return fieldMap[field] ?? null;
    };

    const mappedSortBy =
      sortField && mapSortFieldToAPI(sortField)
        ? mapSortFieldToAPI(sortField)!
        : "createdAt";

    return {
      status: ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH,
      search: searchTerm || undefined,
      page: currentPage,
      limit: pageSize,
      sortBy: mappedSortBy,
      sortOrder: sortDirection.toUpperCase() as "ASC" | "DESC",
    };
  }, [searchTerm, currentPage, pageSize, sortField, sortDirection]);

  // Fetch data from API
  const {
    data: apiData,
    loading,
    error,
  } = useReplacementProposals(queryParams);

  // Transform API data
  const proposals = useMemo(() => {
    if (!apiData?.data) return [];
    return apiData.data;
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

  // Client-side filtering (API already filters by status)
  const filteredProposals = useMemo(() => {
    // API data is already filtered by ĐÃ_LẬP_TỜ_TRÌNH status
    // Just return as is since we're using server-side filtering
    return proposals;
  }, [proposals]);

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

  // Hàm hiển thị icon sắp xếp
  const getSortIcon = (field: string) => {
    return (
      <div className="flex flex-col ml-1">
        <ChevronUp
          className={`h-3 w-3 ${
            sortField === field && sortDirection === "asc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortField === field && sortDirection === "desc"
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "bg-yellow-100 text-yellow-800";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "bg-blue-100 text-blue-800";
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "bg-cyan-100 text-cyan-800";
      case ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "bg-indigo-100 text-indigo-800";
      case ReplacementProposalStatus.ĐÃ_DUYỆT:
        return "bg-green-100 text-green-800";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI:
        return "bg-red-100 text-red-800";
      case ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN:
        return "bg-purple-100 text-purple-800";
      case ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN:
        return "bg-teal-100 text-teal-800";
      case ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT:
        return "Chờ duyệt";
      case ReplacementProposalStatus.CHỜ_XÁC_MINH:
        return "Chờ xác minh";
      case ReplacementProposalStatus.ĐÃ_XÁC_MINH:
        return "Đã xác minh";
      case ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH:
        return "Đã lập tờ trình";
      case ReplacementProposalStatus.ĐÃ_DUYỆT:
        return "Đã duyệt";
      case ReplacementProposalStatus.ĐÃ_TỪ_CHỐI:
        return "Từ chối";
      case ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN:
        return "Đã gửi biên bản";
      case ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN:
        return "Đã ký biên bản";
      case ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM:
        return "Đã mua sắm";
      default:
        return status;
    }
  };

  // Pagination logic - API handles pagination
  const paginatedData = filteredProposals;
  const totalFiltered = apiData?.total || 0;

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(
        paginatedData.map((proposal) => proposal.id.toString())
      );
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, itemId]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Hàm xuất Excel với modal thông báo Ant Design
  const handleExportExcel = async () => {
    const selectedData = paginatedData.filter((item) =>
      selectedRowKeys.includes(item.id.toString())
    );

    if (selectedData.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách đề xuất lập tờ trình");

      // Tạo dữ liệu Excel
      const excelData = selectedData.map((item, index) => ({
        STT: index + 1,
        "Mã đề xuất": item.proposalCode,
        "Tiêu đề": item.title || "Chưa xác định",
        "Mô tả": item.description || "",
        "Người tạo": item.proposer?.fullName || "Chưa xác định",
        "Số linh kiện": item.itemsCount || item.items?.length || 0,
        "Trạng thái": getStatusText(item.status),
        "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
        "Ngày cập nhật": new Date(item.updatedAt).toLocaleDateString("vi-VN"),
      }));

      const columnHeaders = [
        "STT",
        "Mã đề xuất",
        "Tiêu đề",
        "Mô tả",
        "Người tạo",
        "Số linh kiện",
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
      cell4.value = "DANH SÁCH ĐỀ XUẤT ĐÃ LẬP TỜ TRÌNH";
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
      const fileName = `danh-sach-de-xuat-lap-to-trinh-${
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

      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  // Reset pagination when changing search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRowKeys([]);
  }, [searchTerm]);

  return (
    <>
      <div
        className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen"
        style={{ position: "relative", zIndex: 1 }}>
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
                    <span>Danh sách tờ trình</span>
                  </div>
                ),
              },
            ]}
          />
        </div>
        {/* Header */}

        <div className="bg-white shadow rounded-lg p-6 mt-2 mb-4">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Danh sách tờ trình
              </h1>
              <p className="text-gray-600">
                Quản lý các tờ trình đã được lập cho đề xuất thay thế linh kiện
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow mb-4 sm:mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={18} lg={18}>
              <Input
                prefix={<Search className="h-4 w-4 text-gray-400" />}
                placeholder="Tìm theo tiêu đề, mã đề xuất, người tạo, linh kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                size="middle"
              />
            </Col>
            <Col xs={24} sm={24} md={6} lg={6}>
              <Button
                type="primary"
                icon={<Download className="h-4 w-4" />}
                onClick={handleExportExcel}
                disabled={selectedRowKeys.length === 0}
                size="middle"
                className={`w-full ${
                  selectedRowKeys.length > 0
                    ? "bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                    : ""
                }`}
                style={{
                  backgroundColor:
                    selectedRowKeys.length > 0 ? "#16a34a" : undefined,
                  borderColor:
                    selectedRowKeys.length > 0 ? "#16a34a" : undefined,
                }}>
                <span className="hidden sm:inline">
                  Xuất Excel{" "}
                  {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                </span>
                <span className="sm:hidden">
                  Xuất{" "}
                  {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                </span>
              </Button>
            </Col>
          </Row>

          {/* Search Info */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              <span>Đang tìm kiếm: </span>
              <span className="font-medium text-blue-600">
                &quot;{searchTerm}&quot;
              </span>
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4 inline" />
              </button>
            </div>
          )}
        </div>

        {/* Lists Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              Danh sách tờ trình ({totalFiltered})
            </h2>
          </div>

          <div className="flex flex-col min-h-[500px]">
            <div className="flex-1 overflow-auto">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">
                      Lỗi tải dữ liệu
                    </p>
                    <p className="text-gray-500 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Data Display */}
              {!loading && !error && (
                <>
                  {/* Mobile Card View */}
                  <div className="lg:hidden">
                    <div className="p-4 space-y-4">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((request) => (
                          <div
                            key={request.id}
                            className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            {/* Header with icon, title, and checkbox */}
                            <div className="flex items-start gap-3 mb-3">
                              <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                  {request.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  Mã: {request.proposalCode}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleSelectItem(
                                    request.id.toString(),
                                    !selectedRowKeys.includes(
                                      request.id.toString()
                                    )
                                  )
                                }
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                {selectedRowKeys.includes(
                                  request.id.toString()
                                ) ? (
                                  <CheckSquare className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <Square className="h-5 w-5" />
                                )}
                              </button>
                            </div>

                            {/* Info grid */}
                            <div className="space-y-2 mb-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="text-xs text-gray-500 mb-0.5">
                                    Người tạo
                                  </div>
                                  <div className="text-sm text-gray-900 font-medium">
                                    {request.proposer?.fullName ||
                                      "Không xác định"}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs text-gray-500 mb-0.5">
                                    Số linh kiện
                                  </div>
                                  <div className="text-sm text-gray-900 font-medium">
                                    {request.itemsCount ||
                                      request.items?.length ||
                                      0}{" "}
                                    linh kiện
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs text-gray-500 mb-0.5">
                                    Ngày tạo
                                  </div>
                                  <div className="text-sm text-gray-900">
                                    {new Date(
                                      request.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer with status and action */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <span
                                className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                                  request.status
                                )}`}>
                                {getStatusText(request.status)}
                              </span>
                              <button
                                onClick={() => {
                                  router.push(
                                    `/to-truong-ky-thuat/lap-to-trinh/chi-tiet/${request.id}`
                                  );
                                }}
                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                <Eye className="h-4 w-4" />
                                <span>Xem</span>
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            Không tìm thấy kết quả
                          </h3>
                          <p className="text-xs text-gray-500">
                            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Table View - Optimized for full width display */}
                  <div className="hidden lg:block">
                    <table className="w-full divide-y divide-gray-200 table-fixed">
                      <thead className="bg-gray-50 sticky top-0 z-0">
                        <tr>
                          <th className="w-[5%] px-3 py-3 text-left">
                            <button
                              onClick={() =>
                                handleSelectAll(selectedRowKeys.length === 0)
                              }
                              className="text-gray-400 hover:text-gray-600">
                              {selectedRowKeys.length > 0 ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4" />
                              )}
                            </button>
                          </th>
                          <th className="w-[13%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center space-x-1 hover:text-gray-700 uppercase whitespace-nowrap"
                              onClick={() => handleSort("proposalCode")}>
                              <span>Mã đề xuất</span>
                              {getSortIcon("proposalCode")}
                            </button>
                          </th>
                          <th className="w-[25%] px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center space-x-1 hover:text-gray-700 uppercase whitespace-nowrap"
                              onClick={() => handleSort("title")}>
                              <span>Tiêu đề đề xuất</span>
                              {getSortIcon("title")}
                            </button>
                          </th>
                          <th className="w-[8%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                              onClick={() => handleSort("createdBy")}>
                              <span>Người tạo</span>
                              {getSortIcon("createdBy")}
                            </button>
                          </th>
                          <th className="w-[15%] px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                              onClick={() => handleSort("status")}>
                              <span>Trạng thái</span>
                              {getSortIcon("status")}
                            </button>
                          </th>
                          <th className="w-[10%] hidden lg:table-cell px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                              className="flex items-center justify-center space-x-1 hover:text-gray-700 mx-auto uppercase whitespace-nowrap"
                              onClick={() => handleSort("createdAt")}>
                              <span>Ngày tạo</span>
                              {getSortIcon("createdAt")}
                            </button>
                          </th>
                          <th className="w-[18%] lg:w-[18%] px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? (
                          paginatedData.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                              <td className="w-[5%] px-3 py-4">
                                <button
                                  onClick={() =>
                                    handleSelectItem(
                                      request.id.toString(),
                                      !selectedRowKeys.includes(
                                        request.id.toString()
                                      )
                                    )
                                  }
                                  className="text-gray-400 hover:text-gray-600">
                                  {selectedRowKeys.includes(
                                    request.id.toString()
                                  ) ? (
                                    <CheckSquare className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <Square className="h-4 w-4" />
                                  )}
                                </button>
                              </td>
                              <td className="px-2 py-4 whitespace-nowrap w-[13%]">
                                <div
                                  className="text-sm text-blue-600 truncate font-medium cursor-pointer hover:text-blue-800 hover:underline"
                                  title={request.proposalCode}
                                  onClick={() => {
                                    router.push(
                                      `/to-truong-ky-thuat/lap-to-trinh/chi-tiet/${request.id}`
                                    );
                                  }}>
                                  {request.proposalCode}
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap w-[25%]">
                                <div className="flex items-center min-w-0">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className="text-sm font-medium text-gray-900 truncate"
                                      title={request.title}>
                                      {request.title}
                                    </div>
                                    <div
                                      className="text-xs text-gray-500 truncate"
                                      title={request.description}>
                                      {request.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-2 py-4 whitespace-nowrap text-center w-[8%]">
                                <div
                                  className="text-sm text-gray-900 "
                                  title={
                                    request.proposer?.fullName ||
                                    "Không xác định"
                                  }>
                                  {request.proposer?.fullName || "N/A"}
                                </div>
                              </td>
                              <td className="px-2 py-4 whitespace-nowrap text-center w-[15%]">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusBadge(
                                    request.status
                                  )}`}
                                  title={getStatusText(request.status)}>
                                  {getStatusText(request.status)}
                                </span>
                              </td>
                              <td className="hidden lg:table-cell px-2 py-4 whitespace-nowrap text-center w-[10%]">
                                <div className="text-sm text-gray-900">
                                  {new Date(
                                    request.createdAt
                                  ).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap w-[18%]">
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    onClick={() => {
                                      router.push(
                                        `/to-truong-ky-thuat/lap-to-trinh/chi-tiet/${request.id}`
                                      );
                                    }}
                                    className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    title="Xem chi tiết">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                              <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                              <h3 className="text-sm font-medium text-gray-900 mb-1">
                                Không tìm thấy kết quả
                              </h3>
                              <p className="text-xs text-gray-500">
                                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                              </p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalFiltered}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>

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
          width="90%"
          style={{ maxWidth: "400px" }}>
          <div className="flex items-start sm:items-center space-x-3">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Xuất Excel thành công!
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Đã xuất {exportCount} đề xuất ra file {exportFileName} thành
                công.
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
          width="90%"
          style={{ maxWidth: "400px" }}>
          <div className="flex items-start sm:items-center space-x-3">
            <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                Không thể xuất Excel
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Vui lòng chọn ít nhất một đề xuất để xuất Excel hoặc có lỗi xảy
                ra. Vui lòng thử lại.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
