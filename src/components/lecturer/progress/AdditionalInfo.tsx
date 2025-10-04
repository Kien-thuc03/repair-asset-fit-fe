"use client";

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
