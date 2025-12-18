"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Calendar,
  User,
  Building,
  Download,
  CheckCircle,
  XCircle,
  Monitor,
} from "lucide-react";
import { Breadcrumb, Modal, Input, Button, Select } from "antd";
import { SoftwareProposal, SoftwareProposalStatus } from "@/types/software";
import { Pagination, SortableHeader } from "@/components/common";
import SoftwareProposalCards from "@/components/lecturer/softwareProposal/SoftwareProposalCards";
import { useSoftwareProposalsByProposer } from "@/hooks/useSoftwareProposals";
import { useAuth } from "@/contexts/AuthContext";
import { SOFTWARE_PROPOSAL_STATUS_CONFIG } from "@/lib/constants";
import { useProfile } from "@/hooks";

const { Option } = Select;

// Helper functions to get names from nested objects
const getUserName = (proposal: SoftwareProposal): string => {
  return proposal.proposer?.fullName || proposal.proposerId;
};

const getRoomName = (proposal: SoftwareProposal): string => {
  return proposal.room?.name || proposal.room?.roomNumber || proposal.roomId;
};

export default function SoftwareProposalsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userDetails } = useProfile();

  // State
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<SoftwareProposalStatus | "">(
    ""
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<keyof SoftwareProposal | null>(
    null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Export modal states
  const [showExportSuccessModal, setShowExportSuccessModal] = useState(false);
  const [showExportErrorModal, setShowExportErrorModal] = useState(false);
  const [exportCount, setExportCount] = useState(0);

  // Use API hook để lấy dữ liệu theo proposerId
  const { data: apiData, loading } = useSoftwareProposalsByProposer(user?.id);

  const [filteredProposals, setFilteredProposals] = useState<
    SoftwareProposal[]
  >([]);

  // Apply filters to data
  useEffect(() => {
    let filtered = [...apiData];

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(
        (proposal) =>
          proposal.proposalCode
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          proposal.reason?.toLowerCase().includes(searchText.toLowerCase()) ||
          getUserName(proposal)
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          getRoomName(proposal).toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (proposal) => proposal.status === statusFilter
      );
    }

    setFilteredProposals(filtered);

    // Reset selection and page when filter changes
    setSelectedRowKeys([]);
    setCurrentPage(1);
  }, [apiData, searchText, statusFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedRowKeys([]);
  }, [searchText, statusFilter]);

  // Handle sorting
  const handleSort = (field: keyof SoftwareProposal) => {
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

  // Apply sorting to proposals
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | undefined;
    let bValue: string | undefined;

    // Handle nested fields
    switch (sortField) {
      case "proposalCode":
        aValue = a.proposalCode;
        bValue = b.proposalCode;
        break;
      case "proposerId":
        aValue = getUserName(a);
        bValue = getUserName(b);
        break;
      case "roomId":
        aValue = getRoomName(a);
        bValue = getRoomName(b);
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "createdAt":
        aValue = a.createdAt;
        bValue = b.createdAt;
        break;
      default:
        return 0;
    }

    // Handle null/undefined values
    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === "asc" ? -1 : 1;
    if (!bValue) return sortDirection === "asc" ? 1 : -1;

    // Handle date comparison
    if (sortField === "createdAt") {
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

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(
        sortedProposals.map((item: SoftwareProposal) => item.id)
      );
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id));
    }
  };

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = sortedProposals.filter((item: SoftwareProposal) =>
      selectedRowKeys.includes(item.id)
    );

    const itemsToExport =
      selectedData.length > 0 ? selectedData : sortedProposals;

    if (itemsToExport.length === 0) {
      setShowExportErrorModal(true);
      return;
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Danh sách đề xuất phần mềm");

      // Tạo dữ liệu Excel
      const excelData = itemsToExport.map(
        (item: SoftwareProposal, index: number) => ({
          STT: index + 1,
          "Mã đề xuất": item.proposalCode,
          "Người đề xuất": getUserName(item),
          Phòng: getRoomName(item),
          "Lý do đề xuất": item.reason || "",
          "Trạng thái": SOFTWARE_PROPOSAL_STATUS_CONFIG[item.status].label,
          "Ngày tạo": new Date(item.createdAt).toLocaleDateString("vi-VN"),
          "Ngày cập nhật": new Date(item.updatedAt).toLocaleDateString("vi-VN"),
        })
      );

      const columnHeaders = [
        "STT",
        "Mã đề xuất",
        "Người đề xuất",
        "Phòng",
        "Lý do đề xuất",
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
      cell4.value = "DANH SÁCH ĐỀ XUẤT PHẦN MỀM";
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

      // User info row
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

      // Dòng trống
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
      const fileName = `danh-sach-de-xuat-phan-mem-${
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
      setShowExportSuccessModal(true);

      // Reset selection sau khi xuất
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      setShowExportErrorModal(true);
    }
  };

  // Navigation handlers
  const handleViewProposal = (proposal: SoftwareProposal) => {
    router.push(
      `/giang-vien/danh-sach-de-xuat-phan-mem/chi-tiet/${proposal.id}`
    );
  };

  // Page change handler với reset selection
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowKeys([]); // Reset selection when changing page
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    setSelectedRowKeys([]); // Reset selection when changing page size
  };

  // Calculate paginated data for display
  const paginatedProposals = sortedProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Show loading state
  if (loading && apiData.length === 0) {
    return (
      <div className="space-y-6 min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              href: "/giang-vien",
              title: (
                <div className="flex items-center">
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>Danh sách đề xuất phần mềm</span>
                </div>
              ),
            },
          ]}
        />

        {/* Header */}

        <div className="bg-white shadow rounded-lg p-6 mt-2">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Danh sách đề xuất phần mềm
              </h1>
              <p className="text-gray-600">
                Theo dõi tiến độ xử lý các đề xuất cài đặt phần mềm.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: "/giang-vien",
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Danh sách đề xuất phần mềm</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mt-2">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách đề xuất phần mềm
            </h1>
            <p className="text-gray-600">
              Theo dõi tiến độ xử lý các đề xuất cài đặt phần mềm.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Input
            className="col-span-1 sm:col-span-2"
            placeholder="Nhập mã đề xuất, lý do, người đề xuất..."
            prefix={<Search className="w-4 h-4" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
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
            <Option value={SoftwareProposalStatus.CHỜ_DUYỆT}>Chờ duyệt</Option>
            <Option value={SoftwareProposalStatus.ĐÃ_DUYỆT}>Đã duyệt</Option>
            <Option value={SoftwareProposalStatus.ĐÃ_TỪ_CHỐI}>
              Đã từ chối
            </Option>
            <Option value={SoftwareProposalStatus.ĐANG_TRANG_BỊ}>
              Đang trang bị
            </Option>
            <Option value={SoftwareProposalStatus.ĐÃ_TRANG_BỊ}>
              Đã trang bị
            </Option>
          </Select>

          <Button
            type="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportExcel}
            disabled={selectedRowKeys.length === 0}
            size="middle"
            className="w-full">
            <span className="hidden sm:inline">Xuất Excel</span>
            <span className="sm:hidden">Xuất</span> ({selectedRowKeys.length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    title="Chọn tất cả"
                    type="checkbox"
                    checked={
                      paginatedProposals.length > 0 &&
                      paginatedProposals.every((item: SoftwareProposal) =>
                        selectedRowKeys.includes(item.id)
                      )
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <SortableHeader
                  field="proposalCode"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}>
                  Mã đề xuất
                </SortableHeader>
                <SortableHeader
                  field="proposerId"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}>
                  Người đề xuất
                </SortableHeader>
                <SortableHeader
                  field="roomId"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}>
                  Phòng
                </SortableHeader>
                <SortableHeader
                  field="status"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}>
                  Trạng thái
                </SortableHeader>
                <SortableHeader
                  field="createdAt"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}>
                  Ngày tạo
                </SortableHeader>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProposals.map((proposal: SoftwareProposal) => {
                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <input
                        title="Chọn đề xuất"
                        type="checkbox"
                        checked={selectedRowKeys.includes(proposal.id)}
                        onChange={(e) =>
                          handleSelectRow(proposal.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="py-3 sm:py-4 whitespace-nowrap">
                      <div
                        className="text-xs sm:text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                        onClick={() => handleViewProposal(proposal)}>
                        {proposal.proposalCode}
                      </div>
                    </td>
                    <td className=" py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                        <div className="text-xs sm:text-sm text-gray-900">
                          {getUserName(proposal)}
                        </div>
                      </div>
                    </td>
                    <td className=" py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                        <div className="text-xs sm:text-sm text-gray-900">
                          {getRoomName(proposal)}
                        </div>
                      </div>
                    </td>
                    <td className=" py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          SOFTWARE_PROPOSAL_STATUS_CONFIG[proposal.status].color
                        }`}>
                        {SOFTWARE_PROPOSAL_STATUS_CONFIG[proposal.status].label}
                      </span>
                    </td>
                    <td className=" py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs sm:text-sm text-gray-900">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className=" py-3 sm:py-4 whitespace-nowrap text-center">
                      <button
                        title="Xem chi tiết"
                        onClick={() => handleViewProposal(proposal)}
                        className="inline-flex items-center justify-center p-1 sm:p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 items-center" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <SoftwareProposalCards
          proposals={paginatedProposals}
          selectedItems={selectedRowKeys}
          selectAll={
            paginatedProposals.length > 0 &&
            paginatedProposals.every((item: SoftwareProposal) =>
              selectedRowKeys.includes(item.id)
            )
          }
          statusConfig={SOFTWARE_PROPOSAL_STATUS_CONFIG}
          onSelectAll={() => {
            const allSelected =
              paginatedProposals.length > 0 &&
              paginatedProposals.every((item: SoftwareProposal) =>
                selectedRowKeys.includes(item.id)
              );
            handleSelectAll(!allSelected);
          }}
          onSelectItem={(id) => {
            const isSelected = selectedRowKeys.includes(id);
            handleSelectRow(id, !isSelected);
          }}
          onViewDetails={handleViewProposal}
          getUserName={(userId: string) => {
            const proposal = paginatedProposals.find(
              (p) => p.proposerId === userId
            );
            return proposal ? getUserName(proposal) : userId;
          }}
          getRoomName={(roomId: string) => {
            const proposal = paginatedProposals.find(
              (p) => p.roomId === roomId
            );
            return proposal ? getRoomName(proposal) : roomId;
          }}
        />

        {sortedProposals.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12 px-4">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có đề xuất nào
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Chưa có đề xuất phần mềm nào được tạo.
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={sortedProposals.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
        />

        {/* Export Modals */}
        <Modal
          open={showExportSuccessModal}
          onOk={() => setShowExportSuccessModal(false)}
          onCancel={() => setShowExportSuccessModal(false)}
          footer={null}
          closable={true}
          centered>
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <h3 className="text-lg font-semibold mb-2">
              Xuất Excel thành công!
            </h3>
            <p className="text-gray-600">
              Đã xuất {exportCount} đề xuất phần mềm
            </p>
          </div>
        </Modal>

        <Modal
          open={showExportErrorModal}
          onOk={() => setShowExportErrorModal(false)}
          onCancel={() => setShowExportErrorModal(false)}
          footer={null}
          closable={true}
          centered>
          <div className="text-center">
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold mb-2">Lỗi xuất Excel</h3>
            <p className="text-gray-600">
              Vui lòng chọn ít nhất một đề xuất để xuất
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}
