"use client";
import { Monitor, Wrench } from "lucide-react";

interface TechnicianDeviceTabNavigationProps {
  showRepairHistory: boolean;
  repairHistoryCount: number;
  onTabChange: (showRepairHistory: boolean) => void;
}

export default function TechnicianDeviceTabNavigation({
  showRepairHistory,
  repairHistoryCount,
  onTabChange,
}: TechnicianDeviceTabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        <button
          onClick={() => onTabChange(false)}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            !showRepairHistory
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}>
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>Thông tin thiết bị</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange(true)}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            showRepairHistory
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}>
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4" />
            <span>Lịch sử bảo trì</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 text-xs rounded-full">
              {repairHistoryCount}
            </span>
          </div>
        </button>
      </nav>
    </div>
  );
}