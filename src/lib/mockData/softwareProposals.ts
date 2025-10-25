// Mock data cho Software Proposals - Đồng bộ với database
// Ngày tạo: 2025-10-02
import {
  SoftwareProposal,
  SoftwareProposalItem,
  SoftwareProposalStatus,
} from "@/types/software";

// Software Proposals data - Khớp với database
export const mockSoftwareProposals: SoftwareProposal[] = [
  {
    id: "SP001",
    proposalCode: "DXPM-2025-001",
    proposerId: "user-5", // Giảng viên
    approverId: "user-1", // QTV Khoa
    roomId: "ROOM001", // Phòng H101
    reason:
      "Cần cài đặt Adobe Creative Suite để phục vụ môn Thiết kế đồ họa. Phần mềm hiện tại đã lỗi thời và không đáp ứng yêu cầu giảng dạy.",
    status: SoftwareProposalStatus.ĐÃ_DUYỆT,
    createdAt: "2024-12-15T08:30:00.000Z",
    updatedAt: "2024-12-16T10:15:00.000Z",
  },
  {
    id: "SP002",
    proposalCode: "DXPM-2025-002",
    proposerId: "user-5", // Giảng viên
    approverId: null, // Chưa có người phê duyệt
    roomId: "ROOM002", // Phòng H102
    reason:
      "Yêu cầu cài đặt Microsoft Office 365 mới nhất cho 30 máy tính phục vụ thực hành tin học văn phòng.",
    status: SoftwareProposalStatus.CHỜ_DUYỆT,
    createdAt: "2024-12-18T09:00:00.000Z",
    updatedAt: "2024-12-18T09:00:00.000Z",
  },
  {
    id: "SP003",
    proposalCode: "DXPM-2025-003",
    proposerId: "user-6", // Giảng viên kiêm QTV
    approverId: "user-1", // QTV Khoa
    roomId: "ROOM003", // Phòng H103
    reason:
      "Cần cài đặt Visual Studio 2022, IntelliJ IDEA và các công cụ lập trình để phục vụ môn Lập trình nâng cao.",
    status: SoftwareProposalStatus.ĐÃ_DUYỆT,
    createdAt: "2024-12-20T14:20:00.000Z",
    updatedAt: "2024-12-21T16:45:00.000Z",
  },
  {
    id: "SP004",
    proposalCode: "DXPM-2025-004",
    proposerId: "user-5", // Giảng viên
    approverId: "user-1", // QTV Khoa từ chối
    roomId: "ROOM004", // Phòng H201
    reason:
      "Đề xuất cài đặt phần mềm chỉnh sửa video chuyên nghiệp Adobe Premiere Pro cho tất cả máy tính.",
    status: SoftwareProposalStatus.ĐÃ_TỪ_CHỐI,
    createdAt: "2024-12-22T11:30:00.000Z",
    updatedAt: "2024-12-23T08:20:00.000Z",
  },
  {
    id: "SP005",
    proposalCode: "DXPM-2025-005",
    proposerId: "user-6", // Giảng viên kiêm QTV
    approverId: "user-1", // QTV Khoa
    roomId: "ROOM005", // Phòng H202
    reason:
      "Cài đặt trình duyệt web và các phần mềm cơ bản cho phòng thực hành mới.",
    status: SoftwareProposalStatus.ĐÃ_TRANG_BỊ,
    createdAt: "2024-12-10T10:00:00.000Z",
    updatedAt: "2024-12-14T15:30:00.000Z",
  },
];

// Software Proposal Items data - Khớp với database
export const mockSoftwareProposalItems: SoftwareProposalItem[] = [
  // Items cho đề xuất SP001 (Adobe Creative Suite)
  {
    id: "SPI001",
    proposalId: "SP001",
    softwareName: "Adobe Photoshop",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 30,
    licenseType: "Educational License",
    newlyAcquiredSoftwareId: "SW002",
  },
  {
    id: "SPI002",
    proposalId: "SP001",
    softwareName: "Adobe Illustrator",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 30,
    licenseType: "Educational License",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI003",
    proposalId: "SP001",
    softwareName: "Adobe InDesign",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 30,
    licenseType: "Educational License",
    newlyAcquiredSoftwareId: null,
  },

  // Items cho đề xuất SP002 (Microsoft Office)
  {
    id: "SPI004",
    proposalId: "SP002",
    softwareName: "Microsoft Word",
    version: "365",
    publisher: "Microsoft Corporation",
    quantity: 30,
    licenseType: "Volume License",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI005",
    proposalId: "SP002",
    softwareName: "Microsoft Excel",
    version: "365",
    publisher: "Microsoft Corporation",
    quantity: 30,
    licenseType: "Volume License",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI006",
    proposalId: "SP002",
    softwareName: "Microsoft PowerPoint",
    version: "365",
    publisher: "Microsoft Corporation",
    quantity: 30,
    licenseType: "Volume License",
    newlyAcquiredSoftwareId: null,
  },

  // Items cho đề xuất SP003 (Công cụ lập trình)
  {
    id: "SPI007",
    proposalId: "SP003",
    softwareName: "Visual Studio",
    version: "2022",
    publisher: "Microsoft Corporation",
    quantity: 25,
    licenseType: "Educational License",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI008",
    proposalId: "SP003",
    softwareName: "Visual Studio Code",
    version: "1.85",
    publisher: "Microsoft Corporation",
    quantity: 25,
    licenseType: "Free License",
    newlyAcquiredSoftwareId: "SW004",
  },
  {
    id: "SPI009",
    proposalId: "SP003",
    softwareName: "IntelliJ IDEA",
    version: "2023.3",
    publisher: "JetBrains",
    quantity: 25,
    licenseType: "Educational License",
    newlyAcquiredSoftwareId: null,
  },

  // Items cho đề xuất SP004 (Bị từ chối)
  {
    id: "SPI010",
    proposalId: "SP004",
    softwareName: "Adobe Premiere Pro",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 30,
    licenseType: "Professional License",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI011",
    proposalId: "SP004",
    softwareName: "Adobe After Effects",
    version: "2024",
    publisher: "Adobe Inc.",
    quantity: 30,
    licenseType: "Professional License",
    newlyAcquiredSoftwareId: null,
  },

  // Items cho đề xuất SP005 (Đã trang bị)
  {
    id: "SPI012",
    proposalId: "SP005",
    softwareName: "Google Chrome",
    version: "120.0",
    publisher: "Google LLC",
    quantity: 25,
    licenseType: "Free License",
    newlyAcquiredSoftwareId: "SW005",
  },
  {
    id: "SPI013",
    proposalId: "SP005",
    softwareName: "Mozilla Firefox",
    version: "121.0",
    publisher: "Mozilla Foundation",
    quantity: 25,
    licenseType: "Free License",
    newlyAcquiredSoftwareId: null,
  },
  {
    id: "SPI014",
    proposalId: "SP005",
    softwareName: "WinRAR",
    version: "6.24",
    publisher: "win.rar GmbH",
    quantity: 25,
    licenseType: "Commercial License",
    newlyAcquiredSoftwareId: null,
  },
];

// Helper functions
export const getSoftwareProposalById = (
  id: string
): SoftwareProposal | undefined => {
  return mockSoftwareProposals.find((proposal) => proposal.id === id);
};

export const getSoftwareProposalItems = (
  proposalId: string
): SoftwareProposalItem[] => {
  return mockSoftwareProposalItems.filter(
    (item) => item.proposalId === proposalId
  );
};

export const getSoftwareProposalsByStatus = (
  status: SoftwareProposal["status"]
): SoftwareProposal[] => {
  return mockSoftwareProposals.filter((proposal) => proposal.status === status);
};

export const getSoftwareProposalsByProposer = (
  proposerId: string
): SoftwareProposal[] => {
  return mockSoftwareProposals.filter(
    (proposal) => proposal.proposerId === proposerId
  );
};

// Hàm hủy/xóa đề xuất (chỉ cho mock data)
export const cancelSoftwareProposal = (proposalId: string): boolean => {
  const index = mockSoftwareProposals.findIndex(
    (proposal) => proposal.id === proposalId
  );
  if (index !== -1) {
    // Xóa proposal khỏi mảng
    mockSoftwareProposals.splice(index, 1);

    // Xóa tất cả items liên quan
    const itemIndices = mockSoftwareProposalItems
      .map((item, idx) => (item.proposalId === proposalId ? idx : -1))
      .filter((idx) => idx !== -1)
      .reverse(); // Reverse để xóa từ cuối lên đầu, tránh lỗi index

    itemIndices.forEach((idx) => {
      mockSoftwareProposalItems.splice(idx, 1);
    });

    return true;
  }
  return false;
};
