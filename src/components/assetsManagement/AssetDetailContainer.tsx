"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Asset, RepairHistoryItem, ReplacementHistoryItem } from "@/types";
import { getComputerDetail } from "@/lib/api/computers";
import { getRepairs, getRepairLogs } from "@/lib/api/repairs";
import { getReplacementItemsByRepairRequest } from "@/lib/api/replacement-proposals";
import type { ComputerDetail } from "@/types/computer";
import TechnicianDeviceDetailHeader from "./AssetDetailHeader";
import DeviceNotFound from "./AssetNotFound";
import TechnicianDeviceTabNavigation from "./AssetTabNavigation";
import TechnicianDeviceBasicInfo from "./AssetBasicInfo";
import TechnicianDeviceSpecifications from "./AssetSpecifications";
import AssetSoftwareInfo from "./AssetSoftwareInfo";
import TechnicianRepairHistoryTab from "./RepairHistoryTab";

/**
 * Helper function: Transform ComputerDetail từ API sang Asset format
 * để tương thích với các sub-components hiện có
 */
const transformComputerToAsset = (computer: ComputerDetail): Asset => {
  return {
    id: computer.asset.id,
    ktCode: computer.asset.ktCode,
    name: computer.asset.name,
    category: computer.asset.categoryName || "Không xác định",
    specs: computer.asset.specs || "Không có thông số",
    fixedCode: computer.asset.fixedCode,
    roomId: computer.room?.id || "",
    roomName: computer.room?.name || "Không xác định",
    status: computer.asset.status, // API trả về string từ database enum
    purchaseDate: computer.asset.entrydate,
    origin: computer.asset.origin,
    qrCode: `QR_${computer.asset.ktCode}`,
    building: computer.room?.building,
    floor: computer.room?.floor,
    machineLabel: computer.machineLabel,
    componentCount: computer.componentCount,
    // Thêm các field mới từ API
    components: computer.components,
    software: computer.software,
    repairSummary: computer.repairSummary,
    // Bổ sung các trường từ room và computer
    roomNumber: computer.room?.roomNumber,
    roomCode: computer.room?.roomCode,
    notes: computer.notes,
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
  const [repairHistory, setRepairHistory] = useState<RepairHistoryItem[]>([]);
  const [loadingRepairHistory, setLoadingRepairHistory] = useState(false);

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

  // Fetch repair history with logs when asset is loaded
  useEffect(() => {
    if (!asset) return;

    const fetchRepairHistory = async () => {
      try {
        setLoadingRepairHistory(true);

        // Lấy tất cả repair requests cho asset này
        const repairsResponse = await getRepairs({
          computerAssetId: asset.id,
          sortBy: "createdAt",
          sortOrder: "DESC",
        });

        // Với mỗi repair request, fetch logs
        const historyWithLogs = await Promise.all(
          repairsResponse.data.map(async (repair) => {
            let replacementItems: ReplacementHistoryItem[] = [];
            try {
              const items = await getReplacementItemsByRepairRequest(repair.id);
              replacementItems = items.map((item) => ({
                id: item.id,
                oldComponentName: item.oldComponent?.name || item.oldComponent?.componentType,
                oldComponentSpecs: item.oldComponent?.componentSpecs,
                newItemName: item.newItemName,
                newItemSpecs: item.newItemSpecs,
                quantity: item.quantity,
                proposalStatus: item.proposalStatus,
              }));
            } catch (replacementError) {
              console.warn(
                `⚠️ Could not fetch replacement items for repair ${repair.id}:`,
                replacementError
              );
            }

            try {
              const logsResponse = await getRepairLogs(repair.id);
              
              return {
                id: repair.id,
                assetId: asset.id,
                requestCode: repair.requestCode,
                errorType: repair.errorType || "Không xác định",
                description: repair.description,
                solution: repair.resolutionNotes,
                status: repair.status,
                reportDate: repair.createdAt,
                completedDate: repair.completedAt,
                technicianName: repair.assignedTechnicianName || "Chưa phân công",
                reporterName: repair.reporterName || "Không xác định",
                // Transform logs để match với RepairHistoryItem.steps format
                steps: logsResponse.data.map((log) => ({
                  id: log.id,
                  action: log.action,
                  fromStatus: log.fromStatus || null,
                  toStatus: log.toStatus || null,
                  comment: log.comment,
                  createdAt: log.createdAt,
                  actorName: log.actor.fullName,
                  actorEmail: log.actor.email,
                })),
                replacementItems,
              } as RepairHistoryItem;
            } catch (logError) {
              console.warn(`⚠️ Could not fetch logs for repair ${repair.id}:`, logError);
              // Return repair without logs if logs fetch fails
              return {
                id: repair.id,
                assetId: asset.id,
                requestCode: repair.requestCode,
                errorType: repair.errorType || "Không xác định",
                description: repair.description,
                solution: repair.resolutionNotes,
                status: repair.status,
                reportDate: repair.createdAt,
                completedDate: repair.completedAt,
                technicianName: repair.assignedTechnicianName || "Chưa phân công",
                reporterName: repair.reporterName || "Không xác định",
                steps: [],
                replacementItems,
              } as RepairHistoryItem;
            }
          })
        );

        setRepairHistory(historyWithLogs);
      } catch (err) {
        console.error("Error fetching repair history:", err);
        setRepairHistory([]);
      } finally {
        setLoadingRepairHistory(false);
      }
    };

    fetchRepairHistory();
  }, [asset]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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

  return (
    <div className="space-y-6">
      <TechnicianDeviceDetailHeader
        asset={asset}
        onGoBack={handleGoBack}
      />

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        <TechnicianDeviceTabNavigation
          showRepairHistory={showRepairHistory}
          onTabChange={handleTabChange}
        />

        <div className="p-6">
          {!showRepairHistory ? (
            // Device Information Tab
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="col-span-2">
              <TechnicianDeviceBasicInfo asset={asset}/>
              </div>

              <TechnicianDeviceSpecifications asset={asset} />

              <AssetSoftwareInfo asset={asset} />
            </div>
          ) : (
            // Repair History Tab
            <>
              {loadingRepairHistory ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Đang tải lịch sử sửa chữa...</p>
                  </div>
                </div>
              ) : (
                <TechnicianRepairHistoryTab
                  repairHistory={repairHistory}
                  formatDate={formatDate}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}