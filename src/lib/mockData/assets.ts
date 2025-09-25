import { SimpleAsset, AssetStatus, AssetType, AssetShape } from '@/types';

// Mock assets data - Khớp hoàn toàn với database schema
// Chỉ bao gồm các tài sản máy tính (computers) để phù hợp với repair processing workflow
export const mockAssets: SimpleAsset[] = [
  {
    id: "ASSET001",
    name: "PC Dell OptiPlex 3080",
    assetCode: "19-0205/01",
    roomId: "ROOM001"
  },
  {
    id: "ASSET002",
    name: "PC Dell OptiPlex 3080", 
    assetCode: "19-0205/02",
    roomId: "ROOM001"
  },
  {
    id: "ASSET003",
    name: "PC HP ProDesk 400",
    assetCode: "19-0206/01", 
    roomId: "ROOM001"
  },
  {
    id: "ASSET004",
    name: "PC Lenovo ThinkCentre",
    assetCode: "19-0207/01",
    roomId: "ROOM002"
  },
  {
    id: "ASSET005", 
    name: "PC Dell Inspiron",
    assetCode: "19-0208/01",
    roomId: "ROOM002"
  },
  {
    id: "ASSET006",
    name: "PC HP Pavilion",
    assetCode: "19-0209/01",
    roomId: "ROOM002"
  },
  {
    id: "ASSET009",
    name: "PC ASUS VivoBook",
    assetCode: "19-0210/01",
    roomId: "ROOM003"
  },
  {
    id: "ASSET010",
    name: "PC MSI Modern",
    assetCode: "19-0211/01",
    roomId: "ROOM004"
  }
];

// Tất cả assets từ database (bao gồm cả non-computer assets)
export const mockAllAssets: SimpleAsset[] = [
  ...mockAssets,
  {
    id: "ASSET007",
    name: "Máy in Canon LBP6030",
    assetCode: "19-0301/01",
    roomId: "ROOM001"
  },
  {
    id: "ASSET008",
    name: "Bàn giảng viên gỗ",
    assetCode: "19-0302/01",
    roomId: "ROOM003"
  },
  {
    id: "ASSET011",
    name: "Máy in HP LaserJet Pro",
    assetCode: "19-0303/01",
    roomId: "ROOM005"
  },
  {
    id: "ASSET012",
    name: "Projector Epson EB-X06",
    assetCode: "19-0212/01",
    roomId: "ROOM006"
  }
];


// Helper functions
export const getAssetById = (id: string): SimpleAsset | undefined => {
  return mockAssets.find(asset => asset.id === id);
};

export const getAssetsByRoomId = (roomId: string): SimpleAsset[] => {
  return mockAssets.filter(asset => asset.roomId === roomId);
};

export const getAssetByCode = (assetCode: string): SimpleAsset | undefined => {
  return mockAssets.find(asset => asset.assetCode === assetCode);
};
