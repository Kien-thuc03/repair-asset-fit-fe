"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { FileText, FileCheck, ClipboardList } from "lucide-react";
import { Breadcrumb } from "antd";

const stats = [
  {
    name: "Tờ trình chờ xử lý",
    value: "8",
    change: "3 tờ trình mới",
    changeType: "positive",
    icon: FileText,
  },
  {
    name: "Biên bản hoàn thành",
    value: "24",
    change: "+5 tuần này",
    changeType: "positive",
    icon: ClipboardList,
  },
  {
    name: "Đề xuất đã gửi",
    value: "156",
    change: "+12%",
    changeType: "positive",
    icon: FileCheck,
  },
];

export default function PhongQuanTriDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1" />
                  <span>Trang chủ</span>
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1" />
                  <span>Phòng quản trị</span>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Phòng quản trị
        </h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.fullName}! Quản lý toàn bộ hệ thống sửa chữa trường
          học.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6">
            <div>
              <div className="absolute rounded-md bg-purple-500 p-3">
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
            Chức năng chính
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/phong-quan-tri/xu-ly-to-trinh"
              className="relative group bg-blue-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg hover:bg-blue-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-blue-600 text-white">
                <FileText className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý tờ trình
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Xem xét và phê duyệt các tờ trình thay thế từ các khoa
                </p>
              </div>
            </Link>

            <Link
              href="/phong-quan-tri/lap-bien-ban"
              className="relative group bg-green-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg hover:bg-green-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-green-600 text-white">
                <ClipboardList className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý biên bản
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo biên bản hoàn thành và bàn giao thiết bị từ các khoa
                </p>
              </div>
            </Link>

            <Link
              href="/phong-quan-tri/gui-de-xuat-thay-the"
              className="relative group bg-purple-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg hover:bg-purple-100 transition-colors block">
              <span className="rounded-lg inline-flex p-3 bg-purple-600 text-white">
                <FileCheck className="h-6 w-6" />
              </span>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Danh sách mua sắm thiết bị
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Tạo và gửi đề xuất thay thế thiết bị lên cấp trên từ các khoa
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 gap-6 ">
        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Hoạt động gần đây
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Phê duyệt tờ trình thay thế máy chiếu phòng A301
                  </p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ClipboardList className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Lập biên bản bàn giao máy tính mới - Khoa CNTT
                  </p>
                  <p className="text-xs text-gray-500">1 ngày trước</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileCheck className="h-5 w-5 text-purple-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-900">
                    Gửi đề xuất thay thế thiết bị Khoa Cơ khí
                  </p>
                  <p className="text-xs text-gray-500">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
