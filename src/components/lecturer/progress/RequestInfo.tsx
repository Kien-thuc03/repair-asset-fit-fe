"use client";

import {
  User,
  Calendar,
  MapPin,
  AlertTriangle,
  Wrench,
  FileText,
} from "lucide-react";
import { RepairRequest } from "@/types";

interface RequestInfoProps {
  request: RepairRequest;
}

export default function RequestInfo({ request }: RequestInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Thông tin yêu cầu</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Wrench className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tài sản
                </label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {request.assetName}
                </p>
                <p className="text-xs text-gray-500">{request.ktCode}</p>
                {request.componentName && (
                  <p className="text-xs text-blue-600">
                    Linh kiện: {request.componentName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vị trí
                </label>
                <p className="mt-1 text-sm text-gray-900">{request.roomName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại lỗi
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {request.errorTypeName || "Chưa phân loại"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Người báo cáo
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {request.reporterName}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Wrench className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Người xử lý
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {request.assignedTechnicianName || "Chưa tiếp nhận"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày tạo
                </label>
                <div
                  className="truncate"
                  title={new Date(request.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}>
                  {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Mô tả chi tiết
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-900">{request.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
