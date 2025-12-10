import { AssetStatus, ASSET_STATUS_LABELS } from "@/types/computer";

type BadgeColorKey = "green" | "blue" | "orange" | "red" | "gray" | "purple" | "black";

const badgeColorClassMap: Record<BadgeColorKey, string> = {
  green: "bg-green-100 text-green-800 border-green-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  red: "bg-red-100 text-red-800 border-red-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  black: "bg-gray-100 text-gray-800 border-gray-200",
};

export const assetStatusConfig: Record<string, { label: string; colorKey: BadgeColorKey; badgeClass: string }> = {
  [AssetStatus.IN_USE]: {
    label: ASSET_STATUS_LABELS[AssetStatus.IN_USE],
    colorKey: "green",
    badgeClass: badgeColorClassMap.green,
  },
  [AssetStatus.WAITING_HANDOVER]: {
    label: ASSET_STATUS_LABELS[AssetStatus.WAITING_HANDOVER],
    colorKey: "blue",
    badgeClass: badgeColorClassMap.blue,
  },
  [AssetStatus.WAITING_RECEIVE]: {
    label: ASSET_STATUS_LABELS[AssetStatus.WAITING_RECEIVE],
    colorKey: "blue",
    badgeClass: badgeColorClassMap.blue,
  },
  [AssetStatus.WAITING_ALLOCATION]: {
    label: ASSET_STATUS_LABELS[AssetStatus.WAITING_ALLOCATION],
    colorKey: "blue",
    badgeClass: badgeColorClassMap.blue,
  },
  [AssetStatus.DAMAGED]: {
    label: ASSET_STATUS_LABELS[AssetStatus.DAMAGED],
    colorKey: "orange",
    badgeClass: badgeColorClassMap.orange,
  },
  [AssetStatus.LOST]: {
    label: ASSET_STATUS_LABELS[AssetStatus.LOST],
    colorKey: "red",
    badgeClass: badgeColorClassMap.red,
  },
  [AssetStatus.PROPOSED_LIQUIDATION]: {
    label: ASSET_STATUS_LABELS[AssetStatus.PROPOSED_LIQUIDATION],
    colorKey: "purple",
    badgeClass: badgeColorClassMap.purple,
  },
  [AssetStatus.LIQUIDATED]: {
    label: ASSET_STATUS_LABELS[AssetStatus.LIQUIDATED],
    colorKey: "gray",
    badgeClass: badgeColorClassMap.gray,
  },
};

export const getAssetStatusDisplay = (status: AssetStatus | string) => {
  return (
    assetStatusConfig[status] || {
      label: typeof status === "string" ? status : "Không xác định",
      colorKey: "gray",
      badgeClass: badgeColorClassMap.gray,
    }
  );
};

