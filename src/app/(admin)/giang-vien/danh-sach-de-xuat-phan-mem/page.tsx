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
      const XLSX = await import("xlsx");

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

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột tự động
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 20 }, // Mã đề xuất
        { wch: 25 }, // Người đề xuất
        { wch: 15 }, // Phòng
        { wch: 40 }, // Lý do đề xuất
        { wch: 15 }, // Trạng thái
        { wch: 15 }, // Ngày tạo
        { wch: 15 }, // Ngày cập nhật
      ];
      ws["!cols"] = colWidths;

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách đề xuất phần mềm");

      // Xuất file
      const fileName = `danh-sach-de-xuat-phan-mem-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

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
