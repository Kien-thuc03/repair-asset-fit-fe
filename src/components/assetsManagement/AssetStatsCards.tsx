"use client";
import { Monitor, CheckCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Card, Statistic, Row, Col, Skeleton } from "antd";
import type { DeviceAsset } from "@/types/computer";
import type { ComputerSummary, AssetStatus } from "@/types/computer";

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
      valueStyle: { color: "#52c41a" },
    },
    {
      title: "Chờ xử lý",
      value: getStatusCount("WAITING_HANDOVER") + getStatusCount("WAITING_RECEIVE"),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      valueStyle: { color: "#faad14" },
    },
    {
      title: "Hư hỏng",
      value: getStatusCount("DAMAGED"),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      valueStyle: { color: "#ff4d4f" },
    },
    {
      title: "Tổng số",
      value: getTotalCount(),
      icon: Monitor,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      valueStyle: { color: "#1890ff" },
    },
  ];

  return (
    <Row gutter={[16, 16]} className="mb-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card bordered={false} className="hover:shadow-md transition-shadow">
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <IconComponent className={`h-7 w-7 ${stat.color}`} />
                  </div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={stat.valueStyle}
                  />
                </div>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}