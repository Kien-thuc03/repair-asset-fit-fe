"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { Breadcrumb } from "antd";
import { SoftwareProposal, SoftwareProposalStatus } from "@/types/software";
import {
  mockSoftwareProposals,
  getSoftwareProposalsByStatus,
} from "@/lib/mockData/softwareProposals";
import { Pagination } from "@/components/common";


// Mock users và rooms data để hiển thị tên
const mockUsers = {
  "user-5": "Giảng viên",
  "user-6": "Giảng viên kiêm QTV",
  "user-1": "QTV Khoa",
} as const;

const mockRooms = {
  ROOM001: "H101",
  ROOM002: "H102",
  ROOM003: "H103",
  ROOM004: "H201",
  ROOM005: "H202",
} as const;

// Helper functions
const getUserName = (userId: string): string => {
  return (mockUsers as Record<string, string>)[userId] || userId;
};

const getRoomName = (roomId: string): string => {
  return (mockRooms as Record<string, string>)[roomId] || roomId;
};

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

export default function SoftwareProposalsPage() {
  const router = useRouter();

  // State
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedData = useMemo(() => {
    setCurrentPage(1);

    // Lọc dữ liệu
    const filtered = mockSoftwareProposals.filter(
      (proposal: SoftwareProposal) => {
        const matchesSearch = searchText
          ? [
              proposal.proposalCode,
              proposal.reason,
              getUserName(proposal.proposerId),
              getRoomName(proposal.roomId),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          : true;

      

        return matchesSearch ;
      }
    );

    return filtered;
  }, [searchText]);

  // Dữ liệu phân trang
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Navigation handlers
  const handleViewProposal = (proposal: SoftwareProposal) => {
    router.push(
      `/giang-vien/danh-sach-de-xuat-phan-mem/chi-tiet/${proposal.id}`
    );
  };

  // Stats
  const stats = {
    total: mockSoftwareProposals.length,
    pending: getSoftwareProposalsByStatus(SoftwareProposalStatus.CHỜ_DUYỆT)
      .length,
    approved: getSoftwareProposalsByStatus(SoftwareProposalStatus.ĐÃ_DUYỆT)
      .length,
    equipped: getSoftwareProposalsByStatus(SoftwareProposalStatus.ĐÃ_TRANG_BỊ)
      .length,
  };

  return (
    <div className="space-y-6">
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
                <span>Theo dõi tiến độ phần mềm</span>
              </div>
            ),
          },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Monitor className="h-6 w-6 text-blue-600" />
          Theo dõi tiến độ phần mềm
        </h1>
        <p className="mt-2 text-gray-600">
          Theo dõi tiến độ xử lý các đề xuất cài đặt phần mềm.
        </p>
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
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className=" gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm đề xuất phần mềm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập mã đề xuất, lý do, người đề xuất..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đề xuất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người đề xuất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((proposal) => {
                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {proposal.proposalCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getUserName(proposal.proposerId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getRoomName(proposal.roomId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          softwareProposalStatusConfig[proposal.status].color
                        }`}>                     
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        title="Xem chi tiết"
                        onClick={() => handleViewProposal(proposal)}
                        className="inline-flex items-center justify-center p-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Eye className="h-4 w-4 items-center" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="text-center py-12">
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
  );
}
