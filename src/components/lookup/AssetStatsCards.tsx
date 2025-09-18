"use client";
import { Monitor, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Asset } from "@/types";

interface AssetStatsCardsProps {
  assets: Asset[];
}

export default function AssetStatsCards({ assets }: AssetStatsCardsProps) {
  const statsData = [
    {
      title: "Đang sử dụng",
      value: assets.filter((e) => e.status === "đang_sử_dụng").length,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Chờ xử lý",
      value: assets.filter(
        (e) => e.status === "chờ_bàn_giao" || e.status === "chờ_tiếp_nhận"
      ).length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Hư hỏng",
      value: assets.filter((e) => e.status === "hư_hỏng").length,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Tổng số",
      value: assets.length,
      icon: Monitor,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
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
