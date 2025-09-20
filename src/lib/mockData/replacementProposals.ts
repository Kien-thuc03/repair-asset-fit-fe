// Mock replacement proposals - Synchronized with database-sync.json
// For to-truong-ky-thuat pages - replacement proposal management

export interface ReplacementProposal {
  id: string;
  repairRequestId: string;
  proposalCode: string;
  proposerId: string;
  proposerName: string;
  teamLeadApproverId: string | null;
  teamLeadApproverName?: string;
  adminVerifierId: string | null;
  adminVerifierName?: string;
  status:
    | "CHỜ_TỔ_TRƯỞNG_DUYỆT"
    | "CHỜ_ADMIN_XÁC_NHẬN"
    | "ĐÃ_DUYỆT"
    | "ĐÃ_TỪ_CHỐI";
  submissionFormUrl: string;
  verificationReportUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // Related data for display
  assetCode?: string;
  assetName?: string;
  roomName?: string;
  componentName?: string;
  reason?: string;
}

export interface ReplacementItem {
  id: string;
  proposalId: string;
  oldComponentId: string;
  oldComponentName?: string;
  newItemName: string;
  newItemSpecs: string;
  quantity: number;
  reason: string;
  newlyPurchasedAssetId: string | null;
}

// Mock replacement proposals for team leader approval
export const mockReplacementProposals: ReplacementProposal[] = [
  {
    id: "RP001",
    repairRequestId: "req-002",
    proposalCode: "DXTT-2025-0001",
    proposerId: "user-8",
    proposerName: "Anh Tuấn",
    teamLeadApproverId: "user-3",
    teamLeadApproverName: "Tổ trưởng Kỹ thuật",
    adminVerifierId: null,
    adminVerifierName: undefined,
    status: "CHỜ_TỔ_TRƯỞNG_DUYỆT",
    submissionFormUrl: "/documents/proposals/DXTT-2025-0001-submission.pdf",
    verificationReportUrl: null,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    // Related display data
    assetCode: "19-0205/02",
    assetName: "PC Dell OptiPlex 3080",
    roomName: "H101",
    componentName: "Kingston Fury Beast DDR4 16GB",
    reason: "RAM hiện tại gây lỗi màn hình xanh thường xuyên",
  },
  {
    id: "RP002",
    repairRequestId: "req-001",
    proposalCode: "DXTT-2025-0002",
    proposerId: "user-9",
    proposerName: "Văn Đạt",
    teamLeadApproverId: "user-3",
    teamLeadApproverName: "Tổ trưởng Kỹ thuật",
    adminVerifierId: "user-2",
    adminVerifierName: "Nhân viên Phòng Quản trị",
    status: "ĐÃ_DUYỆT",
    submissionFormUrl: "/documents/proposals/DXTT-2025-0002-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0002-verification.pdf",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
    // Related display data
    assetCode: "19-0205/01",
    assetName: "PC Dell OptiPlex 3080",
    roomName: "H101",
    componentName: "Dell 200W PSU",
    reason: "Nguồn điện hiện tại bị cháy, có mùi khét",
  },
  {
    id: "RP003",
    repairRequestId: "req-005",
    proposalCode: "DXTT-2025-0003",
    proposerId: "user-8",
    proposerName: "Anh Tuấn",
    teamLeadApproverId: "user-3",
    teamLeadApproverName: "Tổ trưởng Kỹ thuật",
    adminVerifierId: null,
    adminVerifierName: undefined,
    status: "CHỜ_ADMIN_XÁC_NHẬN",
    submissionFormUrl: "/documents/proposals/DXTT-2025-0003-submission.pdf",
    verificationReportUrl: null,
    createdAt: "2024-01-20T11:30:00Z",
    updatedAt: "2024-01-21T09:15:00Z",
    // Related display data
    assetCode: "19-0207/03",
    assetName: "PC HP ProDesk 400",
    roomName: "H102",
    componentName: "WD Blue SSD 512GB",
    reason: "SSD hiện tại có bad sectors nghiêm trọng, không thể sử dụng được",
  },
  {
    id: "RP004",
    repairRequestId: "req-008",
    proposalCode: "DXTT-2025-0004",
    proposerId: "user-9",
    proposerName: "Văn Đạt",
    teamLeadApproverId: "user-3",
    teamLeadApproverName: "Tổ trưởng Kỹ thuật",
    adminVerifierId: null,
    adminVerifierName: undefined,
    status: "ĐÃ_TỪ_CHỐI",
    submissionFormUrl: "/documents/proposals/DXTT-2025-0004-submission.pdf",
    verificationReportUrl: null,
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-19T10:30:00Z",
    // Related display data
    assetCode: "19-0206/02",
    assetName: "PC Lenovo ThinkCentre - Máy 02",
    roomName: "H103",
    componentName: "Logitech MX Keys",
    reason: "Bàn phím cơ học bị kẹt một số phím, cần thay thế",
  },
];

// Mock replacement items corresponding to proposals
export const mockReplacementItems: ReplacementItem[] = [
  {
    id: "RI001",
    proposalId: "RP001",
    oldComponentId: "CC013",
    oldComponentName: "Kingston Fury Beast DDR4 16GB",
    newItemName: "Kingston Fury Beast DDR4",
    newItemSpecs: "16GB 3200MHz DDR4 - Same specification replacement",
    quantity: 1,
    reason: "RAM hiện tại gây lỗi màn hình xanh thường xuyên",
    newlyPurchasedAssetId: null,
  },
  {
    id: "RI002",
    proposalId: "RP002",
    oldComponentId: "CC005",
    oldComponentName: "Dell 200W PSU",
    newItemName: "Dell 250W PSU",
    newItemSpecs: "250W 80+ Bronze certified - Higher wattage replacement",
    quantity: 1,
    reason: "Nguồn điện hiện tại bị cháy, có mùi khét",
    newlyPurchasedAssetId: null,
  },
  {
    id: "RI003",
    proposalId: "RP003",
    oldComponentId: "CC024",
    oldComponentName: "WD Blue SSD 512GB",
    newItemName: "Samsung 980 SSD",
    newItemSpecs: "512GB NVMe M.2 PCIe 3.0 - Replacement for faulty drive",
    quantity: 1,
    reason: "SSD hiện tại có bad sectors nghiêm trọng, không thể sử dụng được",
    newlyPurchasedAssetId: null,
  },
  {
    id: "RI004",
    proposalId: "RP004",
    oldComponentId: "CC045",
    oldComponentName: "Logitech MX Keys",
    newItemName: "Logitech K380",
    newItemSpecs: "Wireless compact keyboard with multi-device connection",
    quantity: 1,
    reason: "Bàn phím cơ học bị kẹt một số phím, cần thay thế",
    newlyPurchasedAssetId: null,
  },
];

// Status configuration for replacement proposals
export const replacementProposalStatusConfig = {
  CHỜ_TỔ_TRƯỞNG_DUYỆT: {
    label: "Chờ tổ trưởng duyệt",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    badge: "warning",
  },
  CHỜ_ADMIN_XÁC_NHẬN: {
    label: "Chờ admin xác nhận",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    badge: "processing",
  },
  ĐÃ_DUYỆT: {
    label: "Đã duyệt",
    color: "bg-green-100 text-green-800 border-green-200",
    badge: "success",
  },
  ĐÃ_TỪ_CHỐI: {
    label: "Đã từ chối",
    color: "bg-red-100 text-red-800 border-red-200",
    badge: "error",
  },
};
