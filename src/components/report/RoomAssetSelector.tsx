import React from "react";
import { SimpleAsset as Asset } from "@/types";

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
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Bước 1: Room Selection - Chọn phòng trước */}
      <div>
        <label
          htmlFor="roomId"
          className="block text-sm font-medium text-gray-700">
          Bước 1: Chọn phòng/khoa <span className="text-red-500">*</span>
        </label>
        <select
          id="roomId"
          required
          value={roomId}
          onChange={(e) => onRoomChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          <option value="">Chọn phòng</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bước 2: Asset Selection - Chọn thiết bị trong phòng */}
      <div>
        <label
          htmlFor="assetId"
          className="block text-sm font-medium text-gray-700">
          Bước 2: Chọn thiết bị <span className="text-red-500">*</span>
        </label>
        <select
          id="assetId"
          required
          value={assetId}
          onChange={(e) => onAssetChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={!roomId}>
          <option value="">
            {!roomId ? "Vui lòng chọn phòng trước" : "Chọn thiết bị"}
          </option>
          {filteredAssets.map((asset) => {
            const computer = computers.find(
              (comp) => comp.assetId === asset.id
            );
            const machineLabel = computer?.machineLabel || "N/A";
            return (
              <option key={asset.id} value={asset.id}>
                Máy {machineLabel} - {asset.name} ({asset.assetCode})
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default RoomAssetSelector;
