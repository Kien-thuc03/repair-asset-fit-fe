import {
  CheckCircle,
  XCircle,
  Clock,
  Monitor,
  Wrench,
  LucideIcon,
} from "lucide-react";
import { SoftwareProposalStatus } from "@/types/software";

/**
 * Cấu hình trạng thái cho đề xuất phần mềm
 * Bao gồm màu sắc, text hiển thị và icon cho mỗi trạng thái
 */
export const SOFTWARE_PROPOSAL_STATUS_CONFIG: Record<
  SoftwareProposalStatus,
  {
    label: string;
    color: string;
    icon: LucideIcon;
  }
> = {
  [SoftwareProposalStatus.CHỜ_DUYỆT]: {
    label: "Chờ duyệt",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  [SoftwareProposalStatus.ĐÃ_DUYỆT]: {
    label: "Đã duyệt",
    color: "text-green-600 bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  [SoftwareProposalStatus.ĐÃ_TỪ_CHỐI]: {
    label: "Đã từ chối",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
  },
  [SoftwareProposalStatus.ĐANG_TRANG_BỊ]: {
    label: "Đang trang bị",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    icon: Wrench,
  },
  [SoftwareProposalStatus.ĐÃ_TRANG_BỊ]: {
    label: "Đã trang bị",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: Monitor,
  },
};

/**
 * Helper function để lấy cấu hình trạng thái
 * Trả về cấu hình mặc định nếu status không tồn tại
 */
export const getSoftwareProposalStatusConfig = (
  status: SoftwareProposalStatus
) => {
  return (
    SOFTWARE_PROPOSAL_STATUS_CONFIG[status] || {
      label: status,
      color: "text-gray-600 bg-gray-50 border-gray-200",
      icon: Monitor,
    }
  );
};

