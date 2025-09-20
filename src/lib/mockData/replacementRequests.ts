import { ReplacementStatus, ComponentType, ComponentFromReport, ReplacementRequestForTechnician, ComponentFromRequest } from "@/types";

// Mock data based on database-sync.json ReplacementProposals and ReplacementItems
export const mockReplacementRequestsForTechnician: ReplacementRequestForTechnician[] = [
  {
    id: "RP001",
    requestCode: "DXTT-2025-0001",
    title: "Đề xuất thay thế linh kiện máy tính H101",
    description: "Thay thế SSD và RAM bị lỗi của máy tính trong phòng thí nghiệm H101",
    status: ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT,
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "user-4",
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
    requestCode: "DXTT-2025-0002", 
    title: "Thay thế nguồn điện máy tính H101",
    description: "Nguồn điện bị cháy, cần thay thế ngay lập tức để đảm bảo an toàn",
    status: ReplacementStatus.ĐÃ_DUYỆT,
    createdAt: "2024-01-16T09:00:00Z",
    createdBy: "user-4",
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
  },
  {
    id: "RR003",
    requestCode: "DXTT-2025-0003",
    title: "Thay thế bàn phím máy học tập H103",
    description: "Bàn phím nhiều phím bị liệt, ảnh hưởng đến việc học tập",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    createdAt: "2024-01-17T14:30:00Z",
    createdBy: "user-4", // Thay đổi từ "Kỹ thuật viên" thành user-4
    components: [
      {
        id: "RC004",
        componentName: "Dell KB216",
        componentType: ComponentType.KEYBOARD,
        assetId: "ASSET003",
        assetName: "PC HP ProDesk 400",
        assetCode: "19-0206/01",
        buildingName: "Tòa H",
        roomName: "H101",
        newItemName: "Dell KB216",
        newItemSpecs: "USB Wired Standard Keyboard - Replacement",
        quantity: 1,
        reason: "Bàn phím hiện tại nhiều phím bị liệt, không gõ được",
        machineLabel: "03"
      }
    ]
  },
  {
    id: "RR004",
    requestCode: "DXTT-2025-0004",
    title: "Đề xuất thay chuột máy H102",
    description: "Chuột bị lỗi click và di chuyển không chính xác",
    status: ReplacementStatus.ĐÃ_TỪ_CHỐI,
    createdAt: "2024-01-18T09:15:00Z",
    createdBy: "user-4", // Thay đổi từ "Kỹ thuật viên" thành user-4
    components: [
      {
        id: "RC005",
        componentName: "Dell MS116",
        componentType: ComponentType.MOUSE,
        assetId: "ASSET004",
        assetName: "PC Lenovo ThinkCentre",
        assetCode: "19-0207/01",
        buildingName: "Tòa H",
        roomName: "H102",
        newItemName: "Dell MS116",
        newItemSpecs: "USB Optical Mouse 1000 DPI - Replacement",
        quantity: 1,
        reason: "Chuột hiện tại không click được, con trỏ di chuyển khó khăn",
        machineLabel: "01"
      }
    ]
  },
  {
    id: "RR005",
    requestCode: "DXTT-2025-0005",
    title: "Hoàn tất mua sắm linh kiện CPU",
    description: "Đã hoàn tất quá trình mua sắm và lắp đặt linh kiện thay thế CPU",
    status: ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM,
    createdAt: "2024-01-19T11:00:00Z",
    createdBy: "user-4", // Thay đổi từ "Kỹ thuật viên" thành user-4
    components: [
      {
        id: "RC006",
        componentName: "Intel Core i3-11100",
        componentType: ComponentType.CPU,
        assetId: "ASSET005",
        assetName: "PC Dell Inspiron",
        assetCode: "19-0208/01",
        buildingName: "Tòa H",
        roomName: "H102",
        newItemName: "Intel Core i3-11100",
        newItemSpecs: "4 cores, 8 threads, 3.6GHz base, 4.2GHz boost - Replacement",
        quantity: 1,
        reason: "CPU cũ chạy quá nóng, cần thay keo tản nhiệt và vệ sinh",
        machineLabel: "02"
      }
    ]
  }
];

// Create mock data for component replacements with additional information - Synchronized with database
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
    componentName: "Samsung 980 SSD",
    componentType: ComponentType.STORAGE,
    assetId: "ASSET002",
    assetName: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/02",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-15T10:00:00Z",
    machineLabel: "02",
    location: "Tòa H - H101"
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
    componentName: "Dell 200W PSU",
    componentType: ComponentType.PSU,
    assetId: "ASSET001",
    assetName: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/01",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-16T09:00:00Z",
    machineLabel: "01",
    location: "Tòa H - H101"
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
    componentName: "Kingston Fury Beast DDR4",
    componentType: ComponentType.RAM,
    assetId: "ASSET002",
    assetName: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/02",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-15T10:00:00Z",
    machineLabel: "02",
    location: "Tòa H - H101"
  },
  {
    id: "RI004",
    proposalId: "RP003",
    oldComponentId: "CC007",
    newItemName: "Dell KB216",
    newItemSpecs: "USB Wired Standard Keyboard - Replacement",
    quantity: 1,
    reason: "Bàn phím hiện tại nhiều phím bị liệt, không gõ được",
    newlyPurchasedAssetId: null,
    componentName: "Dell KB216",
    componentType: ComponentType.KEYBOARD,
    assetId: "ASSET003",
    assetName: "PC HP ProDesk 400",
    assetCode: "19-0206/01",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-17T14:30:00Z",
    machineLabel: "03",
    location: "Tòa H - H101"
  },
  {
    id: "RI005",
    proposalId: "RP004",
    oldComponentId: "CC008",
    newItemName: "Dell MS116",
    newItemSpecs: "USB Optical Mouse 1000 DPI - Replacement",
    quantity: 1,
    reason: "Chuột hiện tại không click được, con trỏ di chuyển khó khăn",
    newlyPurchasedAssetId: null,
    componentName: "Dell MS116",
    componentType: ComponentType.MOUSE,
    assetId: "ASSET001",
    assetName: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/01",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-18T09:15:00Z",
    machineLabel: "01",
    location: "Tòa H - H101"
  }
];