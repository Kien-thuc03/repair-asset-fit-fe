import { ComprehensiveAsset, AssetType, AssetShape, AssetStatus } from '@/types';

// Mock detailed assets data - Khớp hoàn toàn với database schema
export const mockDetailedAssets: ComprehensiveAsset[] = [
  {
    id: "ASSET001",
    ktCode: "19-0205/01",
    fixedCode: "2023.001",
    name: "PC Dell OptiPlex 3080",
    specs: "Intel Core i5-12400, 16GB RAM, 512GB SSD, Windows 11 Pro",
    entryDate: "2023-01-15T00:00:00.000Z",
    currentRoomId: "ROOM001",
    unit: "chiếc",
    quantity: 1,
    origin: "Dell Technologies Vietnam",
    purchasePackage: 1,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-1",
    createdAt: "2023-01-15T01:00:00.000Z",
    updatedAt: "2024-03-15T03:30:00.000Z"
  },
  {
    id: "ASSET002", 
    ktCode: "19-0205/02",
    fixedCode: "2023.002",
    name: "PC Dell OptiPlex 3080",
    specs: "Intel Core i5-12400, 16GB RAM, 512GB SSD, Windows 11 Pro",
    entryDate: "2023-01-15T00:00:00.000Z",
    currentRoomId: "ROOM001",
    unit: "chiếc",
    quantity: 1,
    origin: "Dell Technologies Vietnam",
    purchasePackage: 1,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.CHO_TIEP_NHAN,
    createdBy: "user-1",
    createdAt: "2023-01-15T01:00:00.000Z",
    updatedAt: "2024-09-01T07:20:00.000Z"
  },
  {
    id: "ASSET003",
    ktCode: "19-0206/01", 
    fixedCode: "2023.003",
    name: "PC HP ProDesk 400",
    specs: "Intel Core i3-12100, 8GB RAM, 256GB SSD, Windows 11 Pro",
    entryDate: "2023-03-20T00:00:00.000Z",
    currentRoomId: "ROOM001",
    unit: "chiếc",
    quantity: 1,
    origin: "HP Vietnam", 
    purchasePackage: 2,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.HU_HONG,
    createdBy: "user-2",
    createdAt: "2023-03-20T02:15:00.000Z",
    updatedAt: "2024-08-22T09:45:00.000Z"
  },
  {
    id: "ASSET004",
    ktCode: "19-0207/01",
    fixedCode: "2023.004", 
    name: "PC Lenovo ThinkCentre",
    specs: "Intel Core i5-11400, 8GB RAM, 512GB SSD, Windows 11 Pro",
    entryDate: "2023-02-10T00:00:00.000Z",
    currentRoomId: "ROOM002",
    unit: "chiếc",
    quantity: 1,
    origin: "Lenovo Vietnam",
    purchasePackage: 3,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-1",
    createdAt: "2023-02-10T01:30:00.000Z",
    updatedAt: "2024-07-15T04:20:00.000Z"
  },
  {
    id: "ASSET005",
    ktCode: "19-0208/01",
    fixedCode: "2023.005",
    name: "PC Dell Inspiron",
    specs: "Intel Core i3-11100, 8GB RAM, 256GB SSD, Windows 11 Home",
    entryDate: "2023-04-05T00:00:00.000Z",
    currentRoomId: "ROOM002", 
    unit: "chiếc",
    quantity: 1,
    origin: "Dell Technologies Vietnam",
    purchasePackage: 4,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-2",
    createdAt: "2023-04-05T00:45:00.000Z",
    updatedAt: "2024-06-10T06:15:00.000Z"
  },
  {
    id: "ASSET006",
    ktCode: "19-0209/01",
    fixedCode: "2023.006",
    name: "PC HP Pavilion",
    specs: "Intel Core i5-11400, 8GB RAM, 256GB SSD, Windows 11 Home",
    entryDate: "2023-05-15T00:00:00.000Z",
    currentRoomId: "ROOM002",
    unit: "chiếc",
    quantity: 1,
    origin: "HP Vietnam",
    purchasePackage: 5,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-1",
    createdAt: "2023-05-15T02:00:00.000Z",
    updatedAt: "2024-05-20T08:30:00.000Z"
  },
  {
    id: "ASSET007",
    ktCode: "19-0301/01",
    fixedCode: "2023.007",
    name: "Máy in Canon LBP6030",
    specs: "Laser đen trắng, A4, USB 2.0, 18 trang/phút",
    entryDate: "2023-06-01T00:00:00.000Z",
    currentRoomId: "ROOM001",
    unit: "chiếc",
    quantity: 1,
    origin: "Canon Vietnam",
    purchasePackage: 6,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "5",
    shape: AssetShape.GENERIC,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-2",
    createdAt: "2023-06-01T03:15:00.000Z",
    updatedAt: "2024-04-12T10:45:00.000Z"
  },
  {
    id: "ASSET008",
    ktCode: "19-0302/01",
    fixedCode: "2023.008",
    name: "Bàn giảng viên gỗ",
    specs: "Gỗ tự nhiên, kích thước 120x60x75cm, có ngăn kéo",
    entryDate: "2023-07-10T00:00:00.000Z",
    currentRoomId: "ROOM003",
    unit: "chiếc",
    quantity: 1,
    origin: "Nội thất Hoàng Gia",
    purchasePackage: 7,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "3",
    shape: AssetShape.GENERIC,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-1",
    createdAt: "2023-07-10T04:30:00.000Z",
    updatedAt: "2024-03-08T11:20:00.000Z"
  },
  {
    id: "ASSET009",
    ktCode: "19-0210/01",
    fixedCode: "2023.009",
    name: "PC ASUS VivoBook",
    specs: "Intel Core i5-11400, 8GB RAM, 512GB SSD, Windows 11 Pro",
    entryDate: "2023-08-20T00:00:00.000Z",
    currentRoomId: "ROOM003",
    unit: "chiếc",
    quantity: 1,
    origin: "ASUS Vietnam",
    purchasePackage: 8,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-2",
    createdAt: "2023-08-20T05:45:00.000Z",
    updatedAt: "2024-02-25T12:10:00.000Z"
  },
  {
    id: "ASSET010",
    ktCode: "19-0211/01",
    fixedCode: "2023.010",
    name: "PC MSI Modern",
    specs: "Intel Core i7-11700, 16GB RAM, 1TB SSD, Windows 11 Pro",
    entryDate: "2023-09-15T00:00:00.000Z",
    currentRoomId: "ROOM004",
    unit: "chiếc",
    quantity: 1,
    origin: "MSI Vietnam",
    purchasePackage: 9,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.COMPUTER,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-1",
    createdAt: "2023-09-15T06:20:00.000Z",
    updatedAt: "2024-01-18T13:55:00.000Z"
  },
  {
    id: "ASSET011",
    ktCode: "19-0303/01",
    fixedCode: "2023.011",
    name: "Máy in HP LaserJet Pro",
    specs: "Laser đen trắng, A4, Network, USB, 28 trang/phút",
    entryDate: "2023-10-05T00:00:00.000Z",
    currentRoomId: "ROOM005",
    unit: "chiếc",
    quantity: 1,
    origin: "HP Vietnam",
    purchasePackage: 10,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "5",
    shape: AssetShape.GENERIC,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-2",
    createdAt: "2023-10-05T07:30:00.000Z",
    updatedAt: "2024-01-05T14:40:00.000Z"
  },
  {
    id: "ASSET012",
    ktCode: "19-0212/01",
    fixedCode: "2023.012",
    name: "Projector Epson EB-X06",
    specs: "LCD, XGA 1024x768, 3600 lumens, HDMI, VGA",
    entryDate: "2023-11-12T00:00:00.000Z",
    currentRoomId: "ROOM006",
    unit: "chiếc",
    quantity: 1,
    origin: "Epson Vietnam",
    purchasePackage: 11,
    type: AssetType.TSCD,
    isHandover: true,
    isLocked: true,
    categoryId: "4",
    shape: AssetShape.GENERIC,
    status: AssetStatus.DANG_SU_DUNG,
    createdBy: "user-1",
    createdAt: "2023-11-12T08:15:00.000Z",
    updatedAt: "2023-12-20T15:25:00.000Z"
  }
];

// Chỉ các tài sản máy tính (computers)
export const mockDetailedComputerAssets = mockDetailedAssets.filter(
  asset => asset.shape === AssetShape.COMPUTER
);

// Chỉ các tài sản khác (non-computers)
export const mockDetailedNonComputerAssets = mockDetailedAssets.filter(
  asset => asset.shape === AssetShape.GENERIC
);

// Helper functions
export const getDetailedAssetById = (id: string): ComprehensiveAsset | undefined => {
  return mockDetailedAssets.find(asset => asset.id === id);
};

export const getDetailedAssetsByRoomId = (roomId: string): ComprehensiveAsset[] => {
  return mockDetailedAssets.filter(asset => asset.currentRoomId === roomId);
};

export const getDetailedAssetByKtCode = (ktCode: string): ComprehensiveAsset | undefined => {
  return mockDetailedAssets.find(asset => asset.ktCode === ktCode);
};

export const getDetailedAssetsByStatus = (status: AssetStatus): ComprehensiveAsset[] => {
  return mockDetailedAssets.filter(asset => asset.status === status);
};

export const getDetailedAssetsByShape = (shape: AssetShape): ComprehensiveAsset[] => {
  return mockDetailedAssets.filter(asset => asset.shape === shape);
};

export const getDetailedAssetsByCategory = (categoryId: string): ComprehensiveAsset[] => {
  return mockDetailedAssets.filter(asset => asset.categoryId === categoryId);
};

// Thống kê assets
export const getAssetStatistics = () => {
  const total = mockDetailedAssets.length;
  const computers = mockDetailedComputerAssets.length;
  const nonComputers = mockDetailedNonComputerAssets.length;
  const inUse = mockDetailedAssets.filter(a => a.status === AssetStatus.DANG_SU_DUNG).length;
  const faulty = mockDetailedAssets.filter(a => a.status === AssetStatus.HU_HONG).length;
  const pending = mockDetailedAssets.filter(a => a.status === AssetStatus.CHO_TIEP_NHAN).length;
  
  return {
    total,
    computers,
    nonComputers,
    inUse,
    faulty, 
    pending
  };
};