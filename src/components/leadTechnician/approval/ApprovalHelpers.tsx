import { ReplacementStatus } from "@/types";

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    [ReplacementStatus.CHỜ_XÁC_MINH]: "bg-yellow-100 text-yellow-800",
    [ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: "bg-orange-100 text-orange-800",
    [ReplacementStatus.ĐÃ_DUYỆT]: "bg-green-100 text-green-800",
    [ReplacementStatus.ĐÃ_TỪ_CHỐI]: "bg-red-100 text-red-800",
  };
  return (
    statusConfig[status as keyof typeof statusConfig] ||
    "bg-gray-100 text-gray-800"
  );
};

export const getStatusText = (status: string) => {
  const statusLabels = {
    [ReplacementStatus.CHỜ_XÁC_MINH]: "Chờ xác minh",
    [ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: "Chờ tổ trưởng duyệt",
    [ReplacementStatus.ĐÃ_DUYỆT]: "Đã duyệt",
    [ReplacementStatus.ĐÃ_TỪ_CHỐI]: "Đã từ chối",
  };
  return statusLabels[status as keyof typeof statusLabels] || status;
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
        status
      )}`}>
      {getStatusText(status)}
    </span>
  );
}

export const getUserRole = () => {
  return "Kỹ thuật viên";
};

export const getComponentInfo = () => {
  // This would normally come from a database or API based on assetCode
  // For now, using fallback data
  return {
    componentName: "Linh kiện cần thay thế",
    componentSpecs: "Thông số kỹ thuật",
  };
};
