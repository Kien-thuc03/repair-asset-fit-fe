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
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
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
