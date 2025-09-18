import React from "react";
import { AlertTriangle } from "lucide-react";

interface ReportHeaderProps {
  isEditMode: boolean;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ isEditMode }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Chỉnh sửa báo cáo lỗi" : "Báo cáo lỗi thiết bị"}
          </h1>
          <p className="text-gray-600">
            {isEditMode
              ? "Cập nhật thông tin báo cáo lỗi thiết bị"
              : "Tạo báo cáo lỗi cho thiết bị gặp sự cố"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
