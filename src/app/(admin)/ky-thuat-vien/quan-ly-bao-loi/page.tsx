"use client";

import { useState, useMemo } from "react";
import {
  Breadcrumb,
  Input,
  Select,
  DatePicker,
  Button,
  Spin,
  Alert,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  Download,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { repairRequestStatusConfig } from "@/lib/constants/repairStatus";
import { RepairStatus, RepairRequest } from "@/types";
import { Pagination } from "@/components/common";
import { useProfile } from "@/hooks/useProfile";
import { useRepairsByTechnician } from "@/hooks/useRepairsByTechnician";
import {
  ExportExcelSuccessModal,
  ExportExcelErrorModal,
} from "@/components/modal";

const { RangePicker } = DatePicker;
const { Option } = Select;

type SortField =
  | "requestCode"
  | "assetName"
  | "location"
  | "reporterName"
  | "errorTypeName"
  | "status"
  | "createdAt";
type SortDirection = "asc" | "desc" | "none";
type RangeValue = [Dayjs | null, Dayjs | null] | null;

export default function DanhSachBaoLoiPage() {
  // Hooks để lấy dữ liệu từ API
  const { userDetails, isLoading: profileLoading } = useProfile();
  const {
    repairs,
    loading: repairsLoading,
    error: repairsError,
  } = useRepairsByTechnician(userDetails?.id);

  // State cho filters và UI
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<RepairStatus | "">("");
  const [dateRange, setDateRange] = useState<RangeValue>(null);
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Export modal states
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");
  const [exportError, setExportError] = useState("");

  // Tổng trạng thái loading
  const isLoading = profileLoading || repairsLoading;

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: SortField) => {
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

  // Hàm lấy icon sắp xếp
  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-300"
          }`}
        />
      </div>
    );
  };

  // Hàm xử lý chọn hàng
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

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = filteredAndSortedData.filter((item) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
      setExportError("Vui lòng chọn ít nhất một báo lỗi để xuất Excel!");
      setShowExportErrorModal(true);
      return;
    }

    try {
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách báo lỗi");

      const excelData = selectedData.map((item, index) => ({
        STT: index + 1,
        "Mã yêu cầu": item.requestCode,
        "Tên tài sản": item.assetName || "Chưa xác định",
        "Mã tài sản": item.ktCode || "Chưa xác định",
        "Linh kiện": item.componentName || "Chưa xác định",
        "Vị trí": `${item.buildingName || "Chưa xác định"} - ${
          item.roomName || "Chưa xác định"
        }`,
        Máy: `Máy ${item.machineLabel || "Chưa xác định"}`,
        "Người báo": item.reporterName || "Chưa xác định",
        "Loại lỗi": item.errorTypeName || "Chưa xác định",
        "Mô tả lỗi": item.description || "",
        "Trạng thái": repairRequestStatusConfig[item.status].label,
        "Ngày báo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
      }));

      const columnHeaders = [
        "STT",
        "Mã yêu cầu",
        "Tên tài sản",
        "Mã tài sản",
        "Linh kiện",
        "Vị trí",
        "Máy",
        "Người báo",
        "Loại lỗi",
        "Mô tả lỗi",
        "Trạng thái",
        "Ngày báo",
      ];

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

      const row1 = worksheet.getRow(currentRow);
      const cell1 = row1.getCell(1);
      cell1.value = "TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP HỒ CHÍ MINH";
      cell1.font = { name: "Arial", size: 9 };
      cell1.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      const row2 = worksheet.getRow(currentRow);
      const cell2 = row2.getCell(1);
      cell2.value =
        "Địa chỉ : 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP Hồ Chí Minh";
      cell2.font = { name: "Arial", size: 9 };
      cell2.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      currentRow++;

      const row4 = worksheet.getRow(currentRow);
      const cell4 = row4.getCell(1);
      cell4.value = "DANH SÁCH BÁO HỎNG THIẾT BỊ";
      cell4.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "FFFF0000" },
      };
      cell4.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      const row5 = worksheet.getRow(currentRow);
      const cell5 = row5.getCell(1);
      cell5.value = "KHOA CÔNG NGHỆ THÔNG TIN";
      cell5.font = { name: "Arial", size: 9 };
      cell5.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      const row6 = worksheet.getRow(currentRow);
      const cell6 = row6.getCell(1);
      cell6.value = `NĂM ${new Date().getFullYear()}`;
      cell6.font = { name: "Arial", size: 9 };
      cell6.alignment = { horizontal: "center", vertical: "middle" };
      worksheet.mergeCells(currentRow, 1, currentRow, columnHeaders.length);
      currentRow++;

      currentRow++;

      // Thông tin người lập và thời gian xuất (góc trái dưới năm)
      const infoRow2 = worksheet.getRow(currentRow);
      const infoCell3 = infoRow2.getCell(1);
      const now = new Date();
      infoCell3.value = `Người lập: ${
        userDetails?.fullName || "N/A"
      }     |     Thời gian xuất: ${now.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`;
      infoCell3.font = { name: "Arial", size: 9 };
      infoCell3.alignment = { horizontal: "left", vertical: "middle" };
      currentRow++;

      currentRow++;

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

      currentRow++;

      const dateRow = worksheet.getRow(currentRow);
      const dateCell = dateRow.getCell(columnHeaders.length);
      dateCell.value = dateStr;
      dateCell.font = { name: "Arial", size: 9 };
      dateCell.alignment = { horizontal: "center", vertical: "middle" };
      currentRow++;

      const footerRowExcel = worksheet.getRow(currentRow);
      footerRow.forEach((value, index) => {
        const cell = footerRowExcel.getCell(index + 1);
        cell.value = value;
        cell.font = { name: "Arial", size: 9, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      columnHeaders.forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 20;
      });

      const fileName = `Danh_sach_bao_loi_${
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

      setExportCount(selectedData.length);
      setExportFileName(fileName);
      setShowExportSuccessModal(true);
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setExportError(
        error instanceof Error ? error.message : "Lỗi không xác định"
      );
      setShowExportErrorModal(true);
    }
  };

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedData = useMemo(() => {
    // Reset về trang 1 khi filter thay đổi
    setCurrentPage(1);

    // Lọc dữ liệu từ API
    const filtered = repairs.filter((item: RepairRequest) => {
      const matchesSearch = searchText
        ? [
            item.requestCode,
            item.assetName,
            item.ktCode,
            item.componentName,
            item.errorTypeName,
            item.roomName,
            item.buildingName,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
        : true;

      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      const createdAt = new Date(item.createdAt);
      const matchesDateRange =
        dateRange && dateRange[0] && dateRange[1]
          ? createdAt >= dateRange[0].toDate() &&
            createdAt <= dateRange[1].toDate()
          : true;

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sắp xếp dữ liệu
    if (!sortField || sortDirection === "none") return filtered;

    return [...filtered].sort((a, b) => {
      let aValue: string | Date | number = "";
      let bValue: string | Date | number = "";

      switch (sortField) {
        case "requestCode":
          aValue = a.requestCode;
          bValue = b.requestCode;
          break;
        case "assetName":
          aValue = a.assetName || "";
          bValue = b.assetName || "";
          break;
        case "location":
          aValue = `${a.buildingName || ""} ${a.roomName || ""}`;
          bValue = `${b.buildingName || ""} ${b.roomName || ""}`;
          break;
        case "reporterName":
          aValue = a.reporterName || "";
          bValue = b.reporterName || "";
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
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [repairs, searchText, statusFilter, dateRange, sortField, sortDirection]);

  // Dữ liệu phân trang
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error State */}
      {repairsError && !isLoading && (
        <Alert
          message="Lỗi tải dữ liệu"
          description={repairsError}
          type="error"
          showIcon
          closable
        />
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!repairsError && (
        <>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              {
                href: "/ky-thuat-vien",
                title: (
                  <div className="flex items-center">
                    <span>Trang chủ</span>
                  </div>
                ),
              },
              {
                title: (
                  <div className="flex items-center">
                    <span>Quản lý báo lỗi</span>
                  </div>
                ),
              },
            ]}
          />

          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              Quản lý báo lỗi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Theo dõi và quản lý các báo cáo lỗi từ giảng viên và kỹ thuật
              viên.
            </p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <Input
                className="col-span-1 sm:col-span-2 lg:col-span-2"
                placeholder="Tìm kiếm theo mã, tên tài sản, linh kiện, loại lỗi, vị trí..."
                prefix={<Search className="w-4 h-4" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <Select
                placeholder="Chọn trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                className="w-full">
                <Option value="">Tất cả trạng thái</Option>
                <Option value={RepairStatus.CHỜ_TIẾP_NHẬN}>
                  Chờ tiếp nhận
                </Option>
                <Option value={RepairStatus.ĐÃ_TIẾP_NHẬN}>Đã tiếp nhận</Option>
                <Option value={RepairStatus.ĐANG_XỬ_LÝ}>Đang xử lý</Option>
                <Option value={RepairStatus.CHỜ_THAY_THẾ}>Chờ thay thế</Option>
                <Option value={RepairStatus.ĐÃ_HOÀN_THÀNH}>
                  Đã hoàn thành
                </Option>
                <Option value={RepairStatus.ĐÃ_HỦY}>Đã hủy</Option>
              </Select>

              <RangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={setDateRange}
                className="w-full"
              />

              <Button
                type="primary"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportExcel}
                disabled={selectedRowKeys.length === 0}
                className="w-full sm:w-auto">
                <span className="hidden sm:inline">Xuất Excel </span>
                <span>({selectedRowKeys.length})</span>
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          {isLoading ? (
            <div className="bg-white shadow rounded-lg flex justify-center items-center py-12">
              <Spin size="large" tip="Đang tải danh sách..." />
            </div>
          ) : (
            <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
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
                          aria-label="Chọn tất cả báo lỗi"
                        />
                        <span className="hidden sm:inline">STT</span>
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("requestCode")}>
                      <div className="flex items-center uppercase space-x-1 whitespace-nowrap">
                        <span>Mã YC</span>
                        {getSortIcon("requestCode")}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("assetName")}>
                      <div className="flex items-center uppercase space-x-1 whitespace-nowrap">
                        <span>Tài sản & Linh kiện</span>
                        {getSortIcon("assetName")}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("location")}>
                      <div className="flex items-center uppercase space-x-1 whitespace-nowrap">
                        <span>Vị trí</span>
                        {getSortIcon("location")}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group hidden xl:table-cell"
                      onClick={() => handleSort("errorTypeName")}>
                      <div className="flex items-center uppercase space-x-1 whitespace-nowrap">
                        <span>Loại lỗi</span>
                        {getSortIcon("errorTypeName")}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort("status")}>
                      <div className="flex items-center uppercase space-x-1 whitespace-nowrap">
                        <span>Trạng thái</span>
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group hidden lg:table-cell"
                      onClick={() => handleSort("createdAt")}>
                      <div className="flex items-center uppercase space-x-1 whitespace-nowrap">
                        <span>Ngày báo</span>
                        {getSortIcon("createdAt")}
                      </div>
                    </th>
                    <th className="px-1 py-2 text-center text-xs uppercase font-medium text-gray-500 tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((record, index) => {
                    const config = repairRequestStatusConfig[record.status];
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-sm text-gray-700">
                          <div className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedRowKeys.includes(record.id)}
                              onChange={(e) =>
                                handleRowSelect(record.id, e.target.checked)
                              }
                              aria-label={`Chọn báo lỗi ${record.requestCode}`}
                            />
                            <span className="hidden sm:inline whitespace-nowrap">
                              {(currentPage - 1) * pageSize + index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                          <Link
                            href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.id}`}>
                            <div
                              className="whitespace-nowrap"
                              title={record.requestCode}>
                              {record.requestCode}
                            </div>
                          </Link>
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-700">
                          <div className="min-w-[180px] max-w-[250px]">
                            <div
                              className="font-medium truncate"
                              title={record.assetName || "Chưa xác định"}>
                              {record.assetName || "Chưa xác định"}
                            </div>
                            <div
                              className="text-xs text-gray-500 truncate"
                              title={record.componentName || "Chưa xác định"}>
                              {record.componentName || "Chưa xác định"}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-700">
                          <div className="min-w-[100px] max-w-[140px]">
                            <div
                              className="font-medium truncate"
                              title={`${record.buildingName || "N/A"} - ${
                                record.roomName || "N/A"
                              }`}>
                              {record.buildingName || "N/A"} -{" "}
                              {record.roomName || "N/A"}
                            </div>
                            <div
                              className="text-xs text-gray-500 truncate"
                              title={`Máy ${record.machineLabel || "N/A"}`}>
                              Máy {record.machineLabel || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-700 hidden xl:table-cell">
                          <div
                            className="max-w-[130px] truncate"
                            title={record.errorTypeName || "Chưa xác định"}>
                            {record.errorTypeName || "Chưa xác định"}
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${config.color} whitespace-nowrap`}
                            title={config.label}>
                            <span className="truncate">{config.label}</span>
                          </span>
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-700 hidden lg:table-cell">
                          <div
                            className="whitespace-nowrap"
                            title={new Date(
                              record.createdAt
                            ).toLocaleDateString("vi-VN")}>
                            {new Date(record.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </td>
                        <td className="px-1 py-2 text-center w-10">
                          <Link
                            href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.id}`}>
                            <button
                              title="Xem chi tiết"
                              className="text-blue-600 hover:text-blue-900 inline-flex items-center p-1 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                total={filteredAndSortedData.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                showSizeChanger={true}
                pageSizeOptions={[10, 20, 50, 100]}
                showQuickJumper={true}
                showTotal={true}
              />
            </div>
          )}

          {/* Mobile Card View */}
          {!isLoading && (
            <div className="lg:hidden bg-white shadow rounded-lg">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Danh sách báo lỗi ({filteredAndSortedData.length})
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {repairsError ? (
                  <div className="flex flex-col justify-center items-center py-12">
                    <XCircle className="h-12 w-12 text-red-300 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Có lỗi xảy ra
                    </h3>
                    <p className="text-xs text-gray-500">{repairsError}</p>
                  </div>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((record) => {
                    const config = repairRequestStatusConfig[record.status];
                    return (
                      <div
                        key={record.id}
                        className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-blue-600 mb-1">
                              {record.requestCode}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {record.assetName || "Chưa xác định"}
                            </p>
                            {record.componentName && (
                              <p className="text-xs text-gray-400 mt-1">
                                Linh kiện: {record.componentName}
                              </p>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 flex-shrink-0 mt-1"
                            checked={selectedRowKeys.includes(record.id)}
                            onChange={(e) =>
                              handleRowSelect(record.id, e.target.checked)
                            }
                            aria-label={`Chọn báo lỗi ${record.requestCode}`}
                          />
                        </div>

                        {/* Info grid */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-start text-xs">
                            <div className="flex-1">
                              <div className="text-gray-500 mb-0.5">Vị trí</div>
                              <div className="text-sm text-gray-900 font-medium">
                                {record.buildingName || "N/A"}
                              </div>
                              <div className="text-gray-500">
                                {record.roomName || "N/A"} - Máy{" "}
                                {record.machineLabel || "N/A"}
                              </div>
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-gray-500 mb-0.5">
                                Người báo
                              </div>
                              <div className="text-sm text-gray-900 font-medium">
                                {record.reporterName || "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-start text-xs">
                            <div className="flex-1">
                              <div className="text-gray-500 mb-0.5">
                                Loại lỗi
                              </div>
                              <div className="text-sm text-gray-900">
                                {record.errorTypeName || "N/A"}
                              </div>
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-gray-500 mb-0.5">
                                Ngày báo
                              </div>
                              <div className="text-sm text-gray-900">
                                {new Date(record.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${config.color}`}>
                            {config.label}
                          </span>
                          <Link
                            href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${record.id}`}>
                            <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                              <Eye className="h-4 w-4" />
                              <span>Xem</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })
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

              {/* Pagination for Mobile */}
              <div className="px-4 pb-4">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={filteredAndSortedData.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                  showSizeChanger={true}
                  pageSizeOptions={[10, 20, 50, 100]}
                  showQuickJumper={true}
                  showTotal={true}
                />
              </div>
            </div>
          )}
        </>
      )}

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
