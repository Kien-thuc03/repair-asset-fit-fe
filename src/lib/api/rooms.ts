import { api } from "../api";

/**
 * Room status enum
 */
export enum RoomStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

/**
 * Room response DTO matching backend
 */
export interface RoomResponseDto {
  id: string;
  building: string;
  roomCode: string;
  floor: string;
  roomNumber: string;
  status: RoomStatus;
  name: string;
  unitId?: string;
  unit?: {
    id: string;
    name: string;
    code: string;
    type: string;
  };
  adjacentRooms?: RoomResponseDto[];
  createdAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  };
}

/**
 * Get all rooms
 * @returns Promise with list of rooms
 */
export const getRoomsApi = async (): Promise<RoomResponseDto[]> => {
  try {
    const response = await api.get<RoomResponseDto[]>("/api/v1/rooms");
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách phòng thất bại."
    );
  }
};

/**
 * Get room by ID
 * @param id Room ID
 * @returns Promise with room details
 */
export const getRoomByIdApi = async (id: string): Promise<RoomResponseDto> => {
  try {
    const response = await api.get<RoomResponseDto>(`/api/v1/rooms/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy thông tin phòng thất bại."
    );
  }
};

/**
 * Get rooms by unit
 * Lấy danh sách phòng theo Khoa Công nghệ Thông tin
 * @param unitId Unit ID (optional, nếu không truyền sẽ lấy theo unit mặc định)
 * @returns Promise with list of rooms
 */
export const getRoomsByUnitApi = async (
  unitId?: string
): Promise<RoomResponseDto[]> => {
  try {
    const url = unitId
      ? `/api/v1/rooms/unit?unitId=${unitId}`
      : `/api/v1/rooms/unit`;
    const response = await api.get<RoomResponseDto[]>(url);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách phòng theo khoa thất bại."
    );
  }
};
