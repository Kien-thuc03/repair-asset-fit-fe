"use client";
import { Monitor } from "lucide-react";
import { Asset } from "@/types";
import { assetStatusConfig } from "@/lib/mockData";

interface AssetBasicInfoProps {
  asset: Asset;
}

export default function AssetBasicInfo({ asset }: AssetBasicInfoProps) {
  const StatusIcon = assetStatusConfig[asset.status].icon;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
        <Monitor className="w-5 h-5 text-blue-600" />
        <span>Thông tin cơ bản</span>
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Mã tài sản:</span>
          <span className="text-sm text-gray-900 font-mono">
            {asset.assetCode}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">
            Tên tài sản:
          </span>
          <span className="text-sm text-gray-900">{asset.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Danh mục:</span>
          <span className="text-sm text-gray-900">{asset.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Model:</span>
          <span className="text-sm text-gray-900">{asset.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">
            Serial Number:
          </span>
          <span className="text-sm text-gray-900 font-mono">
            {asset.serialNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Phòng:</span>
          <span className="text-sm text-gray-900">{asset.roomName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              assetStatusConfig[asset.status].color
            }`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {assetStatusConfig[asset.status].label}
          </div>
        </div>
      </div>
    </div>
  );
}
