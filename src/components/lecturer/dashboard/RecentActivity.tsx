import React from "react";
import Link from "next/link";
import { RepairRequest } from "@/types/repair";

interface ActivityItem extends RepairRequest {
  activityType: "created" | "processing" | "completed";
  activityTime: string;
  statusColor: string;
  relativeTime: string;
}

interface RecentActivityProps {
  repairRequests: RepairRequest[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ repairRequests }) => {
  // Helper function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 ngày trước";
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  };

  // Get recent activities (last 3 activities)
  const recentActivities: ActivityItem[] = repairRequests
    .sort((a, b) => {
      // Sort by latest activity (createdAt, acceptedAt, or completedAt)
      const aLatest = a.completedAt || a.acceptedAt || a.createdAt;
      const bLatest = b.completedAt || b.acceptedAt || b.createdAt;
      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    })
    .slice(0, 3)
    .map((request) => {
      // Determine activity type and time
      let activityType: "created" | "processing" | "completed" = "created";
      let activityTime = request.createdAt;
      let statusColor = "bg-yellow-400";

      if (request.completedAt) {
        activityType = "completed";
        activityTime = request.completedAt;
        statusColor = "bg-green-400";
      } else if (request.acceptedAt) {
        activityType = "processing";
        activityTime = request.acceptedAt;
        statusColor = "bg-blue-400";
      }

      return {
        ...request,
        activityType,
        activityTime,
        statusColor,
        relativeTime: getRelativeTime(activityTime),
      };
    });

  const getActivityText = (activityType: string) => {
    switch (activityType) {
      case "completed":
        return "đã được hoàn thành";
      case "processing":
        return "đang được xử lý";
      case "created":
        return "đã được tạo";
      default:
        return "đã được tạo";
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div
                  className={`w-2 h-2 ${activity.statusColor} rounded-full mt-2`}></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">
                    Báo cáo {activity.requestCode}
                  </span>{" "}
                  {getActivityText(activity.activityType)}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.assetName}, {activity.roomName}
                </p>
                <p className="text-xs text-gray-400">{activity.relativeTime}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/giang-vien/theo-doi-tien-do"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Xem tất cả hoạt động →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
