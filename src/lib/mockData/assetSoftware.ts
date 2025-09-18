export interface AssetSoftware {
  assetId: string;
  softwareId: string;
  installationDate: string;
  notes: string;
}

// Synchronized with database-sync.json assetSoftware section
export const assetSoftware: AssetSoftware[] = [
  {
    assetId: "ASSET001",
    softwareId: "SW001",
    installationDate: "2023-01-15",
    notes: "Standard office suite installation"
  },
  {
    assetId: "ASSET001",
    softwareId: "SW004",
    installationDate: "2023-01-16",
    notes: "Development environment for programming courses"
  },
  {
    assetId: "ASSET001",
    softwareId: "SW005",
    installationDate: "2023-01-15",
    notes: "Primary web browser"
  },
  {
    assetId: "ASSET002",
    softwareId: "SW001",
    installationDate: "2023-01-15",
    notes: "Standard office suite installation"
  },
  {
    assetId: "ASSET002",
    softwareId: "SW005",
    installationDate: "2023-01-15",
    notes: "Primary web browser"
  },
  {
    assetId: "ASSET003",
    softwareId: "SW001",
    installationDate: "2023-03-20",
    notes: "Standard office suite installation"
  },
  {
    assetId: "ASSET003",
    softwareId: "SW002",
    installationDate: "2023-03-21",
    notes: "Graphics design software for multimedia courses"
  },
  {
    assetId: "ASSET003",
    softwareId: "SW005",
    installationDate: "2023-03-20",
    notes: "Primary web browser"
  }
];