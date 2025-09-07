"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Search,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    name: "Báo cáo đã gửi",
    value: "12",
    change: "+2 tuần này",
    changeType: "positive",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    name: "Đang xử lý",
    value: "3",
    change: "1 khẩn cấp",
    changeType: "warning",
    icon: Clock,
    color: "bg-yellow-500",
  },
  {
    name: "Đã hoàn thành",
    value: "8",
    change: "+3 tuần này",
    changeType: "positive",
    icon: CheckCircle,
    color: "bg-green-500",
  },
  {
    name: "Cần theo dõi",
    value: "1",
    change: "Quá hạn",
    changeType: "negative",
    icon: AlertTriangle,
    color: "bg-red-500",
  },
];

export default function GiangVienDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Giảng viên
        </h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.fullName}! Quản lý báo cáo lỗi thiết bị của bạn.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
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
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === "positive"
                    ? "text-green-600"
                    : item.changeType === "negative"
                    ? "text-red-600"
                    : item.changeType === "warning"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/giang-vien/bao-cao-loi"
              className="relative group bg-red-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 rounded-lg hover:bg-red-100 transition-colors block">
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
            </Link>

            <Link
              href="/giang-vien/theo-doi-tien-do"
              className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors block">
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
            </Link>

            <Link
              href="/giang-vien/tra-cuu-thiet-bi"
              className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <Search className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Tra cứu thiết bị
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tìm kiếm và xem thông tin chi tiết tài sản thiết bị
                </p>
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
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Báo cáo YCSC-2025-0012</span> đã
                  được hoàn thành
                </p>
                <p className="text-xs text-gray-500">
                  PC Dell OptiPlex - Máy 05, Phòng A102
                </p>
                <p className="text-xs text-gray-400">2 giờ trước</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Báo cáo YCSC-2025-0013</span>{" "}
                  đang được xử lý
                </p>
                <p className="text-xs text-gray-500">
                  PC HP ProDesk - Máy 01, Phòng A101
                </p>
                <p className="text-xs text-gray-400">5 giờ trước</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  Bạn đã tạo <span className="font-medium">báo cáo mới</span>
                </p>
                <p className="text-xs text-gray-500">
                  PC Lenovo ThinkCentre - Máy 04, Phòng A101
                </p>
                <p className="text-xs text-gray-400">1 ngày trước</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/giang-vien/theo-doi-tien-do"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Xem tất cả hoạt động →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
