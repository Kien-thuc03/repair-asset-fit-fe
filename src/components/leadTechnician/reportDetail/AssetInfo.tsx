import { Settings, MapPin } from "lucide-react";
import { RepairRequest } from "@/types";

interface AssetInfoProps {
  request: RepairRequest;
}

export default function AssetInfo({ request }: AssetInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Thông tin tài sản
        </h2>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã tài sản
            </label>
            <p className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-3 py-2 rounded">
              {request.assetCode}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên thiết bị
            </label>
            <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
              {request.assetName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Linh kiện
            </label>
            <p className="text-sm text-gray-900 mt-1 bg-gray-50 px-3 py-2 rounded">
              {request.componentName || "Tổng thể"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vị trí
            </label>
            <div className="flex items-center mt-1 bg-gray-50 px-3 py-2 rounded">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">
                {request.roomName} - {request.buildingName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
