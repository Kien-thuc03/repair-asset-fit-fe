'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Users, FileCheck, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react'

const stats = [
  {
    name: 'Thành viên nhóm',
    value: '5',
    change: '2 đang bận',
    changeType: 'neutral',
    icon: Users,
  },
  {
    name: 'Đề xuất chờ duyệt',
    value: '3',
    change: '1 khẩn cấp',
    changeType: 'neutral',
    icon: FileCheck,
  },
  {
    name: 'Hoàn thành tháng này',
    value: '28',
    change: '+15%',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    name: 'Cảnh báo',
    value: '2',
    change: 'Thiết bị cũ',
    changeType: 'negative',
    icon: AlertTriangle,
  },
]

export default function ToTruongKyThuatDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Tổ trưởng kỹ thuật</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.name}! Quản lý nhóm kỹ thuật và phê duyệt đề xuất.
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
            Quản lý hôm nay
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <FileCheck className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Phê duyệt đề xuất
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Duyệt phiếu đề xuất thay thế thiết bị
                </p>
              </div>
            </button>

            <button className="relative group bg-indigo-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg hover:bg-indigo-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-indigo-600 text-white">
                <Users className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý nhóm
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Phân công công việc cho kỹ thuật viên
                </p>
              </div>
            </button>

            <button className="relative group bg-yellow-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 rounded-lg hover:bg-yellow-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-yellow-600 text-white">
                <TrendingUp className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Báo cáo tổng hợp
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo báo cáo hiệu suất nhóm
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Team Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Trạng thái nhóm kỹ thuật
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Nguyễn Văn A</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Sẵn sàng
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Trần Thị B</span>
              </div>
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                Đang xử lý - Phòng A301
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Lê Văn C</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Đang kiểm tra - Lab B
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
