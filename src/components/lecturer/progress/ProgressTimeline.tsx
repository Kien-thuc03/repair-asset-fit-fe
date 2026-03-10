"use client";

import { CheckCircle, XCircle, Pause } from "lucide-react";
import { RepairRequest } from "@/types";
import { repairRequestStatusConfig } from "@/lib/constants/repairStatus";

interface ProgressTimelineProps {
  request: RepairRequest;
  formatDate: (dateString: string) => string;
}

export default function ProgressTimeline({
  request,
  formatDate,
}: ProgressTimelineProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Tiến độ xử lý</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {/* Ngày tạo */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Yêu cầu được tạo
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          {/* Ngày tiếp nhận */}
          {request.acceptedAt && request.acceptedAt.trim() !== "" && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Đã tiếp nhận
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(request.acceptedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Trạng thái hiện tại */}
          {request.status !== "CHỜ_TIẾP_NHẬN" &&
            request.status !== "ĐÃ_TIẾP_NHẬN" && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      request.status === "ĐÃ_HOÀN_THÀNH"
                        ? "bg-green-100"
                        : request.status === "ĐÃ_HỦY"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}>
                    {request.status === "ĐÃ_HOÀN_THÀNH" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : request.status === "ĐÃ_HỦY" ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Pause className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {repairRequestStatusConfig[request.status].label}
                  </p>
                  {request.completedAt && request.completedAt.trim() !== "" && (
                    <p className="text-xs text-gray-500">
                      {formatDate(request.completedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
