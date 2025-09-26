"use client";
import { Wrench, Smartphone } from "lucide-react";

interface DeviceManagementHeaderProps {
  isMobile: boolean;
  onQRScan: () => void;
}

export default function DeviceManagementHeader({
  isMobile,
  onQRScan,
}: DeviceManagementHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý thiết bị
            </h1>
            <p className="text-gray-600">
              Theo dõi và quản lý tình trạng thiết bị
            </p>
          </div>
        </div>

        {/* QR Scanner Button - Mobile Only */}
        {isMobile && (
          <button
            onClick={onQRScan}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition flex items-center justify-center shadow-lg"
            title="Quét mã QR thiết bị">
            <Smartphone className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}