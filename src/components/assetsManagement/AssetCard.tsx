"use client";
import { useState, useEffect } from "react";
import { Monitor, Eye, QrCode } from "lucide-react";
import { Asset, DeviceAsset, ComponentStatus } from "@/types";
import { getAssetStatusDisplay } from "@/lib/constants/assetStatus";
import { getComputerDetail } from "@/lib/api/computers";

interface DeviceCardProps {
  asset: Asset | DeviceAsset;
  onViewDetail: (assetId: string) => void;
  onShowQR?: (asset: DeviceAsset) => void;
}

export default function DeviceCard({ asset, onViewDetail, onShowQR }: DeviceCardProps) {
  const statusConfig = getAssetStatusDisplay(asset.status);
  const isDeviceAsset = (a: Asset | DeviceAsset): a is DeviceAsset => "computerId" in a;
  const canShowQR = isDeviceAsset(asset) && !!asset.computerId;

  const getInitialCount = (): number | undefined => {
    // Ưu tiên tính từ components array (nếu có) - lọc bỏ REMOVED
    if ('components' in asset && asset.components && Array.isArray(asset.components)) {
      return asset.components.filter(
        (component) => component.status !== ComponentStatus.REMOVED
      ).length;
    }
    return undefined;
  };

  const [componentCount, setComponentCount] = useState<number | undefined>(getInitialCount);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  // Fetch component count từ API nếu cần
  useEffect(() => {
    // Nếu đã có componentCount từ asset hoặc components, không cần fetch
    const initialCount = getInitialCount();
    if (initialCount !== undefined && initialCount !== null) {
      if (componentCount !== initialCount) {
        setComponentCount(initialCount);
      }
      return;
    }

    // Nếu không có, fetch từ API
    let isMounted = true;
    const fetchComponentCount = async () => {
      try {
        setIsLoadingCount(true);
        const computerDetail = await getComputerDetail(asset.id);
        
        if (!isMounted) return;
        
        // LUÔN ưu tiên tính từ components array và lọc bỏ REMOVED
        if (computerDetail.components && Array.isArray(computerDetail.components)) {
          const count = computerDetail.components.filter(
            (component) => component.status !== ComponentStatus.REMOVED
          ).length;
          setComponentCount(count);
        } else if (computerDetail.componentCount !== undefined) {
          console.warn(`Asset ${asset.id}: Không có components array, dùng componentCount (có thể không chính xác)`);
          setComponentCount(computerDetail.componentCount);
        } else {
          setComponentCount(0);
        }
      } catch (error) {
        console.error("Error fetching component count:", error);
        // Nếu lỗi, hiển thị 0
        if (isMounted) {
          setComponentCount(0);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCount(false);
        }
      }
    };

    fetchComponentCount();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.id, asset.componentCount, 'components' in asset ? asset.components : null]);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-gray-900 truncate max-w-32">
                {asset.name}
              </p>
              <p className="text-sm text-gray-500 font-mono">{asset.ktCode}</p>
            </div>
          </div>
          <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${statusConfig.badgeClass}`}>
            <span className="truncate">
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              Thông số kĩ thuật:
            </span>
            <span className="text-gray-900 text-right max-w-32 truncate" title={'specs' in asset ? asset.specs : 'N/A'}>
              {'specs' in asset ? asset.specs : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phòng:</span>
            <span className="text-gray-900 font-medium">{asset.roomName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 flex items-center">
              Số linh kiện:
            </span>
            <span className="text-gray-900 font-medium">
              {isLoadingCount ? (
                <span className="text-gray-400">Đang tải...</span>
              ) : (
                componentCount ?? 0
              )}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => onViewDetail(asset.id)}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </button>
          {onShowQR && (
            <button
              onClick={() => {
                if (canShowQR) {
                  onShowQR(asset);
                }
              }}
              disabled={!canShowQR}
              className={`w-full inline-flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                canShowQR
                  ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
              }`}>
              <QrCode className="w-4 h-4 mr-2" />
              {canShowQR ? "QR thiết bị" : "Không có QR"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}