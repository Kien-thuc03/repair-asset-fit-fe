"use client";
import { Calendar } from "lucide-react";
import { Asset } from "@/types";

interface AssetWarrantyInfoProps {
  asset: Asset;
  warrantyStatus: {
    label: string;
    color: string;
  };
  formatDate: (dateString: string) => string;
}

export default function AssetWarrantyInfo({
  asset,
  warrantyStatus,
  formatDate,
}: AssetWarrantyInfoProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        <span>Bảo hành & Bảo trì</span>
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Ngày mua:</span>
          <span className="text-sm text-gray-900">
            {formatDate(asset.purchaseDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">
            Hết hạn bảo hành:
          </span>
          <span className={`text-sm ${warrantyStatus.color} font-medium`}>
            {formatDate(asset.warrantyExpiry)}
          </span>
        </div>
        {asset.lastMaintenanceDate && (
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Bảo trì lần cuối:
            </span>
            <span className="text-sm text-gray-900">
              {formatDate(asset.lastMaintenanceDate)}
            </span>
          </div>
        )}
        {asset.assignedTo && (
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              Được giao cho:
            </span>
            <span className="text-sm text-gray-900">{asset.assignedTo}</span>
          </div>
        )}
      </div>
    </div>
  );
}
