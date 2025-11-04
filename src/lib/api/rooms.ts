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
    console.log("🌐 API Call: GET /api/v1/rooms");
    const response = await api.get<RoomResponseDto[]>("/api/v1/rooms");
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get rooms error:", error);
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
    console.log(`🌐 API Call: GET /api/v1/rooms/${id}`);
    const response = await api.get<RoomResponseDto>(`/api/v1/rooms/${id}`);
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Get room by ID error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy thông tin phòng thất bại."
    );
  }
};
