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

// Software Proposal Types
export interface SoftwareProposal {
  id: string;
  proposalCode: string;
  assetId: string;
  roomId: string;
  proposerId: string; // user who creates the proposal
  assignedTechnicianId?: string; // technician assigned to review
  softwareName: string;
  softwareVersion?: string;
  publisher?: string;
  description: string;
  justification: string; // why this software is needed
  targetUsers?: string; // who will use this software
  educationalPurpose: string; // for what educational activities
  status: SoftwareProposalStatus;
  reviewNotes?: string;
  createdAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export enum SoftwareProposalStatus {
  CHỜ_XEM_XÉT = "CHỜ_XEM_XÉT", // Waiting for review
  ĐANG_XEM_XÉT = "ĐANG_XEM_XÉT", // Under review by technician
  ĐÃ_DUYỆT = "ĐÃ_DUYỆT", // Approved by technician
  ĐÃ_TỪ_CHỐI = "ĐÃ_TỪ_CHỐI", // Rejected by technician
  ĐÃ_CÀI_ĐẶT = "ĐÃ_CÀI_ĐẶT", // Software installed
}

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
