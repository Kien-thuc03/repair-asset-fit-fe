import { ReplacementStatus, ComponentType, ReplacementRequestForTechnician, ComponentFromRequest, ComponentFromReport } from "@/types";

// Synchronized with database-sync.json
export const mockReplacementRequestsForTechnician: ReplacementRequestForTechnician[] = [
  {
    id: "RR001",
    requestCode: "DXTT-2025-0001",
    title: "Đề xuất thay thế linh kiện máy lab 101",
    description: "Thay thế SSD và RAM bị lỗi của máy tính trong phòng thí nghiệm",
    status: ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "Nguyễn Văn A",
    components: [
      {
        id: "RC001",
        componentName: "Ổ cứng SSD",
        componentType: ComponentType.STORAGE,
        assetId: "asset-002",
        assetName: "Máy tính văn phòng Dell",
        assetCode: "CNTT-PC-2024-002",
        buildingName: "Tòa nhà A",
        roomName: "Phòng thí nghiệm 101",
        newItemName: "Samsung 980 SSD",
        newItemSpecs: "512GB NVMe M.2 PCIe 3.0 - Replacement for faulty drive",
        quantity: 1,
        reason: "SSD hiện tại có bad sectors nghiêm trọng, không thể sử dụng được",
        machineLabel: "PC-Lab-002"
      },
      {
        id: "RC002", 
        componentName: "Bộ nhớ RAM",
        componentType: ComponentType.RAM,
        assetId: "asset-002",
        assetName: "Máy tính văn phòng Dell",
        assetCode: "CNTT-PC-2024-002",
        buildingName: "Tòa nhà A",
        roomName: "Phòng thí nghiệm 101",
        newItemName: "Kingston Fury Beast DDR4",
        newItemSpecs: "16GB 3200MHz DDR4 - Same specification replacement",
        quantity: 1,
        reason: "RAM hiện tại gây lỗi màn hình xanh thường xuyên",
        machineLabel: "PC-Lab-002"
      }
    ]
  },
  {
    id: "RR002",
    requestCode: "DXTT-2025-0002", 
    title: "Thay thế nguồn điện máy giảng dạy",
    description: "Nguồn điện bị cháy, cần thay thế ngay lập tức để đảm bảo an toàn",
    status: ReplacementStatus.ĐÃ_DUYỆT,
    createdAt: "2024-01-16T09:00:00Z",
    createdBy: "Trần Thị B",
    components: [
      {
        id: "RC003",
        componentName: "Nguồn điện",
        componentType: ComponentType.PSU,
        assetId: "asset-001",
        assetName: "Máy tính giảng dạy HP",
        assetCode: "CNTT-PC-2024-001",
        buildingName: "Tòa nhà B",
        roomName: "Phòng học 201",
        newItemName: "Dell 250W PSU",
        newItemSpecs: "250W 80+ Bronze certified - Higher wattage replacement",
        quantity: 1,
        reason: "Nguồn điện hiện tại bị cháy, có mùi khét",
        machineLabel: "PC-Class-001"
      }
    ]
  },
  {
    id: "RR003",
    requestCode: "DXTT-2025-0003",
    title: "Thay thế bàn phím máy học tập",
    description: "Bàn phím nhiều phím bị liệt, ảnh hưởng đến việc học tập",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    createdAt: "2024-01-17T14:30:00Z",
    createdBy: "Lê Văn C",
    components: [
      {
        id: "RC004",
        componentName: "Bàn phím",
        componentType: ComponentType.KEYBOARD,
        assetId: "asset-003",
        assetName: "Máy tính học tập Asus",
        assetCode: "CNTT-PC-2024-003",
        buildingName: "Tòa nhà C",
        roomName: "Phòng máy tính 301",
        newItemName: "Logitech K120 Keyboard",
        newItemSpecs: "Bàn phím có dây USB tiêu chuẩn",
        quantity: 1,
        reason: "Bàn phím hiện tại nhiều phím bị liệt, không gõ được",
        machineLabel: "PC-Study-003"
      }
    ]
  },
  {
    id: "RR004",
    requestCode: "DXTT-2025-0004",
    title: "Đề xuất thay chuột máy nghiên cứu",
    description: "Chuột bị lỗi click và di chuyển không chính xác",
    status: ReplacementStatus.ĐÃ_TỪ_CHỐI,
    createdAt: "2024-01-18T09:15:00Z",
    createdBy: "Phạm Thị D",
    components: [
      {
        id: "RC005",
        componentName: "Chuột",
        componentType: ComponentType.MOUSE,
        assetId: "asset-004",
        assetName: "Máy tính nghiên cứu Lenovo",
        assetCode: "CNTT-PC-2024-004",
        buildingName: "Tòa nhà D",
        roomName: "Phòng nghiên cứu 401",
        newItemName: "Dell Optical Mouse",
        newItemSpecs: "Chuột quang có dây USB 3 nút",
        quantity: 1,
        reason: "Chuột hiện tại không click được, con trỏ di chuyển khó khăn",
        machineLabel: "PC-Research-004"
      }
    ]
  },
  {
    id: "RR005",
    requestCode: "DXTT-2025-0005",
    title: "Hoàn tất mua sắm linh kiện máy server",
    description: "Đã hoàn tất quá trình mua sắm và lắp đặt linh kiện thay thế",
    status: ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
    createdAt: "2024-01-19T11:00:00Z",
    createdBy: "Hoàng Văn E",
    components: [
      {
        id: "RC006",
        componentName: "Ổ cứng HDD",
        componentType: ComponentType.STORAGE,
        assetId: "asset-005",
        assetName: "Máy chủ Dell PowerEdge",
        assetCode: "CNTT-SV-2024-001",
        buildingName: "Tòa nhà E",
        roomName: "Phòng server",
        newItemName: "Seagate Enterprise 2TB",
        newItemSpecs: "2TB SATA 7200RPM Enterprise HDD",
        quantity: 2,
        reason: "Ổ cứng cũ bị bad sector, cần thay thế để đảm bảo dữ liệu",
        machineLabel: "SV-Main-001"
      }
    ]
  }
];

// Create mock data for component replacements with additional information
export const mockComponentsFromReportsWithStatus: ComponentFromReport[] = [
  {
    id: "RI001",
    proposalId: "RP001",
    oldComponentId: "CC013",
    newItemName: "Samsung 980 SSD",
    newItemSpecs: "512GB NVMe M.2 PCIe 3.0 - Replacement for faulty drive",
    quantity: 1,
    reason: "SSD hiện tại có bad sectors nghiêm trọng, không thể sử dụng được",
    newlyPurchasedAssetId: null,
    componentName: "Ổ cứng SSD",
    componentType: ComponentType.STORAGE,
    assetId: "asset-002",
    assetName: "Máy tính văn phòng Dell",
    assetCode: "CNTT-PC-2024-002",
    buildingName: "Tòa nhà A",
    roomName: "Phòng thí nghiệm 101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-15T10:00:00Z",
    machineLabel: "PC-Lab-002",
    location: "Tòa nhà A - Phòng thí nghiệm 101"
  },
  {
    id: "RI002", 
    proposalId: "RP002",
    oldComponentId: "CC005",
    newItemName: "Dell 250W PSU",
    newItemSpecs: "250W 80+ Bronze certified - Higher wattage replacement",
    quantity: 1,
    reason: "Nguồn điện hiện tại bị cháy, có mùi khét",
    newlyPurchasedAssetId: null,
    componentName: "Nguồn điện",
    componentType: ComponentType.PSU,
    assetId: "asset-001",
    assetName: "Máy tính giảng dạy HP",
    assetCode: "CNTT-PC-2024-001",
    buildingName: "Tòa nhà B",
    roomName: "Phòng học 201",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-16T09:00:00Z",
    machineLabel: "PC-Class-001",
    location: "Tòa nhà B - Phòng học 201"
  },
  {
    id: "RI003",
    proposalId: "RP001", 
    oldComponentId: "CC012",
    newItemName: "Kingston Fury Beast DDR4",
    newItemSpecs: "16GB 3200MHz DDR4 - Same specification replacement",
    quantity: 1,
    reason: "RAM hiện tại gây lỗi màn hình xanh thường xuyên",
    newlyPurchasedAssetId: null,
    componentName: "Bộ nhớ RAM",
    componentType: ComponentType.RAM,
    assetId: "asset-002",
    assetName: "Máy tính văn phòng Dell",
    assetCode: "CNTT-PC-2024-002",
    buildingName: "Tòa nhà A",
    roomName: "Phòng thí nghiệm 101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-15T10:00:00Z",
    machineLabel: "PC-Lab-002",
    location: "Tòa nhà A - Phòng thí nghiệm 101"
  },
  // Add more mock data for testing pagination and filters
  {
    id: "RI004",
    proposalId: "RP003",
    oldComponentId: "CC020",
    newItemName: "Logitech K120 Keyboard",
    newItemSpecs: "Bàn phím có dây USB tiêu chuẩn",
    quantity: 1,
    reason: "Bàn phím hiện tại nhiều phím bị liệt, không gõ được",
    newlyPurchasedAssetId: null,
    componentName: "Bàn phím",
    componentType: ComponentType.KEYBOARD,
    assetId: "asset-003",
    assetName: "Máy tính học tập Asus",
    assetCode: "CNTT-PC-2024-003",
    buildingName: "Tòa nhà C",
    roomName: "Phòng máy tính 301",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-17T14:30:00Z",
    machineLabel: "PC-Study-003",
    location: "Tòa nhà C - Phòng máy tính 301"
  },
  {
    id: "RI005",
    proposalId: "RP004",
    oldComponentId: "CC025",
    newItemName: "Dell Optical Mouse",
    newItemSpecs: "Chuột quang có dây USB 3 nút",
    quantity: 1,
    reason: "Chuột hiện tại không click được, con trỏ di chuyển khó khăn",
    newlyPurchasedAssetId: null,
    componentName: "Chuột",
    componentType: ComponentType.MOUSE,
    assetId: "asset-004",
    assetName: "Máy tính nghiên cứu Lenovo",
    assetCode: "CNTT-PC-2024-004",
    buildingName: "Tòa nhà D",
    roomName: "Phòng nghiên cứu 401",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-18T09:15:00Z",
    machineLabel: "PC-Research-004",
    location: "Tòa nhà D - Phòng nghiên cứu 401"
  }
];