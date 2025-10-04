"use client";

import {  Edit3, Trash2 } from "lucide-react";
import { RepairRequest } from "@/types";
import { repairRequestStatusConfig } from "@/lib/mockData";

interface DetailHeaderProps {
  request: RepairRequest;
  onEditRequest?: () => void;
  onCancelRequest?: () => void;
  showActionButtons?: boolean;
  backUrl?: string;
}

export default function DetailHeader({
  request,
  onEditRequest,
  onCancelRequest,
  showActionButtons = true,
}: DetailHeaderProps) {
  const StatusIcon = repairRequestStatusConfig[request.status].icon;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Chi tiết yêu cầu • {request.requestCode}
            </h1>
            <p className="text-gray-600 text-sm lg:text-base">
              Theo dõi chi tiết trạng thái xử lý yêu cầu
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
          {/* Action buttons for pending requests - only show if user has permission */}
          {showActionButtons &&
            request.status === "CHỜ_TIẾP_NHẬN" &&
            onEditRequest &&
            onCancelRequest && (
              <div className="flex space-x-2">
                <button
                  onClick={onEditRequest}
                  className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={onCancelRequest}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hủy yêu cầu
                </button>
              </div>
            )}
          {/* Show info message when user cannot edit */}
          {!showActionButtons && request.status === "CHỜ_TIẾP_NHẬN" && (
            <div className="text-sm text-gray-500 italic">
              Chỉ giảng viên hoặc QTV khoa tạo yêu cầu mới có thể chỉnh sửa
            </div>
          )}
          {showActionButtons && request.status !== "CHỜ_TIẾP_NHẬN" && (
            <div className="text-sm text-gray-500 italic">
              Chỉ có thể chỉnh sửa khi ở trạng thái &ldquo;Chờ tiếp nhận&rdquo;
            </div>
          )}
          {/* Status badge */}
          <div
            className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${
              repairRequestStatusConfig[request.status].color
            }`}>
            <StatusIcon className="w-4 h-4 mr-2" />
            {repairRequestStatusConfig[request.status].label}
          </div>
        </div>
      </div>
    </div>
  );
}
