import { api } from "../api";

/**
 * Component Type enum
 */
export enum ComponentType {
  CPU = "CPU",
  RAM = "RAM",
  MAINBOARD = "MAINBOARD",
  STORAGE = "STORAGE",
  GPU = "GPU",
  PSU = "PSU",
  CASE = "CASE",
  MONITOR = "MONITOR",
  KEYBOARD = "KEYBOARD",
  MOUSE = "MOUSE",
  NETWORK = "NETWORK",
  OPTICAL_DRIVE = "OPTICAL_DRIVE",
  COOLER = "COOLER",
  UPS = "UPS",
  OTHER = "OTHER",
  NETWORK_CARD = "NETWORK_CARD",
  SOUND_CARD = "SOUND_CARD",
  SPEAKER = "SPEAKER",
  WEBCAM = "WEBCAM",
}

/**
 * Component Status enum
 */
export enum ComponentStatus {
  INSTALLED = "INSTALLED",
  REMOVED = "REMOVED",
  FAULTY = "FAULTY",
  MAINTENANCE = "MAINTENANCE",
}

/**
 * Component response DTO
 */
export interface ComponentResponseDto {
  id: string;
  componentType: ComponentType;
  name: string;
  componentSpecs?: string;
  serialNumber?: string;
  status: ComponentStatus;
  installedAt: string;
  removedAt?: string;
  notes?: string;
}

/**
 * Computer info in component response
 */
interface ComputerInfo {
  id: string;
  machineLabel: string;
  asset?: {
    id: string;
    name: string;
    ktCode: string;
    fixedCode: string;
    status: string;
  };
  room?: {
    id: string;
    name: string;
    roomCode: string;
  };
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
 * Get components by computer response data
 */
interface GetComponentsByComputerData {
  computer: ComputerInfo;
  totalComponents: number;
  componentStats: Record<string, number>;
  components: ComponentResponseDto[];
}

/**
 * Get components by computer ID
 * @param computerId Computer ID (UUID)
 * @returns Promise with list of components for the computer
 */
export const getComponentsByComputerId = async (
  computerId: string
): Promise<ComponentResponseDto[]> => {
  try {
    const response = await api.get<ApiResponse<GetComponentsByComputerData>>(
      `/computer/${computerId}/components`
    );

    // Extract components array from nested structure
    const components = response.data.data.components;

    return components;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy danh sách linh kiện thất bại."
    );
  }
};

/**
 * Get component statistics by computer ID
 * @param computerId Computer ID (UUID)
 * @returns Promise with component statistics
 */
export const getComponentStatsByComputerId = async (
  computerId: string
): Promise<{ computer: ComputerInfo; stats: Record<string, number> }> => {
  try {
    const response = await api.get<ApiResponse<GetComponentsByComputerData>>(
      `/computer/${computerId}/components`
    );

    return {
      computer: response.data.data.computer,
      stats: response.data.data.componentStats,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(
      err.response?.data?.message || "Lấy thống kê linh kiện thất bại."
    );
  }
};
