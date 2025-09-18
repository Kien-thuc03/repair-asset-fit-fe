"use client";
import { Eye } from "lucide-react";
import { Asset } from "@/types";

interface AssetSpecificationsProps {
  asset: Asset;
}

export default function AssetSpecifications({
  asset,
}: AssetSpecificationsProps) {
  if (!asset.specifications) {
    return null;
  }

  return (
    <div className="lg:col-span-2">
      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <Eye className="w-5 h-5 text-blue-600" />
        <span>Thông số kỹ thuật</span>
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(asset.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">{key}:</span>
              <span className="text-sm text-gray-900">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
