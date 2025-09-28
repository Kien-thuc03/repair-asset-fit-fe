import {
  ReplacementRequestItem,
  ComponentFromRequest,
  ReplacementStatus,
  ComponentType,
} from "@/types/repair";

// Mock replacement requests data - Khớp chính xác với database ReplacementProposals (chỉ 2 bản ghi)
export const mockReplacementRequestItem: ReplacementRequestItem[] = [
  {
    id: "RP001",
    proposalCode: "DXTT-2025-0001",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: undefined,
    title: "Đề xuất thay thế linh kiện máy tính PC Dell OptiPlex 3080 tại H101",
    description:
      "Đề xuất thay thế SSD và RAM cho máy tính PC Dell OptiPlex 3080 do các linh kiện bị hỏng và không thể hoạt động bình thường. SSD có bad sectors nghiêm trọng và RAM gây lỗi màn hình xanh thường xuyên.",
    status: ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
    submissionFormUrl: undefined,
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
        reason:
          "SSD hiện tại có bad sectors nghiêm trọng, không thể sử dụng được",
        machineLabel: "02",
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
        machineLabel: "02",
      },
    ],
  },
  {
    id: "RP002",
    proposalCode: "DXTT-2025-0002",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế nguồn điện Dell 200W PSU",
    description:
      "Đề xuất thay thế nguồn điện cho máy tính PC Dell OptiPlex 3080 tại phòng H101 do nguồn điện hiện tại đã bị cháy và có mùi khét. Cần thay thế bằng nguồn có công suất cao hơn để đảm bảo hoạt động ổn định.",
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
        machineLabel: "01",
      },
    ],
  },
  // Thêm dữ liệu cho status ĐÃ_XÁC_MINH (Phòng Quản trị đã xác minh, chờ lập tờ trình)
  {
    id: "RP003",
    proposalCode: "DXTT-2025-0003",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế RAM và SSD cho máy tính H102",
    description:
      "Đề xuất thay thế RAM 8GB và SSD 256GB cho máy tính tại phòng H102 do RAM bị lỗi và SSD có bad sectors. Đã được Phòng Quản trị xác minh và chờ lập tờ trình.",
    status: ReplacementStatus.ĐÃ_XÁC_MINH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0003-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0003-verification.pdf",
    createdAt: "2024-01-20T08:00:00.000Z",
    updatedAt: "2024-01-22T14:30:00.000Z",
    createdBy: "Kỹ thuật viên",
    components: [
      {
        id: "RI004",
        componentName: "Kingston DDR4 8GB",
        componentType: ComponentType.RAM,
        assetId: "ASSET003",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "19-0205/03",
        buildingName: "Tòa H",
        roomName: "H102",
        newItemName: "Kingston Fury Beast DDR4 16GB",
        newItemSpecs: "16GB 3200MHz DDR4 - Upgrade from 8GB",
        quantity: 1,
        reason:
          "RAM 8GB hiện tại bị lỗi, gây tình trạng máy tính restart bất thường",
        machineLabel: "03",
      },
      {
        id: "RI005",
        componentName: "SanDisk SSD Plus 256GB",
        componentType: ComponentType.STORAGE,
        assetId: "ASSET003",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "19-0205/03",
        buildingName: "Tòa H",
        roomName: "H102",
        newItemName: "Samsung 980 SSD 512GB",
        newItemSpecs: "512GB NVMe M.2 PCIe 3.0 - Double capacity upgrade",
        quantity: 1,
        reason: "SSD hiện tại có nhiều bad sectors, tốc độ đọc/ghi chậm",
        machineLabel: "03",
      },
    ],
  },
  // Thêm dữ liệu cho status ĐÃ_LẬP_TỜ_TRÌNH (Tổ trưởng đã lập tờ trình gửi Phòng Quản trị)
  {
    id: "RP004",
    proposalCode: "DXTT-2025-0004",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế bo mạch chủ máy tính H103",
    description:
      "Đề xuất thay thế bo mạch chủ cho máy tính tại phòng H103 do bo mạch chủ bị hư hỏng không sửa được. Tổ trưởng đã lập tờ trình gửi Phòng Quản trị để xử lý.",
    status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0004-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0004-verification.pdf",
    createdAt: "2024-01-25T09:00:00.000Z",
    updatedAt: "2024-01-28T16:45:00.000Z",
    createdBy: "Kỹ thuật viên",
    components: [
      {
        id: "RI006",
        componentName: "ASUS H310M-E",
        componentType: ComponentType.MAINBOARD,
        assetId: "ASSET004",
        assetName: "PC Dell OptiPlex 3060",
        assetCode: "19-0205/04",
        buildingName: "Tòa H",
        roomName: "H103",
        newItemName: "ASUS H510M-K",
        newItemSpecs: "Intel H510 chipset, Socket LGA1200, DDR4 support",
        quantity: 1,
        reason:
          "Bo mạch chủ hiện tại bị hư hỏng cổng USB và slot RAM, không thể sửa chữa",
        machineLabel: "04",
      },
    ],
  },
  // Thêm dữ liệu cho status ĐÃ_DUYỆT_TỜ_TRÌNH (Phòng Quản trị đã duyệt tờ trình)
  {
    id: "RP005",
    proposalCode: "DXTT-2025-0005",
    proposerId: "user-8",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế card đồ họa cho phòng máy H201",
    description:
      "Đề xuất thay thế card đồ họa cho máy tính tại phòng H201 phục vụ môn học đồ họa máy tính. Phòng Quản trị đã duyệt tờ trình và chuẩn bị tiến hành mua sắm.",
    status: ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0005-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0005-verification.pdf",
    createdAt: "2024-02-01T10:30:00.000Z",
    updatedAt: "2024-02-05T11:20:00.000Z",
    createdBy: "Anh Tuấn",
    components: [
      {
        id: "RI007",
        componentName: "GTX 1050 Ti",
        componentType: ComponentType.GPU,
        assetId: "ASSET005",
        assetName: "PC Dell OptiPlex 5080",
        assetCode: "19-0205/05",
        buildingName: "Tòa H",
        roomName: "H201",
        newItemName: "GTX 1660 Super",
        newItemSpecs:
          "6GB GDDR6, 1408 CUDA Cores, Performance upgrade for graphics work",
        quantity: 1,
        reason:
          "Card đồ họa hiện tại không đủ mạnh cho các phần mềm đồ họa chuyên nghiệp",
        machineLabel: "05",
      },
    ],
  },
  // Thêm dữ liệu cho status ĐÃ_TỪ_CHỐI_TỜ_TRÌNH (Phòng Quản trị từ chối tờ trình)
  {
    id: "RP006",
    proposalCode: "DXTT-2025-0006",
    proposerId: "user-9",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title: "Đề xuất thay thế màn hình LCD 24 inch",
    description:
      "Đề xuất thay thế màn hình LCD cho máy tính tại phòng H104. Tờ trình bị từ chối do chưa có biên bản kiểm tra chi tiết về tình trạng màn hình.",
    status: ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0006-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0006-verification.pdf",
    createdAt: "2024-02-08T14:00:00.000Z",
    updatedAt: "2024-02-12T09:15:00.000Z",
    createdBy: "Văn Đạt",
    components: [
      {
        id: "RI008",
        componentName: "Dell P2414H 24 inch",
        componentType: ComponentType.MONITOR,
        assetId: "ASSET006",
        assetName: "PC Dell OptiPlex 3080",
        assetCode: "19-0205/06",
        buildingName: "Tòa H",
        roomName: "H104",
        newItemName: "Dell P2722H 27 inch",
        newItemSpecs: "27 inch Full HD IPS monitor with USB-C connectivity",
        quantity: 1,
        reason: "Màn hình hiện tại có vết nứt nhỏ ở góc và độ sáng giảm",
        machineLabel: "06",
      },
    ],
  },
];

// Helper functions
export const getReplacementRequestById = (
  id: string
): ReplacementRequestItem | undefined => {
  return mockReplacementRequestItem.find((request) => request.id === id);
};

export const getReplacementRequestsByStatus = (
  status: ReplacementStatus
): ReplacementRequestItem[] => {
  return mockReplacementRequestItem.filter(
    (request) => request.status === status
  );
};

export const getReplacementRequestsByAssetId = (
  assetId: string
): ReplacementRequestItem[] => {
  return mockReplacementRequestItem.filter((request) =>
    request.components.some((component) => component.assetId === assetId)
  );
};

export const getComponentsFromReplacementRequest = (
  requestId: string
): ComponentFromRequest[] => {
  const request = getReplacementRequestById(requestId);
  return request ? request.components : [];
};
