"use client";
import { Monitor, Building2, Layers } from "lucide-react";
import { Asset } from "@/types";
import { getAssetStatusDisplay } from "@/lib/constants/assetStatus";

interface TechnicianDeviceBasicInfoProps {
  asset: Asset;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "Không xác định";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export default function TechnicianDeviceBasicInfo({ asset }: TechnicianDeviceBasicInfoProps) {

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
        <Monitor className="w-5 h-5 text-blue-600" />
        <span>Thông tin cơ bản</span>
      </h4>
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        {/* Grid 2 cột cho các thông tin chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-0">
          {/* Cột 1 */}
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Mã kế toán:</span>
              <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">
                {asset.ktCode}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Mã tài sản cố định:</span>
              <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">
                {asset.fixedCode}
              </span>
            </div>

            {asset.machineLabel && (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Số máy:</span>
                <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{asset.machineLabel}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Tên tài sản:</span>
              <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate" title={asset.name}>
                {asset.name}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Danh mục:</span>
              <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{asset.category}</span>
            </div>

            {asset.origin && (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Xuất xứ:</span>
                <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate" title={asset.origin}>
                  {asset.origin}
                </span>
              </div>
            )}
          </div>

          {/* Cột 2 */}
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Phòng làm việc:</span>
              <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{asset.roomName}</span>
            </div>

            {asset.roomNumber && (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Số phòng:</span>
                <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{asset.roomNumber}</span>
              </div>
            )}

            {asset.building && (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Tòa nhà:</span>
                <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{asset.building}</span>
              </div>
            )}

            {asset.floor && (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Tầng:</span>
                <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{asset.floor}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Ngày nhập:</span>
              <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate">{formatDate(asset.purchaseDate)}</span>
            </div>

            {asset.notes && (
              <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">Ghi chú:</span>
                <span className="text-sm text-gray-900 text-right ml-2 max-w-[140px] sm:max-w-[180px] md:max-w-[200px] truncate" title={asset.notes}>
                  {asset.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thông số kĩ thuật - tách riêng để không bị ảnh hưởng bởi gap */}
        <div className="flex items-start justify-between py-2.5 border-t border-gray-300 mt-4 pt-4">
          <span className="text-sm font-medium text-gray-800 whitespace-nowrap flex-shrink-0">Thông số kĩ thuật:</span>
          <span className="text-sm text-gray-900 text-right ml-4 flex-1" title={asset.specs}>
            {asset.specs || "Không có"}
          </span>
        </div>
      </div>
    </div>
  );
}