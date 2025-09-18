import { Software, AssetSoftware } from "@/types";

// Synchronized with database-sync.json software section
export const mockSoftware: Software[] = [
  {
    id: "SW001",
    name: "Microsoft Office 2021",
    version: "2021",
    publisher: "Microsoft Corporation",
    createdAt: "2023-01-15T08:00:00Z",
  },
  {
    id: "SW002",
    name: "Adobe Photoshop",
    version: "2024",
    publisher: "Adobe Inc.",
    createdAt: "2023-01-15T08:05:00Z",
  },
  {
    id: "SW003",
    name: "AutoCAD",
    version: "2024",
    publisher: "Autodesk Inc.",
    createdAt: "2023-01-15T08:10:00Z",
  },
  {
    id: "SW004",
    name: "Visual Studio Code",
    version: "1.85",
    publisher: "Microsoft Corporation",
    createdAt: "2023-01-15T08:15:00Z",
  },
  {
    id: "SW005",
    name: "Google Chrome",
    version: "120.0",
    publisher: "Google LLC",
    createdAt: "2023-01-15T08:20:00Z",
  },
];

// Synchronized with database-sync.json assetSoftware section
export const mockAssetSoftware: AssetSoftware[] = [
  {
    assetId: "ASSET001",
    softwareId: "SW001",
    installationDate: "2023-01-15",
    notes: "Standard office suite installation",
  },
  {
    assetId: "ASSET001",
    softwareId: "SW004",
    installationDate: "2023-01-16",
    notes: "Development environment for programming courses",
  },
  {
    assetId: "ASSET001",
    softwareId: "SW005",
    installationDate: "2023-01-15",
    notes: "Primary web browser",
  },
  {
    assetId: "ASSET002",
    softwareId: "SW001",
    installationDate: "2023-01-15",
    notes: "Standard office suite installation",
  },
  {
    assetId: "ASSET002",
    softwareId: "SW005",
    installationDate: "2023-01-15",
    notes: "Primary web browser",
  },
  {
    assetId: "ASSET003",
    softwareId: "SW001",
    installationDate: "2023-03-20",
    notes: "Standard office suite installation",
  },
  {
    assetId: "ASSET003",
    softwareId: "SW002",
    installationDate: "2023-03-21",
    notes: "Graphics design software for multimedia courses",
  },
  {
    assetId: "ASSET003",
    softwareId: "SW005",
    installationDate: "2023-03-20",
    notes: "Primary web browser",
  },
];

// Helper function to get software installed on a specific asset
export const getSoftwareByAssetId = (assetId: string): Software[] => {
  const assetSoftwareList = mockAssetSoftware.filter(
    (assetSoftware) => assetSoftware.assetId === assetId
  );

  return assetSoftwareList
    .map((assetSoftware) => {
      const software = mockSoftware.find(
        (software) => software.id === assetSoftware.softwareId
      );
      return software!;
    })
    .filter(Boolean);
};

// Helper function to get asset software details with notes
export const getAssetSoftwareDetails = (assetId: string) => {
  return mockAssetSoftware
    .filter((assetSoftware) => assetSoftware.assetId === assetId)
    .map((assetSoftware) => {
      const software = mockSoftware.find(
        (software) => software.id === assetSoftware.softwareId
      );
      return {
        ...assetSoftware,
        software: software!,
      };
    })
    .filter((item) => item.software);
};
