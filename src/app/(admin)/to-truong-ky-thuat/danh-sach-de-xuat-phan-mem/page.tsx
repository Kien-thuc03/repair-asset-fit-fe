"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Modal, Input, Select, message } from "antd";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Monitor,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { SoftwareProposal, SoftwareProposalStatus } from "@/types/software";
import { Pagination, SortableHeader } from "@/components/common";
import {
  useSoftwareProposals,
  useUpdateSoftwareProposalStatus,
} from "@/hooks/useSoftwareProposals";
import { useAuth } from "@/contexts/AuthContext";

const { Option } = Select;

// Config cho trạng thái đề xuất
const softwareProposalStatusConfig = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: {
    label: "Chờ duyệt",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: {
    label: "Đã duyệt",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: {
    label: "Đã từ chối",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: "Đã trang bị",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: Monitor,
  },
};

// Helper functions
const getUserName = (proposal: SoftwareProposal): string => {
  return proposal.proposer?.fullName || proposal.proposerId;
};

const getRoomName = (proposal: SoftwareProposal): string => {
  return (
    proposal.room?.name ||
    proposal.room?.roomNumber ||
    `${proposal.room?.building || ""}.${proposal.room?.floor || ""}${
      proposal.room?.roomNumber || ""
    }` ||
    proposal.roomId
  );
};

export default function DanhSachDeXuatPhanMemPage() {
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

  // Update status hook
  const { updateStatus } = useUpdateSoftwareProposalStatus();

  // Query params
  const queryParams = useMemo(() => {
    const mappedSortBy: "createdAt" | "proposalCode" | "status" | undefined =
      sortField === "proposalCode"
        ? "proposalCode"
        : sortField === "createdAt"
        ? "createdAt"
        : sortField === "status"
        ? "status"
        : "createdAt";

    return {
      status: statusFilter || undefined,
      search: searchText || undefined,
      page: 1,
      limit: 1000, // Lấy tối đa để filter ở frontend
      sortBy: mappedSortBy,
      sortOrder: (sortDirection?.toUpperCase() || "DESC") as "ASC" | "DESC",
    };
  }, [searchText, statusFilter, sortField, sortDirection]);

  // Fetch data from API
  const { data: apiData, loading, refetch } = useSoftwareProposals(queryParams);

  // Filter proposals - chỉ lấy các trạng thái liên quan đến duyệt
  const proposals = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    const ALLOWED_STATUSES = [
      SoftwareProposalStatus.CHỜ_DUYỆT,
      SoftwareProposalStatus.ĐÃ_DUYỆT,
      SoftwareProposalStatus.ĐÃ_TỪ_CHỐI,
      SoftwareProposalStatus.ĐÃ_TRANG_BỊ,
    ];

    return apiData.filter((proposal) =>
      ALLOWED_STATUSES.includes(proposal.status)
    );
  }, [apiData]);

  // Handle sorting
  const handleSort = (field: keyof SoftwareProposal) => {
    if (sortField === field) {
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
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply sorting to proposals
  const sortedProposals = [...proposals].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | undefined;
    let bValue: string | undefined;

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

    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === "asc" ? -1 : 1;
    if (!bValue) return sortDirection === "asc" ? 1 : -1;

    if (sortField === "createdAt") {
      const aTime = new Date(aValue).getTime();
      const bTime = new Date(bValue).getTime();
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    }

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

  // Pagination
  const paginatedProposals = sortedProposals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(paginatedProposals.map((item) => item.id));
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

  // Handle approve
  const handleApproveClick = (proposalId: string) => {
    Modal.confirm({
      title: "Xác nhận duyệt đề xuất",
      content: "Bạn có chắc chắn muốn duyệt đề xuất phần mềm này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          await updateStatus(proposalId, {
            status: SoftwareProposalStatus.ĐÃ_DUYỆT,
            approverId: user?.id,
          });
          message.success("Đã duyệt đề xuất phần mềm thành công!");
          refetch();
        } catch (error) {
          console.error("Error approving proposal:", error);
          message.error(
            error instanceof Error ? error.message : "Không thể duyệt đề xuất."
          );
        }
      },
    });
  };

  // Handle reject
  const handleRejectClick = (proposalId: string) => {
    Modal.confirm({
      title: "Xác nhận từ chối đề xuất",
      content: "Bạn có chắc chắn muốn từ chối đề xuất phần mềm này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        try {
          await updateStatus(proposalId, {
            status: SoftwareProposalStatus.ĐÃ_TỪ_CHỐI,
            approverId: user?.id,
          });
          message.success("Đã từ chối đề xuất phần mềm!");
          refetch();
        } catch (error) {
          console.error("Error rejecting proposal:", error);
          message.error(
            error instanceof Error
              ? error.message
              : "Không thể từ chối đề xuất."
          );
        }
      },
    });
  };

  // Navigation
  const handleViewProposal = (proposal: SoftwareProposal) => {
    router.push(
      `/to-truong-ky-thuat/danh-sach-de-xuat-phan-mem/chi-tiet/${proposal.id}`
    );
  };

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

  // Show loading state
  if (loading && proposals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
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
                <span>Danh sách đề xuất phần mềm</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Danh sách đề xuất phần mềm
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Duyệt các đề xuất cài đặt phần mềm từ giảng viên.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Input
            className="col-span-1 sm:col-span-2 lg:col-span-1"
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
            <Option value={SoftwareProposalStatus.ĐÃ_TRANG_BỊ}>
              Đã trang bị
            </Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProposals.length > 0 &&
                      paginatedProposals.every((item) =>
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProposals.map((proposal) => {
                const StatusIcon =
                  softwareProposalStatusConfig[proposal.status].icon;
                const canApprove =
                  proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;
                const canReject =
                  proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;

                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(proposal.id)}
                        onChange={(e) =>
                          handleSelectRow(proposal.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {proposal.proposalCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getUserName(proposal)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getRoomName(proposal)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          softwareProposalStatusConfig[proposal.status].color
                        }`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {softwareProposalStatusConfig[proposal.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          title="Xem chi tiết"
                          onClick={() => handleViewProposal(proposal)}
                          className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <Eye className="h-4 w-4" />
                        </button>
                        {canApprove && (
                          <button
                            onClick={() => handleApproveClick(proposal.id)}
                            title="Phê duyệt"
                            className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {canReject && (
                          <button
                            onClick={() => handleRejectClick(proposal.id)}
                            title="Từ chối"
                            className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4 p-4">
          {paginatedProposals.map((proposal) => {
            const StatusIcon =
              softwareProposalStatusConfig[proposal.status].icon;
            const canApprove =
              proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;
            const canReject =
              proposal.status === SoftwareProposalStatus.CHỜ_DUYỆT;

            return (
              <div
                key={proposal.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(proposal.id)}
                        onChange={(e) =>
                          handleSelectRow(proposal.id, e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <h3 className="text-sm font-semibold text-blue-600">
                        {proposal.proposalCode}
                      </h3>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <User className="h-3 w-3 mr-1" />
                        {getUserName(proposal)}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Building className="h-3 w-3 mr-1" />
                        {getRoomName(proposal)}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      softwareProposalStatusConfig[proposal.status].color
                    }`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {softwareProposalStatusConfig[proposal.status].label}
                  </span>
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleViewProposal(proposal)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Eye className="w-3 h-3 mr-1" />
                    Chi tiết
                  </button>
                  {canApprove && (
                    <button
                      onClick={() => handleApproveClick(proposal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Duyệt
                    </button>
                  )}
                  {canReject && (
                    <button
                      onClick={() => handleRejectClick(proposal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                      <XCircle className="w-3 h-3 mr-1" />
                      Từ chối
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {sortedProposals.length === 0 && !loading && (
          <div className="text-center py-12 px-4">
            <Monitor className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có đề xuất nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Chưa có đề xuất phần mềm nào cần duyệt.
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
      </div>
    </div>
  );
}
