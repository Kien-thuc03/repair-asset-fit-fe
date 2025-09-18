"use client";

import { Clock } from "lucide-react";

export default function ProgressHeader() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi tiến độ</h1>
          <p className="text-gray-600">
            Theo dõi trạng thái xử lý các báo cáo đã gửi
          </p>
        </div>
      </div>
    </div>
  );
}
