'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Wrench, FileText, Settings, BarChart3, Clock, CheckCircle } from 'lucide-react'

const stats = [
  {
    name: 'Lỗi được giao',
    value: '15',
    change: '+3 hôm nay',
    changeType: 'neutral',
    icon: Wrench,
  },
  {
    name: 'Đang xử lý',
    value: '8',
    change: '2 khẩn cấp',
    changeType: 'neutral',
    icon: Clock,
  },
  {
    name: 'Hoàn thành tuần này',
    value: '12',
    change: '+20%',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    name: 'Đề xuất thay thế',
    value: '3',
    change: '1 chờ duyệt',
    changeType: 'neutral',
    icon: FileText,
  },
]

export default function KyThuatVienDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Kỹ thuật viên</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.name}! Quản lý công việc sửa chữa của bạn.
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
              <div className="absolute rounded-md bg-green-500 p-3">
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
            Công việc hôm nay
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="relative group bg-orange-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 rounded-lg hover:bg-orange-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-orange-600 text-white">
                <Wrench className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Xử lý lỗi
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tiếp nhận và xử lý báo cáo lỗi
                </p>
              </div>
            </button>

            <button className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
                <FileText className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Đề xuất thay thế
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo phiếu đề xuất thay thế thiết bị
                </p>
              </div>
            </button>

            <button className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <BarChart3 className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Thống kê
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem hiệu suất làm việc cá nhân
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
