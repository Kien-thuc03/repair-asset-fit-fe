'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Database, Shield, Users, Settings, Activity, Server } from 'lucide-react'

const stats = [
  {
    name: 'Tổng người dùng',
    value: '234',
    change: '+12 tháng này',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Hệ thống',
    value: '99.9%',
    change: 'Uptime',
    changeType: 'positive',
    icon: Server,
  },
  {
    name: 'Dữ liệu',
    value: '15.2GB',
    change: '+2.1GB tháng này',
    changeType: 'neutral',
    icon: Database,
  },
  {
    name: 'Bảo mật',
    value: '0',
    change: 'Cảnh báo',
    changeType: 'positive',
    icon: Shield,
  },
]

export default function QTVKhoaDashboard() {
  const { user } = useAuth()

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
            Quản trị hệ thống
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <Users className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý tài khoản
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo, sửa, xóa tài khoản người dùng
                </p>
              </div>
            </button>

            <button className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <Database className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Sao lưu dữ liệu
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Backup và khôi phục dữ liệu
                </p>
              </div>
            </button>

            <button className="relative group bg-red-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-red-600 text-white">
                <Shield className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Bảo mật
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Kiểm tra và cấu hình bảo mật
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Monitor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Trạng thái hệ thống
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium">Database Server</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium">Web Server</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium">File Storage</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-sm font-medium">Backup Service</span>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  Đang chạy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Nhật ký hệ thống
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Người dùng &apos;giangvien&apos; đăng nhập thành công
                  </p>
                  <p className="text-xs text-gray-500">10:30 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Backup dữ liệu hoàn thành
                  </p>
                  <p className="text-xs text-gray-500">09:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Tạo tài khoản mới cho kỹ thuật viên
                  </p>
                  <p className="text-xs text-gray-500">08:45 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Cập nhật quyền truy cập cho nhóm giảng viên
                  </p>
                  <p className="text-xs text-gray-500">08:20 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Cấu hình hệ thống
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Settings className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Cấu hình chung</h3>
              <p className="mt-1 text-xs text-gray-500">Thiết lập hệ thống cơ bản</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Bảo mật</h3>
              <p className="mt-1 text-xs text-gray-500">Chính sách và quyền hạn</p>
            </div>
            <div className="text-center">
              <Database className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Cơ sở dữ liệu</h3>
              <p className="mt-1 text-xs text-gray-500">Quản lý và tối ưu hóa</p>
            </div>
            <div className="text-center">
              <Activity className="mx-auto h-8 w-8 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Giám sát</h3>
              <p className="mt-1 text-xs text-gray-500">Theo dõi hiệu suất</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
