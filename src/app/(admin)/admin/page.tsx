'use client'

import { useAuth } from '@/contexts/AuthContext'
import { 
  Wrench, 
  ClipboardList, 
  Users, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp 
} from 'lucide-react'

const stats = [
  {
    name: 'Tổng thiết bị',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: ClipboardList,
  },
  {
    name: 'Đang sửa chữa',
    value: '45',
    change: '+5%',
    changeType: 'neutral',
    icon: Wrench,
  },
  {
    name: 'Hoàn thành hôm nay',
    value: '12',
    change: '+8%',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    name: 'Chờ xử lý',
    value: '8',
    change: '-2%',
    changeType: 'negative',
    icon: Clock,
  },
]

const recentRepairs = [
  {
    id: 'RP001',
    asset: 'Máy tính để bàn Dell OptiPlex 3070',
    location: 'Phòng 201A',
    status: 'Đang sửa chữa',
    technician: 'Nguyễn Văn A',
    priority: 'Cao',
  },
  {
    id: 'RP002',
    asset: 'Máy chiếu Epson EB-S05',
    location: 'Phòng 105B',
    status: 'Hoàn thành',
    technician: 'Trần Thị B',
    priority: 'Trung bình',
  },
  {
    id: 'RP003',
    asset: 'Máy in Canon LBP2900',
    location: 'Phòng 301C',
    status: 'Chờ xử lý',
    technician: '-',
    priority: 'Thấp',
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Tổng quan hệ thống quản lý sửa chữa tài sản - Chào mừng, {user?.name}!
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
                <TrendingUp
                  className="h-4 w-4 flex-shrink-0 self-center"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {item.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                </span>
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Repairs */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Sửa chữa gần đây
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã phiếu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thiết bị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ thuật viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mức độ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentRepairs.map((repair) => (
                  <tr key={repair.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {repair.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repair.asset}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repair.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          repair.status === 'Hoàn thành'
                            ? 'bg-green-100 text-green-800'
                            : repair.status === 'Đang sửa chữa'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repair.technician}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          repair.priority === 'Cao'
                            ? 'bg-red-100 text-red-800'
                            : repair.priority === 'Trung bình'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {repair.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Thao tác nhanh
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <Wrench className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Tạo phiếu sửa chữa
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo phiếu sửa chữa mới cho thiết bị
                </p>
              </div>
            </button>

            <button className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <ClipboardList className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý thiết bị
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem và quản lý danh sách thiết bị
                </p>
              </div>
            </button>

            <button className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
                <BarChart3 className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Báo cáo
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem báo cáo và thống kê
                </p>
              </div>
            </button>

            <button className="relative group bg-orange-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 rounded-lg hover:bg-orange-100 transition-colors">
              <span className="rounded-lg inline-flex p-3 bg-orange-600 text-white">
                <Users className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý người dùng
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Quản lý tài khoản và phân quyền
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
