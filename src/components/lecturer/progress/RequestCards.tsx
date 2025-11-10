"use client";

import { Eye } from "lucide-react";
import { RepairRequest } from "@/types";
import { repairRequestStatusConfig } from "@/lib/mockData";

interface RequestCardsProps {
  requests: RepairRequest[];
  selectedItems: string[];
  selectAll: boolean;
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  onViewDetails: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export default function RequestCards({
  requests,
  selectedItems,
  selectAll,
  onSelectAll,
  onSelectItem,
  onViewDetails,
  formatDate,
}: RequestCardsProps) {
  return (
    <div className="lg:hidden">
      {/* Mobile Select All */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={onSelectAll}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            {selectAll
              ? `Bỏ chọn tất cả`
              : `Chọn tất cả (${requests.length} mục trang này)`}
          </span>
        </label>
      </div>

      <div className="space-y-4 p-4">
        {requests.map((request) => {
          const StatusIcon = repairRequestStatusConfig[request.status].icon;
          return (
            <div
              key={request.id}
              className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              {/* Header with checkbox and request code */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(request.id)}
                    onChange={() => onSelectItem(request.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {request.requestCode}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(request.createdAt)}
                    </div>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    repairRequestStatusConfig[request.status].color
                  }`}>
                  <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                  {repairRequestStatusConfig[request.status].label}
                </div>
              </div>

              {/* Asset and Room Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Tài sản:</div>
                  <div
                    className="font-medium text-gray-900 truncate"
                    title={request.assetName}>
                    {request.assetName}
                  </div>
                  <div
                    className="text-xs text-gray-500 truncate"
                    title={request.ktCode}>
                    {request.ktCode}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Phòng:</div>
                  <div
                    className="font-medium text-gray-900 truncate"
                    title={request.roomName}>
                    {request.roomName}
                  </div>
                </div>
              </div>

              {request.componentName && (
                <div className="text-sm">
                  <div className="text-gray-500">Linh kiện:</div>
                  <div
                    className="text-blue-600 truncate"
                    title={request.componentName}>
                    {request.componentName}
                  </div>
                </div>
              )}

              {/* Error Type and Technician */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Loại lỗi:</div>
                  <div
                    className="text-gray-900 truncate"
                    title={request.errorTypeName || "Chưa phân loại"}>
                    {request.errorTypeName || "Chưa phân loại"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Người xử lý:</div>
                  <div
                    className="text-gray-900 truncate"
                    title={request.assignedTechnicianName || "Chưa phân công"}>
                    {request.assignedTechnicianName || "Chưa phân công"}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => onViewDetails(request.id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Eye className="w-3 h-3 mr-1" />
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
