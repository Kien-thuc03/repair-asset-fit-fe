// Synchronized with database-sync.json structure for software proposals

export interface SoftwareProposal {
  id: string;
  proposalCode: string;
  proposerId: string;
  approverId: string | null;
  roomId: string;
  reason: string;
  status: "CHỜ_DUYỆT" | "ĐÃ_DUYỆT" | "ĐÃ_TỪ_CHỐI" | "ĐÃ_TRANG_BỊ";
  createdAt: string;
  updatedAt: string;
}

export interface SoftwareProposalItem {
  id: string;
  proposalId: string;
  softwareName: string;
  version: string;
  publisher: string;
  quantity: number;
  licenseType: string;
  newlyAcquiredSoftwareId: string | null;
}

// Mock data synchronized with database-sync.json
export const mockSoftwareProposals: SoftwareProposal[] = [
  {
    id: "SP001",
    proposalCode: "DXPM-2025-0001",
    proposerId: "user-5",
    approverId: null,
    roomId: "ROOM001",
    reason: "Cần trang bị phần mềm AutoCAD cho môn Thiết kế kỹ thuật",
    status: "CHỜ_DUYỆT",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T09:00:00Z",
  },
  {
    id: "SP002",
    proposalCode: "DXPM-2025-0002",
    proposerId: "user-5",
    approverId: "user-1",
    roomId: "ROOM002",
    reason: "Cần Adobe Creative Suite cho môn Đồ họa máy tính",
    status: "ĐÃ_DUYỆT",
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
  },
];

export const mockSoftwareProposalItems: SoftwareProposalItem[] = [
  {
    id: "SPI001",
    proposalId: "SP001",
    softwareName: "AutoCAD",
    version: "2024",
    publisher: "Autodesk Inc.",
    quantity: 20,
    licenseType: "Giấy phép giáo dục theo năm",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI002",
    proposalId: "SP002",
    softwareName: "Adobe Photoshop",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 15,
    licenseType: "Giấy phép Creative Cloud theo năm",
    newlyAcquiredSoftwareId: "SW002",
  },
  {
    id: "SPI003",
    proposalId: "SP002",
    softwareName: "Adobe Illustrator",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 15,
    licenseType: "Giấy phép Creative Cloud theo năm",
    newlyAcquiredSoftwareId: null,
  },
];

// Helper functions
export const getSoftwareProposalById = (
  id: string
): SoftwareProposal | undefined => {
  return mockSoftwareProposals.find((proposal) => proposal.id === id);
};

export const getSoftwareProposalsByProposerId = (
  proposerId: string
): SoftwareProposal[] => {
  return mockSoftwareProposals.filter(
    (proposal) => proposal.proposerId === proposerId
  );
};

export const getSoftwareProposalsByRoomId = (
  roomId: string
): SoftwareProposal[] => {
  return mockSoftwareProposals.filter((proposal) => proposal.roomId === roomId);
};

export const getSoftwareProposalsByStatus = (
  status: SoftwareProposal["status"]
): SoftwareProposal[] => {
  return mockSoftwareProposals.filter((proposal) => proposal.status === status);
};

export const getSoftwareProposalItemsByProposalId = (
  proposalId: string
): SoftwareProposalItem[] => {
  return mockSoftwareProposalItems.filter(
    (item) => item.proposalId === proposalId
  );
};

export const getSoftwareProposalWithItems = (proposalId: string) => {
  const proposal = getSoftwareProposalById(proposalId);
  if (!proposal) return null;

  const items = getSoftwareProposalItemsByProposalId(proposalId);
  return {
    ...proposal,
    items,
  };
};

export const getAllSoftwareProposalsWithItems = () => {
  return mockSoftwareProposals.map((proposal) => ({
    ...proposal,
    items: getSoftwareProposalItemsByProposalId(proposal.id),
  }));
};

// Statistics functions
export const getSoftwareProposalStats = () => {
  const total = mockSoftwareProposals.length;
  const pending = mockSoftwareProposals.filter(
    (p) => p.status === "CHỜ_DUYỆT"
  ).length;
  const approved = mockSoftwareProposals.filter(
    (p) => p.status === "ĐÃ_DUYỆT"
  ).length;
  const rejected = mockSoftwareProposals.filter(
    (p) => p.status === "ĐÃ_TỪ_CHỐI"
  ).length;
  const equipped = mockSoftwareProposals.filter(
    (p) => p.status === "ĐÃ_TRANG_BỊ"
  ).length;

  return {
    total,
    pending,
    approved,
    rejected,
    equipped,
  };
};
