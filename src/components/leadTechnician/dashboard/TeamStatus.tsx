import React from "react";

const TeamStatus: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Trạng thái nhóm kỹ thuật
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Nguyễn Văn A</span>
            </div>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Sẵn sàng
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Trần Thị B</span>
            </div>
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Đang xử lý - Phòng A301
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Lê Văn C</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Đang kiểm tra - Lab B
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatus;
