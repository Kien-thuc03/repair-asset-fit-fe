"use client";

import { useAuth } from "@/contexts/AuthContext";
import { mockRepairRequests } from "@/lib/mockData";
import {
  BarChart3,
  FileText,
  CheckCircle,
  Users,
  Building2,
  AlertTriangle,
} from "lucide-react";

const banGiamHieuStats: Array<{
  name: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "warning" | "neutral";
  icon: typeof FileText;
  color: string;
}> = [
  {
    name: "Tổng yêu cầu sửa chữa",
    value: "156",
    change: "+12% so với tháng trước",
    changeType: "positive",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    name: "Đã hoàn thành",
    value: "128",
    change: "82% tỷ lệ hoàn thành",
    changeType: "positive",
    icon: CheckCircle,
    color: "bg-green-500",
  },
  {
    name: "Đang xử lý",
    value: "24",
    change: "4 yêu cầu mới",
    changeType: "warning",
    icon: AlertTriangle,
    color: "bg-yellow-500",
  },
  {
    name: "Tổng đơn vị",
    value: "12",
    change: "Tất cả đang hoạt động",
    changeType: "positive",
    icon: Building2,
    color: "bg-purple-500",
  },
];

export default function BanGiamHieuDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Ban giám hiệu
        </h1>
        <p className="mt-2 text-gray-600">
          Chào mừng {user?.fullName}! Tổng quan hệ thống quản lý sửa chữa thiết
          bị.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {banGiamHieuStats.map((item) => (
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

      {/* Overview Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Tổng quan hệ thống
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Tổng số thiết bị
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  1,245
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Thiết bị đang hoạt động
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  1,156
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Thiết bị cần sửa chữa
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">89</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-sm text-gray-700">
                    Tổng số người dùng
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">342</span>
              </div>
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
              {mockRepairRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        Yêu cầu {request.requestCode}
                      </span>{" "}
                      - {request.assetName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {request.roomName} - {request.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
