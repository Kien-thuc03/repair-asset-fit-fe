import { RepairStatus } from "@/types";
import { CheckCircle, Clock, Wrench, XCircle, Pause } from "lucide-react";

/**
 * Configuration cho các trạng thái của yêu cầu sửa chữa
 * Bao gồm label, màu sắc, icon cho UI
 */
export const repairRequestStatusConfig = {
  [RepairStatus.CHỜ_TIẾP_NHẬN]: {
    label: "Chờ tiếp nhận",
    color: "border-yellow-200 text-yellow-800 bg-yellow-50",
    icon: Clock,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200",
  },
  [RepairStatus.ĐÃ_TIẾP_NHẬN]: {
    label: "Đã tiếp nhận",
    color: "border-blue-200 text-blue-800 bg-blue-50",
    icon: CheckCircle,
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
  },
  [RepairStatus.ĐANG_XỬ_LÝ]: {
    label: "Đang xử lý",
    color: "border-purple-200 text-purple-800 bg-purple-50",
    icon: Wrench,
    bgColor: "bg-purple-50",
    textColor: "text-purple-800",
    borderColor: "border-purple-200",
  },
  [RepairStatus.CHỜ_THAY_THẾ]: {
    label: "Chờ thay thế",
    color: "border-orange-200 text-orange-800 bg-orange-50",
    icon: Pause,
    bgColor: "bg-orange-50",
    textColor: "text-orange-800",
    borderColor: "border-orange-200",
  },
  [RepairStatus.ĐÃ_HOÀN_THÀNH]: {
    label: "Đã hoàn thành",
    color: "border-green-200 text-green-800 bg-green-50",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    borderColor: "border-green-200",
  },
  [RepairStatus.ĐÃ_HỦY]: {
    label: "Đã hủy",
    color: "border-red-200 text-red-800 bg-red-50",
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
};

/**
 * Helper function để lấy config của một trạng thái
 */
export const getStatusConfig = (status: RepairStatus) => {
  return repairRequestStatusConfig[status];
};

/**
 * Helper function để tính thời gian xử lý
 */
export const calculateProcessingTime = (
  createdAt: string,
  completedAt?: string
): string => {
  const start = new Date(createdAt);
  const end = completedAt ? new Date(completedAt) : new Date();
  const diffMs = end.getTime() - start.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} ngày ${diffHours % 24} giờ`;
  }
  return `${diffHours} giờ`;
};

/**
 * Helper function để lấy bước hiện tại trong progress steps
 */
export const getStatusStep = (status: RepairStatus): number => {
  const steps = [
    RepairStatus.CHỜ_TIẾP_NHẬN,
    RepairStatus.ĐÃ_TIẾP_NHẬN,
    RepairStatus.ĐANG_XỬ_LÝ,
    RepairStatus.ĐÃ_HOÀN_THÀNH,
  ];
  const currentIndex = steps.indexOf(status);
  return currentIndex >= 0 ? currentIndex : 0;
};

