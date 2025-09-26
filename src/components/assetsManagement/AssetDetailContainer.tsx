"use client";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Asset, ComprehensiveAsset } from "@/types";
import {
  mockDetailedAssets,
  mockRooms,
  mockCategories,
  mockRepairHistory,
} from "@/lib/mockData";
import TechnicianDeviceDetailHeader from "./AssetDetailHeader";
import DeviceNotFound from "./AssetNotFound";
import TechnicianDeviceTabNavigation from "./AssetTabNavigation";
import TechnicianDeviceBasicInfo from "./AssetBasicInfo";
import TechnicianDeviceWarrantyInfo from "./AssetWarrantyInfo";
import TechnicianDeviceSpecifications from "./AssetSpecifications";
import TechnicianRepairHistoryTab from "./RepairHistoryTab";

// Helper function to convert ComprehensiveAsset to Asset
const convertToAsset = (comprehensive: ComprehensiveAsset): Asset => {
  const room = mockRooms.find((r) => r.id === comprehensive.currentRoomId);
  const category = mockCategories.find((c) => c.id === comprehensive.categoryId);

  return {
    id: comprehensive.id,
    assetCode: comprehensive.ktCode,
    name: comprehensive.name,
    category: category?.name || "Không xác định",
    model: comprehensive.specs || "Không có thông số",
    serialNumber: comprehensive.fixedCode,
    roomId: comprehensive.currentRoomId || "",
    roomName: room?.roomNumber || "Không xác định",
    status: comprehensive.status,
    purchaseDate: comprehensive.entryDate,
    warrantyExpiry: "2025-12-31", // Default warranty
    qrCode: `QR_${comprehensive.ktCode}`,
  };
};

export default function TechnicianDeviceDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for tabs
  const [showRepairHistory, setShowRepairHistory] = useState(false);

  // Convert comprehensive assets to Asset format
  const convertedAssets = mockDetailedAssets.map(convertToAsset);
  const asset = useMemo(
    () => convertedAssets.find((a) => a.id === id),
    [id, convertedAssets]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getWarrantyStatus = (warrantyExpiry: string) => {
    const today = new Date();
    const expiry = new Date(warrantyExpiry);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: "Hết hạn", color: "text-red-600" };
    } else if (diffDays <= 30) {
      return { label: "Sắp hết hạn", color: "text-yellow-600" };
    } else {
      return { label: "Còn hiệu lực", color: "text-green-600" };
    }
  };

  const getRepairHistory = (assetId: string) => {
    return mockRepairHistory.filter((repair) => repair.assetId === assetId);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleTabChange = (showRepairHistory: boolean) => {
    setShowRepairHistory(showRepairHistory);
  };

  if (!asset) {
    return <DeviceNotFound onGoBack={handleGoBack} />;
  }

  const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);
  const repairHistory = getRepairHistory(asset.id);

  return (
    <div className="space-y-6">
      <TechnicianDeviceDetailHeader
        asset={asset}
        warrantyStatus={warrantyStatus}
        onGoBack={handleGoBack}
      />

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        <TechnicianDeviceTabNavigation
          showRepairHistory={showRepairHistory}
          repairHistoryCount={repairHistory.length}
          onTabChange={handleTabChange}
        />

        <div className="p-6">
          {!showRepairHistory ? (
            // Device Information Tab
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TechnicianDeviceBasicInfo asset={asset} />

              <TechnicianDeviceWarrantyInfo
                asset={asset}
                warrantyStatus={warrantyStatus}
                formatDate={formatDate}
              />

              <TechnicianDeviceSpecifications asset={asset} />
            </div>
          ) : (
            // Repair History Tab
            <TechnicianRepairHistoryTab
              repairHistory={repairHistory}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}