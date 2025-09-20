import { TechnicianAssignment } from "@/types/user";

// Mock data for technician assignments - Synchronized with database-sync.json
export const technicianAssignments: TechnicianAssignment[] = [
  {
    technicianId: "user-8", // Anh Tuấn
    building: "Tòa H",
    floor: "Tầng 1",
  },
  {
    technicianId: "user-8", // Anh Tuấn
    building: "Tòa H",
    floor: "Tầng 2",
  },
  {
    technicianId: "user-8", // Anh Tuấn
    building: "Tòa H",
    floor: "Tầng 3",
  },
  {
    technicianId: "user-8", // Anh Tuấn
    building: "Tòa H",
    floor: "Tầng 4",
  },
  {
    technicianId: "user-8", // Anh Tuấn
    building: "Tòa H",
    floor: "Tầng 5",
  },
  {
    technicianId: "user-9", // Văn Đạt
    building: "Tòa H",
    floor: "Tầng 6",
  },
  {
    technicianId: "user-9", // Văn Đạt
    building: "Tòa H",
    floor: "Tầng 7",
  },
  {
    technicianId: "user-9", // Văn Đạt
    building: "Tòa H",
    floor: "Tầng 8",
  },
  {
    technicianId: "user-9", // Văn Đạt
    building: "Tòa H",
    floor: "Tầng 9",
  },
];

// Helper functions to work with technician assignments
export const getTechnicianForArea = (
  building: string,
  floor: string
): string | undefined => {
  const assignment = technicianAssignments.find(
    (assignment) =>
      assignment.building === building && assignment.floor === floor
  );
  return assignment?.technicianId;
};

export const getAssignedAreas = (
  technicianId: string
): { building: string; floor: string }[] => {
  return technicianAssignments
    .filter((assignment) => assignment.technicianId === technicianId)
    .map((assignment) => ({
      building: assignment.building,
      floor: assignment.floor,
    }));
};

export const getAssignedFloorsForBuilding = (
  technicianId: string,
  building: string
): string[] => {
  return technicianAssignments
    .filter(
      (assignment) =>
        assignment.technicianId === technicianId &&
        assignment.building === building
    )
    .map((assignment) => assignment.floor);
};
