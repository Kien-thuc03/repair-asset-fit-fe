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

// Nested object types from backend
export interface ProposerInfo {
  id: string;
  fullName: string;
  email: string;
  unitName: string;
}

export interface ApproverInfo {
  id: string;
  fullName: string;
  email: string;
  unitName: string;
}

export interface RoomInfo {
  id: string;
  name: string;
  building: string;
  floor: string;
  roomNumber: string;
}

// Software Proposal Types - Synchronized with backend response
export interface SoftwareProposal {
  id: string;
  proposalCode: string;
  proposerId: string;
  approverId?: string | null;
  roomId: string;
  reason: string;
  status: SoftwareProposalStatus;
  createdAt: string;
  updatedAt: string;
  // Nested objects from backend
  proposer?: ProposerInfo;
  approver?: ApproverInfo;
  room?: RoomInfo;
  items?: SoftwareProposalItem[];
}

export interface SoftwareProposalItem {
  id: string;
  proposalId?: string;
  softwareName: string;
  version?: string;
  publisher?: string;
  quantity: number;
  licenseType?: string;
  newlyAcquiredSoftwareId?: string | null;
}

export enum SoftwareProposalStatus {
  CHỜ_DUYỆT = "CHỜ_DUYỆT", // Waiting for approval
  ĐÃ_DUYỆT = "ĐÃ_DUYỆT", // Approved
  ĐÃ_TỪ_CHỐI = "ĐÃ_TỪ_CHỐI", // Rejected
  ĐÃ_TRANG_BỊ = "ĐÃ_TRANG_BỊ", // Software equipped
}

// Legacy form type - maintaining backward compatibility
export interface SoftwareProposalForm {
  assetId: string;
  roomId: string;
  softwareName: string;
  softwareVersion: string;
  publisher: string;
  description: string;
  justification: string;
  targetUsers: string;
  educationalPurpose: string;
}

export interface SoftwareItemForm {
  softwareName: string;
  version: string;
}

// New form type for multiple software items
export interface NewSoftwareProposalForm {
  roomId: string;
  reason: string;
  softwareItems: SoftwareItemForm[];
}
