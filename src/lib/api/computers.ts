import { api } from "../api";
import type {
  GetComputersResponse,
  GetComputersParams,
  Computer,
} from "@/types/computer";

/**
 * Computer response DTO (legacy - for backward compatibility)
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
    const response = await api.get<ApiResponse<GetComputersByRoomData>>(
      `/computer/room/${roomId}`
    );

    // Extract computers array from nested structure
    const computers = response.data.data.computers;

    return computers;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách máy tính thất bại."
    );
  }
};

/**
 * Get computers with filters and pagination
 * Endpoint: GET /computer
 * 
 * @param params Query parameters for filtering, pagination, and sorting
 * @returns Promise with computers list, pagination, and summary
 * 
 * @example
 * ```typescript
 * // Get all computers (first page)
 * const result = await getComputers();
 * 
 * // Search and filter
 * const result = await getComputers({
 *   search: "Dell",
 *   status: ["IN_USE"],
 *   building: "H",
 *   page: 1,
 *   limit: 12
 * });
 * ```
 */
export const getComputers = async (
  params?: GetComputersParams
): Promise<GetComputersResponse> => {
  try {
    // Destructure to separate status from other params
    const { status, ...otherParams } = params || {};
    
    const response = await api.get<GetComputersResponse>("/computer", {
      params: {
        ...otherParams,
        // Only include status if array has items
        ...(status && status.length > 0 ? { status } : {}),
      },
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách máy tính thất bại."
    );
  }
};

/**
 * Get computer by ID
 * @param computerId Computer ID (UUID)
 * @returns Promise with computer details
 */
export const getComputerById = async (
  computerId: string
): Promise<Computer> => {
  try {
    const response = await api.get<ApiResponse<Computer>>(
      `/computer/${computerId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy thông tin máy tính thất bại."
    );
  }
};
