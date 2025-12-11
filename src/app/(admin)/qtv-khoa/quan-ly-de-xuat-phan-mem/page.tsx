'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Eye, 
  Monitor,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Breadcrumb, Input, Select } from 'antd';
import { SoftwareProposal, SoftwareProposalStatus } from '@/types/software';
import { Pagination, SortableHeader } from '@/components/common';
import { useSoftwareProposals } from '@/hooks/useSoftwareProposals';
import { SOFTWARE_PROPOSAL_STATUS_CONFIG } from '@/lib/constants';

const { Option } = Select;

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

export default function QtvKhoaSoftwareProposalsPage() {
  const router = useRouter();
  
  // State
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<SoftwareProposalStatus | ''>('');
  const [sortField, setSortField] = useState<keyof SoftwareProposal | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
  const { data: apiData, loading } = useSoftwareProposals(queryParams);

  // Filter proposals
  const proposals = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    const ALLOWED_STATUSES = [
      SoftwareProposalStatus.CHỜ_DUYỆT,
      SoftwareProposalStatus.ĐÃ_DUYỆT,
      SoftwareProposalStatus.ĐÃ_TỪ_CHỐI,
      SoftwareProposalStatus.ĐANG_TRANG_BỊ,
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

  // Navigation handlers
  const handleViewProposal = (proposal: SoftwareProposal) => {
    router.push(`/qtv-khoa/quan-ly-de-xuat-phan-mem/chi-tiet/${proposal.id}`);
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Stats
  const stats = {
    total: proposals?.length || 0,
    pending: proposals?.filter(p => p.status === SoftwareProposalStatus.CHỜ_DUYỆT).length || 0,
    approved: proposals?.filter(p => p.status === SoftwareProposalStatus.ĐÃ_DUYỆT).length || 0,
    equipped: proposals?.filter(p => p.status === SoftwareProposalStatus.ĐÃ_TRANG_BỊ).length || 0,
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
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/qtv-khoa',
            title: (
              <div className="flex items-center">
                <span>Trang chủ</span>
              </div>
            ),
          },
          {
            title: (
              <div className="flex items-center">
                <span>Quản lý đề xuất phần mềm</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mt-2 mb-4">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý đề xuất phần mềm
            </h1>
            <p className="text-gray-600">
              Theo dõi các đề xuất cài đặt phần mềm từ giảng viên và kỹ thuật viên.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Monitor className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng đề xuất
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chờ duyệt
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pending}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đã duyệt
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.approved}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Monitor className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đã trang bị
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.equipped}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow space-y-3 sm:space-y-4 mb-4">
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
            <Option value={SoftwareProposalStatus.ĐANG_TRANG_BỊ}>
              Đang trang bị
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
                const statusConfig = SOFTWARE_PROPOSAL_STATUS_CONFIG[proposal.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="py-4 whitespace-nowrap text-left">
                      <div
                        className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                        onClick={() => handleViewProposal(proposal)}>
                        {proposal.proposalCode}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {getUserName(proposal)}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {getRoomName(proposal)}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          statusConfig.color
                        }`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        title="Xem chi tiết"
                        onClick={() => handleViewProposal(proposal)}
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye className="h-4 w-4" />
                      </button>
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
            const statusConfig = SOFTWARE_PROPOSAL_STATUS_CONFIG[proposal.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={proposal.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
                        onClick={() => handleViewProposal(proposal)}>
                      {proposal.proposalCode}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        {getUserName(proposal)}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        {getRoomName(proposal)}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        {new Date(proposal.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      statusConfig.color
                    }`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleViewProposal(proposal)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Eye className="w-3 h-3 mr-1" />
                    Chi tiết
                  </button>
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
      </div>
    </div>
  );
}