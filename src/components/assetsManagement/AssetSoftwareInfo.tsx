"use client";
import { Package, Calendar, Building } from "lucide-react";
import { Asset } from "@/types";

interface AssetSoftwareInfoProps {
  asset: Asset;
}

export default function AssetSoftwareInfo({ asset }: AssetSoftwareInfoProps) {
  // Lấy danh sách phần mềm từ API data (đã có trong asset.software)
  const installedSoftware = asset.software || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="lg:col-span">
      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
        <span>Phần mềm cài đặt</span>
      </h4>
      
      {installedSoftware.length > 0 ? (
        <div className="space-y-3">
          {installedSoftware.map((software) => (
            <div 
              key={software.id} 
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <h5 className="text-sm font-semibold text-gray-900">
                      {software.name}
                    </h5>
                    {software.version && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        v{software.version}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building className="w-3 h-3" />
                      <span>Nhà phát hành:</span>
                      <span className="font-medium">{software.publisher}</span>
                    </div>
                    
                    {software.installationDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Ngày cài đặt:</span>
                        <span className="font-medium">{formatDate(software.installationDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-1">Chưa có thông tin phần mềm</p>
          <p className="text-xs text-gray-400">
            Thiết bị này chưa được cài đặt phần mềm hoặc chưa được cập nhật thông tin
          </p>
        </div>
      )}
    </div>
  );
}