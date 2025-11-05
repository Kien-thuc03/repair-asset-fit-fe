import { apiClient } from "../api";

export interface TechnicianInfo {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface RoomWithTechnician {
  id: string;
  name: string;
  roomCode: string;
  building: string;
  floor: string;
  roomNumber: string;
  status: string;
  assignmentId: string | null; // ID của assignment để update
  assignedTechnician: TechnicianInfo | null;
}

export interface TechnicianAssignment {
  building: string;
  floor: string;
  roomCount: number;
}

export interface TechnicianWithRooms {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  assignments: TechnicianAssignment[];
  totalRooms: number;
}

export interface UpdateTechnicianAssignmentResponse {
  id: string;
  technicianId: string;
  building: string;
  floor: string;
}

export interface AssignmentByFloor {
  id: string;
  technicianId: string;
  building: string;
  floor: string;
  technician: TechnicianInfo;
}

/**
 * Lấy danh sách phòng với thông tin kỹ thuật viên phụ trách
 */
export async function getRoomsWithTechnicians(
  building?: string,
  floor?: string
): Promise<RoomWithTechnician[]> {
  const params = new URLSearchParams();
  if (building) params.append("building", building);
  if (floor) params.append("floor", floor);

  const queryString = params.toString();
  const url = `/technician-assignments/rooms${
    queryString ? `?${queryString}` : ""
  }`;

  return await apiClient.get<RoomWithTechnician[]>(url);
}

/**
 * Lấy danh sách kỹ thuật viên với các phòng họ phụ trách
 */
export async function getTechniciansWithRooms(): Promise<
  TechnicianWithRooms[]
> {
  return await apiClient.get<TechnicianWithRooms[]>(
    "/technician-assignments/technicians"
  );
}

/**
 * Phân công kỹ thuật viên cho một tầng cụ thể
 */
export async function assignTechnicianToFloor(
  building: string,
  floor: string,
  technicianId: string
): Promise<UpdateTechnicianAssignmentResponse> {
  return await apiClient.patch<UpdateTechnicianAssignmentResponse>(
    `/technician-assignments/assign`,
    { building, floor, technicianId }
  );
}

/**
 * Phân công kỹ thuật viên cho một phòng cụ thể (deprecated)
 */
export async function assignTechnicianToRoom(
  roomId: string,
  technicianId: string
): Promise<UpdateTechnicianAssignmentResponse> {
  return await apiClient.patch<UpdateTechnicianAssignmentResponse>(
    `/technician-assignments/assign`,
    { roomId, technicianId }
  );
}

/**
 * Cập nhật kỹ thuật viên phụ trách cho một phân công (deprecated)
 */
export async function updateTechnicianAssignment(
  assignmentId: string,
  technicianId: string
): Promise<UpdateTechnicianAssignmentResponse> {
  return await apiClient.patch<UpdateTechnicianAssignmentResponse>(
    `/technician-assignments/${assignmentId}`,
    { technicianId }
  );
}

/**
 * Lấy danh sách phân công theo tầng
 */
export async function getAssignmentsByFloor(
  building: string,
  floor: string
): Promise<AssignmentByFloor[]> {
  return await apiClient.get<AssignmentByFloor[]>(
    `/technician-assignments/floor/${building}/${floor}`
  );
}
