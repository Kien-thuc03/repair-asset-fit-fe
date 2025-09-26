"use client";
import { Calendar, Shield, Clock, User } from "lucide-react";
import { Asset } from "@/types";

interface TechnicianDeviceWarrantyInfoProps {
  asset: Asset;
  warrantyStatus: {
    label: string;
    color: string;
  };
  formatDate: (dateString: string) => string;
}

export default function TechnicianDeviceWarrantyInfo({
  asset,
  warrantyStatus,
  formatDate,
}: TechnicianDeviceWarrantyInfoProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
        <Shield className="w-5 h-5 text-green-600" />
        <span>Bảo hành & Bảo trì</span>
      </h4>
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Ngày mua:</span>
            </div>
            <span className="text-sm text-gray-900 bg-white px-2 py-1 rounded">
              {formatDate(asset.purchaseDate)}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Hết hạn bảo hành:</span>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-sm ${warrantyStatus.color} font-medium`}>
                {formatDate(asset.warrantyExpiry)}
              </span>
              <span className={`text-xs ${warrantyStatus.color} font-semibold`}>
                ({warrantyStatus.label})
              </span>
            </div>
          </div>
          
          {asset.lastMaintenanceDate && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Bảo trì lần cuối:</span>
              </div>
              <span className="text-sm text-gray-900 bg-white px-2 py-1 rounded">
                {formatDate(asset.lastMaintenanceDate)}
              </span>
            </div>
          )}
          
          {asset.assignedTo && (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Được giao cho:</span>
              </div>
              <span className="text-sm text-gray-900 font-medium">{asset.assignedTo}</span>
            </div>
          )}
        </div>
        
        {/* Warranty Status Card */}
        <div className={`p-3 rounded-lg border-l-4 ${
          warrantyStatus.label === "Còn hiệu lực" 
            ? "bg-green-50 border-green-400" 
            : warrantyStatus.label === "Sắp hết hạn"
            ? "bg-yellow-50 border-yellow-400"
            : "bg-red-50 border-red-400"
        }`}>
          <div className="flex items-center space-x-2">
            <Shield className={`w-5 h-5 ${warrantyStatus.color}`} />
            <div>
              <p className={`text-sm font-medium ${warrantyStatus.color}`}>
                Trạng thái bảo hành: {warrantyStatus.label}
              </p>
              <p className="text-xs text-gray-600">
                {warrantyStatus.label === "Còn hiệu lực" 
                  ? "Thiết bị đang được bảo hành"
                  : warrantyStatus.label === "Sắp hết hạn"
                  ? "Cần gia hạn bảo hành sớm"
                  : "Bảo hành đã hết hạn"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}