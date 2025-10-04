'use client'

import { useAuth } from '@/contexts/AuthContext'
import { 
  Users, 
  Settings, 
  Activity, 
  Server, 
  ClipboardList,
  FolderCode,
  CheckCircle,
  Clock,
  XCircle,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { users } from '@/lib/mockData/users'
import { mockSoftwareProposals, getSoftwareProposalsByStatus } from '@/lib/mockData/softwareProposals'
import { mockReplacementRequestItem } from '@/lib/mockData/replacementRequests'
import { SoftwareProposalStatus } from '@/types/software'
import { ReplacementStatus, UserStatus } from '@/types'

export default function QTVKhoaDashboard() {
  const { user } = useAuth()

  // Tính toán thống kê từ dữ liệu thực
  const stats = useMemo(() => {
    // Thống kê người dùng
    const activeUsers = users.filter(u => u.status === UserStatus.ACTIVE).length
    const totalUsers = users.length

    // Thống kê đề xuất phần mềm
    const totalSoftwareProposals = mockSoftwareProposals.length
    const pendingSoftwareProposals = getSoftwareProposalsByStatus(SoftwareProposalStatus.CHỜ_DUYỆT).length

    // Thống kê đề xuất linh kiện
    const totalComponentRequests = mockReplacementRequestItem.length
    const pendingComponentRequests = mockReplacementRequestItem.filter(
      req => req.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT || 
             req.status === ReplacementStatus.CHỜ_XÁC_MINH
    ).length

    return [
      {
        name: 'Tổng người dùng',
        value: totalUsers.toString(),
        change: `${activeUsers} đang hoạt động`,
        changeType: 'positive' as const,
        icon: Users,
      },
      {
        name: 'Đề xuất phần mềm',
        value: totalSoftwareProposals.toString(),
        change: `${pendingSoftwareProposals} chờ duyệt`,
        changeType: pendingSoftwareProposals > 0 ? 'neutral' as const : 'positive' as const,
        icon: FolderCode,
      },
      {
        name: 'Đề xuất linh kiện',
        value: totalComponentRequests.toString(),
        change: `${pendingComponentRequests} chờ xử lý`,
        changeType: pendingComponentRequests > 0 ? 'neutral' as const : 'positive' as const,
        icon: ClipboardList,
      },
      {
        name: 'Hệ thống',
        value: '99.9%',
        change: 'Uptime',
        changeType: 'positive' as const,
        icon: Server,
      },
    ]
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản trị viên khoa</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.fullName}! Quản lý hệ thống và dữ liệu của khoa.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <div>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </div>
            <div className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'positive'
                    ? 'text-green-600'
                    : item.changeType === 'neutral'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Chức năng chính
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/qtv-khoa/quan-ly-nguoi-dung" className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <Users className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý người dùng
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo, cập nhật tài khoản và phân quyền
                </p>
              </div>
            </Link>

            <Link href="/qtv-khoa/quan-ly-de-xuat-phan-mem" className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <FolderCode className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Đề xuất phần mềm
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Theo dõi các đề xuất cài đặt phần mềm
                </p>
              </div>
            </Link>

            <Link href="/qtv-khoa/quan-ly-thay-the-linh-kien" className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
                <ClipboardList className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Đề xuất linh kiện
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Theo dõi các đề xuất thay thế linh kiện
                </p>
              </div>
            </Link>

            {/* <Link href="/qtv-khoa/giam-sat-he-thong" className="relative group bg-red-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-red-600 text-white">
                <Settings className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Giám sát hệ thống
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Theo dõi và quản lý hệ thống
                </p>
              </div>
            </Link> */}
          </div>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Software Proposals Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Trạng thái đề xuất phần mềm
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-sm font-medium">Chờ duyệt</span>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  {getSoftwareProposalsByStatus(SoftwareProposalStatus.CHỜ_DUYỆT).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium">Đã duyệt</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {getSoftwareProposalsByStatus(SoftwareProposalStatus.ĐÃ_DUYỆT).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium">Đã trang bị</span>
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {getSoftwareProposalsByStatus(SoftwareProposalStatus.ĐÃ_TRANG_BỊ).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-sm font-medium">Đã từ chối</span>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  {getSoftwareProposalsByStatus(SoftwareProposalStatus.ĐÃ_TỪ_CHỐI).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Component Requests Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Trạng thái đề xuất linh kiện
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-sm font-medium">Chờ tổ trưởng duyệt</span>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  {mockReplacementRequestItem.filter(req => req.status === ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium">Đã duyệt</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {mockReplacementRequestItem.filter(req => req.status === ReplacementStatus.ĐÃ_DUYỆT).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium">Đã hoàn tất mua sắm</span>
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {mockReplacementRequestItem.filter(req => req.status === ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-sm font-medium">Đã từ chối</span>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  {mockReplacementRequestItem.filter(req => req.status === ReplacementStatus.ĐÃ_TỪ_CHỐI).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  Đã duyệt đề xuất phần mềm DXPM-2025-003
                </p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  Tạo tài khoản mới cho kỹ thuật viên
                </p>
                <p className="text-xs text-gray-500">4 giờ trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  Có đề xuất phần mềm mới cần duyệt DXPM-2025-002
                </p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  Đã từ chối đề xuất phần mềm DXPM-2025-004
                </p>
                <p className="text-xs text-gray-500">2 ngày trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
