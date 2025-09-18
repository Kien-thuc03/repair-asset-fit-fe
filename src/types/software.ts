export interface Software {
  id: string;
  name: string;
  version: string;
  publisher: string;
  createdAt: string;
}

export interface AssetSoftware {
  assetId: string;
  softwareId: string;
  installationDate: string;
  notes: string;
}
