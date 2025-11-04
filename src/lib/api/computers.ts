import { api } from "../api";

/**
 * Computer response DTO
 */
export interface ComputerResponseDto {
  id: string;
  machineLabel: string;
  notes?: string;
  // Asset information
  asset?: {
    id: string;
    name: string;
    ktCode: string;
    fixedCode: string;
    status: string;
    specs?: string;
    entrydate?: string;
    origin?: string;
  };
  // Room information
  room?: {
    id: string;
    name: string;
    roomCode: string;
  };
  // Components information
  components?: Array<{
    id: string;
    componentType: string;
    name: string;
    componentSpecs?: string;
    serialNumber?: string;
    status: string;
    installedAt: string;
    notes?: string;
  }>;
  componentCount?: number;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Get computers by room response data
 */
interface GetComputersByRoomData {
  roomId: string;
  totalComputers: number;
  computers: ComputerResponseDto[];
}

/**
 * Get computers by room ID
 * @param roomId Room ID (UUID)
 * @returns Promise with list of computers in the room
 */
export const getComputersByRoomId = async (
  roomId: string
): Promise<ComputerResponseDto[]> => {
  try {
    console.log(`🌐 API Call: GET /computer/room/${roomId}`);
    const response = await api.get<ApiResponse<GetComputersByRoomData>>(
      `/computer/room/${roomId}`
    );
    console.log("✅ API Response:", response.data);

    // Extract computers array from nested structure
    const computers = response.data.data.computers;
    console.log("✅ Computers extracted:", computers);

    return computers;
  } catch (error: unknown) {
    console.error("❌ Get computers by room error:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách máy tính thất bại."
    );
  }
};
