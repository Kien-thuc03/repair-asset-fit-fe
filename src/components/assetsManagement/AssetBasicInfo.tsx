"use client";
import { Monitor, Tag, Hash } from "lucide-react";
import { Asset } from "@/types";
import { getAssetStatusDisplay } from "@/lib/constants/assetStatus";

interface TechnicianDeviceBasicInfoProps {
  asset: Asset;
}

export default function TechnicianDeviceBasicInfo({ asset }: TechnicianDeviceBasicInfoProps) {
  const statusConfig = getAssetStatusDisplay(asset.status);

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
              <span className="text-sm font-medium text-gray-500">Mã kế toán:</span>
            </div>
            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded">
              {asset.ktCode}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Tên tài sản:</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{asset.name}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">Danh mục:</span>
            <span className="text-sm text-gray-900">{asset.category}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">Thông số kĩ thuật:</span>
            <span className="text-sm text-gray-900 max-w-48 text-right" title={asset.specs}>
              {asset.specs}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm font-medium text-gray-500">Mã tài sản cố định:</span>
            <span className="text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded">
              {asset.fixedCode}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Phòng làm việc:</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">{asset.roomName}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-gray-500">Trạng thái hiện tại:</span>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.badgeClass}`}>
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}