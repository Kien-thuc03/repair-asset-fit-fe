"use client";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockAssetsLookup, mockRepairHistoryLookup } from "@/lib/mockData";
import AssetDetailHeader from "./AssetDetailHeader";
import AssetNotFound from "./AssetNotFound";
import AssetTabNavigation from "./AssetTabNavigation";
import AssetBasicInfo from "./AssetBasicInfo";
import AssetWarrantyInfo from "./AssetWarrantyInfo";
import AssetSpecifications from "./AssetSpecifications";
import RepairHistoryTab from "./RepairHistoryTab";

export default function AssetDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // State for tabs
  const [showRepairHistory, setShowRepairHistory] = useState(false);

  const asset = useMemo(() => mockAssetsLookup.find((a) => a.id === id), [id]);

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
    return mockRepairHistoryLookup.filter(
      (repair) => repair.assetId === assetId
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleTabChange = (showRepairHistory: boolean) => {
    setShowRepairHistory(showRepairHistory);
  };

  if (!asset) {
    return <AssetNotFound onGoBack={handleGoBack} />;
  }

  const warrantyStatus = getWarrantyStatus(asset.warrantyExpiry);
  const repairHistory = getRepairHistory(asset.id);

  return (
    <div className="space-y-6">
      <AssetDetailHeader
        asset={asset}
        warrantyStatus={warrantyStatus}
        onGoBack={handleGoBack}
      />

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        <AssetTabNavigation
          showRepairHistory={showRepairHistory}
          repairHistoryCount={repairHistory.length}
          onTabChange={handleTabChange}
        />

        <div className="p-6">
          {!showRepairHistory ? (
            // Device Information Tab
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AssetBasicInfo asset={asset} />

              <AssetWarrantyInfo
                asset={asset}
                warrantyStatus={warrantyStatus}
                formatDate={formatDate}
              />

              <AssetSpecifications asset={asset} />
            </div>
          ) : (
            // Repair History Tab
            <RepairHistoryTab
              repairHistory={repairHistory}
              formatDate={formatDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
