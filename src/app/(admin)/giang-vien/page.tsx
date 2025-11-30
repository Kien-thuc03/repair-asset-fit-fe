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
    <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 min-h-screen space-y-4 sm:space-y-6">
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
