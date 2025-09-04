'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Building, Users, FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react'

const stats = [
  {
    name: 'Tổng đơn vị',
    value: '12',
    change: '2 khoa chính',
    changeType: 'neutral',
    icon: Building,
  },
  {
    name: 'Nhân sự kỹ thuật',
    value: '45',
    change: '5 tổ trưởng',
    changeType: 'neutral',
    icon: Users,
  },
  {
    name: 'Báo cáo tháng này',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: FileText,
  },
  {
    name: 'Ngân sách',
    value: '2.5M',
    change: '80% đã sử dụng',
    changeType: 'neutral',
    icon: DollarSign,
  },
]

export default function PhongQuanTriDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Phòng quản trị</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.name}! Quản lý toàn bộ hệ thống sửa chữa trường học.
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
              <div className="absolute rounded-md bg-purple-500 p-3">
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
                    : item.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-600'
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
            Quản lý hệ thống
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
                <Building className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý đơn vị
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thêm, sửa, xóa thông tin khoa/phòng ban
                </p>
              </div>
            </button>

            <button className="relative group bg-teal-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500 rounded-lg hover:bg-teal-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-teal-600 text-white">
                <Users className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý người dùng
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Phân quyền và quản lý tài khoản
                </p>
              </div>
            </button>

            <button className="relative group bg-red-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-red-600 text-white">
                <TrendingUp className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Báo cáo tổng hợp
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thống kê toàn trường theo thời gian
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Hoạt động gần đây
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Phê duyệt thay thế máy chiếu phòng A301
                  </p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Thêm kỹ thuật viên mới - Khoa CNTT
                  </p>
                  <p className="text-xs text-gray-500">1 ngày trước</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Cập nhật quy trình sửa chữa
                  </p>
                  <p className="text-xs text-gray-500">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Trạng thái các khoa
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Khoa CNTT</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Hoạt động bình thường
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Khoa Cơ khí</span>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  3 thiết bị cần sửa
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Khoa Điện</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Hoạt động bình thường
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Phòng hành chính</span>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  1 lỗi khẩn cấp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
