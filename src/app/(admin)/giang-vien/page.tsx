'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react'

const stats = [
  {
    name: 'Báo cáo đã gửi',
    value: '12',
    change: '+2 tuần này',
    changeType: 'positive',
    icon: FileText,
  },
  {
    name: 'Đang xử lý',
    value: '3',
    change: '1 khẩn cấp',
    changeType: 'neutral',
    icon: Clock,
  },
  {
    name: 'Đã hoàn thành',
    value: '8',
    change: '+3 tuần này',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    name: 'Cần theo dõi',
    value: '1',
    change: 'Quá hạn',
    changeType: 'negative',
    icon: AlertTriangle,
  },
]

export default function GiangVienDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Giảng viên</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.fullName}! Quản lý báo cáo lỗi thiết bị của bạn.
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
              <div className="absolute rounded-md bg-blue-500 p-3">
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
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="relative group bg-red-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-red-600 text-white">
                <AlertTriangle className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Báo cáo lỗi mới
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo báo cáo lỗi cho thiết bị gặp sự cố
                </p>
              </div>
            </button>

            <button className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <Clock className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Theo dõi tiến độ
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem tiến độ xử lý các báo cáo đã gửi
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
