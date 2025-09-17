"use client";
import { Search, Camera } from "lucide-react";

interface AssetLookupHeaderProps {
  isMobile: boolean;
  onQRScan: () => void;
}

export default function AssetLookupHeader({
  isMobile,
  onQRScan,
}: AssetLookupHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tra cứu thiết bị
            </h1>
            <p className="text-gray-600">
              Tìm kiếm và xem thông tin chi tiết thiết bị
            </p>
          </div>
        </div>

        {/* QR Scanner Button - Mobile Only */}
        {isMobile && (
          <button
            onClick={onQRScan}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition flex items-center justify-center shadow-lg"
            title="Quét mã QR thiết bị">
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
