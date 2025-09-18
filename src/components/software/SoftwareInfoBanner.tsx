"use client";

import { Laptop } from "lucide-react";

export default function SoftwareInfoBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Laptop className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-blue-900">
            Báo lỗi phần mềm
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            Sử dụng form này để báo cáo các sự cố liên quan đến phần mềm, ứng
            dụng, hệ điều hành, driver, hoặc các vấn đề kết nối mạng.
          </p>
        </div>
      </div>
    </div>
  );
}
