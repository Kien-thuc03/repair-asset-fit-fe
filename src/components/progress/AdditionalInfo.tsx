"use client";

import { Edit3 } from "lucide-react";
import { RepairRequest } from "@/types";

interface AdditionalInfoProps {
  request: RepairRequest;
}

export default function AdditionalInfo({ request }: AdditionalInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Thông tin thêm</h3>
      </div>
      <div className="p-6 space-y-4">
        {/* Notice for editable requests */}
        {request.status === "CHỜ_TIẾP_NHẬN" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  Yêu cầu có thể chỉnh sửa
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Yêu cầu này chưa được tiếp nhận, bạn có thể chỉnh sửa thông
                  tin hoặc hủy yêu cầu.
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày dự kiến hoàn thành
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(
              new Date(request.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {request.status === "ĐÃ_HOÀN_THÀNH" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thời gian xử lý
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {request.completedAt
                ? Math.ceil(
                    (new Date(request.completedAt).getTime() -
                      new Date(request.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : "N/A"}{" "}
              ngày
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
