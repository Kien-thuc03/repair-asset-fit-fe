"use client";
import { Monitor, Eye } from "lucide-react";
import { Asset } from "@/types";
import { assetStatusConfig, categoryIcons } from "@/lib/mockData";

interface AssetCardProps {
  asset: Asset;
  onViewDetail: (assetId: string) => void;
}

export default function AssetCard({ asset, onViewDetail }: AssetCardProps) {
  const StatusIcon = assetStatusConfig[asset.status].icon;
  const CategoryIcon = categoryIcons[asset.category] || Monitor;

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const today = new Date();
    const expiry = new Date(warrantyExpiry);
    const daysLeft = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) {
      return { status: "expired", label: "Hết hạn", color: "text-red-600" };
    } else if (daysLeft < 30) {
      return {
        status: "expiring",
        label: `Còn ${daysLeft} ngày`,
        color: "text-orange-600",
      };
    } else {
      return {
        status: "valid",
        label: `Còn ${Math.ceil(daysLeft / 30)} tháng`,
        color: "text-green-600",
      };
    }
  };

  const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CategoryIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{asset.name}</p>
              <p className="text-sm text-gray-500">{asset.assetCode}</p>
            </div>
          </div>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
              assetStatusConfig[asset.status].color
            }`}>
            <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {assetStatusConfig[asset.status].label}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Model:</span>
            <span className="text-gray-900">{asset.model}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phòng:</span>
            <span className="text-gray-900">{asset.roomName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Bảo hành:</span>
            <span className={`font-medium ${warrantyStatus.color}`}>
              {warrantyStatus.label}
            </span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => onViewDetail(asset.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Eye className="w-3 h-3 mr-1" />
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
