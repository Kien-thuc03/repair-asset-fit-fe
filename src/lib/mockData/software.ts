import { Software } from '@/types';

// Mock software data - Khớp hoàn toàn với database schema
export const mockSoftware: Software[] = [
  {
    id: "SW001",
    name: "Microsoft Office 2021",
    version: "2021",
    publisher: "Microsoft Corporation",
    createdAt: "2023-01-15T01:00:00.000Z"
  },
  {
    id: "SW002", 
    name: "Adobe Photoshop",
    version: "2024",
    publisher: "Adobe Inc.",
    createdAt: "2023-01-15T01:05:00.000Z"
  },
  {
    id: "SW003",
    name: "AutoCAD", 
    version: "2024",
    publisher: "Autodesk Inc.",
    createdAt: "2023-01-15T01:10:00.000Z"
  },
  {
    id: "SW004",
    name: "Visual Studio Code",
    version: "1.85",
    publisher: "Microsoft Corporation",
    createdAt: "2023-01-15T01:15:00.000Z"
  },
  {
    id: "SW005",
    name: "Google Chrome",
    version: "120.0", 
    publisher: "Google LLC",
    createdAt: "2023-01-15T01:20:00.000Z"
  },
  // Phần mềm được thêm từ software proposals
  {
    id: "SW006",
    name: "Adobe Illustrator",
    version: "2024",
    publisher: "Adobe Inc.",
    createdAt: "2024-12-16T10:00:00.000Z"
  },
  {
    id: "SW007",
    name: "Adobe InDesign",
    version: "2024",
    publisher: "Adobe Inc.",
    createdAt: "2024-12-16T10:05:00.000Z"
  },
  {
    id: "SW008",
    name: "Visual Studio",
    version: "2022",
    publisher: "Microsoft Corporation",
    createdAt: "2024-12-21T16:00:00.000Z"
  },
  {
    id: "SW009",
    name: "IntelliJ IDEA",
    version: "2023.3",
    publisher: "JetBrains",
    createdAt: "2024-12-21T16:10:00.000Z"
  },
  {
    id: "SW010",
    name: "Mozilla Firefox",
    version: "121.0",
    publisher: "Mozilla Foundation",
    createdAt: "2024-12-14T15:00:00.000Z"
  },
  {
    id: "SW011",
    name: "WinRAR",
    version: "6.24",
    publisher: "win.rar GmbH",
    createdAt: "2024-12-14T15:10:00.000Z"
  }
];

// Helper functions
export const getSoftwareById = (id: string): Software | undefined => {
  return mockSoftware.find(software => software.id === id);
};

export const getSoftwareByName = (name: string): Software[] => {
  return mockSoftware.filter(software => 
    software.name.toLowerCase().includes(name.toLowerCase())
  );
};

// Mock AssetSoftware relationship data - Khớp với database AssetSoftware table
const mockAssetSoftware = [
  { assetId: "ASSET001", softwareId: "SW001" }, // Office
  { assetId: "ASSET001", softwareId: "SW004" }, // VS Code  
  { assetId: "ASSET001", softwareId: "SW005" }, // Chrome
  { assetId: "ASSET002", softwareId: "SW001" }, // Office
  { assetId: "ASSET002", softwareId: "SW005" }, // Chrome
  { assetId: "ASSET003", softwareId: "SW001" }, // Office
  { assetId: "ASSET003", softwareId: "SW002" }, // Photoshop
  { assetId: "ASSET003", softwareId: "SW005" }, // Chrome
  // Các assets khác chỉ có software cơ bản
  { assetId: "ASSET004", softwareId: "SW001" }, // Office
  { assetId: "ASSET004", softwareId: "SW005" }, // Chrome
  { assetId: "ASSET005", softwareId: "SW001" }, // Office
  { assetId: "ASSET005", softwareId: "SW005" }, // Chrome
  { assetId: "ASSET006", softwareId: "SW001" }, // Office
  { assetId: "ASSET006", softwareId: "SW005" }, // Chrome
  { assetId: "ASSET009", softwareId: "SW001" }, // Office (máy giảng viên)
  { assetId: "ASSET009", softwareId: "SW002" }, // Photoshop (máy giảng viên)
  { assetId: "ASSET009", softwareId: "SW003" }, // AutoCAD (máy giảng viên)
  { assetId: "ASSET009", softwareId: "SW005" }, // Chrome
  { assetId: "ASSET010", softwareId: "SW001" }, // Office (lab cao cấp)
  { assetId: "ASSET010", softwareId: "SW002" }, // Photoshop (lab cao cấp)
  { assetId: "ASSET010", softwareId: "SW003" }, // AutoCAD (lab cao cấp)
  { assetId: "ASSET010", softwareId: "SW004" }, // VS Code (lab cao cấp)
  { assetId: "ASSET010", softwareId: "SW005" }, // Chrome
];

// Function to get software installed on specific asset
// Simulates querying AssetSoftware join table with actual database data
export const getSoftwareByAssetId = (assetId: string): Software[] => {
  const installedSoftwareIds = mockAssetSoftware
    .filter(relation => relation.assetId === assetId)
    .map(relation => relation.softwareId);
  
  return mockSoftware.filter(software => 
    installedSoftwareIds.includes(software.id)
  );
};