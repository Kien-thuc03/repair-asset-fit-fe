import { ComponentFromReport, ComponentType, ReplacementStatus } from '@/types/repair';

// Mock data cho ComponentFromReport - dùng cho trang lập phiếu đề xuất
// Dữ liệu này mô phỏng các linh kiện từ báo cáo lỗi có thể được chọn để tạo đề xuất thay thế
export const mockComponentsFromReportsWithStatus: ComponentFromReport[] = [
  {
    id: "CFR001",
    proposalId: "", // Chưa có proposal ID vì chưa tạo đề xuất
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
    reportDate: "2024-01-15T02:30:00.000Z",
    machineLabel: "02",
    location: "Tòa H - H101 - Máy 02"
  },
  {
    id: "CFR002", 
    proposalId: "",
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
    reportDate: "2024-01-15T03:00:00.000Z",
    machineLabel: "02",
    location: "Tòa H - H101 - Máy 02"
  },
  {
    id: "CFR003",
    proposalId: "",
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
    reportDate: "2024-01-16T01:45:00.000Z",
    machineLabel: "01",
    location: "Tòa H - H101 - Máy 01"
  },
  {
    id: "CFR004",
    proposalId: "",
    oldComponentId: "CC024",
    newItemName: "HP P24v G5",
    newItemSpecs: "24 inch 1920x1080 IPS, LED backlit - Upgraded model",
    quantity: 1,
    reason: "Monitor flickering, possible backlight issue",
    newlyPurchasedAssetId: null,
    componentName: "HP P22v G4",
    componentType: ComponentType.MONITOR,
    assetId: "ASSET003",
    assetName: "PC HP ProDesk 400",
    assetCode: "19-0206/01",
    buildingName: "Tòa H",
    roomName: "H101", 
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-17T04:20:00.000Z", 
    machineLabel: "03",
    location: "Tòa H - H101 - Máy 03"
  },
  {
    id: "CFR005",
    proposalId: "",
    oldComponentId: "CC032",
    newItemName: "Intel Core i5-11400",
    newItemSpecs: "6 cores, 12 threads, 2.6GHz base, 4.4GHz boost - Performance upgrade",
    quantity: 1,
    reason: "CPU undergoing thermal paste replacement",
    newlyPurchasedAssetId: null,
    componentName: "Intel Core i3-11100",
    componentType: ComponentType.CPU,
    assetId: "ASSET005",
    assetName: "PC Dell Inspiron",
    assetCode: "19-0208/01",
    buildingName: "Tòa H",
    roomName: "H102",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-18T02:10:00.000Z",
    machineLabel: "02", 
    location: "Tòa H - H102 - Máy 02"
  },
  {
    id: "CFR006",
    proposalId: "",
    oldComponentId: "CC007",
    newItemName: "Dell KB522",
    newItemSpecs: "USB Wired Business Keyboard - Improved durability",
    quantity: 1,
    reason: "Some keys not working properly",
    newlyPurchasedAssetId: null,
    componentName: "Dell KB216",
    componentType: ComponentType.KEYBOARD,
    assetId: "ASSET001",
    assetName: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/01",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-20T03:30:00.000Z",
    machineLabel: "01",
    location: "Tòa H - H101 - Máy 01"
  },
  {
    id: "CFR007",
    proposalId: "",
    oldComponentId: "CC008",
    newItemName: "Dell MS118",
    newItemSpecs: "USB Optical Mouse 1600 DPI - Higher DPI version", 
    quantity: 1,
    reason: "Mouse scroll wheel occasionally unresponsive",
    newlyPurchasedAssetId: null,
    componentName: "Dell MS116",
    componentType: ComponentType.MOUSE,
    assetId: "ASSET001",
    assetName: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/01",
    buildingName: "Tòa H",
    roomName: "H101",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-20T03:35:00.000Z",
    machineLabel: "01",
    location: "Tòa H - H101 - Máy 01"
  },
  {
    id: "CFR008",
    proposalId: "",
    oldComponentId: "CC042",
    newItemName: "Corsair Vengeance LPX DDR4", 
    newItemSpecs: "32GB (2x16GB) 3200MHz DDR4 - Capacity upgrade",
    quantity: 1,
    reason: "Need more RAM for multitasking during lectures",
    newlyPurchasedAssetId: null,
    componentName: "Corsair Vengeance LPX DDR4",
    componentType: ComponentType.RAM,
    assetId: "ASSET009",
    assetName: "PC ASUS VivoBook",
    assetCode: "19-0210/01",
    buildingName: "Tòa H",
    roomName: "H103",
    status: ReplacementStatus.CHỜ_XÁC_MINH,
    reportDate: "2024-01-22T01:15:00.000Z",
    machineLabel: "01",
    location: "Tòa H - H103 - Máy 01"
  },
  // Thêm một vài component đã được xử lý để test
  {
    id: "CFR009",
    proposalId: "RP001",
    oldComponentId: "CC033",
    newItemName: "ASUS ROG Strix B550-F",
    newItemSpecs: "AMD B550 chipset, ATX motherboard", 
    quantity: 1,
    reason: "Motherboard power delivery issues",
    newlyPurchasedAssetId: null,
    componentName: "AMD Ryzen Motherboard",
    componentType: ComponentType.MAINBOARD,
    assetId: "ASSET006",
    assetName: "PC HP Pavilion",
    assetCode: "19-0209/01",
    buildingName: "Tòa H",
    roomName: "H102",
    status: ReplacementStatus.CHỜ_TỔ_TRƯỞNG_DUYỆT, // Đã được tạo đề xuất
    reportDate: "2024-01-10T02:00:00.000Z",
    machineLabel: "03",
    location: "Tòa H - H102 - Máy 03"
  },
  {
    id: "CFR010",
    proposalId: "RP002",
    oldComponentId: "CC044",
    newItemName: "NVIDIA GeForce GTX 1650",
    newItemSpecs: "4GB GDDR6 Graphics Card",
    quantity: 1,
    reason: "Integrated graphics not sufficient for design work",
    newlyPurchasedAssetId: "COMP_NEW_001",
    componentName: "Integrated Graphics",
    componentType: ComponentType.GPU,
    assetId: "ASSET009",
    assetName: "PC ASUS VivoBook", 
    assetCode: "19-0210/01",
    buildingName: "Tòa H",
    roomName: "H103",
    status: ReplacementStatus.ĐÃ_HOÀN_TẤT_MUA_SẮM, // Đã mua sắm xong
    reportDate: "2024-01-08T04:30:00.000Z",
    machineLabel: "01",
    location: "Tòa H - H103 - Máy 01"
  }
];

// Helper functions
export const getComponentFromReportById = (id: string): ComponentFromReport | undefined => {
  return mockComponentsFromReportsWithStatus.find(component => component.id === id);
};

export const getComponentsFromReportsByStatus = (status: ReplacementStatus): ComponentFromReport[] => {
  return mockComponentsFromReportsWithStatus.filter(component => component.status === status);
};

export const getComponentsFromReportsByAssetId = (assetId: string): ComponentFromReport[] => {
  return mockComponentsFromReportsWithStatus.filter(component => component.assetId === assetId);
};

export const getPendingComponentsFromReports = (): ComponentFromReport[] => {
  return mockComponentsFromReportsWithStatus.filter(component => 
    component.status === ReplacementStatus.CHỜ_XÁC_MINH
  );
};