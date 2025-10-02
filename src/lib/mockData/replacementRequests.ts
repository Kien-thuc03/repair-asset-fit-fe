import {
  ReplacementRequestItem,
  ComponentFromRequest,
  ReplacementStatus,
  ComponentType,
} from "@/types/repair";

export const mockReplacementRequestItem: ReplacementRequestItem[] = [
  {
    id: "RP001",
    proposalCode: "DXTT-2025-0001",
    proposerId: "user-1",
    teamLeadApproverId: "user-2",
    adminVerifierId: "user-3",
    title: "Đề xuất thay thế linh kiện máy tính phòng H2.15",
    description:
      "Máy tính trong phòng H2.15 gặp sự cố về bo mạch chủ và cần được thay thế để đảm bảo hoạt động giảng dạy.",
    status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0001-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0001-verification.pdf",
    createdAt: "2024-01-15T08:30:00.000Z",
    updatedAt: "2024-01-20T14:45:00.000Z",
    createdBy: "Nguyễn Văn A",
    components: [
      {
        id: "RI001",
        componentName: "ASUS Prime H410M-E",
        componentType: ComponentType.MAINBOARD,
        assetId: "ASSET001",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "19-0205/01",
        buildingName: "Tòa H",
        roomName: "H2.15",
        newItemName: "ASUS Prime B460M-A",
        newItemSpecs: "Socket LGA1200, DDR4 support, PCIe 3.0",
        quantity: 1,
        reason: "Bo mạch chủ hiện tại bị hỏng, không thể khởi động máy",
        machineLabel: "01",
      },
    ],
  },
  {
    id: "RP002",
    proposalCode: "DXTT-2025-0002",
    proposerId: "user-2",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-4",
    title: "Đề xuất nâng cấp RAM cho máy tính giảng dạy",
    description:
      "Nâng cấp RAM từ 4GB lên 8GB để cải thiện hiệu suất khi sử dụng các phần mềm giảng dạy.",
    status: ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0002-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0002-verification.pdf",
    createdAt: "2024-01-20T09:15:00.000Z",
    updatedAt: "2024-01-25T16:20:00.000Z",
    createdBy: "Trần Thị B",
    components: [
      {
        id: "RI002",
        componentName: "Kingston DDR4 4GB",
        componentType: ComponentType.RAM,
        assetId: "ASSET002",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "19-0205/02",
        buildingName: "Tòa H",
        roomName: "H2.15",
        newItemName: "Kingston DDR4 8GB",
        newItemSpecs: "8GB DDR4 2666MHz SODIMM",
        quantity: 1,
        reason: "RAM hiện tại không đủ để chạy phần mềm mới",
        machineLabel: "02",
      },
    ],
  },
  {
    id: "RP003",
    proposalCode: "DXTT-2025-0003",
    proposerId: "user-3",
    teamLeadApproverId: "user-2",
    adminVerifierId: "user-1",
    title: "Thay thế ổ cứng SSD cho máy chủ",
    description:
      "Ổ cứng SSD hiện tại đã xuất hiện bad sector, cần thay thế để tránh mất dữ liệu.",
    status: ReplacementStatus.ĐÃ_TỪ_CHỐI_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0003-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0003-verification.pdf",
    createdAt: "2024-02-01T10:00:00.000Z",
    updatedAt: "2024-02-05T11:30:00.000Z",
    createdBy: "Lê Văn C",
    components: [
      {
        id: "RI003",
        componentName: "Samsung SSD 256GB",
        componentType: ComponentType.STORAGE,
        assetId: "ASSET003",
        assetName: "Dell PowerEdge T40",
        assetCode: "SERVER-001",
        buildingName: "Tòa H",
        roomName: "H1.05",
        newItemName: "Samsung SSD 512GB",
        newItemSpecs: "512GB SATA 2.5' SSD, Read: 560MB/s",
        quantity: 1,
        reason: "SSD hiện tại có bad sector và hiệu suất giảm",
        machineLabel: "SVR01",
      },
    ],
  },
  {
    id: "RP004",
    proposalCode: "DXTT-2025-0004",
    proposerId: "user-4",
    teamLeadApproverId: "user-1",
    adminVerifierId: "user-2",
    title: "Đề xuất thay màn hình máy tính văn phòng",
    description:
      "Màn hình hiện tại bị mờ và có đốm, ảnh hưởng đến công việc của giảng viên.",
    status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0004-submission.pdf",
    verificationReportUrl: undefined,
    createdAt: "2024-02-10T14:20:00.000Z",
    updatedAt: "2024-02-10T14:20:00.000Z",
    createdBy: "Phạm Thị D",
    components: [
      {
        id: "RI004",
        componentName: 'LG 19M38A-B 18.5"',
        componentType: ComponentType.MONITOR,
        assetId: "ASSET004",
        assetName: "Monitor LG 19M38A",
        assetCode: "19-0205/04",
        buildingName: "Tòa H",
        roomName: "H3.02",
        newItemName: 'LG 22MK430H-B 21.5"',
        newItemSpecs: "21.5' IPS Panel, Full HD 1920x1080, 75Hz",
        quantity: 1,
        reason: "Màn hình bị mờ và xuất hiện các đốm đen",
        machineLabel: "04",
      },
    ],
  },
  {
    id: "RP005",
    proposalCode: "DXTT-2025-0005",
    proposerId: "user-1",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-4",
    title: "Nâng cấp nguồn máy tính phòng lab",
    description:
      "Nguồn máy tính không đủ công suất để hỗ trợ card đồ họa mới được lắp đặt.",
    status: ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0005-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0005-verification.pdf",
    createdAt: "2024-02-15T09:45:00.000Z",
    updatedAt: "2024-02-20T13:15:00.000Z",
    createdBy: "Hoàng Văn E",
    components: [
      {
        id: "RI005",
        componentName: "Cooler Master Elite 430W",
        componentType: ComponentType.PSU,
        assetId: "ASSET005",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "19-0205/05",
        buildingName: "Tòa H",
        roomName: "H4.01",
        newItemName: "Cooler Master MWE 650W",
        newItemSpecs: "650W 80+ Bronze, Modular cables, ATX",
        quantity: 1,
        reason: "Nguồn hiện tại không đủ công suất cho GPU mới",
        machineLabel: "05",
      },
    ],
  },
  {
    id: "RP006",
    proposalCode: "DXTT-2025-0006",
    proposerId: "user-2",
    teamLeadApproverId: "user-4",
    adminVerifierId: "user-1",
    title: "Thay thế màn hình cho phòng họp",
    description:
      "Thay thế 5 màn hình cũ trong phòng họp bằng màn hình mới có độ phân giải cao hơn.",
    status: ReplacementStatus.ĐÃ_LẬP_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0006-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0006-verification.pdf",
    createdAt: "2024-02-25T11:00:00.000Z",
    updatedAt: "2024-03-01T10:30:00.000Z",
    createdBy: "Vũ Thị F",
    components: [
      {
        id: "RI006_MONITOR_GROUP",
        componentName: 'Dell P2014H 20"',
        componentType: ComponentType.MONITOR,
        assetId: "ASSETS_MEETING_ROOM",
        assetName: "Monitor Dell P2014H",
        assetCode: "MEETING-MONITORS",
        buildingName: "Tòa H",
        roomName: "H1.01",
        newItemName: 'Dell P2422H 24"',
        newItemSpecs:
          "24' IPS, Full HD 1920x1080, USB-C Hub, Height Adjustable",
        quantity: 5,
        reason: "Màn hình cũ có độ phân giải thấp và kích thước nhỏ",
        machineLabel: "01-05",
      },
    ],
  },
  {
    id: "RP007",
    proposalCode: "DXTT-2025-0007",
    proposerId: "user-3",
    teamLeadApproverId: "user-1",
    adminVerifierId: "user-2",
    title: "Nâng cấp RAM cho lab máy tính",
    description:
      "Nâng cấp RAM cho 8 máy tính trong phòng lab để chạy được phần mềm mới.",
    status: ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0007-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0007-verification.pdf",
    createdAt: "2024-02-28T08:15:00.000Z",
    updatedAt: "2024-03-05T15:45:00.000Z",
    createdBy: "Đỗ Văn G",
    components: [
      {
        id: "RI007_RAM_GROUP",
        componentName: "Kingston DDR4 8GB",
        componentType: ComponentType.RAM,
        assetId: "ASSETS_LAB_H105",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "LAB-H105-GROUP",
        buildingName: "Tòa H",
        roomName: "H105",
        newItemName: "Kingston Fury Beast DDR4 16GB",
        newItemSpecs: "16GB 3200MHz DDR4 - Double capacity upgrade",
        quantity: 8,
        reason: "RAM hiện tại không đáp ứng yêu cầu phần mềm mới",
        machineLabel: "01-08",
      },
    ],
  },
  // Tờ trình nâng cấp Lab Khoa CNTT - gộp theo loại linh kiện và phòng
  {
    id: "RP008",
    proposalCode: "DXTT-2025-0008",
    proposerId: "user-4",
    teamLeadApproverId: "user-3",
    adminVerifierId: "user-2",
    title:
      "Đề xuất nâng cấp SSD và RAM cho các phòng Lab Khoa CNTT (H8.1, H8.2, H8.3)",
    description:
      "Đề xuất nâng cấp SSD và RAM cho tổng cộng 90 máy tính tại 3 phòng Lab của Khoa CNTT (H8.1: 30 máy, H8.2: 30 máy, H8.3: 30 máy). Mục đích phục vụ việc cập nhật phần mềm chuyên ngành mới nhất như Xử lý ảnh, Nhận dạng mẫu, Học sâu, Công nghệ mới để đáp ứng yêu cầu giảng dạy và nghiên cứu.",
    status: ReplacementStatus.ĐÃ_DUYỆT_TỜ_TRÌNH,
    submissionFormUrl: "/documents/proposals/DXTT-2025-0008-submission.pdf",
    verificationReportUrl: "/documents/reports/DXTT-2025-0008-verification.pdf",
    createdAt: "2024-03-01T09:00:00.000Z",
    updatedAt: "2024-03-10T16:30:00.000Z",
    createdBy: "Trưởng khoa CNTT",
    components: [
      // Lab H8.1 - SSD (30 máy)
      {
        id: "RI_H81_SSD_GROUP",
        componentName: "SSD 120GB SATA",
        componentType: ComponentType.STORAGE,
        assetId: "ASSETS_H81_GROUP",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "H8.1-GROUP",
        buildingName: "Tòa H",
        roomName: "H8.1",
        newItemName: "SSD M.2 NVMe 240GB",
        newItemSpecs:
          "240GB M.2 NVMe PCIe 3.0 - Upgrade cho phần mềm chuyên ngành",
        quantity: 30,
        reason:
          "SSD hiện tại chỉ 120GB không đủ cho các phần mềm xử lý ảnh và học sâu",
        machineLabel: "01-30",
      },
      // Lab H8.1 - RAM (30 máy)
      {
        id: "RI_H81_RAM_GROUP",
        componentName: "Kingston DDR4 8GB",
        componentType: ComponentType.RAM,
        assetId: "ASSETS_H81_GROUP",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "H8.1-GROUP",
        buildingName: "Tòa H",
        roomName: "H8.1",
        newItemName: "Kingston Fury Beast DDR4 16GB",
        newItemSpecs:
          "16GB DDR4 3200MHz - Upgrade cho ứng dụng AI và Machine Learning",
        quantity: 30,
        reason:
          "RAM 8GB không đủ để chạy các framework học sâu TensorFlow, PyTorch",
        machineLabel: "01-30",
      },
      // Lab H8.2 - SSD (30 máy)
      {
        id: "RI_H82_SSD_GROUP",
        componentName: "SSD 120GB SATA",
        componentType: ComponentType.STORAGE,
        assetId: "ASSETS_H82_GROUP",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "H8.2-GROUP",
        buildingName: "Tòa H",
        roomName: "H8.2",
        newItemName: "SSD M.2 NVMe 240GB",
        newItemSpecs:
          "240GB M.2 NVMe PCIe 3.0 - Upgrade cho phần mềm chuyên ngành",
        quantity: 30,
        reason: "SSD hiện tại chỉ 120GB không đủ cho dataset lớn và mô hình AI",
        machineLabel: "01-30",
      },
      // Lab H8.2 - RAM (30 máy)
      {
        id: "RI_H82_RAM_GROUP",
        componentName: "Kingston DDR4 8GB",
        componentType: ComponentType.RAM,
        assetId: "ASSETS_H82_GROUP",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "H8.2-GROUP",
        buildingName: "Tòa H",
        roomName: "H8.2",
        newItemName: "Kingston Fury Beast DDR4 16GB",
        newItemSpecs:
          "16GB DDR4 3200MHz - Upgrade cho ứng dụng AI và Machine Learning",
        quantity: 30,
        reason: "RAM 8GB không đủ để xử lý ảnh số và nhận dạng mẫu real-time",
        machineLabel: "01-30",
      },
      // Lab H8.3 - SSD (30 máy)
      {
        id: "RI_H83_SSD_GROUP",
        componentName: "SSD 120GB SATA",
        componentType: ComponentType.STORAGE,
        assetId: "ASSETS_H83_GROUP",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "H8.3-GROUP",
        buildingName: "Tòa H",
        roomName: "H8.3",
        newItemName: "SSD M.2 NVMe 240GB",
        newItemSpecs:
          "240GB M.2 NVMe PCIe 3.0 - Upgrade cho phần mềm chuyên ngành",
        quantity: 30,
        reason:
          "SSD hiện tại chỉ 120GB không đủ cho môi trường phát triển và IDE",
        machineLabel: "01-30",
      },
      // Lab H8.3 - RAM (30 máy)
      {
        id: "RI_H83_RAM_GROUP",
        componentName: "Kingston DDR4 8GB",
        componentType: ComponentType.RAM,
        assetId: "ASSETS_H83_GROUP",
        assetName: "PC Dell OptiPlex 3070",
        assetCode: "H8.3-GROUP",
        buildingName: "Tòa H",
        roomName: "H8.3",
        newItemName: "Kingston Fury Beast DDR4 16GB",
        newItemSpecs:
          "16GB DDR4 3200MHz - Upgrade cho ứng dụng AI và Machine Learning",
        quantity: 30,
        reason:
          "RAM 8GB không đủ để chạy đồng thời nhiều công cụ phát triển AI",
        machineLabel: "01-30",
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
