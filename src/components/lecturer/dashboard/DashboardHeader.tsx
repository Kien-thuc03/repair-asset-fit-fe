import React from "react";

interface DashboardHeaderProps {
  userName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Giảng viên</h1>
      <p className="mt-2 text-gray-600">
        Chào mừng {userName}! Quản lý báo cáo lỗi thiết bị của bạn.
      </p>
    </div>
  );
};

export default DashboardHeader;
