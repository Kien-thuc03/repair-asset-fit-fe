"use client";

import { Monitor } from "lucide-react";

export default function SoftwareHeader() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Monitor className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo lỗi phần mềm</h1>
          <p className="text-gray-600">
            Tạo báo cáo lỗi cho các sự cố phần mềm trên thiết bị
          </p>
        </div>
      </div>
    </div>
  );
}
