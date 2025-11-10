"use client";
import { Monitor, Tag, Hash, Building2 } from "lucide-react";
import { Asset } from "@/types";

interface TechnicianDeviceBasicInfoProps {
  asset: Asset;
}

export default function TechnicianDeviceBasicInfo({ asset }: TechnicianDeviceBasicInfoProps) {
  // Asset status configuration - từ database enum
  const getStatusConfig = (status: string) => {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      "IN_USE": { label: "Đang sử dụng", color: "bg-green-100 text-green-800 border-green-200" },
      "DANG_SU_DUNG": { label: "Đang sử dụng", color: "bg-green-100 text-green-800 border-green-200" },
      "WAITING_HANDOVER": { label: "Chờ bàn giao", color: "bg-blue-100 text-blue-800 border-blue-200" },
      "CHO_BAN_GIAO": { label: "Chờ bàn giao", color: "bg-blue-100 text-blue-800 border-blue-200" },
      "WAITING_RECEIVE": { label: "Chờ tiếp nhận", color: "bg-orange-100 text-orange-800 border-orange-200" },
      "CHO_TIEP_NHAN": { label: "Chờ tiếp nhận", color: "bg-orange-100 text-orange-800 border-orange-200" },
      "DAMAGED": { label: "Hư hỏng", color: "bg-red-100 text-red-800 border-red-200" },
      "HU_HONG": { label: "Hư hỏng", color: "bg-red-100 text-red-800 border-red-200" },
      "LOST": { label: "Đã mất", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "DA_MAT": { label: "Đã mất", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "PROPOSED_LIQUIDATION": { label: "Đề xuất thanh lý", color: "bg-purple-100 text-purple-800 border-purple-200" },
      "DE_XUAT_THANH_LY": { label: "Đề xuất thanh lý", color: "bg-purple-100 text-purple-800 border-purple-200" },
      "LIQUIDATED": { label: "Đã thanh lý", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "DA_THANH_LY": { label: "Đã thanh lý", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "WAITING_ALLOCATION": { label: "Chờ phân bổ", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    };

    return statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800 border-gray-200"
    };
  };

  const statusConfig = getStatusConfig(asset.status);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
        <Monitor className="w-5 h-5 text-blue-600" />
        <span>Thông tin cơ bản</span>
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Mã tài sản:</span>
            </div>
            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded">
              {asset.assetCode}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Tên tài sản:</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{asset.name}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">Danh mục:</span>
            <span className="text-sm text-gray-900">{asset.category}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">Model:</span>
            <span className="text-sm text-gray-900 max-w-48 text-right" title={asset.model}>
              {asset.model}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">Serial Number:</span>
            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded">
              {asset.serialNumber}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Phòng làm việc:</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{asset.roomName}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-500">Trạng thái hiện tại:</span>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}