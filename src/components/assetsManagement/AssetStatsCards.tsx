"use client";
import { Monitor, CheckCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import type { DeviceAsset } from "@/types/computer";
import type { ComputerSummary } from "@/types/computer";

interface DeviceStatsCardsProps {
  assets: DeviceAsset[];
  summary?: ComputerSummary | null;
  loading?: boolean;
}

export default function DeviceStatsCards({ 
  assets, 
  summary,
  loading = false 
}: DeviceStatsCardsProps) {
  // Sử dụng summary từ API nếu có, fallback về tính từ assets
  const getStatusCount = (status: string) => {
    if (summary?.byStatus) {
      return summary.byStatus[status] || 0;
    }
    // Fallback: tính từ assets hiện tại
    return assets.filter((e) => e.status === status).length;
  };

  const getTotalCount = () => {
    if (summary?.totalComputers) {
      return summary.totalComputers;
    }
    // Fallback: đếm assets hiện tại
    return assets.length;
  };

  const statsData = [
    {
      title: "Đang sử dụng",
      value: getStatusCount("IN_USE"),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Chờ xử lý",
      value: getStatusCount("WAITING_HANDOVER") + getStatusCount("WAITING_RECEIVE"),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Hư hỏng",
      value: getStatusCount("DAMAGED"),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Tổng số",
      value: getTotalCount(),
      icon: Monitor,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    {loading ? (
                      <Loader2 className={`h-6 w-6 ${stat.color} animate-spin`} />
                    ) : (
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    )}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {loading ? (
                        <span className="inline-block animate-pulse bg-gray-200 rounded w-12 h-6"></span>
                      ) : (
                        stat.value
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}