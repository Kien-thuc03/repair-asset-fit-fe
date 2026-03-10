"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DashboardHeader,
  StatsCards,
  QuickActions,
} from "@/components/leadTechnician/dashboard";
import { useRepairDashboardData } from "@/hooks/useRepairDashboardData";
import { RepairStatus } from "@/types";
import { ClipboardList, Clock, Wrench, CheckCircle } from "lucide-react";

export default function ToTruongKyThuatDashboard() {
  const { user } = useAuth();
  const { allRepairs } = useRepairDashboardData();

  const stats = useMemo(() => {
    const total = allRepairs.length;
    const waiting = allRepairs.filter(r => r.status === RepairStatus.CHỜ_TIẾP_NHẬN).length;
    const inProgress = allRepairs.filter(r => r.status === RepairStatus.ĐANG_XỬ_LÝ).length;
    const completed = allRepairs.filter(r => r.status === RepairStatus.ĐÃ_HOÀN_THÀNH).length;

    return [
      { name: "Tổng yêu cầu", value: total.toString(), changeType: "neutral" as const, icon: ClipboardList, color: "bg-blue-500" },
      { name: "Chờ tiếp nhận", value: waiting.toString(), changeType: "warning" as const, icon: Clock, color: "bg-yellow-500" },
      { name: "Đang xử lý", value: inProgress.toString(), changeType: "warning" as const, icon: Wrench, color: "bg-indigo-500" },
      { name: "Đã hoàn thành", value: completed.toString(), changeType: "positive" as const, icon: CheckCircle, color: "bg-green-500" },
    ];
  }, [allRepairs]);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
      {/* Header */}
      <DashboardHeader userName={user?.fullName} />

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
