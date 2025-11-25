'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  ChevronUp,
  ChevronDown,
  Download,
  Wrench
} from 'lucide-react';
import { Breadcrumb, Select, DatePicker, Button, Input, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { SoftwareProposal, SoftwareProposalStatus } from '@/types/software';
import { useSoftwareProposalsByTechnician } from '@/hooks/useSoftwareProposals';
import { useAuth } from '@/contexts/AuthContext';
import { Pagination } from '@/components/common';

const { RangePicker } = DatePicker;
const { Option } = Select;

type SortField = "proposalCode" | "reason" | "proposerId" | "roomId" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | "none"

// Helper functions
const getUserName = (proposal: SoftwareProposal): string => {
  return proposal.proposer?.fullName || proposal.proposerId || 'N/A';
};

const getRoomName = (proposal: SoftwareProposal): string => {
  return proposal.room?.name || proposal.roomId || 'N/A';
};

// Config cho trạng thái đề xuất
const softwareProposalStatusConfig = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: {
    label: 'Chờ duyệt',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: Clock
  },
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: {
    label: 'Đã duyệt',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: CheckCircle
  },
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: {
    label: 'Đã từ chối',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: XCircle
  },
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: {
    label: 'Đang trang bị',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: Wrench
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: 'Đã trang bị',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: Monitor
  }
};

export default function SoftwareProposalsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<SoftwareProposalStatus | ''>('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Lấy danh sách đề xuất từ API theo kỹ thuật viên được phân công
  // Endpoint: GET /technicians/:technicianId
  const { data: technicianProposals, loading, error } = useSoftwareProposalsByTechnician(user?.id);

  // Hàm xử lý sắp xếp 3 trạng thái
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection("none")
        setSortField("")
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Hàm lấy icon sắp xếp
  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === "none") {
      return (
        <div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
          <ChevronUp className="h-3 w-3 text-gray-400" />
          <ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
        </div>
      )
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`h-3 w-3 ${sortDirection === "asc" ? "text-blue-600" : "text-gray-300"}`}
        />
        <ChevronDown
          className={`h-3 w-3 -mt-1 ${sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
        />
      </div>
    )
  }

  // Hàm xử lý chọn hàng
  const handleRowSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedRowKeys(prev => [...prev, id])
    } else {
      setSelectedRowKeys(prev => prev.filter(key => key !== id))
    }
  }

  // Hàm xử lý chọn tất cả
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const currentPageKeys = paginatedData.map(row => row.id)
      setSelectedRowKeys(prev => [...prev, ...currentPageKeys])
    } else {
      const currentPageKeys = paginatedData.map(row => row.id)
      setSelectedRowKeys(prev => prev.filter(key => !currentPageKeys.includes(key)))
    }
  }

  // Hàm xuất Excel
  const handleExportExcel = async () => {
    const selectedData = filteredAndSortedData.filter((item) => selectedRowKeys.includes(item.id))
    
    if (selectedData.length === 0) {
      message.warning('Vui lòng chọn ít nhất một đề xuất để xuất Excel')
      return
    }

    try {
      // Dynamic import để tránh lỗi SSR
      const XLSX = await import('xlsx')
      
      // Tạo dữ liệu Excel
      const excelData = selectedData.map((item: SoftwareProposal, index: number) => ({
        'STT': index + 1,
        'Mã đề xuất': item.proposalCode,
        'Lý do đề xuất': item.reason,
        'Người đề xuất': getUserName(item),
        'Phòng': getRoomName(item),
        'Trạng thái': softwareProposalStatusConfig[item.status]?.label || item.status,
        'Ngày tạo': new Date(item.createdAt).toLocaleDateString('vi-VN'),
      }))

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đề xuất phần mềm')

      // Xuất file
      const fileName = `danh-sach-de-xuat-phan-mem-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)

      message.success(`Đã xuất ${selectedData.length} đề xuất ra file ${fileName}`)
      
      // Reset selection sau khi xuất
      setSelectedRowKeys([])
    } catch (error) {
      console.error('Lỗi xuất Excel:', error)
      message.error('Có lỗi xảy ra khi xuất file Excel')
    }
  }

  // Lọc và sắp xếp dữ liệu
  const filteredAndSortedData = useMemo(() => {
    if (!technicianProposals) return [];
    
    // Lọc dữ liệu từ technicianProposals
    const filtered = technicianProposals.filter((proposal: SoftwareProposal) => {
      const matchesSearch = searchText ? 
        [
          proposal.proposalCode, 
          proposal.reason, 
          getUserName(proposal), 
          getRoomName(proposal)
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(searchText.toLowerCase()) : true;

      const matchesStatus = statusFilter ? proposal.status === statusFilter : true;

      const createdAt = new Date(proposal.createdAt);
      const matchesDateRange = dateRange && dateRange[0] && dateRange[1] ? 
        createdAt >= dateRange[0].toDate() && createdAt <= dateRange[1].toDate() : true;

      return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Sắp xếp dữ liệu
    if (!sortField || sortDirection === "none") return filtered;

    return [...filtered].sort((a, b) => {
      let aValue: string | Date | number = ""
      let bValue: string | Date | number = ""

      switch (sortField) {
        case "proposalCode":
          aValue = a.proposalCode
          bValue = b.proposalCode
          break
        case "reason":
          aValue = a.reason
          bValue = b.reason
          break
        case "proposerId":
          aValue = getUserName(a)
          bValue = getUserName(b)
          break
        case "roomId":
          aValue = getRoomName(a)
          bValue = getRoomName(b)
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [technicianProposals, searchText, statusFilter, dateRange, sortField, sortDirection]);

  // Dữ liệu phân trang
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Navigation handlers
  const handleViewProposal = (proposal: SoftwareProposal) => {
    router.push(`/ky-thuat-vien/quan-ly-de-xuat-phan-mem/chi-tiet/${proposal.id}`);
  };

  // Stats - tính toán từ dữ liệu đề xuất của technician
  const stats = useMemo(() => {
    if (!technicianProposals) {
      return { total: 0, approved: 0, equipping: 0, equipped: 0 };
    }
    
    return {
      total: technicianProposals.length,
      approved: technicianProposals.filter(p => p.status === SoftwareProposalStatus.ĐÃ_DUYỆT).length,
      equipping: technicianProposals.filter(p => p.status === SoftwareProposalStatus.ĐANG_TRANG_BỊ).length,
      equipped: technicianProposals.filter(p => p.status === SoftwareProposalStatus.ĐÃ_TRANG_BỊ).length,
    };
  }, [technicianProposals]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/ky-thuat-vien',
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Monitor className="h-6 w-6 text-blue-600" />
          Quản lý đề xuất phần mềm
        </h1>
        <p className="mt-2 text-gray-600">
          Theo dõi và xử lý các đề xuất cài đặt phần mềm từ giảng viên.
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
                <Wrench className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang trang bị
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.equipping}
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            className='col-span-1 md:col-span-2'
            placeholder="Tìm kiếm theo mã đề xuất, lý do, người đề xuất..."
            prefix={<Search className="w-4 h-4" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          
          <Select
            placeholder="Chọn trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
          >
            <Option value="">Tất cả trạng thái</Option>
            <Option value={SoftwareProposalStatus.CHỜ_DUYỆT}>
              Chờ duyệt
            </Option>
            <Option value={SoftwareProposalStatus.ĐÃ_DUYỆT}>
              Đã duyệt
            </Option>
            <Option value={SoftwareProposalStatus.ĐANG_TRANG_BỊ}>
              Đang trang bị
            </Option>
            <Option value={SoftwareProposalStatus.ĐÃ_TRANG_BỊ}>
              Đã trang bị
            </Option>
          </Select>
          
          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            format="DD/MM/YYYY"
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />

          <Button
            type="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportExcel}
            disabled={selectedRowKeys.length === 0}
          >
            Xuất Excel ({selectedRowKeys.length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={paginatedData.length > 0 && paginatedData.every(item => selectedRowKeys.includes(item.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Chọn tất cả đề xuất"
                />
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                onClick={() => handleSort("proposalCode")}
              >
                <div className="flex items-center justify-between uppercase">
                  Mã đề xuất
                  {getSortIcon("proposalCode")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                onClick={() => handleSort("proposerId")}
              >
                <div className="flex items-center justify-between uppercase">
                  Người đề xuất
                  {getSortIcon("proposerId")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                onClick={() => handleSort("roomId")}
              >
                <div className="flex items-center justify-between uppercase">
                  Phòng
                  {getSortIcon("roomId")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center justify-between uppercase">
                  Trạng thái
                  {getSortIcon("status")}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer hover:bg-gray-100 group"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center justify-between uppercase">
                  Ngày tạo
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase font-medium text-gray-500 tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="text-red-600">
                    <p className="font-medium">Có lỗi xảy ra</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((proposal) => {
                const StatusIcon = softwareProposalStatusConfig[proposal.status]?.icon || Monitor;
                return (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRowKeys.includes(proposal.id)}
                      onChange={(e) => handleRowSelect(proposal.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`Chọn đề xuất ${proposal.proposalCode}`}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {proposal.proposalCode}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {getUserName(proposal)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {getRoomName(proposal)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${softwareProposalStatusConfig[proposal.status].color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {softwareProposalStatusConfig[proposal.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {new Date(proposal.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      title='Xem chi tiết'
                      onClick={() => handleViewProposal(proposal)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 focus:outline-none"
                    >
                      <Eye className="h-4 w-4 items-center" />
                    </button>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        {!loading && !error && paginatedData.length === 0 && (
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
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 50, 100]}
          showQuickJumper={true}
          showTotal={true}
        />
      </div>
    </div>
  );
}