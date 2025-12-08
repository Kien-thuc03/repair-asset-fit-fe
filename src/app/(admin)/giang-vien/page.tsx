"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DashboardHeader,
  StatsCards,
  QuickActions,
  RecentActivity,
} from "@/components/lecturer/dashboard";
import { useRepairDashboardData } from "@/hooks/useRepairDashboardData";
import { RepairStatus } from "@/types";
import { ClipboardList, CheckCircle, Clock } from "lucide-react";

export default function GiangVienDashboard() {
  const { user } = useAuth();
  const { allRepairs } = useRepairDashboardData();

  const myRequests = useMemo(() => {
    if (!user) return allRepairs;
    return allRepairs.filter((r) => r.reporterId === user.id);
  }, [allRepairs, user]);

  const stats = useMemo(() => {
    const total = myRequests.length;
    const completed = myRequests.filter((r) => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH).length;
    const inProgress = myRequests.filter(
      (r) =>
        r.status === RepairStatus.ĐANG_XỬ_LÝ ||
        r.status === RepairStatus.CHỜ_TIẾP_NHẬN ||
        r.status === RepairStatus.ĐÃ_TIẾP_NHẬN
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return [
      {
        name: "Yêu cầu đã gửi",
        value: total.toString(),
        change: `${completionRate}% hoàn thành`,
        changeType: completionRate >= 70 ? "positive" : "warning",
        icon: ClipboardList,
        color: "bg-blue-500",
      },
      {
        name: "Đang xử lý",
        value: inProgress.toString(),
        change: `${inProgress} đang mở`,
        changeType: inProgress > 0 ? "warning" : "positive",
        icon: Clock,
        color: "bg-yellow-500",
      },
      {
        name: "Đã hoàn thành",
        value: completed.toString(),
        change: `${completionRate}%`,
        changeType: "positive",
        icon: CheckCircle,
        color: "bg-green-500",
      },
    ];
  }, [myRequests]);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
      {/* Header */}
      <DashboardHeader userName={user?.fullName} />

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity repairRequests={myRequests} />
    </div>
  );
}
