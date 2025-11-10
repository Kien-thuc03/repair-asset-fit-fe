"use client";
import { Search } from "lucide-react";
import { Asset } from "@/types";
import { DeviceAsset } from "@/types/computer";
import DeviceCard from "./AssetCard";

interface DeviceGridProps {
  assets: Asset[] | DeviceAsset[];
  onViewDetail: (assetId: string) => void;
}

export default function DeviceGrid({
  assets,
  onViewDetail,
}: DeviceGridProps) {
  return (
    <>
      {/* Device Grid */}
      <div className="min-h-96">
        {assets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy thiết bị
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không có thiết bị nào phù hợp với bộ lọc.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <DeviceCard
                key={asset.id}
                asset={asset}
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}