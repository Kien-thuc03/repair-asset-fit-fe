import { ReplacementRequestForTechnician, ComponentFromRequest, ReplacementStatus, ComponentType } from '@/types/repair';

// Mock replacement requests data - Khớp chính xác với database ReplacementProposals (chỉ 2 bản ghi)
export const mockReplacementRequestsForTechnician: ReplacementRequestForTechnician[] = [
  {
    id: "RP001",
    proposalCode: "DXTT-2025-0001",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: undefined,
    title: "Đề xuất thay thế linh kiện máy tính PC Dell OptiPlex 3080 tại H101",
    description: "Đề xuất thay thế SSD và RAM cho máy tính PC Dell OptiPlex 3080 do các linh kiện bị hỏng và không thể hoạt động bình thường. SSD có bad sectors nghiêm trọng và RAM gây lỗi màn hình xanh thường xuyên.",
    status: ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0001-submission.pdf",
    verificationReportUrl: undefined,
    createdAt: "2024-01-15T03:00:00.000Z",
    updatedAt: "2024-01-15T03:00:00.000Z",
    createdBy: "Kỹ thuật viên",
    components: [
      {
        id: "RI001",
        componentName: "Samsung 980 SSD",
        componentType: ComponentType.STORAGE,
        assetId: "ASSET002",
        assetName: "PC Dell OptiPlex 3080",
        assetCode: "19-0205/02",
        buildingName: "Tòa H",
        roomName: "H101",
        newItemName: "Samsung 980 SSD",
        newItemSpecs: "512GB NVMe M.2 PCIe 3.0 - Replacement for faulty drive",
        quantity: 1,
        reason: "SSD hiện tại có bad sectors nghiêm trọng, không thể sử dụng được",
        machineLabel: "02"
      },
      {
        id: "RI003",
        componentName: "Kingston Fury Beast DDR4",
        componentType: ComponentType.RAM,
        assetId: "ASSET002",
        assetName: "PC Dell OptiPlex 3080",
        assetCode: "19-0205/02",
        buildingName: "Tòa H",
        roomName: "H101",
        newItemName: "Kingston Fury Beast DDR4",
        newItemSpecs: "16GB 3200MHz DDR4 - Same specification replacement",
        quantity: 1,
        reason: "RAM hiện tại gây lỗi màn hình xanh thường xuyên",
        machineLabel: "02"
      }
    ]
  },
  {
    id: "RP002",
    proposalCode: "DXTT-2025-0002",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế nguồn điện Dell 200W PSU",
    description: "Đề xuất thay thế nguồn điện cho máy tính PC Dell OptiPlex 3080 tại phòng H101 do nguồn điện hiện tại đã bị cháy và có mùi khét. Cần thay thế bằng nguồn có công suất cao hơn để đảm bảo hoạt động ổn định.",
    status: ReplacementStatus.ĐÃ_DUYỆT,
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
        assetCode: "19-0205/01",
        buildingName: "Tòa H",
        roomName: "H101",
        newItemName: "Dell 250W PSU",
        newItemSpecs: "250W 80+ Bronze certified - Higher wattage replacement",
        quantity: 1,
        reason: "Nguồn điện hiện tại bị cháy, có mùi khét",
        machineLabel: "01"
      }
    ]
  }
];

// Helper functions
export const getReplacementRequestById = (id: string): ReplacementRequestForTechnician | undefined => {
  return mockReplacementRequestsForTechnician.find(request => request.id === id);
};

export const getReplacementRequestsByStatus = (status: ReplacementStatus): ReplacementRequestForTechnician[] => {
  return mockReplacementRequestsForTechnician.filter(request => request.status === status);
};

export const getReplacementRequestsByAssetId = (assetId: string): ReplacementRequestForTechnician[] => {
  return mockReplacementRequestsForTechnician.filter(request => 
    request.components.some(component => component.assetId === assetId)
  );
};

export const getComponentsFromReplacementRequest = (requestId: string): ComponentFromRequest[] => {
  const request = getReplacementRequestById(requestId);
  return request ? request.components : [];
};