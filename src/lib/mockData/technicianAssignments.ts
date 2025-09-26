import { TechnicianAssignment } from "@/types/repair";

// Mock data cho bảng TechnicianAssignments - Chỉ có Tòa H với 9 tầng
// Khớp với database thực tế: user-8 (Anh Tuấn) và user-9 (Văn Đạt)
export const mockTechnicianAssignments: TechnicianAssignment[] = [
  // Anh Tuấn (user-8) - Phụ trách tầng 1-5 của Tòa H
  {
    id: "ta-001",
    technicianId: "user-8", // Anh Tuấn
    building: "Tòa H",
    floors: ["1", "2", "3", "4", "5"],
    isActive: true,
    assignedBy: "user-3", // Tổ trưởng kỹ thuật phân công
    assignedAt: "2024-01-01T08:00:00.000Z",
    notes: "Chuyên trách hệ thống mạng và bảo trì phòng máy tầng 1-5 Tòa H",
    createdAt: "2024-01-01T08:00:00.000Z",
    updatedAt: "2024-01-01T08:00:00.000Z",
  },

  // Văn Đạt (user-9) - Phụ trách tầng 6-9 của Tòa H
  {
    id: "ta-002",
    technicianId: "user-9", // Văn Đạt
    building: "Tòa H",
    floors: ["6", "7", "8", "9"],
    isActive: true,
    assignedBy: "user-3",
    assignedAt: "2024-01-01T08:00:00.000Z",
    notes: "Chuyên trách phần cứng và thay thế linh kiện tầng 6-9 Tòa H",
    createdAt: "2024-01-01T08:00:00.000Z",
    updatedAt: "2024-01-01T08:00:00.000Z",
  },
];

/**
 * Lấy danh sách kỹ thuật viên được phân công cho khu vực cụ thể
 * @param building - Tên tòa nhà (chỉ có "Tòa H")
 * @param floor - Tầng cụ thể (từ "1" đến "9")
 * @returns Array of technician IDs được phân công cho khu vực này
 */
export const getTechniciansForArea = (
  building: string,
  floor: string
): string[] => {
  return mockTechnicianAssignments
    .filter(
      (assignment) =>
        assignment.isActive &&
        assignment.building === building &&
        assignment.floors.includes(floor)
    )
    .map((assignment) => assignment.technicianId);
};

/**
 * Lấy kỹ thuật viên chính được phân công cho khu vực cụ thể
 * @param building - Tên tòa nhà (chỉ có "Tòa H")
 * @param floor - Tầng cụ thể (từ "1" đến "9")
 * @returns Technician ID chính được phân công
 */
export const getPrimaryTechnicianForArea = (
  building: string,
  floor: string
): string | undefined => {
  const technicians = getTechniciansForArea(building, floor);
  return technicians.length > 0 ? technicians[0] : undefined;
};

/**
 * Lấy tất cả khu vực được phân công cho kỹ thuật viên
 * @param technicianId - ID của kỹ thuật viên (user-8 hoặc user-9)
 * @returns Array of assignments với building và floors
 */
export const getAssignmentsForTechnician = (technicianId: string) => {
  return mockTechnicianAssignments
    .filter(
      (assignment) =>
        assignment.isActive && assignment.technicianId === technicianId
    )
    .map((assignment) => ({
      building: assignment.building,
      floors: assignment.floors,
      assignedAt: assignment.assignedAt,
      notes: assignment.notes,
    }));
};

/**
 * Kiểm tra xem kỹ thuật viên có được phân công cho khu vực cụ thể không
 * @param technicianId - ID của kỹ thuật viên (user-8 hoặc user-9)
 * @param building - Tên tòa nhà (chỉ có "Tòa H")
 * @param floor - Tầng cụ thể (từ "1" đến "9")
 * @returns boolean
 */
export const isTechnicianAssignedToArea = (
  technicianId: string,
  building: string,
  floor: string
): boolean => {
  return mockTechnicianAssignments.some(
    (assignment) =>
      assignment.isActive &&
      assignment.technicianId === technicianId &&
      assignment.building === building &&
      assignment.floors.includes(floor)
  );
};

/**
 * Lấy danh sách tất cả tầng có trong Tòa H
 * @returns Array of floor numbers (string)
 */
export const getAllFloorsInTowerH = (): string[] => {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
};

/**
 * Lấy thông tin chi tiết phân công theo tầng
 * @returns Object mapping floor to technician info
 */
export const getTowerHFloorAssignments = () => {
  const assignments: Record<
    string,
    { technicianId: string; technicianName: string; notes: string }
  > = {};

  // Tầng 1-5: Anh Tuấn (user-8)
  for (let floor = 1; floor <= 5; floor++) {
    assignments[floor.toString()] = {
      technicianId: "user-8",
      technicianName: "Anh Tuấn",
      notes: "Chuyên trách hệ thống mạng và bảo trì phòng máy",
    };
  }

  // Tầng 6-9: Văn Đạt (user-9)
  for (let floor = 6; floor <= 9; floor++) {
    assignments[floor.toString()] = {
      technicianId: "user-9",
      technicianName: "Văn Đạt",
      notes: "Chuyên trách phần cứng và thay thế linh kiện",
    };
  }

  return assignments;
};
