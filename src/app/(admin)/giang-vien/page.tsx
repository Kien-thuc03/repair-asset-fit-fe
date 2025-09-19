"use client";

import { useAuth } from "@/contexts/AuthContext";
import { lecturerStats } from "@/lib/mockData/stats";
import { mockRepairRequests } from "@/lib/mockData";
import {
  DashboardHeader,
  StatsCards,
  QuickActions,
  RecentActivity,
} from "@/components/lecturer/dashboard";

export default function GiangVienDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader userName={user?.fullName} />

      {/* Stats */}
      <StatsCards stats={lecturerStats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity repairRequests={mockRepairRequests} />
    </div>
  );
}
