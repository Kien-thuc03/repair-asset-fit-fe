"use client";

import { useAuth } from "@/contexts/AuthContext";
import { teamLeaderStats } from "@/lib/mockData/stats";
import {
  TrendingUp,
  MapPin,
  FileText,
  ClipboardList,
  BarChart,
  FileCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function ToTruongKyThuatDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Tổ trưởng kỹ thuật
        </h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.fullName}! Quản lý nhóm kỹ thuật và phê duyệt đề
          xuất.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {teamLeaderStats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
            <div>
              <div className={`absolute rounded-md ${item.color} p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </div>
            <div className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
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
            <Link
              href="/to-truong-ky-thuat/duyet-de-xuat"
              className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <FileCheck className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Duyệt đề xuất
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Phê duyệt yêu cầu thay thế thiết bị
                </p>
              </div>
            </Link>

            <Link
              href="/to-truong-ky-thuat/phan-cong"
              className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <MapPin className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Phân công khu vực
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Gán khu vực cho kỹ thuật viên
                </p>
              </div>
            </Link>

            <Link
              href="/to-truong-ky-thuat/danh-sach-bao-loi"
              className="relative group bg-orange-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-500 rounded-lg hover:bg-orange-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-orange-600 text-white">
                <ClipboardList className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Danh sách báo lỗi
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Theo dõi các báo cáo lỗi
                </p>
              </div>
            </Link>

            <Link
              href="/to-truong-ky-thuat/lap-to-trinh"
              className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
                <FileText className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Lập tờ trình
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo tờ trình gửi Phòng Quản trị
                </p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <Link
              href="/to-truong-ky-thuat/tra-cuu-tai-san"
              className="relative group bg-indigo-50 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg hover:bg-indigo-100 transition-colors block">
              <div className="flex items-center">
                <span className="rounded-lg inline-flex p-2 bg-indigo-600 text-white mr-3">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Tra cứu tài sản
                  </h4>
                  <p className="text-xs text-gray-500">
                    Xem thông tin & lịch sử
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/to-truong-ky-thuat/thong-ke"
              className="relative group bg-red-50 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors block">
              <div className="flex items-center">
                <span className="rounded-lg inline-flex p-2 bg-red-600 text-white mr-3">
                  <BarChart className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Thống kê báo cáo
                  </h4>
                  <p className="text-xs text-gray-500">Xuất báo cáo tổng hợp</p>
                </div>
              </div>
            </Link>

            <Link
              href="/to-truong-ky-thuat/bien-ban"
              className="relative group bg-yellow-50 p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-yellow-500 rounded-lg hover:bg-yellow-100 transition-colors block">
              <div className="flex items-center">
                <span className="rounded-lg inline-flex p-2 bg-yellow-600 text-white mr-3">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Xác nhận biên bản
                  </h4>
                  <p className="text-xs text-gray-500">
                    Xác nhận biên bản do phòng quản trị gửi
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  <div className="relative flex space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                      <FileCheck className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-900">
                          Đã <span className="font-medium">phê duyệt</span> đề
                          xuất thay thế máy tính
                        </p>
                        <p className="text-xs text-gray-500">10 phút trước</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Mã tài sản: PC001 - Phòng A101
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  <div className="relative flex space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-900">
                          Phân công{" "}
                          <span className="font-medium">Trần Văn B</span> phụ
                          trách tòa A
                        </p>
                        <p className="text-xs text-gray-500">30 phút trước</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  <div className="relative flex space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                      <ClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-900">
                          Có{" "}
                          <span className="font-medium">2 báo cáo lỗi mới</span>{" "}
                          cần xử lý
                        </p>
                        <p className="text-xs text-gray-500">1 giờ trước</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Máy chiếu P304, Máy in P202
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <p className="text-sm text-gray-900">
                          Gửi{" "}
                          <span className="font-medium">
                            tờ trình thay thế thiết bị
                          </span>{" "}
                          lên Phòng Quản trị
                        </p>
                        <p className="text-xs text-gray-500">2 giờ trước</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Đề xuất mua 5 máy tính mới cho phòng máy
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
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
  );
}
