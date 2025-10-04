"use client";

import { useAuth } from "@/contexts/AuthContext";
import { teamLeaderStats } from "@/lib/mockData/stats";
import {
  DashboardHeader,
  StatsCards,
  QuickActions,
  RecentActivity,
} from "@/components/leadTechnician/dashboard";

export default function ToTruongKyThuatDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader userName={user?.fullName} />

      {/* Stats */}
      <StatsCards stats={teamLeaderStats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />

    </div>
  );
}
