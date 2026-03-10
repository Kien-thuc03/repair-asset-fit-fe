import React from "react";
import { Select } from "antd";
import { ChevronDown, MapPin, Monitor } from "lucide-react";
import { SimpleAsset as Asset } from "@/types";

const { Option } = Select;

interface Room {
  id: string;
  name: string;
}

interface Computer {
  assetId: string;
  machineLabel: string;
}

interface RoomAssetSelectorProps {
  roomId: string;
  assetId: string;
  rooms: Room[];
  filteredAssets: Asset[];
  computers: Computer[];
  onRoomChange: (roomId: string) => void;
  onAssetChange: (assetId: string) => void;
}

const RoomAssetSelector: React.FC<RoomAssetSelectorProps> = ({
  roomId,
  assetId,
  rooms,
  filteredAssets,
  computers,
  onRoomChange,
  onAssetChange,
}) => {
  const selectedComputer = computers.find((c) => c.assetId === assetId);
  const selectedAsset = filteredAssets.find((a) => a.id === assetId);

  return (
    <div className="space-y-4">
      <h3 className="block text-sm font-medium text-gray-700 ">
        Bước 1: Chọn máy tính cần cài đặt phần mềm
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Selection */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            Chọn phòng <span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            placeholder="Chọn phòng"
            className="w-full"
            value={roomId || undefined}
            onChange={onRoomChange}
            suffixIcon={<ChevronDown className="w-4 h-4" />}
            size="large">
            {rooms.map((room) => (
              <Option key={room.id} value={room.id}>
                {room.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Asset Selection */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Monitor className="w-4 h-4 mr-1" />
            Chọn máy tính <span className="text-red-500 ml-1">*</span>
          </label>
          <Select
            placeholder="Chọn máy tính"
            className="w-full"
            value={assetId || undefined}
            onChange={onAssetChange}
            disabled={!roomId}
            suffixIcon={<ChevronDown className="w-4 h-4" />}
            size="large">
            {filteredAssets.map((asset) => {
              const computer = computers.find((c) => c.assetId === asset.id);
              return (
                <Option key={asset.id} value={asset.id}>
                  {computer?.machineLabel} - {asset.name}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>

      {/* Selected Asset Info */}
      {selectedAsset && selectedComputer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Monitor className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-900">
              Thông tin máy đã chọn
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Máy số:</span>
              <span className="ml-2 font-medium">
                {selectedComputer.machineLabel}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tên máy:</span>
              <span className="ml-2 font-medium">{selectedAsset.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Mã tài sản:</span>
              <span className="ml-2 font-medium">
                {selectedAsset.ktCode}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Phòng:</span>
              <span className="ml-2 font-medium">
                {rooms.find((r) => r.id === roomId)?.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAssetSelector;
