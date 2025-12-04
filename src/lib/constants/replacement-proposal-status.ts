import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { ReplacementProposalStatus } from "@/types/repair";

/**
 * Cấu hình trạng thái cho đề xuất thay thế linh kiện
 * Bao gồm màu sắc, text hiển thị và icon cho mỗi trạng thái
 */
export const REPLACEMENT_PROPOSAL_STATUS_CONFIG: Record<
  ReplacementProposalStatus,
  {
    color: string;
    text: string;
    icon: React.ElementType;
  }
> = {
  [ReplacementProposalStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT]: {
    color: "orange",
    text: "Chờ Tổ trưởng duyệt",
    icon: Clock,
  },
  [ReplacementProposalStatus.KHOA_ĐÃ_DUYỆT_TỜ_TRÌNH]: {
    color: "lime",
    text: "Khoa đã duyệt tờ trình",
    icon: CheckCircle,
  },
  [ReplacementProposalStatus.CHỜ_XÁC_MINH]: {
    color: "blue",
    text: "Chờ xác minh",
    icon: AlertTriangle,
  },
  [ReplacementProposalStatus.ĐÃ_DUYỆT]: {
    color: "green",
    text: "Đã duyệt",
    icon: CheckCircle,
  },
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI]: {
    color: "red",
    text: "Đã từ chối",
    icon: XCircle,
  },
  [ReplacementProposalStatus.ĐÃ_XÁC_MINH]: {
    color: "purple",
    text: "Đã xác minh",
    icon: CheckCircle,
  },
  [ReplacementProposalStatus.ĐÃ_LẬP_TỜ_TRÌNH]: {
    color: "geekblue",
    text: "Đã lập tờ trình",
    icon: FileText,
  },
  [ReplacementProposalStatus.ĐÃ_DUYỆT_TỜ_TRÌNH]: {
    color: "lime",
    text: "Đã duyệt tờ trình",
    icon: CheckCircle,
  },
  [ReplacementProposalStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH]: {
    color: "volcano",
    text: "Đã từ chối tờ trình",
    icon: XCircle,
  },
  [ReplacementProposalStatus.ĐÃ_GỬI_BIÊN_BẢN]: {
    color: "cyan",
    text: "Đã gửi biên bản",
    icon: FileText,
  },
  [ReplacementProposalStatus.ĐÃ_KÝ_BIÊN_BẢN]: {
    color: "geekblue",
    text: "Đã ký biên bản",
    icon: CheckCircle,
  },
  [ReplacementProposalStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM]: {
    color: "purple",
    text: "Đã hoàn tất mua sắm",
    icon: CheckCircle,
  },
};

/**
 * Helper function để lấy cấu hình trạng thái
 * Trả về cấu hình mặc định nếu status không tồn tại
 */
export const getReplacementProposalStatusConfig = (
  status: ReplacementProposalStatus
) => {
  return (
    REPLACEMENT_PROPOSAL_STATUS_CONFIG[status] || {
      color: "default",
      text: status,
      icon: Clock,
    }
  );
};
