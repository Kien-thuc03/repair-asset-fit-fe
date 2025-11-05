"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  Input,
  Select,
  DatePicker,
  Button,
  Modal,
  Spin,
} from "antd";
import type { Dayjs } from "dayjs";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { repairRequestStatusConfig } from "@/lib/mockData/repairRequests";
import { RepairStatus, RepairRequest } from "@/types";
import { Pagination } from "@/components/ui";
import { useRepairs } from "@/hooks/useRepairs";
import type { GetRepairsQueryParams } from "@/lib/api/repairs";

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
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<RepairStatus | "">("");
  const [dateRange, setDateRange] = useState<RangeValue>(null);
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Fetch data from API
  const {
    data: apiData,
    meta,
    loading,
    error,
    updateParams,
  } = useRepairs({
    page: currentPage,
    limit: pageSize,
    sortBy: (sortField || undefined) as GetRepairsQueryParams["sortBy"],
    sortOrder:
      sortDirection === "asc"
        ? "ASC"
        : sortDirection === "desc"
        ? "DESC"
        : undefined,
    search: searchText || undefined,
    status: statusFilter || undefined,
    fromDate: dateRange?.[0]?.toISOString(),
    toDate: dateRange?.[1]?.toISOString(),
  });

  // Export modal states
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportFileName, setExportFileName] = useState("");

  // Update API params when filters change
  useEffect(() => {
    updateParams({
      page: currentPage,
      limit: pageSize,
      sortBy: (sortField || undefined) as GetRepairsQueryParams["sortBy"],
      sortOrder:
        sortDirection === "asc"
          ? "ASC"
          : sortDirection === "desc"
          ? "DESC"
          : undefined,
      search: searchText || undefined,
      status: statusFilter || undefined,
      fromDate: dateRange?.[0]?.toISOString(),
      toDate: dateRange?.[1]?.toISOString(),
    });
  }, [
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    searchText,
    statusFilter,
    dateRange,
    updateParams,
  ]);

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
      const currentPageKeys = paginatedData.map(
        (row: { id: string }) => row.id
      );
      setSelectedRowKeys((prev) => [...prev, ...currentPageKeys]);
    } else {
      const currentPageKeys = paginatedData.map(
        (row: { id: string }) => row.id
      );
      setSelectedRowKeys((prev) =>
        prev.filter((key) => !currentPageKeys.includes(key))
      );
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = apiData.filter((item: { id: string }) =>
      selectedRowKeys.includes(item.id)
    );

    if (selectedData.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import("xlsx");

      // Tạo dữ liệu Excel
      const excelData = selectedData.map(
        (item: RepairRequest, index: number) => ({
          STT: index + 1,
          "Mã yêu cầu": item.requestCode,
          "Tên tài sản": item.assetName || "Chưa xác định",
          "Mã tài sản": item.assetCode || "Chưa xác định",
          "Linh kiện": item.componentName || "Chưa xác định",
          "Vị trí": `${item.buildingName || "Chưa xác định"} - ${
            item.roomName || "Chưa xác định"
          }`,
          Máy: `Máy ${item.machineLabel || "Chưa xác định"}`,
          "Người báo": item.reporterName || "Chưa xác định",
          "Loại lỗi": item.errorTypeName || "Chưa xác định",
          "Mô tả lỗi": item.description || "",
          "Trạng thái":
            repairRequestStatusConfig[
              item.status as keyof typeof repairRequestStatusConfig
            ].label,
          "Ngày báo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
        })
      );

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách báo lỗi");

      // Xuất file
      const fileName = `danh-sach-bao-loi-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

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

  // Data từ API đã được lọc và phân trang ở backend
  const paginatedData = apiData;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
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
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          Danh sách báo lỗi
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Theo dõi và quản lý các báo cáo lỗi từ giảng viên và kỹ thuật viên.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Input
            className="col-span-1 sm:col-span-2 lg:col-span-2"
            placeholder="Tìm kiếm..."
            prefix={<Search className="w-4 h-4" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="middle"
          />

          <Select
            placeholder="Chọn trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            size="middle"
            className="w-full">
            <Option value="">Tất cả trạng thái</Option>
            <Option value={RepairStatus.CHỜ_TIẾP_NHẬN}>Chờ tiếp nhận</Option>
            <Option value={RepairStatus.ĐÃ_TIẾP_NHẬN}>Đã tiếp nhận</Option>
            <Option value={RepairStatus.ĐANG_XỬ_LÝ}>Đang xử lý</Option>
            <Option value={RepairStatus.CHỜ_THAY_THẾ}>Chờ thay thế</Option>
            <Option value={RepairStatus.ĐÃ_HOÀN_THÀNH}>Đã hoàn thành</Option>
            <Option value={RepairStatus.ĐÃ_HỦY}>Đã hủy</Option>
          </Select>

          <RangePicker
            placeholder={["Từ ngày", "Đến ngày"]}
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={setDateRange}
            size="middle"
            className="w-full"
          />

          <Button
            type="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportExcel}
            disabled={selectedRowKeys.length === 0}
            size="middle"
            className="w-full"
            style={{
              backgroundColor:
                selectedRowKeys.length > 0 ? "#16a34a" : undefined,
              borderColor: selectedRowKeys.length > 0 ? "#16a34a" : undefined,
            }}>
            <span className="hidden sm:inline">
              Xuất Excel{" "}
              {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
            </span>
            <span className="sm:hidden">
              Xuất {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
            </span>
          </Button>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="bg-white shadow rounded-lg hidden lg:block">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách báo lỗi ({meta.total})
          </h2>
        </div>
        <div className="min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center py-12">
              <XCircle className="h-12 w-12 text-red-300 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Có lỗi xảy ra
              </h3>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-12">
              <Search className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Không tìm thấy kết quả
              </h3>
              <p className="text-xs text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          ) : (
            <table className="w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                    <div className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={
                          paginatedData.length > 0 &&
                          paginatedData.every((row: { id: string }) =>
                            selectedRowKeys.includes(row.id)
                          )
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        aria-label="Chọn tất cả báo lỗi"
                      />
                      <span className="hidden xl:inline">STT</span>
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[10%]"
                    onClick={() => handleSort("requestCode")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Mã YC</span>
                      {getSortIcon("requestCode")}
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[15%]"
                    onClick={() => handleSort("assetName")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Tài sản</span>
                      {getSortIcon("assetName")}
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[13%]"
                    onClick={() => handleSort("location")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Vị trí</span>
                      {getSortIcon("location")}
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[12%]"
                    onClick={() => handleSort("reporterName")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Người báo</span>
                      {getSortIcon("reporterName")}
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[13%]"
                    onClick={() => handleSort("errorTypeName")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Loại lỗi</span>
                      {getSortIcon("errorTypeName")}
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[12%]"
                    onClick={() => handleSort("status")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Trạng thái</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group w-[10%]"
                    onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center uppercase space-x-1">
                      <span>Ngày báo</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th className="px-2 py-3 text-center text-xs uppercase font-medium text-gray-500 tracking-wider w-[10%]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((record: RepairRequest, index: number) => {
                  const config =
                    repairRequestStatusConfig[
                      record.status as keyof typeof repairRequestStatusConfig
                    ];
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 flex-shrink-0"
                            checked={selectedRowKeys.includes(record.id)}
                            onChange={(e) =>
                              handleRowSelect(record.id, e.target.checked)
                            }
                            aria-label={`Chọn báo lỗi ${record.requestCode}`}
                          />
                          <span className="hidden xl:inline">
                            {(currentPage - 1) * pageSize + index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm font-medium text-blue-600">
                        <div className="truncate" title={record.requestCode}>
                          {record.requestCode}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <div
                          className="font-medium truncate"
                          title={record.assetName || "Chưa xác định"}>
                          {record.assetName || "Chưa xác định"}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <div>
                          <div
                            className="font-medium truncate"
                            title={record.buildingName || "Chưa xác định"}>
                            {record.buildingName || "Chưa xác định"}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate"
                            title={`${
                              record.roomName || "Chưa xác định"
                            } - Máy ${record.machineLabel || "N/A"}`}>
                            {record.roomName || "Chưa xác định"} - M
                            {record.machineLabel || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <div
                          className="truncate"
                          title={record.reporterName || "Chưa xác định"}>
                          {record.reporterName || "Chưa xác định"}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <div
                          className="truncate"
                          title={record.errorTypeName || "Chưa xác định"}>
                          {record.errorTypeName || "Chưa xác định"}
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${config.color} truncate max-w-full`}
                          title={config.label}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-700">
                        <div
                          className="truncate"
                          title={new Date(record.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}>
                          {new Date(record.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <Link
                          href={`/to-truong-ky-thuat/danh-sach-bao-loi/chi-tiet?id=${record.id}`}>
                          <button
                            title="Xem chi tiết"
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden bg-white shadow rounded-lg">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">
            Danh sách báo lỗi ({meta.total})
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center py-12">
              <XCircle className="h-12 w-12 text-red-300 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Có lỗi xảy ra
              </h3>
              <p className="text-xs text-gray-500">{error}</p>
            </div>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((record: RepairRequest) => {
              const config =
                repairRequestStatusConfig[
                  record.status as keyof typeof repairRequestStatusConfig
                ];
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
                    </div>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 flex-shrink-0 mt-1"
                      checked={selectedRowKeys.includes(record.id)}
                      onChange={(e) =>
                        handleRowSelect(record.id, e.target.checked)
                      }
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
                          {record.roomName || "N/A"} - M
                          {record.machineLabel || "N/A"}
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="text-gray-500 mb-0.5">Người báo</div>
                        <div className="text-sm text-gray-900 font-medium">
                          {record.reporterName || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-start text-xs">
                      <div className="flex-1">
                        <div className="text-gray-500 mb-0.5">Loại lỗi</div>
                        <div className="text-sm text-gray-900">
                          {record.errorTypeName || "N/A"}
                        </div>
                      </div>
                      <div className="flex-1 text-right">
                        <div className="text-gray-500 mb-0.5">Ngày báo</div>
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
                      href={`/to-truong-ky-thuat/danh-sach-bao-loi/chi-tiet?id=${record.id}`}>
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
      </div>

      {/* Pagination */}
      <div className="mt-4 sm:mt-6">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={meta.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
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
        width={400}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Xuất Excel thành công!
            </h3>
            <p className="text-sm text-gray-500">
              Đã xuất {exportCount} báo lỗi ra file {exportFileName} thành công.
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
              Không có dữ liệu để xuất hoặc có lỗi xảy ra. Vui lòng chọn ít nhất
              một báo lỗi và thử lại.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
