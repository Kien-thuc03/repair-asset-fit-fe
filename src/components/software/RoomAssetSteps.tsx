"use client";

import { SimpleAsset as Asset } from "@/types";
import { mockSimpleRooms, mockComputers } from "@/lib/mockData";

interface RoomAssetStepsProps {
  roomId: string;
  assetId: string;
  filteredAssets: Asset[];
  onRoomChange: (roomId: string) => void;
  onAssetChange: (assetId: string) => void;
}

export default function RoomAssetSteps({
  roomId,
  assetId,
  filteredAssets,
  onRoomChange,
  onAssetChange,
}: RoomAssetStepsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Bước 1: Room Selection */}
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
          {mockSimpleRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bước 2: Asset Selection */}
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
            const computer = mockComputers.find(
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
}
