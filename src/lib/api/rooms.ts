import { ICreateRoomRequest, IUpdateRoomRequest } from "@/types/unit";
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
 * Lấy danh sách phòng theo Khoa Công nghệ Thông tin
 * @returns Promise with list of rooms
 */
export const getRoomsApi = async (): Promise<RoomResponseDto[]> => {
  try {
    const url = `/api/v1/rooms/unit`;
    const response = await api.get<RoomResponseDto[]>(url);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách phòng theo khoa thất bại."
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
 * Lấy danh sách tất cả phòng (dành cho Admin quản lý)
 * @returns Promise with list of rooms
 */
export const getAllRoomsApi = async (): Promise<RoomResponseDto[]> => {
  try {
    const url = `/api/v1/rooms`;
    const response = await api.get<RoomResponseDto[]>(url);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách tất cả phòng thất bại."
    );
  }
};

/**
 * Tạo mới một phòng
 * @param roomData Data để tạo phòng
 * @returns 
 */
export const createRoomApi = async (
  roomData: ICreateRoomRequest
): Promise<RoomResponseDto> => {
  try {
    const response = await api.post<RoomResponseDto>('/api/v1/rooms', roomData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string | string[] } } };
    const errorMessage = Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message;
    throw new Error(errorMessage || "Tạo dữ liệu phòng thất bại, mã phòng có thể đã tồn tại.");
  }
};

/**
 * Cập nhật thông tin phòng
 * @param id Room ID
 * @param updateData Data cần cập nhật
 * @returns 
 */
export const updateRoomApi = async (
  id: string,
  updateData: IUpdateRoomRequest
): Promise<RoomResponseDto> => {
  try {
    const response = await api.patch<RoomResponseDto>(`/api/v1/rooms/${id}`, updateData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string | string[] } } };
    const errorMessage = Array.isArray(err.response?.data?.message)
      ? err.response.data.message.join(', ')
      : err.response?.data?.message;
    throw new Error(errorMessage || "Cập nhật dữ liệu phòng thất bại.");
  }
};

/**
 * Xóa mềm phòng
 * @param id Room ID
 * @returns 
 */
export const deleteRoomApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/rooms/${id}`);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Xóa phòng thất bại.");
  }
};
