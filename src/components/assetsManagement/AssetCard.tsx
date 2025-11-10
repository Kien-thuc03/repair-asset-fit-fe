"use client";
import { Monitor, Eye, Wrench, Calendar } from "lucide-react";
import { Asset, AssetStatus, DeviceAsset } from "@/types";
interface DeviceCardProps {
  asset: Asset | DeviceAsset;
  onViewDetail: (assetId: string) => void;
}

export const assetStatusConfig = {
  [AssetStatus.WAITING_HANDOVER]: {
    label: "Chờ bàn giao",
    color: "blue"
  },
  [AssetStatus.WAITING_RECEIVE]: {
    label: "Chờ tiếp nhận",
    color: "orange"
  },
  [AssetStatus.IN_USE]: {
    label: "Đang sử dụng",
    color: "green"
  },
  [AssetStatus.LOST]: {
    label: "Đã mất",
    color: "gray"
  },
  [AssetStatus.PROPOSED_LIQUIDATION]: {
    label: "Đề xuất thanh lý",
    color: "purple"
  },
  [AssetStatus.LIQUIDATED]: {
    label: "Đã thanh lý",
    color: "black"
  },
  [AssetStatus.DAMAGED]: {
    label: "Hư hỏng",
    color: "red"
  }
};

export default function DeviceCard({ asset, onViewDetail }: DeviceCardProps) {
  const getStatusConfig = (status: string) => {
    const config = assetStatusConfig[status as keyof typeof assetStatusConfig];
    if (!config) {
      return {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200"
      };
    }
    
    const colorMap: { [key: string]: string } = {
      green: "bg-green-100 text-green-800 border-green-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      red: "bg-red-100 text-red-800 border-red-200",
      gray: "bg-gray-100 text-gray-800 border-gray-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      black: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return {
      label: config.label,
      color: colorMap[config.color] || "bg-gray-100 text-gray-800 border-gray-200"
    };
  };

  const getWarrantyStatus = (warrantyExpiry?: string) => {
    if (!warrantyExpiry) {
      return { status: "unknown", label: "Không có thông tin", color: "text-gray-600" };
    }

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

  const statusConfig = getStatusConfig(asset.status);
  const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
                {asset.name}
              </p>
              <p className="text-sm text-gray-500 font-mono">{asset.ktCode}</p>
            </div>
          </div>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${statusConfig.color}`}>
            <span className="truncate">
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              <Wrench className="w-4 h-4 mr-1" />
              Thông số kĩ thuật:
            </span>
            <span className="text-gray-900 text-right max-w-32 truncate" title={'specs' in asset ? asset.specs : 'N/A'}>
              {'specs' in asset ? asset.specs : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phòng:</span>
            <span className="text-gray-900 font-medium">{asset.roomName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Bảo hành:
            </span>
            <span className={`font-medium ${warrantyStatus.color}`}>
              {warrantyStatus.label}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewDetail(asset.id)}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}