import {
  ReplacementRequestItem,
  ReplacementProposalStatus,
  ComponentType,
} from "@/types";

// Interface for Report List (Tờ trình) containing multiple replacement requests
export interface ReportList {
  id: string;
  reportCode: string; // Mã tờ trình: TT-2025-0001
  title: string;
  description: string;
  status:
    | "CHỜ_LẬP_TỜ_TRÌNH"
    | "ĐÃ_LẬP_TỜ_TRÌNH"
    | "ĐÃ_DUYỆT_TỜ_TRÌNH"
    | "ĐÃ_TỪ_CHỐI_TỜ_TRÌNH";
  createdBy: string; // Tổ trưởng kỹ thuật
  createdAt: string;
  updatedAt: string;
  reportUrl?: string; // URL file tờ trình đã tạo
  items: ReplacementRequestItem[]; // Danh sách các đề xuất thay thế trong tờ trình này
}

// Mock data cho các đề xuất thay thế đã DUYỆT - sẵn sàng lập tờ trình
// Dữ liệu khớp chính xác với replacementRequests.ts - chỉ lấy các request có trạng thái ĐÃ_DUYỆT
export const mockApprovedReplacementRequests: ReplacementRequestItem[] = [
  {
    id: "RP002",
    proposalCode: "DXTT-2025-0002",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế nguồn điện Dell 200W PSU",
    description:
      "Đề xuất thay thế nguồn điện cho máy tính PC Dell OptiPlex 3080 tại phòng H101 do nguồn điện hiện tại đã bị cháy và có mùi khét. Cần thay thế bằng nguồn có công suất cao hơn để đảm bảo hoạt động ổn định.",
    status: ReplacementProposalStatus.ĐÃ_DUYỆT,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0002-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0002-verification.pdf",
    createdAt: "2024-01-16T02:00:00.000Z",
    updatedAt: "2024-01-18T07:30:00.000Z",
    createdBy: "Kỹ thuật viên",
    components: [
      {
        id: "RI002",
        componentName: "Dell 200W PSU",
        componentType: ComponentType.PSU,
        assetId: "ASSET001",
        assetName: "PC Dell OptiPlex 3080",
        ktCode: "19-0205/01",
        buildingName: "Tòa H",
        roomName: "H101",
        newItemName: "Dell 250W PSU",
        newItemSpecs: "250W 80+ Bronze certified - Higher wattage replacement",
        quantity: 1,
        reason: "Nguồn điện hiện tại bị cháy, có mùi khét",
        machineLabel: "01",
      },
    ],
  },
];

// Mock data cho report lists - chứa tờ trình đã nộp để phòng quản trị xử lý
export const mockReportLists: ReportList[] = [
  {
    id: "TT001",
    reportCode: "TT-2025-0001",
    title: "Tờ trình thay thế linh kiện máy tính tháng 1/2025",
    description:
      "Tờ trình đề xuất thay thế nguồn điện PC Dell OptiPlex 3080 tại phòng H101 trong tháng 1/2025",
    status: "ĐÃ_LẬP_TỜ_TRÌNH",
    createdBy: "user-3", // Tổ trưởng kỹ thuật
    createdAt: "2024-02-05T08:00:00.000Z",
    updatedAt: "2024-02-06T10:30:00.000Z",
    reportUrl: "/documents/reports/TT-2025-0001.pdf",
    items: [
      mockApprovedReplacementRequests[0], // RP002 - Dell PSU
    ],
  },
  {
    id: "TT002",
    reportCode: "TT-2025-0002",
    title: "Tờ trình thay thế linh kiện máy tính tháng 2/2025",
    description:
      "Tờ trình đề xuất thay thế nguồn điện máy tính khác tại phòng H102",
    status: "ĐÃ_DUYỆT_TỜ_TRÌNH",
    createdBy: "user-3", // Tổ trưởng kỹ thuật
    createdAt: "2024-01-20T08:00:00.000Z",
    updatedAt: "2024-01-22T14:20:00.000Z",
    reportUrl: "/documents/reports/TT-2025-0002.pdf",
    items: [],
  },
];

// Helper functions
export const getReportListsByStatus = (
  status: ReportList["status"]
): ReportList[] => {
  return mockReportLists.filter((list) => list.status === status);
};

export const getReportListById = (id: string): ReportList | undefined => {
  return mockReportLists.find((list) => list.id === id);
};

export const getAllApprovedReplacementRequests =
  (): ReplacementRequestItem[] => {
    return mockApprovedReplacementRequests;
  };

export const getReplacementRequestsByReportListId = (
  reportListId: string
): ReplacementRequestItem[] => {
  const reportList = getReportListById(reportListId);
  return reportList ? reportList.items : [];
};

// Function để tạo data cho trang lập tờ trình - lấy tất cả items từ các report list
export const getAllReplacementRequestsForReporting =
  (): ReplacementRequestItem[] => {
    const reportLists = getReportListsByStatus("CHỜ_LẬP_TỜ_TRÌNH");
    return reportLists.flatMap((list) => list.items);
  };

// Function để lấy tờ trình đã nộp cho phòng quản trị xử lý
export const getSubmittedReportLists = (): ReportList[] => {
  return mockReportLists.filter(
    (list) =>
      list.status === "ĐÃ_LẬP_TỜ_TRÌNH" ||
      list.status === "ĐÃ_DUYỆT_TỜ_TRÌNH" ||
      list.status === "ĐÃ_TỪ_CHỐI_TỜ_TRÌNH"
  );
};

// Function để lấy tờ trình chờ xử lý (đã lập chưa duyệt)
export const getPendingReportLists = (): ReportList[] => {
  return mockReportLists.filter((list) => list.status === "ĐÃ_LẬP_TỜ_TRÌNH");
};

// Status configuration cho report lists
export const reportListStatusConfig = {
  CHỜ_LẬP_TỜ_TRÌNH: {
    label: "Chờ lập tờ trình",
    color: "bg-yellow-100 text-yellow-800",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200",
  },
  ĐÃ_LẬP_TỜ_TRÌNH: {
    label: "Đã lập tờ trình",
    color: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    borderColor: "border-blue-200",
  },
  ĐÃ_DUYỆT_TỜ_TRÌNH: {
    label: "Đã duyệt tờ trình",
    color: "bg-green-100 text-green-800",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    borderColor: "border-green-200",
  },
  ĐÃ_TỪ_CHỐI_TỜ_TRÌNH: {
    label: "Đã từ chối tờ trình",
    color: "bg-red-100 text-red-800",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
} as const;
