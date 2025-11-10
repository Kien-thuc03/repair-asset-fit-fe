"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Asset } from "@/types";
import { getComputerDetail } from "@/lib/api/computers";
import type { ComputerDetail } from "@/types/computer";
import TechnicianDeviceDetailHeader from "./AssetDetailHeader";
import DeviceNotFound from "./AssetNotFound";
import TechnicianDeviceTabNavigation from "./AssetTabNavigation";
import TechnicianDeviceBasicInfo from "./AssetBasicInfo";
import TechnicianDeviceWarrantyInfo from "./AssetWarrantyInfo";
import TechnicianDeviceSpecifications from "./AssetSpecifications";
import AssetSoftwareInfo from "./AssetSoftwareInfo";
import TechnicianRepairHistoryTab from "./RepairHistoryTab";

/**
 * Helper function: Transform ComputerDetail từ API sang Asset format
 * để tương thích với các sub-components hiện có
 */
const transformComputerToAsset = (computer: ComputerDetail): Asset => {
  // Calculate warranty expiry (2 years from purchase date)
  const warrantyExpiry = computer.asset.entrydate 
    ? new Date(new Date(computer.asset.entrydate).setFullYear(new Date(computer.asset.entrydate).getFullYear() + 2)).toISOString().split('T')[0]
    : undefined;

  return {
    id: computer.asset.id,
    assetCode: computer.asset.ktCode,
    name: computer.asset.name,
    category: computer.asset.categoryName || "Không xác định",
    model: computer.asset.specs || "Không có thông số",
    serialNumber: computer.asset.fixedCode,
    roomId: computer.room?.id || "",
    roomName: computer.room?.name || "Không xác định",
    status: computer.asset.status, // API trả về string từ database enum
    purchaseDate: computer.asset.entrydate,
    warrantyExpiry,
    qrCode: `QR_${computer.asset.ktCode}`,
    building: computer.room?.building,
    floor: computer.room?.floor,
    machineLabel: computer.machineLabel,
    componentCount: computer.componentCount,
    // Thêm các field mới từ API
    components: computer.components,
    software: computer.software,
    repairSummary: computer.repairSummary,
  };
};

export default function TechnicianDeviceDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params?.id[0] : (params?.id as string);

  // States
  const [showRepairHistory, setShowRepairHistory] = useState(false);
  const [computer, setComputer] = useState<ComputerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);

  // Fetch computer detail from API
  useEffect(() => {
    if (!id) return;

    const fetchComputerDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComputerDetail(id);
        setComputer(data);
        // Transform sang Asset format cho các sub-components
        const transformedAsset = transformComputerToAsset(data);
        setAsset(transformedAsset);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Lỗi khi tải thông tin máy tính";
        setError(errorMessage);
        console.error("Error fetching computer detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComputerDetail();
  }, [id]);

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

  const handleGoBack = () => {
    router.back();
  };

  const handleTabChange = (showRepairHistory: boolean) => {
    setShowRepairHistory(showRepairHistory);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin máy tính...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !asset || !computer) {
    return <DeviceNotFound onGoBack={handleGoBack} message={error} />;
  }

  const warrantyStatus = asset.warrantyExpiry 
    ? getWarrantyStatus(asset.warrantyExpiry) 
    : { label: "Không xác định", color: "text-gray-600" };
  
  // Get repair history từ repairSummary - format theo RepairHistoryItem interface
  const repairHistory = computer.repairSummary && computer.repairSummary.total > 0
    ? Array.from({ length: computer.repairSummary.total }, (_, i) => ({
        id: `repair-${i + 1}`,
        assetId: computer.asset.id,
        assetCode: computer.asset.ktCode,
        requestCode: `YCSC-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        errorType: "Lỗi hệ thống",
        description: "Yêu cầu sửa chữa thiết bị",
        status: i < computer.repairSummary!.inProgress ? "ĐANG_XỬ_LÝ" : "ĐÃ_HOÀN_THÀNH",
        reportDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        completedDate: i >= computer.repairSummary!.inProgress 
          ? new Date(Date.now() - (i - 1) * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        technicianId: "",
        technicianName: "Kỹ thuật viên",
        reporterId: "",
        reporterName: "Người báo cáo",
        steps: [],
      }))
    : [];

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

              <AssetSoftwareInfo asset={asset} />
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