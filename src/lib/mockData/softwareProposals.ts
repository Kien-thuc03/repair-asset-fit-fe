import { SoftwareProposal, SoftwareProposalStatus } from "@/types";

export const mockSoftwareProposals: SoftwareProposal[] = [
  {
    id: "SWPROP001",
    proposalCode: "DXPM-2024-0001",
    assetId: "ASSET001",
    roomId: "ROOM001",
    proposerId: "user-5", // Giảng viên Nguyễn Thị Lan
    assignedTechnicianId: "user-4", // Kỹ thuật viên
    softwareName: "MATLAB",
    softwareVersion: "R2024a",
    publisher: "MathWorks",
    description: "Phần mềm tính toán khoa học và mô phỏng kỹ thuật",
    justification:
      "Cần thiết cho môn Xử lý tín hiệu số và Điều khiển tự động. Sinh viên cần thực hành mô phỏng và tính toán các thuật toán phức tạp.",
    targetUsers: "Sinh viên năm 3, năm 4 ngành Điện tử viễn thông",
    educationalPurpose:
      "Thực hành môn Xử lý tín hiệu số, Điều khiển tự động, Thiết kế hệ thống nhúng",
    status: SoftwareProposalStatus.CHỜ_XEM_XÉT,
    createdAt: "2024-09-15T08:30:00Z",
  },
  {
    id: "SWPROP002",
    proposalCode: "DXPM-2024-0002",
    assetId: "ASSET002",
    roomId: "ROOM001",
    proposerId: "user-5",
    assignedTechnicianId: "user-4",
    softwareName: "SolidWorks",
    softwareVersion: "2024",
    publisher: "Dassault Systèmes",
    description: "Phần mềm thiết kế CAD 3D chuyên nghiệp",
    justification:
      "Máy tính hiện tại chỉ có AutoCAD 2D. Cần SolidWorks để sinh viên học thiết kế 3D, mô phỏng cơ khí và phân tích kết cấu.",
    targetUsers: "Sinh viên ngành Cơ khí, Cơ điện tử",
    educationalPurpose:
      "Môn Thiết kế cơ khí, Mô phỏng kết cấu, Đồ án tốt nghiệp",
    status: SoftwareProposalStatus.ĐANG_XEM_XÉT,
    reviewNotes: "Đang kiểm tra tính tương thích với cấu hình máy hiện tại",
    createdAt: "2024-09-12T14:15:00Z",
  },
  {
    id: "SWPROP003",
    proposalCode: "DXPM-2024-0003",
    assetId: "ASSET003",
    roomId: "ROOM001",
    proposerId: "user-6", // Giảng viên khác
    assignedTechnicianId: "user-4",
    softwareName: "Adobe Creative Suite",
    softwareVersion: "2024",
    publisher: "Adobe Inc.",
    description:
      "Bộ phần mềm thiết kế đồ họa chuyên nghiệp (Photoshop, Illustrator, InDesign)",
    justification:
      "Hiện tại chỉ có Photoshop. Cần thêm Illustrator và InDesign để giảng dạy thiết kế đồ họa hoàn chỉnh.",
    targetUsers: "Sinh viên ngành Thiết kế đồ họa, Truyền thông đa phương tiện",
    educationalPurpose: "Môn Thiết kế logo, Thiết kế bao bì, Thiết kế ấn phẩm",
    status: SoftwareProposalStatus.ĐÃ_DUYỆT,
    reviewNotes: "Đề xuất hợp lý, máy đủ cấu hình. Sẽ cài đặt trong tuần tới.",
    createdAt: "2024-09-10T09:00:00Z",
    reviewedAt: "2024-09-11T15:30:00Z",
    approvedAt: "2024-09-11T15:30:00Z",
  },
  {
    id: "SWPROP004",
    proposalCode: "DXPM-2024-0004",
    assetId: "ASSET004",
    roomId: "ROOM002",
    proposerId: "user-5",
    assignedTechnicianId: "user-4",
    softwareName: "Ansys Fluent",
    softwareVersion: "2024 R1",
    publisher: "Ansys Inc.",
    description: "Phần mềm mô phỏng động lực học chất lỏng (CFD)",
    justification:
      "Cần mô phỏng dòng chảy và truyền nhiệt cho môn Cơ học chất lỏng",
    targetUsers: "Sinh viên năm 4 ngành Cơ khí",
    educationalPurpose:
      "Môn Cơ học chất lỏng, Truyền nhiệt, Đồ án chuyên ngành",
    status: SoftwareProposalStatus.ĐÃ_TỪ_CHỐI,
    reviewNotes:
      "Cấu hình máy không đủ mạnh cho phần mềm này. Đề xuất sử dụng phòng máy cấu hình cao hơn.",
    createdAt: "2024-09-08T11:20:00Z",
    reviewedAt: "2024-09-09T16:45:00Z",
    rejectedAt: "2024-09-09T16:45:00Z",
  },
  {
    id: "SWPROP005",
    proposalCode: "DXPM-2024-0005",
    assetId: "ASSET005",
    roomId: "ROOM003",
    proposerId: "user-6",
    assignedTechnicianId: "user-8", // Kỹ thuật viên khác
    softwareName: "Arduino IDE",
    softwareVersion: "2.3.2",
    publisher: "Arduino",
    description: "Môi trường phát triển cho lập trình Arduino và vi điều khiển",
    justification:
      "Cần cho thực hành lập trình vi điều khiển. Phần mềm miễn phí và cần thiết cho môn học.",
    targetUsers: "Sinh viên ngành Điện tử, Cơ điện tử",
    educationalPurpose:
      "Môn Lập trình vi điều khiển, Hệ thống nhúng, Đồ án IoT",
    status: SoftwareProposalStatus.ĐÃ_CÀI_ĐẶT,
    reviewNotes: "Phần mềm miễn phí, dễ cài đặt. Đã hoàn thành cài đặt.",
    createdAt: "2024-09-05T13:30:00Z",
    reviewedAt: "2024-09-06T08:00:00Z",
    approvedAt: "2024-09-06T08:00:00Z",
  },
];

// Helper functions for software proposals
export const getSoftwareProposalsByStatus = (
  status: SoftwareProposalStatus
) => {
  return mockSoftwareProposals.filter((proposal) => proposal.status === status);
};

export const getSoftwareProposalsByProposer = (proposerId: string) => {
  return mockSoftwareProposals.filter(
    (proposal) => proposal.proposerId === proposerId
  );
};

export const getSoftwareProposalsByTechnician = (technicianId: string) => {
  return mockSoftwareProposals.filter(
    (proposal) => proposal.assignedTechnicianId === technicianId
  );
};

export const getSoftwareProposalById = (id: string) => {
  return mockSoftwareProposals.find((proposal) => proposal.id === id);
};

export const getSoftwareProposalStats = () => {
  const stats = {
    total: mockSoftwareProposals.length,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
    installed: 0,
  };

  mockSoftwareProposals.forEach((proposal) => {
    switch (proposal.status) {
      case SoftwareProposalStatus.CHỜ_XEM_XÉT:
        stats.pending++;
        break;
      case SoftwareProposalStatus.ĐANG_XEM_XÉT:
        stats.reviewing++;
        break;
      case SoftwareProposalStatus.ĐÃ_DUYỆT:
        stats.approved++;
        break;
      case SoftwareProposalStatus.ĐÃ_TỪ_CHỐI:
        stats.rejected++;
        break;
      case SoftwareProposalStatus.ĐÃ_CÀI_ĐẶT:
        stats.installed++;
        break;
    }
  });

  return stats;
};
